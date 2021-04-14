import React from "react";
import Slider from "react-slick";
import Footer from "../footer/LandingFooter";
import Wrapper from "../../hoc/wrapperHoc";
import LocationSearchInput from "./map";
import Spinner from "../ui/loaders/threeDotSpinner";
import ProfileMenu from "../header/profile/profileMenu";
import { CSSTransition } from "react-transition-group";
import LogOutDialog from "../dialogs/logOut";
import LocationDrawer from "./locateDrawer";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import * as enVariables from "../../lib/envariables";
import LanguageSelector from "../language/selector";
import { selectLocale } from "../../actions/language";
import redirect from "../../lib/redirect";
import { setCookie, getCookie } from "../../lib/session";
import { DEFAULT_LANG } from "../../lib/envariables";
import PopularCategoGrociery  from "../productList/newComponents/MpopularGro";
import PopularCategories from "../productList/newComponents/popularCat"
import { connect } from "react-redux";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import StoreCard from "../FoodTheme/Cards/storeCard"
import {
  NavigateToRestaurant,
  NavigateToStore,
} from "../../lib/navigation/navigation";
import $ from "jquery";
class LocationSelect extends React.Component {
  state = {
    loginSliderWidth: "100%",
    language: getCookie("lang") || DEFAULT_LANG,
  };

  showLocationHandler = () => {
    this.setState({ loginSliderWidth: "100%" });
    this.child.handleToggle();
  };

  handleClose = () => {
    this.setState({ loginSliderWidth: "0%" });
  };
  handleClick = (data) => {
    console.log(data,"handleClick")
    
   if(data=="Kochi"){
     this.setState({address:"Kochi,kerela,india"},()=>this.locationFind())
   }else{
    this.setState({ address: data },()=>this.locationFind())
   }
   
  }
  locationFind =()=>{
    geocodeByAddress(this.state.address)
    .then(results =>getLatLng(results[0]))
    .then(latLng => this.updateData(latLng))
    .catch(error => console.error('Error', error))
  }
  hideUserMenu = () => {
    this.setState({
      showUserMenu: false
    });
  };
  logOut = () => {
    this.logOutRef.openOptionsDialog(2);
  };
  showUserMenu = () => {
    this.setState({
      showUserMenu: true
    });
  };
  updateData(data) {
    console.log(data,"tusharG")
    data['address'] = this.state.address
    this.props.updateLocation(data)
  }
  selectLanguage = (event) => {
    this.props.changeLang(event.target.value);
    this.setState({ language: event.target.value });
    setCookie("lang", event.target.value);
  };

 
   RouteToRestaurant = (store, loaderCallback, props) => {
    
  
    NavigateToRestaurant(store);
  };
  
   RouteToStore = (store, categoryId, index) => {
   
  setCookie("StoreNumber",index)
    NavigateToStore(store, categoryId);
  };
  handleRedirect=(type)=>{
    redirect(`/${this.props.cityName}/stores`)
    if(type==1){
        setCookie("strNm" ,1)
    }else{
        setCookie("strNm" ,0)   
    }
   
}
  componentDidMount=()=>{
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
  render() {
//     window.onscroll = function () { scrollFunction() };

// function scrollFunction() {
//     if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
//         document.getElementById("navbar").style.backgroundColor = "#003049";
//         document.getElementById("navbar").style.paddingBottom = "0px";
//         document.getElementById("navbar").style.paddingTop = "0px";
//         document.getElementById("navbar").style.boxShadow = "0px 4px 9px #00000029";
//         document.getElementById("searchInput").style.display = "block";
//         //  document.getElementById("inputD").style.display ="block"
//     } else {
//         document.getElementById("navbar").style.backgroundColor = "transparent";
//         document.getElementById("navbar").style.paddingBottom = "20px";
//         document.getElementById("navbar").style.paddingTop = "20px";
//         document.getElementById("navbar").style.boxShadow = "none";
//         document.getElementById("searchInput").style.display = "none";
//         // document.getElementById("inputD").style.display ="none"
//     }
// }
    let settings = {
      arrows: false,
      autoplay: true,
      dots: false,
      infinite: true,
      vertical: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    let mobileSettings = {
      arrows: false,
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    const BannerShow =this.props.productList;
    const locale = this.props.locale;
console.log(this.props.productList,"this.props.productList")
    return (
      <Wrapper>
        <main className="mobile-hide">
          <div className="col-12 wrapper white p-0">
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col-md-7 loginFormSectionLayout">
                    <div className="row justify-content-center">
                      {/* <div className="col-12 mt-3">
                        <select
                          className="selectpicker"
                          value={this.state.language}
                          data-width="fit"
                          onChange={this.selectLanguage.bind(this)}
                        >
                          <option
                            data-content='<span className="fa fa-globe"></span> English'
                            value="en"
                          >
                            English
                          </option>
                          <option
                            data-content='<span className="fa fa-globe"></span> Español'
                            value="spa"
                          >
                            spanish
                          </option>
                        </select>
                      </div> */}
                      {/* <div className="col-sm-11 col-md-12 col-lg-10 col-xl-9 py-lg-5 py-4 pr-5 locateSectionLayout">
                        <div className="row align-items-center pr-2">
                          <div className="col-sm-6">
                            <img
                              src={enVariables.DESK_LOGO}
                              width="30"
                              alt={enVariables.APP_NAME}
                              title={enVariables.APP_NAME}
                              className="img-fluid logoImg"
                            />
                          </div>
                          <div className="col-sm-6 text-right">
                            {this.props.isAuthorized ? (
                              <div className="row">
                                <div className="col-12">
                                  <a
                                    onClick={this.props.goToProfile}
                                    className="userBox"
                                  >
                                    <b>{this.props.userName}</b>
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="row">
                                <div className="col-5 ml-auto loginBtnLogLayout px-sm-2">
                                  <button
                                    className="btn btn-primary loginBtnLog text-right"
                                    data-toggle="modal"
                                    data-target="#loginModal"
                                    onClick={this.props.showLoginHandler}
                                  >
                                    {locale
                                      ? locale.locationSel.login
                                      : "Log In"}
                                  </button>
                                </div>
                                <div className="col-5 ml-auto signUpBtnLogLayout px-sm-2">
                                  <button
                                    className="btn btn-primary signUpBtnLog"
                                    data-toggle="modal"
                                    data-target="#loginModal"
                                    onClick={this.props.showSignUpHandler}
                                  >
                                    {locale
                                      ? locale.locationSel.signUp
                                      : "Sign up"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col py-lg-5 py-3 mt-lg-3">
                            <div className="row">
                              <div className="col">
                                <ul className="nav flex-column" id="vertical">
                               
                                  <div>
                                    <li className="nav-item">
                                      <a className="nav-link active" href="#">
                                        {locale
                                          ? locale.locationSel.noTimeMsg
                                          : "No time to drive to the local grocery store?"}
                                      </a>
                                    </li>
                                  </div>

                                  
                                </ul>
                              </div>
                            </div>
                            <h5 className="orderTextLog">
                              {locale
                                ? locale.locationSel.ordTime
                                : "One-stop solution to all your delivery needs"}
                            </h5>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <form>
                              <div className="row">
                                <div className="col pr-0">
                                  <div className="form-group m-0">
                                    <LocationSearchInput
                                      updateLocation={this.props.updateLocation}
                                      id="landingPageLocBox"
                                      locErrMessage={this.props.locErrMessage}
                                      inputClassName="form-control py-lg-3 rounded-0 findInputLog overflow-ellipsis"
                                      locale={this.props.locale}
                                      ref={(ref) => (this.LocSearchRef = ref)}
                                    />

                                    <a
                                      onClick={this.props.getGeoLocation}
                                      className="locateMeIcon"
                                    >
                                      {locale
                                        ? locale.locationSel.locateMe
                                        : "Locate Me"}
                                    </a>
                                  </div>
                                </div>
                                <div className="col-3  pl-0">
                                  <div className="form-group m-0">
                                    <a
                                      onClick={() => this.props.getCategories()}
                                      className="form-control py-lg-3 rounded-0 findBtnLog"
                                    >
                                      {locale
                                        ? locale.locationSel.search
                                        : "Search"}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>

                        {this.props.locErrMessage ? (
                          <div className="row">
                            <div className="col">
                              <div className="locationError">
                                <p> {this.props.locErrMessage} </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="row">
                          <div className="col-lg-12 col-xl-11 py-lg-5 py-4 pr-3">
                            <ul className="nav locationCitiesUL">
                              {this.props.cityData &&
                                this.props.cityData.map((city, key) => (
                                  <li
                                    className="nav-item"
                                    key={"cityData-" + key}
                                  >
                                    <a className="nav-link" href="#">
                                      {city.cityName}
                                    </a>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div> */}
                   
                    </div>
                  </div>
                  {/* <div className="col-5 d-none d-md-block bannerBgRightLogin">
                   
                  </div> */}
                </div>
              </div>
            </div>

            <div className="col-12 mainNav" id="navbar">
        <nav className="navbar navbar-expand-sm navbar-dark justify-content-between">

        <img src={"/static/images/loopz/Archive 2/logo.svg"} width="200px"/>
           {this.props.currentAddress &&this.props.productList && this.props.currentAddress.length > 0?
           <div className="d-flex align-items-center">
            <div className="col-auto pr-0">
                <img src="/static/images/grocer/btn-location.png" width="10" height="14" alt="" />
            </div> 
            <div className="col-auto pl-2 threeDots1" onClick={this.props.showLocationHandler}>
                <a  className="whiteClr fnt13" style={{textDecoration: "underline"}}>{this.props.currentAddress}</a>
            </div>
            </div>
            :""}
            <div className="col col-lg-auto" id="searchInput" style={{width: "550px"}}>
            {/* <div className="input-group searchInputSec col-12 p-0">
                        
                        <div className="col-9 p-0">
                         <LocationSearchInput
                                      updateLocation={this.props.updateLocation}
                                      id=""
                                      locErrMessage={this.props.locErrMessage}
                                      inputClassName="form-control"
                                      locale={this.props.locale}
                                      ref={(ref) => (this.LocSearchRef = ref)}
                                    />
                        <img src="/static/images/grocer/search.svg" width="15" className="searchImg" alt="" />
                        <img src="/static/images/grocer/cursor.svg" width="15" className="locationImg" alt="" onClick={this.props.getGeoLocation}/>
                        </div>
                        <div className="input-group-append col-3 p-0">
                            <span className="input-group-text" style={{background:"#08FEFF","border":"none"}}>
                                <button className="btn btn-default srchBtn p-0" style={{background:"#08FEFF"}}  onClick={() => this.props.getCategories()}>Search</button>
                            </span>
                        </div>
                    </div> */}
                  
            </div>
         
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="collapsibleNavbar">
              {this.props.isAuthorized ? 
                                <ul className="navbar-nav ml-auto ">
                                       <li className="nav-item mr-5" >
                                <a
                                  className=""
                                  onMouseLeave={this.hideUserMenu}
                                  onMouseMove={this.showUserMenu}
                                  onClick={this.showUserMenu}
                                  
                                >
                                  {/* <i className="fa fa-user mr-2" style={{color:"white"}} /> */}
                                  <span style={{color:"white",fontSize: "21px",fontWeight:"600",textTransform:"capitalize"}}>{this.props.userName}</span>
                                  {/* <img style={{borderRadius :"50%",width: "40px",height:"40px", marginLeft: "15px",objectFit:"cover"}} src={ this.props.userProfileDetail.profilePic || enVariables.PROFILE_ICON} alt="" /> */}
                                  

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
                                  </ul>
                                 :
              
              
                <ul className="navbar-nav ml-auto mainNavUL">
                    <li className="nav-item">
                        <a className="nav-link" href="#"  data-toggle="modal" data-target="#cartModal"  onClick={this.props.showLoginHandler}>Sign in</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#" onClick={this.props.showSignUpHandler}>Sign up</a>
                    </li>
                </ul>
              }
            </div>
        </nav>
    </div>
            <div className={`row mx-0 align-items-center bannerSection ${BannerShow ? "bannerSectionMini":""}`}>
        {/* <div className="lyrCustom"></div> */}
        <div className={`col-12 text-center ${BannerShow ? "d-none":""}`}>
            <h1 className="whiteClr">Many Needs One App</h1>
            <h6 className="whiteClr">One-stop solution to all your delivery needs</h6>
       
            <div className="row justify-content-center py-4 mb-2">
                <div className="col-auto w650">
                    <div className="input-group searchInputSec col-12 p-0">
                        {/* <input type="text" className="form-control" placeholder="Enter area, Street, City" /> */}
                        <div className="col-9 p-0">
                         <LocationSearchInput
                                      updateLocation={this.props.updateLocation}
                                      id=""
                                      locErrMessage={this.props.locErrMessage}
                                      inputClassName="form-control"
                                      locale={this.props.locale}
                                      ref={(ref) => (this.LocSearchRef = ref)}
                                    />
                        <img src="/static/images/grocer/search.svg" width="15" className="searchImg" alt="" />
                        <img src="/static/images/grocer/cursor.svg" width="15" className="locationImg" alt="" onClick={this.props.getGeoLocation}/>
                        </div>
                        <div className="input-group-append col-3 p-0">
                            <span className="input-group-text" style={{background:"#08FEFF","border":"none"}} >
                                <button className="btn btn-default srchBtn p-0" style={{background:"#08FEFF"}}  onClick={() => this.props.getCategories()}>Search</button>
                            </span>
                        </div>
                    </div>
                    {this.props.locErrMessage ? (
                          <div className="row">
                            <div className="col">
                              <div className="locationError">
                                <p> {this.props.locErrMessage} </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                </div>
            </div>
          
            <ul className="nav locationUL justify-content-center">
            {this.props.cityData &&
                                this.props.cityData.map((city, key) => (
                <li className="nav-item" style={{color:"white"}}>
                   <a className="nav-link" onClick={() => this.handleClick(city.cityName)}>
                                      {city.cityName}
                                    </a>
                </li>
                  ))}
              
            </ul>
        </div>
    </div>
            {this.props.productList && this.props.productList.categoryData &&this.props.productList.categoryData.length > 0 ?
            <div className="col-12 py-5">
        <div className="row">
            <div className="container">
                <h5 className="text-center fntWght700 baseClr op9 cusMarBtm">Popular Categories</h5>
               <PopularCategories productList ={this.props.productList } cityName={this.props.cityName}></PopularCategories>
            </div>
        </div>
    </div>
:""}
    {/* <div className="col-12 py-5 bgCustomGrey">
        <div className="row">
            <div className="container">
                <h5 className="text-center fntWght700 baseClr op9 cusMarBtm">Most Popular Restaurants</h5>
               <PopularCategoGrociery/>
               

                <h6 className="mb-0 text-center mt-5"><span className="fntWght700 baseClr op9">Don’t see what you’re looking
                        for?</span> <a href="#" className="anchClr">See more restaurants</a></h6>
            </div>
        </div>
    </div> */}
{this.props.productList &&this.props.productList.categoryData &&this.props.productList.categoryData.map((items,index)=>{
  return (
    <div className={items.storeData && items.storeData && items.storeData.length > 0 ? "":"d-none" }>
<div className={items.type ==2 ?  `col-12 py-4 bg-white`:`col-12 py-4 bgCustomGrey` }>
        <div className="row">
            <div className="container">
                <h5 className="text-center fntWght700 baseClr op9 cusMarBtm">{  `Most Popular ${items.categoryName}`}</h5>
                <div className="row">
                {items.storeData.map((item,index) =>{
                  return (
                
                    <div className="col-sm-6 col-md-4 col-lg-3 mb-4 ">
                        <div className={`col-12 py-3 bg-white mainStoreHover ${!item.storeIsOpen && "storeClosed"}`}  onClick={
        item.storeIsOpen &&
        (items.type == 2
          ? () =>
              this.RouteToStore(
                item,
                items._id,
                index
              )
          : () =>
              this.RouteToRestaurant(item, item))
      }>
        {!item.storeIsOpen && (
          <div className="storeclosed" style={{ color: "red", float: "right" }}>
            Store closed
          </div>
        )}
                            <div className="mb-3">
                                <img src={item.bannerImage} width="100%" className="gridImg" alt="" />
                            </div>
                            <h6 className="itemTitle">{item.storeName}</h6>
                            <div className="catTitle">{item.storeTypeMsg}</div>
                            <div className="row justify-content-between align-items-end">
                                <div className="col-auto pr-0">
                                    <span className="item-distance-Price"><img src="/static/images/loopz/btn-location.png"
                                            className="mr-1" width="10" height="14" alt="" /> {item.distanceKm}</span>
                                    <span className="">.</span>
                                    <span className="item-distance-Price">{item.currencySymbol} {item.minimumOrder} Min Order</span>
                                </div>
                                <div className="col-auto">
                                    <div className="itemRating">{item.averageRating}</div>
                                </div>
                            </div>
                        </div>
                    </div>
             
                  )
                })}
                 </div>
                <h6 className="mb-0 text-center mt-5"><span className="fntWght700 baseClr op9">Don’t see what you’re looking
                        for?</span> <a  className="anchClr" onClick={this.handleRedirect}>{ `See more ${items.categoryName}`}</a></h6>
            </div>
        </div>
    </div>
 </div>
  )
})
    
    }
    {/* <div className="col-12 py-5 bgCustomGrey">
        <div className="row">
            <div className="container">
                <h5 className="text-center fntWght700 baseClr op9 cusMarBtm">Most Popular Babystores</h5>
                <PopularCategoGrociery/>
                <h6 className="mb-0 text-center mt-5"><span className="fntWght700 baseClr op9">Don’t see what you’re looking
                        for?</span> <a href="#" className="anchClr">See more restaurants</a></h6>
            </div>
        </div>
    </div> */}
            <div className="col-12 border py-0 py-sm-5 bgCustomGrey">
            <div className="row py-4">
            <div className="col-12 px-0">
                <div className="row mx-0 align-items-center saveXcuseSec">
                    <div className="col-auto offset-sm-1 offset-md-3 offset-lg-2" style={{width: "290px"}}>
                        <h3 className="whiteClr mb-3">Save the excuses and time.</h3>
                        <h6 className="whiteClr mb-4">The better way to get things done, just Threestops</h6>
                        <div className="row align-items-center">
                            <div className="col-auto pr-0">
                               <a href={enVariables.APP_STORE} target="_blank">
                               <img src="/static/images/grocer/app-store.png" width="120" className="appImg" alt="" />
                               </a>
                               
                            </div>
                            <div className="col-auto">
                              <a href={enVariables.PLAY_STORE} target="_blank">
                              <img src="/static/images/grocer/google-play.png" width="120" className="appImg" alt="" />
                              </a>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
          </div>
          <Footer lang={this.props.lang} locale={this.props.locale} />
        </main>
        {/* style={{ background: `url(${enVariables.SPLASH})` }} */}
        <div className="col-12 loginMobilePage mobile-show mobileLandingDiv">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div
                  className="col-12 p-0 text-center loginItems"
                  style={{ height: "100vh", display: "flex" }}
                >
                  <img src="/static/images/loopz/Archive 2/logo.svg"></img>
                </div>
              </div>
            </div>
          </div>

          <div
            className="row"
            style={{ position: "absolute", width: "100%", top: "65vh" }}
          >
            <div className="col-12 text-center">
              <div className="row justify-content-center">
                <div className="col-12 px-5">
                  <div className="setUpLoc">
                    <button
                      onClick={this.props.getGeoLocation}
                      type="button"
                      className="form-control"
                    >
                      {locale
                        ? locale.locationSel.detectLoc
                        : "DETECT MY LOCATION"}
                    </button>
                    <p>
                      {" "}
                      <a onClick={this.showLocationHandler}>
                        {locale
                          ? locale.locationSel.setLocMan
                          : "Set location manually"}{" "}
                      </a>
                    </p>
                  </div>

                  {this.props.locErrMessage ? (
                    <p className="locErrMobi">
                      {locale.notDeliver ||
                        "Sorry! We don't deliver here, try another location"}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <LocationDrawer
              onRef={(ref) => (this.child = ref)}
              width={this.state.loginSliderWidth}
              updateLocation={this.props.updateLocation}
              loading={this.props.loading}
              handleClose={this.handleClose}
              locErrMessage={this.props.locErrMessage}
              getGeoLocation={this.props.getGeoLocation}
              showLoginHandler={this.showLoginHandler}
            />
             <LogOutDialog onRef={ref => (this.logOutRef = ref)} />
          </div>
        </div>

        {this.props.loading ? <CircularProgressLoader /> : ""}
      </Wrapper>
    );
  }
}

const dispatchAction = (dispatch) => {
  return {
    changeLang: (lang) => dispatch(selectLocale(lang)),
  };
};
const stateToProps = (state) => {
  return {
    lang: state.locale,
    userProfileDetail: state.userProfile,
  };
};
export default connect(stateToProps, dispatchAction)(LocationSelect);
