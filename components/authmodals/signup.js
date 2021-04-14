import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Done from "@material-ui/icons/Done";
import Wrapper from "../../hoc/wrapperHoc";
import AuthInput from "../ui/auth/input";
import Intelinput from "../ui/intelinput";
import LinearProgressBar from "../ui/linearProgress";
import wrapper from "../../hoc/wrapperHoc";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { BASE_COLOR } from "../../lib/envariables";
import Countdown from "react-countdown-now";
import LangWrapepr from "../../hoc/language";
import { getGeoInfo } from "../../lib/getip";
import OtpInput from 'react-otp-input';
// import OTPInput, { ResendOTP } from "otp-input-react";
let isPhoneValid = false;

class signupModal extends React.Component {
  state = {
    resendBtn: false,
    flag: true,
    date: Date.now() + 120000,
    contryCode: "",
    otp:""
  };

  componentDidMount() {
    getGeoInfo().then(data => {
      this.setState({
        ...this.state,
        contryCode: data.country_code
      });
      console.log("ForgetPasswordModal", data);
    });
  }

  handleotp = () => {
    this.setState(
      {
        resendBtn: false,
        flag: true
      },
      () => {
        this.handletimer();
        this.props.resendOtp();
      }
    );
  };

  handletimer = () => {
    this.setState({
      date: Date.now() + 120000
    });
  };
  handleChange=otp=>{
    this.setState({otp})
  }
  render() {
    const locale = this.props.lang;
   console.log(this.state.otp,"tusharttt")
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        this.setState({
          resendBtn: true,
          flag: false
        });
        return null;
      } else {
        // Render a countdown
        return (
          <p>
            {minutes}:{seconds}
          </p>
        );
      }
    };

    console.log("NOW TSTATE --> ", this.state.resendBtn, this.state.flag);

    return (
      <Wrapper>
        <div
          className="col-lg-11"
          id="signUpModalId"
          style={{ display: this.props.show ? "block" : "none" }}
        >
          <div className="row">
            <div className="col-12 modal-header" style={{display:"flex",justifyContent:"flex-end",padding:"10px 0px 5px 0px !important"}}>
              <button
                type="button"
                className="close"
                onClick={this.props.closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 my-lg-2 text-center">
              <h5 className="modal-title" id="loginModalLabel">
                {locale ? locale.locationSel.signUp : "sign up"}
              </h5>
              {/* <div className="createAccountLayout">
                <span className="orStatic">
                  {locale ? locale.auth.or : "or"}{" "}
                </span>
                <a
                  style={{ color: BASE_COLOR }}
                  className="createAccountStatic"
                  onClick={this.props.showLoginHandler}
                >
                  {" "}
                  {locale ? locale.auth.loginToAcc : "login to your account"}
                </a>
              </div> */}
            </div>
            {/* <div className="col-5">
              <img
                src="/static/images/loginRoll.png"
                className="img-fluid"
                width="100"
                height="100"
                alt="loginRoll"
              />
            </div> */}
          </div>

          <div className="row">
            <div className="col-12 modal-body">
              <form
                onSubmit={this.props.handleSignUpSubmit}
                className="signup-form"
                autoComplete="off"
              >
                {this.props.otpShow ? (
                  <Wrapper>
                    <div className="col-12 info" style={{textAlign: "center",
    width: "100%"}}>
                      <p style={{fontWeight:"400"}}>
                        {locale
                          ? locale.auth.codeSent
                          : "A 6 digit verification code has been sent to"}{" "}
                        
                      </p>
                      <p style={{fontWeight:"500"}}>{this.props.phone}</p>
                    </div>
                    <div className="col-12 p-0 mb-2 signupStyle">
                      {/* <div className="outline-box last-child-border mb-2"> */}
                      
                      
                      <OtpInput
        value={this.props.otp}
        onChange={this.props.otpHandler}
        numInputs={6}
        inputStyle={"inputStype"}
        // separator={}
      />
                        {/* <AuthInput
                          type="text"
                          label="Enter the code"
                          name="otp"
                          id="otpInput"
                          value={this.props.otp}
                          onChange={this.props.otpHandler}
                          otp={true}
                        /> */}
                         {/* <OTPInput
      value={OTP}
      onChange={setOTP}
      autoFocus
      OTPLength={4}
      otpType="number"
      disabled={false}
      secure
    /> */}
                      {/* </div> */}
                    </div>

                    <div className="resend_otp text-center">
                      {this.state.flag ? (
                        <Countdown
                          date={this.state.date}
                          intervalDelay={0}
                          precision={1}
                          zeroPadTime={1}
                          renderer={renderer}
                        />
                      ) : null}
                    </div>

                    {this.state.resendBtn ? (
                      <a onClick={this.handleotp} className="btn resendotp">
                        Resend
                      </a>
                    ) : (
                      ""
                    )}

                    <a
                      onClick={this.props.verifyOtpHandler}
                      className="btn loginAndSignUpButton"
                    >
                      {locale ? locale.auth.verify : "Verify"}
                    </a>
                  </Wrapper>
                ) : (
                  <Wrapper>
                    <div className="col-12 p-0 float-left">
                      <div className="outline-box p-0 mb-2">
                        <div className="col-12">
                          <PhoneInput
                            country={this.state.contryCode}
                            // country={props.countryIntl}
                            placeholder="Enter phone number"
                            value={this.props.phone}
                            onChange={this.props.signupFormHandler}
                            id="regFormPhone"
                            error={
                              this.props.phone && this.props.phone.length > 0
                                ? isValidPhoneNumber(this.props.phone)
                                  ? ((isPhoneValid = true), undefined)
                                  : ((isPhoneValid = false),
                                    locale
                                      ? locale.auth.invalidPhoneMsg
                                      : "Invalid phone number")
                                : ""
                            }
                          />
                        </div>
                        {/* <div className="col-3 p-0 float-left">
                                                <Intelinput id="signup-intel-input" />
                                            </div>
                                            <div className="col-9 p-0 float-left">
                                                <AuthInput
                                                    signup={true}
                                                    type="text"
                                                    label="Phone number"
                                                    name="phone"
                                                    id="signUpMobileNumber"
                                                    keyType="phone"
                                                    allowNumber={props.allowOnlyNumber}
                                                    value={props.phone}
                                                    onChange={props.signupFormHandler}
                                                />
                                            </div> */}
                      </div>
                    </div>
                    <div className="col-12 p-0">
                      <div className="outline-box mb-2">
                        <AuthInput
                          signup={true}
                          type="text"
                          label={locale ? locale.auth.name : "Name"}
                          name="name"
                          id="signUpName"
                          keyType="name"
                          value={this.props.name}
                          onChange={this.props.signupFormHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 p-0">
                      <div className="outline-box mb-2">
                        <AuthInput
                          signup={true}
                          type="text"
                          label={locale ? locale.auth.email : "Email"}
                          name="email"
                          id="signUpEmail"
                          keyType="email"
                          value={this.props.email}
                          onChange={this.props.signupFormHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 p-0">
                      <div className="outline-box last-child-border mb-2">
                        <AuthInput
                          signup={true}
                          type="password"
                          label={locale ? locale.auth.password : "Password"}
                          name="password"
                          id="signUpPassword"
                          keyType="password"
                          value={this.props.password}
                          onChange={this.props.signupFormHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 p-0" id="signUpRefCodeLayout">
                      <div className="outline-box last-child-border mb-2">
                        <AuthInput
                          signup={true}
                          type="text"
                          name="referCode"
                          label={
                            locale ? locale.auth.referCode : "Referral Code"
                          }
                          id="signUpRefCode"
                          keyType="referCode"
                          value={this.props.referCode}
                          onChange={this.props.signupFormHandler}
                        />
                      </div>
                    </div>
                    <a
                      onClick={this.props.refCodeShow}
                      className="mt-4 colorAnch"
                      id="haveRefCodeId"
                    >
                      {locale
                        ? locale.auth.haveRefCode
                        : "Have a referral code?"}
                    </a>
                    <p className="mt-3 termsAndConditionsSignUpModalText text-center">
                  {locale
                    ? locale.auth.accept1
                    : "By creating an account, I accept the "}
                  
                </p >
                <p className="mt-1 termsAndConditionsSignUpModalText text-center">
                <a className="colorAnch" href="/terms" target="_blank">
                    {locale ? locale.auth.accept2 : "Terms & Conditions"}
                  </a>
                </p>
                    {isPhoneValid &&
                    this.props.name &&
                    this.props.email &&
                    this.props.password ? (
                      <button
                        type="submit"
                        className="btn loginAndSignUpButton"
                      >
                        {locale ? locale.auth.continue : "continue"}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn loginAndSignUpButton"
                        title={
                          locale
                            ? locale.auth.validDetMsg
                            : "Please Enter Valid Details"
                        }
                        style={{ backgroundColor: "grey",color:"white" }}
                        disabled
                      >
                        {locale ? locale.auth.continue : "continue"}
                      </button>
                    )}
                  </Wrapper>
                )}

                <LinearProgressBar
                  error={this.props.error}
                  loading={this.props.loading}
                />

                {this.props.loading ? <CircularProgressLoader /> : ""}

                {/* <p className="mt-1 termsAndConditionsSignUpModalText">
                  {locale
                    ? locale.auth.accept1
                    : "By creating an account, I accept the "}
                  <a className="colorAnch" href="/terms" target="_blank">
                    {locale ? locale.auth.accept2 : "Terms & Conditions"}
                  </a>
                </p> */}
                <div class="fnt11 text-center baseClr">Already have an account ? <span class="fntWght700 border-bottom" onClick={this.props.showLoginHandler} style={{cursor:"pointer"}}>Log In</span></div>
              </form>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}
export default LangWrapepr(signupModal);
