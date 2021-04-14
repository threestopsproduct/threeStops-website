import { post, postWithToken, get } from "../lib/request";
import $ from "jquery";
import { setCookie, getCookie, removeCookie } from "../lib/session";
import { FILTER_HOST } from "../lib/envariables";
import axios from "axios";

export const authenticate = async (userPhone, userPassword, cc) => {
  try {
    const response = await post("/customer/signIn", {
      phone: userPhone,
      password: userPassword,
      deviceId: "skldnvlkd",
      pushToken: "web",
      appVersion: "web",
      deviceMake: "web",
      deviceModel: "web",
      deviceType: 3,
      deviceTime: "web",
      countryCode: cc,
    });
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };

    return err;
  }
};

export const signUpUserApi = async (data) => {
  let zoneid = getCookie("zoneid", "");

  let signupData = {
    name: data.name,
    email: data.email,
    deviceId: "web",
    pushToken: "web",
    password: data.password,
    countryCode: data.cc,
    mobile: data.phone,
    loginType: 3,
    deviceType: 3,
    termsAndCond: 1,
    appVersion: "web",
    deviceMake: "web",
    deviceModel: "web",
    zoneId: zoneid,
  };
  data.referCode ? (signupData["referralCode"] = data.referCode) : "";

  try {
    const response = await postWithToken("/customer/signUp", signupData);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };

    return err;
  }
};

export const checkEmailPhone = async (data) => {
  try {
    const response = await post("/customer/emailPhoneValidate", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };

    return err;
  }
};

export const checkOldPassword = async (data) => {
  try {
    const response = await post("/customer/password/check", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };

    return err;
  }
};

export const appConfig = async () => {
  try {
    const response = await get("/customer/config", "");
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };

    return err;
  }
};

export const getCities = async () => {
  return axios.get(FILTER_HOST + "/cities/", {
    headers: {
      "Content-Type": "application/json",
      language: "en",
    },
  });
};
