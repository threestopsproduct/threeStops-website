import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";
import {connect} from "react-redux"
import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { Creditly } from "../../lib/validation";
import { addCard } from "../../services/cart";
import LinearProgress from "../ui/linearProgress";
import LanguageWrapper from "../../hoc/language";
class AddCardLeftSliderWallate extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    loading: false,
    error: null,

    settings: {
      merchantID: "molpaytech",
      orderID: "DEMO1045",
      amount: 1.1,
      bill_name: "MOLPay demo",
      bill_email: "satya@mobifyi.com",
      bill_mobile: "+919036445233",
      bill_desc: "testing by MOLPay",
      country: "MY",
      returnURL: "processing.php",
      vcode: "3d54cff83b89c5875fa9b86a166010ba",
      cur: "MYR",
      langcode: "en"
    },
    conf: {
      min_amount: 1.1,
      molpay_url: "https://www.onlinepayment.com.my/MOLPay/pay/"
    },
    returnURL: ""
  };

  stripe;

  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () => {
    this.CouponLeftSliderRef.handleLeftSliderToggle();
    document.getElementById("cardFormDesk").reset();
    setTimeout(() => {
      this.setControlFocus("inputCardNumDesk");
    }, 1000);
  };
  handleClose = () => {
    this.CouponLeftSliderRef.handleLeftSliderClose();
    this.setState({ error: "", loading: false });
  };
  closeSlider = () => {};

  setControlFocus = id => {
    document.getElementById(id).focus();
  };

  componentDidMount() {
    const { classes, myCart, selectedCoupon, deliveryFeesTotal, couponBenifit, currencySymbol } = this.props;
    let PriceValue =couponBenifit ?
    parseFloat(parseFloat(this.props.driverTip||0) +parseFloat(this.props.serviceFees||0)+parseFloat(deliveryFeesTotal)+parseFloat(myCart.finalTotalIncludingTaxes) - parseFloat(couponBenifit.discountAmount)).toFixed(2) :
    parseFloat(parseFloat(this.props.driverTip||0) +parseFloat(this.props.serviceFees||0)+parseFloat(deliveryFeesTotal)+parseFloat(myCart.finalTotalIncludingTaxes)).toFixed(2)
    console.log(this.props.serviceFees,deliveryFeesTotal,myCart.finalTotalIncludingTaxes,"PriceValue")
    this.props.onRef(this);

    $(document).ready(function() {
      var options = {
        mp_username: "api_SB_5canale",
        mp_password: "api_ozpG197c",
        mp_merchant_ID: "SB_5canale",
        mp_app_name: "5canale",
        mp_verification_key: "3d54cff83b89c5875fa9b86a166010ba",
        mp_amount: "1.10",
        mp_order_ID: "orderid123",
        mp_currency: "MYR",
        mp_country: "MY",
        mp_channel: "multi",
        mp_bill_description: "billdesc",
        mp_bill_name: "billname",
        mp_bill_email: "satya@mobifyi.com",
        mp_bill_mobile: "9036445233"
      };
    });

    $(document).ready(() => {
     
      $(() => {
        var creditly = Creditly.initialize(
          ".expiration-month-and-year",
          ".credit-card-number",
          ".security-code",
          ".card-type",
          ".card-avtar"
        );

        $(".creditly-card-form .submit").click(e => {
          e.preventDefault();

          var output = creditly.validate();

          this.setState({ loading: true });
          if (output) {
            // Your validated credit card output

            this.addCard(output);
          } else {
            this.setState({
              loading: false,
              error: "Please fill details correctly!"
            });
          }
        });
      });

      // Stripe.setPublishableKey('pk_test_sp0gbTEyinY0KYOo4e3Jw0sM');
      // Stripe.setPublishableKey('pk_test_IBYk0hnidox7CDA3doY6KQGi')
      // Stripe.setPublishableKey("pk_test_wkBp1AheycW1DkLZjT3WQkNV");
      CashFree.init("pk_test_wkBp1AheycW1DkLZjT3WQkNV")
    var options = {
      appId: "pk_test_wkBp1AheycW1DkLZjT3WQkNV",
     
      customerName: "5canale",
      mp_verification_key: "3d54cff83b89c5875fa9b86a166010ba",
      orderAmount: "1.10",
      orderCurrency:"INR",
      orderId: "orderid123",
      
      customerEmail: "satya@mobifyi.com",
      customerPhone: "9036445233",
      returnUrl:"NA",
      paymentToken:"pk_test_wkBp1AheycW1DkLZjT3WQkNV"
    };
    console.log(this.props.appConfig,"createToken")
    // CashFree.paySeamless(options);
    });
    
  }
  
  addCard(result) {
    const { classes, myCart, selectedCoupon, deliveryFeesTotal, couponBenifit, currencySymbol } = this.props;
    let PriceValue =this.props.walletRechargeAmount ?this.props.walletRechargeAmount:0
  let postPaymentCallback = function (event){
    console.log(event,"suAveChheBe");
    // Callback method that handles Payment 
    if (event.name == "PAYMENT_RESPONSE" && event.status == "SUCCESS") {
    
    } 
    else if (event.name == "PAYMENT_RESPONSE" && event.status == "CANCELLED") {
      // Handle Cancelled
      alert("CANCELLED")
    } 
    else if (event.name == "PAYMENT_RESPONSE" && event.status == "FAILED") {
      // Handle Failed
      alert("FAILED")
    } 
    else if (event.name == "VALIDATION_ERROR") { 
      // Incorrect inputs
      alert("VALIDATION_ERROR")
    }
  };



// var token = hash_hmac('sha256', tokenData, this.props.caseFreeData &&this.props.caseFreeData.data&&this.props.caseFreeData.data.token.length > 0 ?this.props.caseFreeData.data.token:"", true);

  
// var token= new CashFreeToken();
// let paymentToken = base64_encode(token);

let appId =this.props.caseFreeData &&this.props.caseFreeData.data&&this.props.caseFreeData.data.appId.length > 0 ?this.props.caseFreeData.data.appId:""
let customerName =this.props.userProfile && this.props.userProfile.name &&this.props.userProfile.name.length > 0 ?this.props.userProfile.name :"tushar ghodadra"
let orderId =this.props.caseFreeData &&this.props.caseFreeData.data&&this.props.caseFreeData.data.orderId.length > 0 ?this.props.caseFreeData.data.orderId:""
let customerEmail =this.props.userProfile && this.props.userProfile.email &&this.props.userProfile.email.length > 0 ?this.props.userProfile.email :"tushar@mobifyi.com"
let customerPhone =this.props.userProfile && this.props.userProfile.mobile &&this.props.userProfile.mobile.length > 0 ?this.props.userProfile.mobile :"7984440844"
let secretKey =this.props.caseFreeData &&        this.props.caseFreeData.data&&this.props.caseFreeData.data.secretKey.length > 0 ?     this.props.caseFreeData.data.secretKey:""
var tokenData = `appId=${appId}&orderId=${orderId}&orderAmount=${PriceValue}&customerEmail=${customerEmail}&customerPhone=${customerPhone}&orderCurrency=INR`;
 var hash = CryptoJS.HmacSHA256(tokenData, secretKey);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var paymentToken = (this.props.caseFreeData &&this.props.caseFreeData.data&&this.props.caseFreeData.data.secretKey.length > 0 ?this.props.caseFreeData.data.secretKey:"");
  var valuePyment =btoa(hashInBase64)
  console.log(hash ,valuePyment,hashInBase64,"hashInBase64")
  
// let paymentToken = token.CreateToken(tokenData, this.props.caseFreeData &&this.props.caseFreeData.data&&this.props.caseFreeData.data.token.length > 0 ?this.props.caseFreeData.data.token:"");
    var data = {};
data.paymentOption ="card";
data.card = {};
data.card.number =result.number; 
data.card.expiryMonth = result.expiration_month;
data.card.expiryYear = result.expiration_year;
data.card.holder = "tushar ghodadra";
data.card.cvv = result.security_code;
data.paymentToken= hashInBase64;
data.appId= appId;
data.customerName= customerName;
data.orderAmount= PriceValue;
data.orderCurrency="INR";
data.orderId =orderId ;
data.customerEmail= customerEmail;
data.customerPhone= customerPhone;
data.returnUrl="http://localhost:3535/checkout",
      // data.secretKey="pk_test_wkBp1AheycW1DkLZjT3WQkNV"
CashFree.paySeamless(data,postPaymentCallback)
// var token = response.id;

//       let cardData = {
//         email: this.props.userProfile ? this.props.userProfile.email : "",
//         cardToken: hashInBase64
//       };

//       addCard(cardData).then(data => {
//         data.error
//           ? this.setState({
//               error: " Failed to Add Card ! ",
//               loading: false
//             })
//           : (this.props.getCustomerCards(),
//             this.handleClose(),
//             this.setState({ loading: false }),
//             setTimeout(() => {
//               $(".creditly-card-form")
//                 .find("input[type=text], textarea")
//                 .val("");
//               $("#inputEmail4").val("");
//               $("#inputPassword4").val("");
//               $(".expiration-month-and-year").val("");
//               $(".credit-card-number").val("");
//               $(".security-code").val("");
//               $(".security-code").val("");
//             }, 500));
//       });
    // CashFree.paySeamless(
    //   {
    //    data
    //   },
    //   (status, response) => {
    //     if (response.status =="ERROR") {
    //       // Problem!
    //       this.setState({ loading: false, error: response.error.message });
    //     } else {
    //       // Token was created!

    //       // Get the token ID:
    //       var token = response.id;

    //       let cardData = {
    //         email: this.props.userProfile ? this.props.userProfile.email : "",
    //         cardToken: token
    //       };

    //       addCard(cardData).then(data => {
    //         data.error
    //           ? this.setState({
    //               error: " Failed to Add Card ! ",
    //               loading: false
    //             })
    //           : (this.props.getCustomerCards(),
    //             this.handleClose(),
    //             this.setState({ loading: false }),
    //             setTimeout(() => {
    //               $(".creditly-card-form")
    //                 .find("input[type=text], textarea")
    //                 .val("");
    //               $("#inputEmail4").val("");
    //               $("#inputPassword4").val("");
    //               $(".expiration-month-and-year").val("");
    //               $(".credit-card-number").val("");
    //               $(".security-code").val("");
    //               $(".security-code").val("");
    //             }, 500));
    //       });
    //     }
    //   }
    // );
  }

  clearError = () => {
    this.setState({ error: "" });
  };
  stripeResponseHandler(status, response) {
    if (response.error) {
      // Problem!
      this.setState({ loading: false, error: response.error.message });
    } else {
      // Token was created!

      // Get the token ID:
      var token = response.id;
    }
  }

  render() {
    let lang = this.props.lang;
    console.log(this.props,"this.props.caseFreeDatass")
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.CouponLeftSliderRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle={lang.addCard || "Add Card"}
        >
          <div
            className="col-12 py-3 addCardSection mobile-hide"
            style={{ background: "#fff", borderBottom: "1px solid #e5e5e5" }}
          >
            {/*  */}
            <div className="row justify-content-center">
              <div className="col-11 my-4">
                {/* <h5 className="addCardH5Title">Enter your card details</h5>
                                <p className="addCardPTitle">Card Details will be saved securely, based of the industry standard</p> */}
                <form
                  className="creditly-card-form"
                  id="cardFormDesk"
                  autoComplete="off"
                  autocomplete="off"
                >
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control credit-card-number"
                      id="inputCardNumDesk"
                      onFocus={this.clearError}
                      placeholder={
                        lang.cardNo || "Enter your 15/16 digit card no."
                      }
                    />
                    <div className="card-type-image">
                      <img
                        className="card-avtar"
                        src="/static/images/cc-icon.png"
                      ></img>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-8">
                      <input
                        type="email"
                        onFocus={this.clearError}
                        className="form-control expiration-month-and-year"
                        id="inputEmail4"
                        placeholder={
                          lang.validymonth || "Valid through (MM/YY)"
                        }
                        autocomplete="off"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group col-4">
                      <input
                        type="password"
                        onFocus={this.clearError}
                        autoComplete="off"
                        autocomplete={"off"}
                        className="form-control security-code"
                        id="inputPassword4"
                        placeholder="CVV"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={this.state.loading}
                    className="btn btn-default submit w-100 addCardBtn"
                  >
                    {lang.addCardC || "ADD CARD"}
                  </button>
                </form>

                <div className="my-2">
                  <LinearProgress
                    error={this.state.error}
                    loading={this.state.loading}
                  />
                </div>
                {/* <button type="button" id="myPay" class="btn btn-primary btn-lg" data-toggle="molpayseamless" data-mpsmerchantid="molpaymerchant" data-mpschannel="maybank2u" data-mpsamount="1.20" data-mpsorderid="TEST1139669863" data-mpsbill_name="MOLPay Technical" >Pay by Maybank2u</button> */}
              </div>
            </div>
          </div>
        </LeftSlider>
      </Wrapper>
    );
  }
}

// export default LanguageWrapper(AddCardLeftSlider);
const mapStateToProps = state => {
  return {
      reduxState: state,
      stores: state.stores,
      myCart: state.cartList,
      appConfig: state.appConfig,
      userProfile: state.userProfile,
      lang:state.locale,
      selectedLang: state.selectedLang
  };
};

export default connect(mapStateToProps)(LanguageWrapper(AddCardLeftSliderWallate));