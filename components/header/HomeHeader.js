import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";
import $ from "jquery";
import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie
} from "../../lib/session";
import Authmodals from "../authmodals/index";
import Wrapper from "../../hoc/wrapperHoc";
import Router from "next/router";
import * as actions from "../../actions/index";
import * as enVariables from "../../lib/envariables";
import ExpireCartDialog from "../dialogs/expireCart";
import TopLoader from "../ui/loaders/TopBarLoader/TopBarLoader";
import CartBadge from "../ui/cart/badge";
import ProfileMenu from "./profile/profileMenu";
import CartContent from "./cart/cart";
import LogOutDialog from "../dialogs/logOut";

class HomePageHeader extends React.Component {
  state = {
    currentAddress: "",
    city: "",
    isRendered: false,
    sessionVerified: false
  };

  constructor(props) {
    super(props);
    this.setDeliveryType = this.setDeliveryType.bind(this);
  }

  showLoginHandler = () => {
    this.props.showLoginHandler();
  };
  showSignUpHandler = () => {
    this.props.showSignupHandler();
  };
  showLocationMobileHandler = () => {
    this.props.showLocationMobileHandler();
  };
  showLocationHandler = () => {
    this.props.showLocationHandler();
  };
  showCart = () => {
    this.props.isAuthorized ? this.props.showCart() : this.showLoginHandler();
  };

  RouteBack = () => {
    Router.back();
  };
  RouteSearch = () => {
    Router.push("/restoSearch");
  };
  RouteProfile = () => {
    Router.push("/profile");
  };

  changeAddress = (lat, lng) => {
    location.reload();
  };

  logOut = () => {
    this.logOutRef.openOptionsDialog(2);
  };

  setDeliveryType(type, event) {
    localStorage.setItem("foo",type );
    event.stopPropagation();
    this.props.dispatch(actions.deliveryType(type));
    // Router.push("/checkout").then(() => window.scrollTo(0, 0));
    this.verifyMinimuOrderCheck();
    setCookie("deliveryType",type)
    // this.TopLoader.startLoader();
  }
  verifyMinimuOrderCheck = () => {
    let cartStoresData = this.props.myCart ? this.props.myCart.cart : [];
    let invalidStoreOrders = [];
    cartStoresData &&
      cartStoresData.map((item, storeIndex) => {
        let minAmount = item.minimumOrder;
        let storeCurrentTotal = item.storeTotalPrice;

        if (!item.minimumOrderSatisfied && minAmount - storeCurrentTotal > 0) {
          invalidStoreOrders.push(item);
        }
      });

    if (invalidStoreOrders && invalidStoreOrders.length > 0) {
      console.log("MY CART --> ", invalidStoreOrders);
      let minAmount = invalidStoreOrders[0].minimumOrder;
      let storeName = invalidStoreOrders[0].storeName;
      let storeCurrentTotal = invalidStoreOrders[0].storeTotalPrice;
      toastr.error(
        `${
          "The minimum order value is ₹"} ${minAmount} ${
          "for"} ${storeName}. ${ "Add ₹"} ${parseFloat(minAmount -
          storeCurrentTotal).toFixed(2)} ${ "to be able to order"}.`
      );
      return;
    }
    
    Router.push("/checkout").then(() => window.scrollTo(0, 0));
  };
  getAddress = async (lat, lng,address) => {

    let latitude = parseFloat(lat);
    let longitude =parseFloat(lng)
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(latitude, longitude);
    console.log(lat, lng,address,"lat, lng")
    
    await geocoder.geocode({ latLng: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        // let addr = results[results.length - 6].formatted_address.split(",");

        let mainLocIndex = -1;
        let currentCity = "";
        let currentState ="";
        let currentJilo ="";
        results.map(location => {
          mainLocIndex = location.types.findIndex(
            typeOfLocation =>
              typeOfLocation === "locality" || typeOfLocation === "country"
          );
          // check if the locality (city) is available in google result
          if (mainLocIndex > -1) {
            currentCity = location.formatted_address.split(",")[0];
            
          }
          console.log( location.formatted_address.split(",")[0],"currentState")
        });
        this.setState({
          city: currentCity,
        
          currentAddress: results[0].formatted_address
        });
      }
    });
  };

  initGeolocation() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    if (navigator.geolocation) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition(
        this.successLocation,
        this.successLocation,
        options
      );
    } else {
      toastr.error(
        "Desculpe, seu navegador não suporta serviços de geolocalização."
      );
    }
  }

  successLocation = async position => {
    if (position && position.coords) {
      // this.setPosition(position.coords.latitude, position.coords.longitude);
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      await geocoder.geocode({ latLng: latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let addr = results[results.length - 6].formatted_address.split(",");
          // this.setState({
          //   city: addr[1],
          //   currentAddress: results[0].formatted_address
          // });
          console.log(
            "accurate.. is",
            results[0].formatted_address,
            position.coords.latitude,
            position.coords.longitude
          );
        }
      });
    }
  };

  componentDidMount() {
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    let address =getCookie("place","");
    this.getAddress(lat, lng ,address);
    // this.props.dispatch(actions.getProfile());
    this.setState({ isRendered: true });

    // this.initGeolocation();
    // window.addEventListener("scroll", this.handleScroll);
    $(function() {
      //caches a jQuery object containing the header element
      var header = $("#navbar");
      $(window).scroll(function() {
          var scroll = $(window).scrollTop();
  
          if (scroll >= 100) {
              header.removeClass('backSecondCss').addClass("backCss");
          } else {
              header.removeClass("backCss").addClass('backSecondCss');
          }
      });
  });
  }
  

  handleScroll() {
    console.log(document.body.scrollTop,document.documentElement.scrollTop,"tusharH")
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          document.getElementById("navbar").style.backgroundColor = "#003049";
          document.getElementById("navbar").style.paddingBottom = "0px";
          document.getElementById("navbar").style.paddingTop = "0px";
          document.getElementById("navbar").style.boxShadow = "0px 4px 9px #00000029";
          // document.getElementById("searchInput").style.display = "block";
          //  document.getElementById("inputD").style.display ="block"
      } else {
          document.getElementById("navbar").style.backgroundColor = "transparent";
          document.getElementById("navbar").style.paddingBottom = "20px";
          document.getElementById("navbar").style.paddingTop = "20px";
          document.getElementById("navbar").style.boxShadow = "none";
          // document.getElementById("searchInput").style.display = "none";
          // document.getElementById("inputD").style.display ="none"
      }
  }
  componentWillReceiveProps = newProps => {
    this.checkForSession(newProps); // calling a function to check the user session
  };

  checkForSession = newProps => {
    if (
      getCookie("authorized") &&
      newProps.sessionExpired &&
      !this.state.sessionVerified
    ) {
      this.logOutRef.openOptionsDialog(1);
      this.setState({ sessionVerified: true });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.lat !== this.props.lat) {
      this.getAddress(this.props.lat, this.props.lng);
    }
  }

  startTopLoader = () => this.TopLoader.startLoader();

  hammburgerHandler = () => {
    this.props.handleHammburger();
  };

  showUserMenu = () => {
    this.setState({
      showUserMenu: true
    });
  };
  hideUserMenu = () => {
    this.setState({
      showUserMenu: false
    });
  };
  showUserCart = () => {
    if (this.props.myCart && this.props.myCart.cart) {
      this.setState({
        showUserCart: true
      });
    }
  };
  hideUserCart = () => {
    this.setState({
      showUserCart: false
    });
  };

  render() {
   console.log(this.props.selectedCategory,"tusharMalam")
    let { lang } = this.props;
    let addrParts = this.state.currentAddress
      ? this.state.currentAddress.split(",")
      : "";
    addrParts =
      addrParts && addrParts.length > 4 ? addrParts[addrParts.length - 4] : "";
console.log(this.state.currentAddress,"this.state.currentAddress")
    return (
      <Wrapper>
        {this.props.headerMobile ? (
          <div className="headerM">
            <div className="col-12">
              <div className="row align-items-center">
                {this.props.hammburger ? (
                  <div className="col-auto pr-0">
                    <a onClick={this.hammburgerHandler}>
                      <img
                        src="/static/images/grocer/hammburger.png"
                        width="22px"
                      />
                    </a>
                  </div>
                ) : (
                  <div className="col-auto pr-0">
                    <a onClick={this.RouteBack}>
                      <img
                        src="/static/foodImages/backBtn.svg"
                        width="20"
                        className="img-fluid"
                        alt="go to previous"
                      />
                    </a>
                  </div>
                )}

                <div className="col">
                  <h6
                    onClick={this.showLocationMobileHandler}
                    className="locAreaTitle pt-1"
                    // style={{ lineHeight: "23px" }}
                  >
                    {/* {this.state.city} */}
                    {/* {this.state.currentAddress ? this.state.currentAddress.split(",")[1] : ''} */}
                    {addrParts}
                    {this.state.city ? (
                      <i className="fa fa-chevron-down" />
                    ) : (
                      ""
                    )}
                  </h6>
                  {this.props.componentMounted ? (
                    <p className="locaAreaDyn">{this.state.currentAddress}</p>
                  ) : (
                    ""
                  )}
                </div>

                {this.props.hideFilters ? (
                  ""
                ) : (
                  <div className="col-3 text-right">
                    <h6 className="filtersM">
                      {lang.filterCap || "FILTERS"}
                      <i className="fa fa-filter" />
                    </h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // <div
          //   className={"col-12 headerWrap " + this.props.className}
          //   id={this.props.id}
          // >
          //   <div className="row restHeadCont">
          //     <div className="col-xl-12 position-relative">
          //       <div className="row justify-content-center">
          //         <div className="col-12">
          //           <nav className="navbar navbar-expand-md navbar-light">
          //             <div className="row align-items-center">
          //               {this.props.hammburger ? (
          //                 <div className="col-auto">
          //                   <div
          //                     className="hamIcon d-none d-lg-block"
          //                     onClick={this.toggleMenu}
          //                   >
          //                     <div className="ham" />
          //                   </div>
          //                 </div>
          //               ) : (
          //                 ""
          //               )}

          //               <div className="col-auto logoCont">
          //                 <a
                           
          //                   onClick={this.startTopLoader}
          //                   href="/"
          //                 >
          //                   <img
          //                     src={enVariables.DESK_LOGO}
          //                     width="30"
          //                     height=""
          //                     className="d-none d-sm-block logoImg"
          //                     alt="logoName"
          //                   />
          //                   <img
          //                     src={enVariables.DESK_LOGO}
          //                     width="28"
          //                     height=""
          //                     className="d-inline-block d-sm-none logoImg"
          //                     alt="logoName"
          //                   />
          //                 </a>
          //               </div>
          //               <div
          //                 style={{ cursor: "pointer" }}
          //                 onClick={this.showLocationHandler}
          //                 className="col pl-0 px-sm-0 position-relative"
          //               >
          //                 <span className="currentLocationType">
          //                   <span>
                            
          //                     {addrParts || ""}
          //                   </span>
          //                 </span>
          //                 <span
          //                   title={this.state.currentAddress}
          //                   className="currentLocationSelected"
          //                 >
          //                   {this.props.componentMounted
          //                     ? this.state.currentAddress
          //                     : ""}
          //                 </span>
          //                 {this.props.componentMounted ? (
          //                   <span className="currentLocationIcon" />
          //                 ) : (
          //                   ""
          //                 )}
          //               </div>
          //             </div>
          //             <button
          //               className="navbar-toggler"
          //               type="button"
          //               data-toggle="collapse"
          //               data-target="#navbarSupportedContent"
          //               aria-controls="navbarSupportedContent"
          //               aria-expanded="false"
          //               aria-label="Toggle navigation"
          //             >
          //               <span className="navbar-toggler-icon" />
          //             </button>

          //             <div
          //               className="collapse navbar-collapse"
          //               id="navbarSupportedContent"
          //             >
          //               <ul className="navbar-nav ml-auto headerNavUL">
          //                 <li className="nav-item active"></li>
          //                 {this.props.isAuthorized ? (
          //                   this.props.userProfileDetail ? (
          //                     <li className="nav-item">
          //                       <a
          //                         className="navTextWrapper"
          //                         onMouseLeave={this.hideUserMenu}
          //                         onMouseMove={this.showUserMenu}
          //                         onClick={this.showUserMenu}
                                  
          //                       >
          //                         <i className="fa fa-user mr-2" />
          //                         {this.props.userProfileDetail.name}

          //                         <CSSTransition
          //                           in={this.state.showUserMenu}
          //                           timeout={100}
          //                           classNames="userMenuAnim"
          //                           unmountOnExit
          //                         >
          //                           <ProfileMenu logOut={this.logOut} />
          //                         </CSSTransition>
          //                       </a>
          //                     </li>
          //                   ) : (
          //                     <li className="nav-item">
          //                       <a className="nav-link">
          //                         {" "}
          //                         <span
          //                           className="shine"
          //                           style={{ height: "25px", width: "100%" }}
          //                         />{" "}
          //                       </a>
          //                     </li>
          //                   )
          //                 ) : (
          //                   <li className="nav-item">
          //                     <i className="fa fa-user" />
          //                     <a
          //                       className="nav-link"
          //                       onClick={this.showLoginHandler}
          //                     >
          //                       {lang.logIn || "Sign in"}
          //                     </a>
          //                   </li>
          //                 )}

          //                 <li className="nav-item">
          //                   {enVariables.CART_ICON}
          //                   <a
          //                     className="nav-link foodCart"
          //                     style={{ position: "relative" }}
          //                     onClick={this.props.showCart}
          //                     onMouseLeave={this.hideUserCart}
          //                     onMouseMove={this.showUserCart}
                             
          //                   >
          //                     <div>
          //                       Cart
          //                       {this.props.mycartProducts &&
          //                       this.props.mycartProducts.length > 0 ? (
          //                         <div className="customBadge">
          //                           <span>
          //                             {this.props.mycartProducts.length}
          //                           </span>{" "}
          //                         </div>
          //                       ) : (
          //                         ""
          //                       )}
          //                       <CSSTransition
          //                         in={this.state.showUserCart}
          //                         timeout={100}
          //                         classNames="userMenuAnim"
          //                         unmountOnExit
          //                       >
          //                         <CartContent
          //                           cart={this.props.myCart}
          //                           setDeliveryType={this.setDeliveryType}
          //                         />
          //                       </CSSTransition>
          //                     </div>
          //                   </a>
          //                 </li>
                         
          //               </ul>
          //             </div>
          //           </nav>
          //         </div>
          //         {this.props.children ? (
          //           <div className="col-12">{this.props.children}</div>
          //         ) : (
          //           ""
          //         )}
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <div className="mobile-hide">
          <div className="col-12 mainNav" id="navbar">
          <nav className="navbar navbar-expand-sm navbar-dark justify-content-between">
  
              <a className="navbar-brand" href="/"> <img src={"/static/images/loopz/Archive 2/logo.svg"} width="200px"/></a>
              <div className="col-auto pr-0">
                  <img src="/static/images/grocer/btn-location.png" width="10" height="14" alt="" />
              </div>
              <div className="col-auto pl-2 threeDots" onClick={this.showLocationHandler}>
                  <a className="whiteClr fnt13" style={{textDecoration: "underline"}} >{this.props.componentMounted
                            ? this.state.currentAddress
                         : ""} </a>
              </div>
             
           
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                  <span className="navbar-toggler-icon"></span>
              </button>
  
              <div className="collapse navbar-collapse" id="collapsibleNavbar">
              <ul className="navbar-nav ml-auto headerNavUL" style={{color:"white"}}>
                          <li className="nav-item active"></li>
                          <li className="nav-item">
                            {enVariables.CART_ICON}
                            <a
                              className="nav-link foodCart"
                              style={{ position: "relative" }}
                              onClick={this.props.showCart}
                              onMouseLeave={this.hideUserCart}
                              onMouseMove={this.showUserCart}
                             
                            >
                              <div  style={{color:"white"}}>
                                Cart
                                {this.props.mycartProducts &&
                                this.props.mycartProducts.length > 0 ? (
                                  <div className="customBadge">
                                    <span>
                                      {this.props.mycartProducts.length}
                                    </span>{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                                <CSSTransition
                                  in={this.state.showUserCart}
                                  timeout={100}
                                  classNames="userMenuAnim"
                                  unmountOnExit
                                >
                                  <CartContent
                                    cart={this.props.myCart}
                                    setDeliveryType={this.setDeliveryType}
                                  />
                                </CSSTransition>
                              </div>
                            </a>
                          </li>
                          {this.props.isAuthorized ? (
                            this.props.userProfileDetail ? (
                              <li className="nav-item d-flex align-items-center" >
                                <a
                                  className=""
                                  onMouseLeave={this.hideUserMenu}
                                  onMouseMove={this.showUserMenu}
                                  onClick={this.showUserMenu}
                                  
                                >
                                  {/* <i className="fa fa-user mr-2" style={{color:"white"}} /> */}
                                  <span style={{color:"white",fontSize: "13px"}}>{this.props.userProfileDetail.name}</span>
                                  <img style={{borderRadius :"50%",width: "40px",height:"40px", marginLeft: "15px",objectFit:"cover"}} src={ this.props.userProfileDetail.profilePic || enVariables.PROFILE_ICON} alt="" />
                                  

                                  <CSSTransition
                                    in={this.state.showUserMenu}
                                    timeout={100}
                                    classNames="userMenuAnim"
                                    unmountOnExit
                                  >
                                    <ProfileMenu logOut={this.logOut} />
                                  </CSSTransition>
                                </a>
                              </li>
                            ) : (
                              <li className="nav-item">
                                <a className="nav-link">
                                  {" "}
                                  <span
                                    className="shine"
                                    style={{ height: "25px", width: "100%" }}
                                  />{" "}
                                </a>
                              </li>
                            )
                          ) : (
                            <li className="nav-item">
                              <i className="fa fa-user" />
                              <a
                                className="nav-link"
                                onClick={this.showLoginHandler}
                                style={{color:"white !important"}}
                              >
                                {lang.logIn || "Sign in"}
                              </a>
                            </li>
                          )}

                          
                         
                        </ul>
              </div>
          </nav>
      </div>
      <div className="row mx-0 align-items-center bannerSection bannerSectionMini" style={{background:`url(${this.props.selectedCategory.type==2 ?"/static/images/loopz/supermarket.png":"/static/images/loopz/resta.png" })`}}>
      {/* <div className="lyrCustom"></div> */}
     
  </div>
  </div>
        )}
        <TopLoader onRef={ref => (this.TopLoader = ref)} />

        <LogOutDialog onRef={ref => (this.logOutRef = ref)} />

       
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    userProfileDetail: state.userProfile,
    myCart: state.cartList,
    mycartProducts: state.cartProducts,
    lat: state.lat,
    lng: state.long,
    sessionExpired: state.sessionExpired,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(HomePageHeader);
