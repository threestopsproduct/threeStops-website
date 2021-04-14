import Router from "next/router";

import redirect from "../redirect";
import { getCookie, setCookie } from "../session";

// redirection to product detail page
export const RouteToDetails = (product, bType) => {
  let products =product.productName.replace("/","")
  redirect(
    `/details/${getCookie("cityReg")}/${getCookie("areaReg")}/${getCookie(
      "storeName"
    )}/${products}?id=${product.childProductId}`
      .replace(/%20/g, "")
      .replace(/,/g, "")
      .replace(/ /g, "-")
  );
};

// redirection to restaurant page
export const NavigateToRestaurant = (store) => {
  setCookie("storeId", store.storeId);
  setCookie("dlvxCartLmt", store.cartsAllowed);
  setCookie("storeType", store.storeType);
  setCookie("storeName", store && store.storeName);
  let finalSlug = "";

  Object.keys(store.addressCompo).map((key) => {
    store.addressCompo[key] != "undefined" &&
    store.addressCompo[key].length > 2 &&
    (key == "sublocality_level_1" ||
      key == "sublocality_level_2" ||
      key == "locality" ||
      key == "postal_code")
      ? (finalSlug += "-" + store.addressCompo[key])
      : "";
  });
  console.log("sadasdasd", store);

  Router.push(
    `/restofront?id=${store.storeId}`,
    `/restaurant/${(store.storeName + finalSlug)
      .replace(/%20/g, "")
      .replace(/,/g, "")
      .replace(/&/g, "")
      .replace(/ /g, "-")}`
  ).then(() => window.scrollTo(0, 0));
};

// redirection to stores page
export const NavigateToStore = (store, categoryId) => {
  console.log(store, "tushar");
  // Router.prefetch("/stores");
  setCookie("storeId", store && store.storeId);
  setCookie("storeType", store && store.storeType);
  setCookie("stroeCategoryId", store && categoryId);
  setCookie("dlvxCartLmt", store && store.cartsAllowed);
  setCookie("storeName", store && store.storeName);

  let finalSlug = "";

  Object.keys(store.addressCompo).map((key) => {
    store.addressCompo[key] != "undefined" &&
    store.addressCompo[key].length > 2 &&
    (key == "sublocality_level_1" ||
      key == "sublocality_level_2" ||
      key == "locality" ||
      key == "postal_code")
      ? (finalSlug += "-" + store.addressCompo[key])
      : "";
  });

  let storeName =
    store &&
    store.storeName.replace(/,/g, "").replace(/& /g, "").replace(/ /g, "-");

  redirect(
    `/stores/${storeName + finalSlug}`
      .replace(/%20/g, "")
      .replace(/,/g, "")
      .replace(/&/g, "")
      .replace(/ /g, "-")
  );
};
