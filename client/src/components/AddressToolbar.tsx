import React, { Component } from "react";
import { LocaleLink as Link } from "../i18n";
import Modal from "./Modal";

import "styles/AddressToolbar.css";
import { Trans } from "@lingui/macro";
import { SearchAddress } from "./AddressSearch";

export type AddressToolbarProps = {
  onExportClick: () => void;
  numOfAssocAddrs: number;
  searchAddr: SearchAddress;
};

type State = {
  showExportModal: boolean;
};

export default class AddressToolbar extends Component<AddressToolbarProps, State> {
  constructor(props: AddressToolbarProps) {
    super(props);

    this.state = {
      showExportModal: false,
    };
  }

  render() {
    // fancy default syntax - if userArr is null, bbl keeps ''
    // let { bbl = '' } = this.props.userAddr;
    // let boro, block, lot;

    // if (bbl.length) {
    //   ({ boro, block, lot } = Helpers.splitBBL(bbl));
    // }

    const userAddrStr = `${this.props.searchAddr.housenumber} ${this.props.searchAddr.streetname}, ${this.props.searchAddr.boro}`;

    return (
      <div className="AddressToolbar">
        <div className="btn-group float-right">
          <Link
            className="btn btn-primary"
            onClick={() => {
              window.gtag("event", "new-search");
            }}
            to="/"
          >
            <Trans>New Search</Trans>
          </Link>
          <button className="btn" onClick={() => this.setState({ showExportModal: true })}>
            <Trans>Export Data</Trans>
          </button>
        </div>
        <Modal
          showModal={this.state.showExportModal}
          onClose={() => this.setState({ showExportModal: false })}
        >
          <Trans render="p">
            This will export <b>{this.props.numOfAssocAddrs}</b> addresses associated with the
            landlord at <b>{userAddrStr}</b>!
          </Trans>
          <Trans render="p">
            This data is in <u>CSV file format</u>, which can easily be used in Excel, Google
            Sheets, or any other spreadsheet program.
          </Trans>
          <br />
          <button
            className="btn centered"
            onClick={() => {
              window.gtag("event", "export-data");
              this.props.onExportClick();
            }}
          >
            <Trans>Download</Trans>
          </button>
        </Modal>
      </div>
    );
  }
}
