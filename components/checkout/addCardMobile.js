import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";

import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { CreditlyMobi } from "../../lib/validation";
import { addCard } from "../../services/cart";
import LinearProgress from "../ui/linearProgress";
import LanguageWrapper from "../../hoc/language";
class AddCardLeftSliderMobile extends Component {
  lang = this.props.lang;
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
    returnURL: "",
    readyToRender: false,

    cardNum: "",
    cardExp: "",
    cardCvc: ""
  };

  stripe;

  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    this.allowOnlyNumber = this.allowOnlyNumber.bind(this);
  }

  handleLeftSliderOpen = () => {
    this.CouponLeftSliderRef.handleLeftSliderToggle();
    document.getElementById("inputCardNumMobi").reset();

    setTimeout(() => {
      this.setControlFocus("cardNumMobi12");
    }, 1000);
  };
  setControlFocus = id => {
    document.getElementById(id) ? document.getElementById(id).focus() : "";
  };

  handleClose = () => this.CouponLeftSliderRef.handleLeftSliderClose();
  closeSlider = () => {};
  componentDidMount() {
    console.log(this.props.myCart,"avse ke nai")
    this.props.onRef(this);
    this.setState({ readyToRender: true });
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
        // mpsreturnurl:this.state.returnURL,
        // mpscancelurl:this.state.returnURL
      };

      // $('#myPay').MOLPaySeamless(options)
    });

    $(document).ready(() => {
      // this.setState({ returnURL: location.href })
      $(() => {
        var creditly = CreditlyMobi.initialize(
          ".expiration-month-and-year-mobi",
          ".credit-card-number-mobi",
          ".security-code-mobi",
          ".card-type-mobi",
          ".card-avtar-mobi"
        );

        $(".creditly-card-form .submit-mobi").click(e => {
          e.preventDefault();

          var output = creditly.validate();

          this.setState({ loading: true });
          if (output) {
            // Your validated credit card output

            this.addCard(output);
          } else {
            this.setState({
              loading: false,
              error: this.lang.pleaseFill || "Please fill details correctly!"
            });
          }
        });
      });

      // Stripe.setPublishableKey('pk_test_sp0gbTEyinY0KYOo4e3Jw0sM');
      // Stripe.setPublishableKey('pk_test_IBYk0hnidox7CDA3doY6KQGi')
      Stripe.setPublishableKey("pk_test_wkBp1AheycW1DkLZjT3WQkNV");
    });
  }

  clearError = () => {
    this.setState({ error: "" });
  };

  addCard(result) {
    const { classes, myCart, selectedCoupon, deliveryFeesTotal, couponBenifit, currencySymbol,walletRechargeAmount } = this.props;
    
      let PriceValue =this.props.myCart&& this.props.myCart.finalTotalIncludingTaxes&& this.props.myCart.finalTotalIncludingTaxes.length > 0?couponBenifit ?
      parseFloat(parseFloat(this.props.driverTip||0) +parseFloat(this.props.serviceFees||0)+parseFloat(deliveryFeesTotal)+parseFloat(this.props.myCart.finalTotalIncludingTaxes) - parseFloat(couponBenifit.discountAmount)).toFixed(2) :
      parseFloat(parseFloat(this.props.driverTip||0) +parseFloat(this.props.serviceFees||0)+parseFloat(deliveryFeesTotal)+parseFloat(this.props.myCart.finalTotalIncludingTaxes)).toFixed(2):""
   
    
    console.log(PriceValue,walletRechargeAmount,"PriceValue")
    let walltevalue =walletRechargeAmount &&walletRechargeAmount.length > 0 ?   walletRechargeAmount:PriceValue
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
var tokenData = `appId=${appId}&orderId=${orderId}&orderAmount=${walltevalue}&customerEmail=${customerEmail}&customerPhone=${customerPhone}&orderCurrency=INR`;
 var hash = CryptoJS.HmacSHA256(tokenData, secretKey);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var paymentToken = (this.props.caseFreeData &&this.props.caseFreeData.data&&this.props.caseFreeData.data.secretKey.length > 0 ?this.props.caseFreeData.data.secretKey:"");
  var valuePyment =btoa(hashInBase64)
  console.log(hash ,valuePyment,hashInBase64,"hashInBase64")
  let Origin =window.location.origin
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
data.orderAmount= walltevalue;
data.orderCurrency="INR";
data.orderId =orderId ;
data.customerEmail= customerEmail;
data.customerPhone= customerPhone;
data.returnUrl=this.props.check =="check"?`${Origin}/profile`:`${Origin}/checkout`,
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

  allowOnlyNumber = (e, name) => {
    const re = /[0-9]+/g;

    if (name == "cardNum") {
      let cardNum = e.target.value.replace(/ /g, "");

      if (re.test(e.target.value) && cardNum.length <= 16) {
        switch (e.target.value.length) {
          default:
            this.setState({ [name]: e.target.value });
            break;
          case 4:
            let case4 = e.target.value;

            if (this.state.cardNum.charAt(4) == " ") {
              case4 = e.target.value;
            } else {
              case4 += " ";
            }
            this.setState({ [name]: case4 });
            break;
          case 9:
            let case8 = e.target.value;
            if (this.state.cardNum.charAt(9) == " ") {
              case8 = e.target.value;
            } else {
              case8 += " ";
            }
            this.setState({ [name]: case8 });
            break;
          case 14:
            let case12 = e.target.value;
            if (this.state.cardNum.charAt(14) == " ") {
              case12 = e.target.value;
            } else {
              case12 += " ";
            }
            this.setState({ [name]: case12 });
            break;
          case 19:
            let case16 = e.target.value;
            if (this.state.cardNum.charAt(19) == " ") {
              case16 = e.target.value;
            } else {
              case16 += " ";
            }
            this.setState({ [name]: case16 });
            break;
        }
      } else if (e.target.value === "") {
        this.setState({ [name]: e.target.value });
      }
    } else if (name == "cardExp") {
      if (
        (e.target.value === "" || re.test(e.target.value)) &&
        e.target.value.length <= 7
      ) {
        if (e.target.value.length === 2) {
          let thisVal = e.target.value;
          if (this.state.cardExp.includes("/")) {
            thisVal = thisVal.split("/").join("");
          } else {
            thisVal += "/";
          }
          this.setState({ [name]: thisVal });
        } else {
          this.setState({ [name]: e.target.value });
        }
      }
    } else if (name == "cardCvc") {
      if (
        (e.target.value === "" || re.test(e.target.value)) &&
        e.target.value.length <= 5
      ) {
        this.setState({ [name]: e.target.value });
      }
    }
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
    return this.state.readyToRender ? (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.CouponLeftSliderRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle={this.lang.addCard || "Add Card"}
        >
          <div className="col-12 py-3 addCardSection mobile-show">
            {/*  */}
            <div className="row justify-content-center">
              <div className="col-11 my-4">
                {/* <h5 className="addCardH5Title">Enter your card details</h5>
                                    <p className="addCardPTitle">Card Details will be saved securely, based of the industry standard</p> */}
                <form className="creditly-card-form" id="inputCardNumMobi">
                  <div className="form-group">
                    <input
                      type="text"
                      onFocus={this.clearError}
                     value={this.state.cardNum}
                       onKeyPress={e => this.allowOnlyNumber(e, "cardNum")}
                      onChange={e => this.allowOnlyNumber(e, "cardNum")}
                      className="form-control credit-card-number-mobi"
                      id="cardNumMobi12"
                      placeholder={
                        this.lang.cardNo || "Enter your 15/16 digit card no."
                      }
                    />
                    <div className="card-type-image">
                      <img
                        className="card-avtar-mobi"
                        src="/static/images/cc-icon.png"
                      ></img>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-8">
                      <input
                        type="email"
                        onFocus={this.clearError}
                        value={this.state.cardExp}
                         onKeyPress={e => this.allowOnlyNumber(e, "cardExp")}
                        onChange={e => this.allowOnlyNumber(e, "cardExp")}
                        className="form-control expiration-month-and-year-mobi"
                        id="inputEmail41"
                        placeholder={
                          this.lang.validymonth || "Valid through (MM/YY)"
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group col-4">
                      <input
                        type="password"
                        onFocus={this.clearError}
                        value={this.state.cardCvc}
                         onKeyPress={e => this.allowOnlyNumber(e, "cardCvc")}
                        onChange={e => this.allowOnlyNumber(e, "cardCvc")}
                        className="form-control security-code-mobi"
                        id="inputPassword41"
                        placeholder="CVV"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button
                    type="submit-mobi"
                    disabled={this.state.loading}
                    className="btn btn-default submit-mobi w-100 addCardBtn"
                  >
                    {this.lang.addCardC || "ADD CARD"}
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
    ) : (
      ""
    );
  }
}

export default LanguageWrapper(AddCardLeftSliderMobile);
