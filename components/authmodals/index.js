import { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import axios from "axios";
// import Drawer from 'material-ui/Drawer';
import Drawer from "@material-ui/core/Drawer";
import { Dialog } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import dynamic from "next/dynamic";
import Paho from "../../lib/paho-mqtt";
import MQTT from "../../lib/paho-mqtt";

// import Paho from 'paho-mqtt'
// import MQTT from 'paho-mqtt'

import LoginModal from "./login";
import SignUpModal from "./signup";
import ForgetPasswordModal from "./forgetpassword";
import * as actions from "../../actions/index";
import * as enVariables from "../../lib/envariables";
import Wrapper from "../../hoc/wrapperHoc";
import LocationDrawer from "../location/locateDrawer";
import CartSlider from "../cart/cartSlider";
import {
  authenticate,
  signUpUserApi,
  checkEmailPhone,
} from "../../services/auth";
import { setCookie, getCookie, removeCookie } from "../../lib/session";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
  forgotPassword,
} from "../../services/otp";
import {
  validateNewUser,
  ValidateLoginFields,
  ValidateSingleField,
  ValidateResetPassword,
} from "../../lib/validation";
import {
  getCategoriesApi,
  getCategoriesApiNew,
  getStoreCategoriesApi,
} from "../../services/category";
import { getLocationZone } from "../../services/guestLogin";
import { getLocation } from "../../lib/auth";
import { updateCustomerDetail } from "../../services/profileApi";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import redirect from "../../lib/redirect";
import { getAreaData } from "../../lib/location/location";
import { getGeoInfo } from "../../lib/getip";

const styles = {
  paper: {
    width: enVariables.DRAWER_WIDTH_DESK,
  },
  mobilePaper: {
    width: "100%",
  },
};

class Authmodals extends Component {
  signupData = [];

  state = {
    showLogin: false,
    showSignup: false,
    showForgot: false,
    loginPhone: "",
    loginPassword: "",
    loading: false,
    error: null,
    otpPhone: "",
    otpData: {
      otp: "",
      otpVerified: false,
      otpShow: false,
    },
    signup: {
      phone: "",
      name: "",
      password: "",
      email: "",
      referCode: "",
      regPhone: "",
      cc: "",
    },
    forgetPassword: {
      showReset: false,
      otp: "",
      cc: "",
      mobile: "",
      newPassword: "",
      confirmPassword: "",
    },
    loginSliderWidth: 450,
    width: "100%",
    open: false,
    allowMqtt: false,
    file: null,
    showPreview: false,
    idSuccess: false,
    countryIntl: "IN",
    phoneNotAvailable: true,
    locationOpen: false,
    contryCode: "",
  };

  componentDidMount() {
    let data = getGeoInfo().then((data) => {
      this.setState({
        ...this.state,
        contryCode: data.country_code,
      });
      console.log("ForgetPasswordModal", data);
    });
  }

  constructor(props) {
    super(props);
    this.signupFormHandler = this.signupFormHandler.bind(this);
    this.showLoginHandler = this.showLoginHandler.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.mqttConnector = this.mqttConnector.bind(this);
    this.updateLoginPhone = this.updateLoginPhone.bind(this);
    this.allowOnlyNumber = this.allowOnlyNumber.bind(this);
  }

  handleClose = () => {
    this.setState({ open: false });
    this.props.handleClose();
  };

  componentDidMount() {
    // passing ref to parent to call children functions
    this.props.onRef(this);

    let sid = getCookie("sid", "");
    let mqttTopic = localStorage.getItem("dlvMqtCh");
    let authorized = getCookie("authorized", "");

    // this.getUserLocation();

    // if (!this.state.client && authorized || this.state.client && !this.state.client.isConnected && authorized) {
    //     console.log("mqtt client connection", this.state.client && this.state.client.isConnected ? this.state.client.isConnected : "noooo");
    //     this.mqttConnector(sid, mqttTopic);
    // }
    // if (authorized && mqttTopic && sid && !this.state.client) {
    //     console.log("authmodalll mqtt", this.state.mqttTopic);
    //     this.mqttConnector(sid, mqttTopic);
    // }

    // , this.props.dispatch(actions.getProfile())
  }

  allowOnlyNumber(e) {
    let char = e.keyCode;
    parseInt(char) >= 0 ||
    parseInt(char) <= 9 ||
    char == "Backspace" ||
    char == "Tab"
      ? console.log("char.....", parseInt(char))
      : e.preventDefault();
    if (
      (char >= 37 && char <= 40) ||
      (char >= 48 && char <= 57) ||
      (char >= 96 && char <= 105) ||
      char == 8 ||
      char == 9 ||
      char == 13
    ) {
    } else {
      e.preventDefault();
    }
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!this.state.phoneNotAvailable || this.checkPhone()) {
      // let phone = e.target.elements.phone.value
      let phone = this.state.lgPhone;
      // let password = e.target.elements.password.value
      let password = e.target.elements.password.value;
      let cc = this.state.cc;
      password
        ? this.userLogin(phone, password, cc)
        : this.authCallError("please enter password");
    } else {
    }
  };

  userLogin(phone, password, cc) {
    console.log("login Data", password, " ", phone, " ", cc);
    this.setState({ loading: true });
    authenticate(phone, password, cc)
      .then((res) => {
        // this.setState({ allowMqtt: true })
        res.error
          ? (this.authCallError(res.data.message),
            res.status == 404 ? this.showSignupHandler() : "")
          : this.authCallSuccess(res.data.data, 1);
      })
      .catch((error) => {
        console.log("login error", error);
      });
  }

  mqttConnector(sid, mqttTopic) {
    const connectReq = window.client ? !window.client.isConnected() : true;

    console.log("sadasdada", window.client && window.client.isConnected());
    if (
      getCookie("authorized") &&
      localStorage.getItem("dlvMqtCh") &&
      connectReq
    ) {
      window.Paho = { MQTT };
      let client;
      // if (!this.state.client || this.state.client && !this.state.client.isConnected) {
      client = new Paho.Client(enVariables.MQTT_HOST, sid);

      window.client = client;
      // console.log("mqtt outer connect...", this.state.client, client.isConnected());
      const options = {
        userName: "threestopAppVerneMq",
        password: "T9LPDYgQcuWVm8PC",
        useSSL: true,
        mqttVersion: 3,
        keepAliveInterval: 3,
        cleanSession: true,
        // reconnect: true,
        // timeout: 60,
        // Gets Called if the connection has successfully been established
        onSuccess: () => {
          console.log("connected", mqttTopic);

          var subscribeOptions = {
            qos: 2, // QoS
            invocationContext: { foo: true }, // Passed to success / failure callback
            onSuccess: (resp) => {
              console.log("mqtt subscribe success: ", resp);
            },
            onFailure: (err) => {
              console.log("mqtt subscribe failure: ", err);
            },
            //  timeout: 10
          };

          client.subscribe(mqttTopic.toString(), subscribeOptions);

          console.log("subscribed to", mqttTopic);

          // this.setState({ client: client });
        },
        onFailure: (message) => {
          console.log("mqtt Connection failed:.", message);
        },
      };
      client.connect(options);

      client.onConnectionLost = function (responseObject) {
        console.log("mqtt Connection Lost: ", responseObject.errorMessage);

        // reconnect again, if connection to socket gets disconnect
        client.connect(options);
      };

      // }
    }

    if (window.client) {
      window.client.onMessageArrived = (message) => {
        let mqttData = JSON.parse(message.payloadString);
        console.log(
          "****************mqttData***************",
          JSON.parse(message.payloadString)
        );
        this.props.dispatch(actions.alert(mqttData));
        // toastr.success(mqttData.statusMessage);
        switch (mqttData.status) {
          case 2:
            toastr.error("Order Id :" + mqttData.bid + ", " + mqttData.msg);
            break;

          case 7:
          case 15:
          case 4:
            toastr.success(
              "Order Id :" + mqttData.bid + ", " + mqttData.statusMessage
            );
            break;

          case 5:
          case 6:
          case 8:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
            toastr.info(
              "Order Id :" + mqttData.bid + ", " + mqttData.statusMessage
            );
            break;
        }
      };
    }
  }

  handleSignUpSubmit = (e) => {
    e.preventDefault();

    let cc = this.state.signup.cc;

    this.setState({ loading: true, otpPhone: this.state.signup.regPhone });

    let data = {
      phone: this.state.signup.regPhone,
      password: e.target.elements.password.value,
      email: e.target.elements.email.value,
      name: e.target.elements.name.value,
      refercode: e.target.elements.referCode.value,
      cc: cc,
      zoneId: getCookie("zoneid"),
    };
    this.state.signup.referCode
      ? (data["referCode"] = this.state.signup.referCode)
      : "";
    // validate form
    let validation = validateNewUser(
      data.name,
      data.phone,
      data.email,
      data.password
    );

    let checkEmail, checkPhone;
    console.log("Phone", data.phone);
    validation
      ? this.authCallError(validation)
      : ((this.signupData = data),
        (checkEmail = { verifyType: 2, email: data.email }),
        (checkPhone = { verifyType: 1, mobile: data.phone, countryCode: cc }),
        // check for phone

        checkEmailPhone(checkPhone).then((res) => {
          res.error
            ? this.authCallError(res.data.message)
            : // check for email
              checkEmailPhone(checkEmail).then((emailRes) => {
                emailRes.error
                  ? this.authCallError(emailRes.data.message)
                  : // send otp after all verifications => check for verifyOtpHandler for next steps in signup
                    sendOtp(data.phone, cc).then((otpRes) => {
                      otpRes.error
                        ? this.authCallError(otpRes.data.message)
                        : this.setState({
                            otpData: { ...this.state.otpData, otpShow: true },
                            loading: false,
                          });
                    });
              });
        }));
  };

  resendOtp = () => {
    const cc = this.state.cc;
    sendOtp(this.state.lgPhone, cc).then((otpRes) => {
      otpRes.error
        ? this.authCallError(otpRes.data.message)
        : this.setState({
            otpData: { ...this.state.otpData, otpShow: true },
            loading: false,
          });
    });
  };

  verifyOtpHandler(e) {
    let data;
    let cc = this.state.cc;
    const locale = this.props.locale;
    // check for the req field
    this.state.otpData.otp
      ? (this.setState({ loading: true }),
        (data = {
          mobile: this.state.lgPhone,
          countryCode: cc,
          code: this.state.otpData.otp,
        }),
        // verify otp
        verifyOtp(data)
          .then((res) => {
            res.error
              ? this.authCallError(res.data.message)
              : // sign up the customer
                signUpUserApi(this.signupData)
                  .then((res) => {
                    res.error
                      ? (this.authCallError(res.data.message),
                        res.status === 401
                          ? this.setState({
                              otpData: {
                                ...this.state.otpData,
                                otpShow: false,
                              },
                            })
                          : "")
                      : (this.authCallSuccess(res.data.data, 2),
                        this.setState({
                          otpData: { ...this.state.otpData, otpShow: false },
                        }),
                        this.closeModal());
                  })
                  .catch((error) => {});
          })
          .catch((error) => {}))
      : this.authCallError(
          locale ? locale.auth.plzEnterCode : "Please Enter Verification Code"
        );
  }

  refreshSignUp() {
    this.setState({
      otpData: { ...this.state.otpData, otpShow: false },

      signup: {
        ...this.state.signup,
        phone: "",
        name: "",
        password: "",
        email: "",
        referCode: "",
      },
    });
  }

  verifyForgotPasswordOtp() {
    let data;
    let cc = this.state.cc;
    const locale = this.props.locale;

    this.state.otpData.otp
      ? (this.setState({ loading: true }),
        (data = {
          mobile: this.state.lgPhone,
          countryCode: cc,
          code: this.state.otpData.otp,
        }),
        // verify otp
        verifyOtp(data)
          .then((res) => {
            res.error
              ? this.authCallError(res.data.message)
              : ($(".otpform")[0].reset(),
                this.setState(
                  {
                    forgetPassword: {
                      ...this.state.forgetPassword,
                      mobile: this.state.loginPhone,
                      otp: this.state.otpData.otp,
                      cc: cc,
                      showReset: true,
                    },
                    loading: false,
                    otpData: { ...this.state.otpData, otp: "" },
                    loginPhone: "",
                  },
                  () => {
                    setTimeout(() => {
                      this.setControlFocus("newpassword");
                    }, 500);
                  }
                ));
          })
          .catch((error) => {}))
      : this.authCallError(
          locale ? locale.auth.plzEnterCode : "Please Enter Verification Code"
        );
  }

  resetPasswordHandler() {
    let data = {
      mobile: this.state.lgPhone,
      countryCode: this.state.forgetPassword.cc,
      code: this.state.forgetPassword.otp,
      password: this.state.forgetPassword.confirmPassword,
    };
    const locale = this.props.locale;
    let validate = ValidateResetPassword(
      this.state.forgetPassword.newPassword,
      this.state.forgetPassword.confirmPassword
    );

    validate
      ? this.authCallError(validate)
      : resetPassword(data)
          .then((res) => {
            res.error
              ? this.authCallError(res.data.message)
              : this.setState(
                  {
                    error: locale
                      ? locale.auth.passSuccess
                      : "Password Changed Successfully",
                  },
                  () => {
                    this.userLogin(
                      data.mobile,
                      data.password,
                      data.countryCode
                    );
                  }
                );
          })
          .catch((err) => {});
  }

  async authCallSuccess(res, type) {
    await this.props.dispatch(actions.auth(res.name));
    await setCookie("token", res.token);
    await setCookie("sid", res.sid);
    await setCookie("username", res.name);
    await setCookie("authorized", true);
    await setCookie("req_id", res.requester_id);

    localStorage.setItem("dlvMqtCh", res.mqttTopic);

    type == 1 ? this.closeModal() : "";
    axios.defaults.headers.common["authorization"] = await res.token;

    this.setState({ mqttTopic: res.mqttTopic });
    await this.props.dispatch(actions.checkCookies());
    await this.props.dispatch(actions.getCart());
    await setTimeout(() => {
      this.props.dispatch(actions.getCart());
    }, 1000);
    setTimeout(() => {
      // setCookie('mqttTopic', res.mqttTopic)
      this.mqttConnector(res.sid, res.mqttTopic);
      this.props.dispatch(actions.getProfile());
    }, 100);
  }

  authCallError(res) {
    this.setState({ error: res, loading: false });
    setTimeout(() => {
      this.setState({ error: null });
    }, 3500);
  }

  closeModal() {
    this.setState({
      loginPhone: "",
      loginPassword: "",
      loading: false,
      open: false,
      showLogin: false,
    });

    this.refreshSignUp();
  }

  refCodeShow() {
    $("#signUpRefCodeLayout").show();
    $("#haveRefCodeId").hide();
  }

  updateNewPassword = (e) => {
    this.setState({
      forgetPassword: {
        ...this.state.forgetPassword,
        newPassword: e.target.value,
      },
    });
  };
  updateConfirmPassword = (e) => {
    this.setState({
      forgetPassword: {
        ...this.state.forgetPassword,
        confirmPassword: e.target.value,
      },
    });
  };
  updateLoginPhone = (phone) => {
    const phoneNumber = phone
      ? parsePhoneNumberFromString(phone.toString())
      : "";
    const countryIntl = phoneNumber ? phoneNumber.country : "IN";
    const re = /[0-9]+/g;
    // if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 10) {
    this.setState({
      loginPhone: phone,
      cc: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      lgPhone: phoneNumber ? phoneNumber.nationalNumber : "",
      countryIntl: countryIntl,
    });
    // }
  };
  updateLoginPassword = (e) => {
    this.setState({ loginPassword: e.target.value });
  };

  showLoginHandler(isMobile) {
    this.setState(
      {
        open: true,
        width: isMobile === true ? "100%" : 450,
        loading: false,
        showLogin: true,
        showSignup: false,
        showForgot: false,
        phoneNotAvailable: true,
      },
      () => {
        setTimeout(() => {
          this.setControlFocus("loginPhone");
        }, 500);
      }
    );
  }
  showSignupHandler(isMobile) {
    this.setState(
      {
        open: true,
        loading: false,
        width: isMobile === true ? "100%" : 450,
        showLogin: false,
        showSignup: true,
        showForgot: false,
      },
      () => {
        this.setControlFocus("regFormPhone");
      }
    );
  }

  setControlFocus = (id) => {
    document.getElementById(id) ? document.getElementById(id).focus() : "";
  };

  showForgotPasswordHandler(isPhoneValid) {
    if (!isPhoneValid) return; // check and return if the entered phone is not valid
    const locale = this.props.locale;
    let verify = ValidateSingleField(this.state.loginPhone);
    let cc = this.state.cc;
    let forgotPwdData = {
      countryCode: this.state.cc,
      emailOrMobile: this.state.lgPhone,
      verifyType: 1,
    };
    verify
      ? this.authCallError(verify)
      : (this.setState({ loading: true }),
        forgotPassword(forgotPwdData).then((res) => {
          res.error
            ? res.status
              ? this.authCallError(
                  locale
                    ? locale.auth.phoneNotReg
                    : "This Phone Number is not registered with us"
                )
              : this.authCallError(res.data.message)
            : // sendOtp(this.state.loginPhone, cc).then((otpRes) => {
              //     otpRes.error ? this.authCallError(otpRes.data.message) :
              this.setState(
                {
                  loading: false,
                  showLogin: false,
                  showSignup: false,
                  showForgot: true,
                },
                () => {
                  //     setTimeout(() => {
                  //         this.setControlFocus("forgotPassword");
                  //     }, 500);
                  // })
                }
              );
        }));
  }

  otpHandler(otp) {
    console.log(otp, "otpHandler");
    const re = /[0-9]+/g;
    this.setState({
      otpData: { ...this.state.otpData, otp: otp },
    });
  }

  signupFormHandler(keyName, e) {
    switch (keyName) {
      case "name":
        this.setState({
          signup: { ...this.state.signup, name: e.target.value },
        });
        break;
      case "password":
        this.setState({
          signup: { ...this.state.signup, password: e.target.value },
        });
        break;
      case "email":
        this.setState({
          signup: { ...this.state.signup, email: e.target.value },
        });
        break;
      case "referCode":
        this.setState({
          signup: { ...this.state.signup, referCode: e.target.value },
        });
        break;
      default:
        const re = /[0-9]+/g;
        const phoneNumber = keyName
          ? parsePhoneNumberFromString(keyName.toString())
          : "";
        const countryIntl = phoneNumber ? phoneNumber.country : "IN";
        this.setState({
          signup: {
            ...this.state.signup,
            phone: keyName,
            regPhone: phoneNumber ? phoneNumber.nationalNumber : "",
            cc: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
          },
          cc: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
          lgPhone: phoneNumber ? phoneNumber.nationalNumber : "",
          countryIntl: countryIntl,
        });

        // if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 10) {
        //     this.setState({ signup: { ...this.state.signup, phone: e.target.value, } });
        // }
        break;
    }
  }

  showLocationHandler = () => {
    this.setState({ loginSliderWidth: 450, locationOpen: true }, () => {
      this.child.handleToggle();
      setTimeout(() => {
        this.setControlFocus("locMobiInput");
      }, 1000);
    });
  };

  showCart = () => {
    this.cartRef.handleToggle();
  };

  showLocationMobileHandler = (isLocationAvailable) => {
    this.setState(
      {
        loginSliderWidth: "100%",
        userLocation: isLocationAvailable,
        locationOpen: true,
      },
      () => {
        this.child.handleToggle();
        setTimeout(() => {
          this.setControlFocus("locMobiInput");
        }, 1000);
      }
    );
  };

  handleClose = () => {
    this.setState({ loginSliderWidth: 0, locationOpen: false });
  };

  getUserLocation = () => {
    axios.get("https://ipapi.co/json").then((data) => {
      setCookie("cityReg", data.data.city);
      this.setState({ city: data.data.city });
    });
  };

  getGeoLocation = () => {
    const location = getLocation();
    location.then(
      (res) => {
        // if (getCookie("storeType") && getCookie("dlvxCartLmt")) {
        //     this.updateLocation({ lat: res.coords.latitude, lng: res.coords.longitude })
        // } else {
        //     this.updateStoreList();
        //     this.setState({ loading: true })
        //     setTimeout(() => {
        //         this.setState({ loading: false })
        //         this.child.handleClose();
        //     }, 700);
        // }
        this.updateLocation({
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        });
      },
      (error) => {
        axios.get("https://ipapi.co/json").then((data) => {
          this.updateLocation({
            lat: data.data.latitude,
            lng: data.data.longitude,
          });
        });
      }
    );
  };

  updateStoreList = () => {
    // let lat = getCookie("lat", '');
    // let lng = getCookie("long", '');

    // let query = {
    //     lat: lat,
    //     long: lng,
    //     token: getCookie("token"),
    //     zoneId: getCookie("zoneid"),
    //     offset: 0,
    //     limit: 40,
    //     type: getCookie("categoryType"),
    //     categoryId: getCookie("categoryId")
    // };

    // getAllStoreList(query).then(({ data }) => {

    //     if (data && data.data) {
    //         this.setState({ storeList: data.data, offerList: data.offerData, offerListLoading: false });
    //     }
    // });

    this.props.updateStoreList();
  };

  setupUserByAddress = (address) => {
    this.updateLocation({
      lat: address.latitude,
      lng: address.longitude,
    });
  };

  setupAddressLocation = (data, type) => {
    console.log("setupAddressLocation")
    data["token"] = getCookie("token", "");

    this.setState({
      loading: true,
      location: data.location,
      lat: data.lat,
      long: data.lng,
      locationData: data,
    });

    let totalAddr = data && data.address ? data.address.split(",") : null;

    totalAddr
      ? setCookie("areaReg", totalAddr[totalAddr.length - 4].trim())
      : "";

    getLocationZone(data.lat, data.lng).then((zone) => {
      zone.error
        ? (this.errorHandler(zone.data.message),
        setCookie("locatonShow", false))
        : zone.data.zoneId && data.lat && data.lng && data.token
        setCookie("locatonShow", true)
        setCookie("authenticatedZone", true)
        ? getStoreCategoriesApi(zone.data.cityId, data.token).then((res) => {
          
            if (res.error) {
              this.errorHandler(res.data.message);
            } else {
              // this.startTopLoader(),
              getAreaData(data.lat, data.lng).then((areaData) => {
                this.props.dispatch(actions.initLocChange(data));
                setCookie("zoneid", zone.data.zoneId);
                setCookie("cityid", zone.data.cityId);
                setCookie("locAuthenticated", true);
                setCookie("authenticatedZone", true);
                setCookie("malam", 1),
                type && type == 2
                  ? redirect("/profile")
                  : redirect(`/${areaData.city}/stores`);
                  // ${areaData.city}/stores
                // : redirect('/restaurants')
              });
            }
            this.setState({ loading: false });
          })
        : this.errorHandler("improper location"), setCookie("locatonShow", false)
    });
  };

  errorHandler = (res) => {
    this.state.error
      ? ""
      : (this.setState({ error: res, loading: false }),
        setTimeout(() => {
          this.setState({ error: null });
        }, 3500));
  };

  // called when user selects address from dropdown, or update user location
  updateLocation = async (data) => {
    // check if the user is not in store page, update lat, long and refresh the page
    // if (!getCookie("storeType") || !getCookie("dlvxCartLmt")) {
    // console.log(data ,"tusharGHODADR")
    // console.log("setupAddressLocation")
    this.setState({ loading: true });

    await setCookie("lat", data.lat);
    await setCookie("long", data.lng);
    setCookie("locAuthenticated", true);
    setCookie("authenticatedZone", true);
    await this.props.dispatch(actions.initLocChange(data));

    // this.updateStoreList();

    setTimeout(() => {
      getAreaData(data.lat, data.lng).then((areaData) => {
        if (areaData && areaData.city) {
          redirect(`/${areaData.city}/stores`);
        } else {
          redirect("/");
        }
      });
      // window.location.reload();
    }, 1800);

    return;
    // }else{
    //     console.log("HEHEHEHEHEHEHEHEHEE ELSEEEEEEEE")

    // }

    // will go furthure if user is changing the location from stores pages
    const locale = this.props.locale;

    data["token"] = getCookie("token", "");
    this.setState({ loading: true });

    this.props.dispatch(actions.initLocChange(data));
    let storeType = getCookie("storeType");
    let stroeCategoryId = getCookie("stroeCategoryId");
    let storeId = getCookie("storeId");

    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");

    // get stores category wise
    let getStoresPayload = {
      lat: lat,
      long: lng,
      token: getCookie("token"),
      zoneId: getCookie("zoneid"),
      offset: 0,
      limit: 40,
      type: 2,
      categoryId: getCookie("categoryId"),
    };

    // getting new zones based on selected location lat and long
    getLocationZone(data.lat, data.lng).then((zone) => {
      zone.error
        ? this.authCallError(zone.data.message)
        : zone.data.zoneId && data.lat && data.lng && data.token
        
        ? getCategoriesApiNew(
            zone.data.zoneId,
            storeType,
            stroeCategoryId,
            storeId,
            data.lat,
            data.lng,
            data.token
          ).then((res) => {
            res.error
              ? this.authCallError(res.data.message)
              : (setCookie("storeId", 0),
                this.props.dispatch(actions.getCategory(res.data)),
                setCookie("zoneid", zone.data.zoneId),
                setCookie("lat", data.lat),
                setCookie("long", data.lng),
                setCookie("malam", 1),
                this.child.handleClose(),
                this.handleClose(),
                // this.props.dispatch(actions.getStores()),
                this.props.dispatch(actions.getStoresByType(getStoresPayload)));
            this.setState({ loading: false });
          })
        : this.authCallError(
            locale ? locale.auth.imprLoc : "improper location"
          );
    });
  };

  handleFileUpload = (event) => {
    this.setState({ file: event.target.files, showPreviewforMMJ: true });
    var reader = new FileReader();

    reader.onload = function (e) {
      var fu1 = document.getElementById("mmjFile").value;
      var filename = fu1.replace(/^.*[\\\/]/, "");
      document.getElementById("mmjName").innerHTML = filename;
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  submitFile = (e) => {
    AWS.config.update({
      accessKeyId: "AKIAIUEEKTGNKHAC6NYQ",
      secretAccessKey: "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",
      region: "us-east-1",
    });

    var s3 = new AWS.S3();
    let tStamp = +new Date();
    var params = {
      Bucket: "loopzadmin",
      Key: "Customers/MMJPic/" + "MMJPic_" + getCookie("sid"),
      ContentType: this.state.file[0].type,
      Body: this.state.file[0],
      ACL: "public-read",
    };
    this.setState({ loading: true, mmjLoading: true });
    s3.putObject(params, (err, res) => {
      if (err) {
        this.setState({ mmjLoading: false });
      } else {
        this.setState({
          mmjSuccess: true,
          showPreviewforMMJ: false,
          mmjLoading: false,
        });
        let data = {
          mmjCard: "https://s3.amazonaws.com/loopzadmin/" + params.Key,
        };
        updateCustomerDetail(data).then((res) => {
          this.state.mmjSuccess && this.state.idSuccess
            ? this.closeModal()
            : "";
        });
        this.setState({ loading: false });
      }
    });
  };
  handleFileUploadID = (event) => {
    this.setState({ idPicFile: event.target.files, showPreviewforID: true });
    var reader = new FileReader();

    reader.onload = function (e) {
      var fu1 = document.getElementById("idPicFile").value;
      var filename = fu1.replace(/^.*[\\\/]/, "");
      document.getElementById("idPicName").innerHTML = filename;
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  submitFileID = (e) => {
    AWS.config.update({
      accessKeyId: "AKIAIUEEKTGNKHAC6NYQ",
      secretAccessKey: "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",
      region: "us-east-1",
    });

    var s3 = new AWS.S3();
    let tStamp = +new Date();
    var params = {
      Bucket: "loopzadmin",
      Key: "Customers/IDPic/" + "IDPic_" + getCookie("sid"),
      ContentType: this.state.idPicFile[0].type,
      Body: this.state.idPicFile[0],
      ACL: "public-read",
    };
    this.setState({ loading: true, idLoading: true });
    s3.putObject(params, (err, res) => {
      if (err) {
        this.setState({ idLoading: false });
      } else {
        this.setState({
          idSuccess: true,
          showPreviewforID: false,
          idLoading: false,
        });
        let data = {
          identityCard: "https://s3.amazonaws.com/loopzadmin/" + params.Key,
        };
        updateCustomerDetail(data).then((res) => {
          this.state.mmjSuccess && this.state.idSuccess
            ? this.closeModal()
            : "";
        });
        this.setState({ loading: false });
      }
    });
  };
  checkPhone = (event) => {
    let data = {
      countryCode: this.state.cc,
      mobile: this.state.lgPhone,
      verifyType: 1,
    };
    checkEmailPhone(data).then((res) => {
      if (res.error) {
        this.setState({ phoneNotAvailable: false }, () => {
          this.setControlFocus("loginPassword");
        });
        return true;
      } else {
        this.setState({ phoneNotAvailable: true });
        // , signup: { ...this.state.signup, phone: this.state.lgPhone }
        this.showSignupHandler();
        return false;
      }
    });
  };

  resetFileControl = (type) => {
    type == 1
      ? ((document.getElementById("idPicFile").value = ""),
        this.setState({ showPreviewforID: false }))
      : ((document.getElementById("mmjFile").value = ""),
        this.setState({ showPreviewforMMJ: false }));
  };

  render() {
    // const width = window.innerWidth;
    const { classes } = this.props;

    // classes["paper"]["width"] = 500;

    return (
      <Wrapper>
        <Dialog
          // onRequestChange={(open) => this.setState({ open })}
          open={this.state.open}
          // openSecondary={true}
          width={this.state.width}
          // docked={false}
          anchor="right"
          classes={{
            paper:
              this.state.width == "100%" ? classes.mobilePaper : classes.paper,
          }}
          onClose={this.closeModal}
          // containerStyle={{ width: this.state.width, overflow: 'hidden' }}
          // containerStyle={{ width: this.state.width, maxWidth: this.state.loginSliderWidth }}
        >
          <div className="col-12">
            <div className="row justify-content-center">
              {this.state.showLogin ? (
                <LoginModal
                  show={this.state.showLogin}
                  loginPhone={this.state.loginPhone}
                  loginPassword={this.state.loginPassword}
                  countryIntl={this.state.countryIntl}
                  handleLoginSubmit={(event) => this.handleLoginSubmit(event)}
                  updateLoginPhone={(event) => this.updateLoginPhone(event)}
                  updateLoginPassword={(event) =>
                    this.updateLoginPassword(event)
                  }
                  allowOnlyNumber={this.allowOnlyNumber}
                  showSignupHandler={(event) => this.showSignupHandler(event)}
                  showForgotPasswordHandler={(event) =>
                    this.showForgotPasswordHandler(event)
                  }
                  loading={this.state.loading}
                  error={this.state.error}
                  closeModal={this.closeModal}
                  locale={this.props.locale}
                  checkPhone={this.checkPhone}
                  phoneNotAvailable={this.state.phoneNotAvailable}
                />
              ) : (
                ""
              )}

              <SignUpModal
                {...this.state.signup}
                {...this.state.otpData}
                otpHandler={(event) => this.otpHandler(event)}
                allowOnlyNumber={this.allowOnlyNumber}
                handleSignUpSubmit={(event) => this.handleSignUpSubmit(event)}
                signupFormHandler={this.signupFormHandler}
                verifyOtpHandler={() => this.verifyOtpHandler()}
                show={this.state.showSignup}
                showLoginHandler={(event) => this.showLoginHandler(event)}
                loading={this.state.loading}
                error={this.state.error}
                refCodeShow={this.refCodeShow}
                closeModal={this.closeModal}
                handleFileUpload={this.handleFileUpload}
                handleFileUploadID={this.handleFileUploadID}
                submitFile={this.submitFile}
                submitFileID={this.submitFileID}
                showPreviewforMMJ={this.state.showPreviewforMMJ}
                showPreviewforID={this.state.showPreviewforID}
                mmjSuccess={this.state.mmjSuccess}
                idSuccess={this.state.idSuccess}
                resetFileControl={this.resetFileControl}
                skipUpload={this.skipUpload}
                idLoading={this.state.idLoading}
                mmjLoading={this.state.mmjLoading}
                locale={this.props.locale}
                countryIntl={this.state.countryIntl}
                resendOtp={this.resendOtp}
              />

              <ForgetPasswordModal
                loginPhone={this.state.loginPhone}
                updateLoginPhone={(event) => this.updateLoginPhone(event)}
                countryIntl={this.state.countryIntl}
                otp={this.state.otpData.otp}
                show={this.state.showForgot}
                resetEnable={this.state.forgetPassword.showReset}
                verifyForgotPasswordOtp={() => this.verifyForgotPasswordOtp()}
                resetPasswordHandler={() => this.resetPasswordHandler()}
                otpHandler={(event) => this.otpHandler(event)}
                showLoginHandler={(event) => this.showLoginHandler(event)}
                loading={this.state.loading}
                error={this.state.error}
                newPassword={this.state.forgetPassword.newPassword}
                confirmPassword={this.state.forgetPassword.confirmPassword}
                updateNewPassword={(event) => this.updateNewPassword(event)}
                updateConfirmPassword={(event) =>
                  this.updateConfirmPassword(event)
                }
                closeModal={this.closeModal}
                locale={this.props.locale}
              />
            </div>
          </div>
        </Dialog>

        {this.state.locationOpen ? (
          <LocationDrawer
            onRef={(ref) => (this.child = ref)}
            width={this.state.loginSliderWidth}
            updateLocation={this.updateLocation}
            loading={this.state.loading}
            handleClose={this.handleClose}
            locErrMessage={this.state.error}
            getGeoLocation={this.getGeoLocation}
            setupUserByAddress={this.setupUserByAddress}
            locale={this.props.locale}
            userProfile={this.props.userProfile}
            userLocation={this.state.userLocation}
          />
        ) : (
          ""
        )}
        <CartSlider
          onRef={(ref) => (this.cartRef = ref)}
          editCart={this.props.editCart}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    userProfile: state.userProfile,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Authmodals));
