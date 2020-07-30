import React from "react";

import Loader from "../components/Loader";
import APIClient from "../components/APIClient";
import { RouteComponentProps, useHistory } from "react-router";
import { Trans } from "@lingui/macro";
import Page from "../components/Page";
import { createRouteForAddressPage } from "../routes";
import { makeEmptySearchAddress } from "../components/AddressSearch";

// This will be *either* bbl *or* boro, block, and lot.
type BBLPageParams = {
  bbl?: string;
  boro?: string;
  block?: string;
  lot?: string;
};

type BBLPageProps = RouteComponentProps<BBLPageParams>;

const BBLPage: React.FC<BBLPageProps> = (props) => {
  const history = useHistory();

  window.gtag("event", "direct-link");

  const params = props.match.params;

  var fullBBL: string;
  var searchAddress = makeEmptySearchAddress();

  // handling for when url parameter is separated bbl
  if (params.bbl) {
    fullBBL = params.bbl;
  } else if (params.boro && params.block && params.lot) {
    fullBBL = params.boro + params.block.padStart(5, "0") + params.lot.padStart(4, "0");
  } else {
    throw new Error("Invalid params, expected either a BBL or boro/block/lot!");
  }

  APIClient.getBuildingInfo(fullBBL)
    .then((results) => {
      searchAddress = {
        boro: results.result[0].boro,
        housenumber: results.result[0].housenumber,
        streetname: results.result[0].streetname,
        bbl: fullBBL,
      };
      const addressPage = createRouteForAddressPage(searchAddress);
      history.push(addressPage);
    })
    .catch((err) => {
      window.Rollbar.error("API error from BBL page: Building Info", err, fullBBL);
    });

  return (
    <Page>
      <div className="Page HomePage">
        <div className="HomePage__content">
          <div className="HomePage__search">
            <Loader classNames="Loader--centered" loading={true}>
              <Trans>Searching</Trans>
            </Loader>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default BBLPage;
