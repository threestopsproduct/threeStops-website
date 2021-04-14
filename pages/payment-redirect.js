import React from "react";
import { connect } from 'react-redux'

import "../assets/about.scss";
import { DESK_COLOR_LOGO } from "../lib/envariables";
import ActionResponse from "../components/dialogs/actionResponse";
import redirect from "../lib/redirect";
import { checkOutCart } from "../services/cart";
import * as actions from '../actions/index'
import { paymentValidation, paymentValidationRedirect } from "../services/payment";

import Router from "next/router";

class PaymentsRedirect extends React.Component {
    state = {
        appUrl: ""
    }

    handleResponseActions = () => {
        this.goToAppURL();
        // redirect("/profile");
    }

    handleErrResponseActions = () => {
        // redirect("/");
    }

    goToAppURL = () => {
        if (this.state.appUrl && this.state.appUrl.length > 0)
            window.location.href = this.state.appUrl
        else {
            // window.close();
            window.open('', '_self').close();
        }
    }

    componentWillReceiveProps = () => {
        console.log("newProps...", this.props)
    }


    checkOut = (payload) => {
        // this.ActionRes.openDialog();

        // console.log("QUEYR...", Router.query)

        const { locale } = this.props;

        this.setState({ appUrl: Router.query.appUrl }, () => {

        })
        let query = Router.query;
        // parseInt(parseFloat(this.props.myCart.finalTotalIncludingTaxes).toFixed(2)).toString()
        let paymentPayload = {
            amount: +query["amount"],
            currency: query["currency"],
            source: query["source"],
            name: query["name"] || "",
            email: query["email"] || ""
        }


        paymentValidationRedirect(paymentPayload)
            .then((res) => {
                this.orderDone();
                if (res.error) {
                    this.setState({ actionErrMsg: locale.somethingWrong, loadingMsg: null, successMsg: null });
                }
            })

    }

    componentDidMount = () => {
        const { locale } = this.props;

        // let checkoutPayload = JSON.parse(localStorage.getItem("chData"));
        // JSON.parse(localStorage.getItem("chData")));
        this.setState({ loadingMsg: locale.paymentLoading, redirectionFlag: 0, successMsg: null, actionErrMsg: null }, () => {
            this.checkOut();
            // this.ActionRes.openDialog();
        })
    }

    orderDone = () => {
        const { locale } = this.props;

        this.setState({ actionErrMsg: null, loadingMsg: null, successMsg: locale.other.ordSuccess }, () => {
            setTimeout(() => {
                this.handleResponseActions();
            }, 1000);
        })
    }

    render() {
        return (
            <div className="col-12 py-0">
                {/* <img src={DESK_COLOR_LOGO} height="70px" /> */}

                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="lds-dual-ring"></div>
                </div>
                {/* <ActionResponse onRef={ref => (this.ActionRes = ref)} handleResponseActions={this.handleResponseActions} handleErrResponseActions={this.handleErrResponseActions}
                    loadingMsg={this.state.loadingMsg} actionErrMsg={this.state.actionErrMsg}
                    successMsg={this.state.successMsg} top={90} circleColor="#1ed25f" /> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        myCart: state.cartList,
        locale: state.locale
    }
}

// export default Payments;
export default connect(mapStateToProps)(PaymentsRedirect);