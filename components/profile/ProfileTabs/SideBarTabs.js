import React, { useContext } from "react";
import { Component } from "react";
import Wrapper from "../../../hoc/wrapperHoc";
import LanguageContext from "../../../context/languageContext";
export const SideBarTabs = props => {
  const { lang } = useContext(LanguageContext);
  return (
    <Wrapper>
      {/* <div
        className="col-12 col-md-auto col-lg-auto pr-0 pt-3 mb-4 mb-lg-0"
        id="ordersSideMenuLayout"
      >
        <ul
          className="nav nav-pills flex-column"
          role="tablist"
          id="ordersSideMenuLayoutULId"
        >
          <li className="nav-item">
            <a
              className="nav-link active"
              id="ordersid"
              data-toggle="pill"
              href="#orders"
            >
              
              {lang.orders || "orders"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="addressesid"
              data-toggle="pill"
              href="#manageAddresses"
            >
            
              {lang.manageAddress || "manage addresses"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="paymentsid"
              data-toggle="pill"
              href="#payments"
            >
              
              {lang.payment || "payments"}
            </a>
          </li>
         
          <li className="nav-item">
            <a
              className="nav-link"
              id="Offersid"
              data-toggle="pill"
              href="#offers"
            >
              
              {lang.offers || "Offers"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="Offersid"
              data-toggle="pill"
              href="#helpSupport"
            >
              
              {lang.helpCenter || "Help Center"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="profile_logOutid"
              onClick={props.deleteAllCookies}
            >
              {lang.lougout || "Log out"}
            </a>
          </li>
        </ul>
      </div> */}
       <div className="col-lg-3 col-md-4 py-sm-4 ml-lg-3">
       <div className="col-12 py-sm-4 h-100" style={{background: "#eff5fc"}}>
                            <ul className="nav nav-pills flex-column my-order-ul">
                                <li className="nav-item">
                                    <a className="nav-link active" data-toggle="pill" href="#orders">Orders</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="pill" href="#manageAddresses">Manage Addresses</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="pill" href="#payments">Payments</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="pill" href="#offers">Offers</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="pill" href="#helpSupport">Help Center</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="pill" href="#LogOut"
                                     onClick={props.deleteAllCookies}
                                    >Log Out</a>
                                </li>
                            </ul>
                        </div>
                        </div>
    </Wrapper>
  );
};
 {/* <li className="nav-item">
                        <a className="nav-link" id="favouritesid" data-toggle="pill" href="#favourites">favorites</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="wishListid" data-toggle="pill" href="#wishlist">Wishlist</a>
                    </li> */}
          {/* <li className="nav-item">
                        <a className="nav-link" id="wishListid" data-toggle="pill" href="#favourites">
                            <img src="/static/images/new_imgs/FAV_TAB.svg" className="profileTabIcons" /> 
                            favorites</a>
                    </li> */}