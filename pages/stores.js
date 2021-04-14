import { Component } from "react";
import { connect } from "react-redux";
import { getBrands } from "../services/getIpInfo";
import fetch from "isomorphic-unfetch";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/Header";
import Authmodals from "../components/authmodals";
import * as actions from "../actions";
import { setCookie, getCookiees, getCookie } from "../lib/session";
import Router from "next/router";
import { redirectIfNotAuthenticated, deleteAllCookies } from "../lib/auth";
import ProductsHomeComponent from "../components/producthome";
import LiveTrackSlider from "../components/mobileViews/liveTrack";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import SearchBar from "../components/search/seachBar";
import { getCustomerOrders } from "../services/profileApi";
import { getCategoriesApi, getStores } from "../services/category";
import redirect from "../lib/redirect";
import * as enVariables from "../lib/envariables";
import LogOutDialog from "../components/dialogs/logOut";
import TopLoader from "../components/ui/loaders/TopBarLoader/TopBarLoader";
import { getFavtProducts } from "../services/cart";
import "../assets/style.scss";
import "../assets/homepage.scss";
import "../assets/about.scss";
import "../assets/login.scss";
import { multiStoreCartCheck } from "../lib/multiStoreCartCheck";
import ExpireCartDialog from "../components/dialogs/expireCart";
import { addToCartExFunc } from "../lib/cart/addToCart";
import CustomHead from "../components/html/head";
import StoreHeader from "../components/header/innerPageHeader";

class Products extends Component {
  static async getInitialProps({ ctx }) {
    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const userName = await getCookiees("username", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let zoneDetails = (await getCookiees("zoneDetails", ctx.req)) || null;
    let storeId = await getCookiees("storeId", ctx.req);

    const queries = ctx.query;

    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    // const jwt = getJwt(ctx);

    const hardCodedStoreId = await (storeId || 0);
    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }
    let storeType = getCookiees("storeType", ctx.req);
    let stroeCategoryId = getCookiees("stroeCategoryId", ctx.req);

    const getCategory = await fetch(
      enVariables.API_HOST +
        "/productAndCategories/" +
        zoneID +
        "/" +
        storeType +
        "/" +
        stroeCategoryId +
        "/" +
        storeId +
        "/" +
        parseFloat(lat) +
        "/" +
        parseFloat(lng),
      {
        method: "get",
        headers: {
          language: "en",
          "content-type": "application/json",
          authorization: token,
        },
      }
    );
    const getCategoryList = await getCategory.json();

    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";

    return {
      getCategoryList,
      isAuthorized,
      token,
      queries,
      zoneDetails,
      hardCodedStoreId,
      lat,
      lng,
      lang,
    };
  }

  prev = 0;

  state = {
    username: this.props.userName,
    isAuthorized: this.props.isAuthorized,
    loading: false,
    categoryList: this.props.getCategoryList,
    width: "100%",
    stickyHeader: false,
    open: false,
    storeId: this.props.hardCodedStoreId,
    selectedOrderForTrack: null,
    lat: "",
    lng: "",
    typingTimeout: 0
  };

  constructor(props) {
    super(props);
    this.showLoginHandler = this.showLoginHandler.bind(this);
  }

  componentDidMount() {
    $(document).ready(function(){
      $(this).scrollTop(0);
  });
    window.addEventListener("scroll", this.handleScroll);
    setCookie("strNm", 0);
    setCookie("storeId", this.state.storeId);
    getBrands(this.state.storeId).then((data) => {
      console.log(data, "tusharMalam");
      this.setState({ productsList: data.data });
    });
    // this.state.categoryList && this.state.categoryList.data && this.state.categoryList.data.store ? setCookie('place', this.state.categoryList.data.store.storeAddr) : ''
    // let temp = this.state.categoryList && this.state.categoryList.data && this.state.categoryList.data.lowestPrice ? this.state.categoryList.data.lowestPrice : '';

    // temp.length > 0 ? temp.push({isEmpty: true}) : ''
    // this.setState({}, ()=> {
    // console.log("store catList/....", this.state.categoryList)

    // })
    console.log("store catList/....", this.props);
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");

    let getStoresPayload = {
      lat: lat,
      long: lng,
      token: getCookie("token"),
      zoneId: getCookie("zoneid"),
      offset: 0,
      limit: 40,
      type: 2,
      categoryId: getCookie("stroeCategoryId") || getCookie("categoryId"),
    };
   let storeId= getCookiees("storeId")
    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(storeId));
    }, 200);
    setTimeout(() => {
      this.state.isAuthorized
        ? (this.props.dispatch(actions.getCart()),
          this.props.dispatch(actions.getProfile()))
        : "";
      this.props.dispatch(actions.getStoresByType(getStoresPayload));
      this.props.dispatch(actions.selectLocale(this.props.lang));
      this.props.dispatch(actions.getAppConfig());
      // this.props.dispatch(actions.getZones(lat, lng)) // dispatching actions to get currecy symbol based on zone
    }, 2000);

    let sid = getCookie("sid");
    let mqttTopic = localStorage.getItem("dlvMqtCh");
    // this.child.mqttConnector(sid, mqttTopic);

    this.startTopLoader();
    Router.prefetch("/searchPage");
    Router.prefetch("/history");
    Router.prefetch("/cart");
    Router.prefetch("/profile");
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentWillReceiveProps(newProps) {
    // if (this.props.notifications && (this.props.notifications.bid == newProps.notifications.bid)) {
    //   let orderData = {
    //     pageIndex: 0,
    //   }
    //   orderData["type"] = 2;
    //   this.state.isAuthorized ?
    //     getCustomerOrders(orderData).then((data) => {
    //       data.error ? this.checkForError(data) :
    //         (this.setState({ currentOrders: data.data }),
    //           this.state.selectedOrderForTrack && data.data && data.data.data && data.data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId) >= 0 ?
    //             this.LiveTrackRef.updateData(data.data.data.ordersArray[data.data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId)]) : ''
    //         )
    //     })
    //     : ''
    //   orderData["type"] = 1;
    //   this.state.isAuthorized ?
    //     getCustomerOrders(orderData).then(({ data }) => {
    //       data.error ? this.checkForError(data) : data && data.data && data.data.ordersArray ? this.setState({ pastOrders: data.data.ordersArray, totalOrderCount: data.data.ordersArray.length }) : ''
    //     })
    //     : ''
    // }
  }

  setupLiveTrackOrder = (orderData) => {
    this.setState({ selectedOrderForTrack: orderData });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });

      setTimeout(() => {
        this.getFavtData();
      }, 2000);
    }

    if (
      prevProps.reduxState.categoryList !== this.props.reduxState.categoryList
    ) {
      this.setState({ categoryList: this.props.reduxState.categoryList });
      setCookie("place", this.state.categoryList.data.store.storeAddr);
    }
  }

  getFavtData = async () => {
    let token = getCookie("token", "");
    // let products = await getCategoriesApi(0, this.state.categoryList.data.store.businessId, 0, 0, token)
    // await this.setState({ categoryList: products.data });
    // let favtdata = {
    //   storeId: this.state.product.storeId
    // };
    // console.log(favtdata);
    // favtdata.storeId
    let tempListData = this.state.categoryList;

    getFavtProducts(getCookie("storeId"), getCookie("zoneid")).then((data) => {
      data.error
        ? data.status == 404
          ? this.setState({ favLoading: false, favtProducts: [] })
          : this.setState({ favLoading: false })
        : (console.log("fa0-----------", data),
          (tempListData.data = {
            ...tempListData.data,
            favProducts: data.data.data,
          }),
          this.setState({ favtProducts: data.data.data, favLoading: false }),
          console.log(data.data, this.state.product));
    });
    // : "";
  };

  handleScroll = (event) => {
    this.prev = window.scrollY;
    this.prev > 60
      ? !this.state.stickyHeader
        ? this.setState({ stickyHeader: true })
        : ""
      : this.state.stickyHeader
      ? this.setState({ stickyHeader: false })
      : "";
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  addToCart = (data, event) => {
    event.stopPropagation();
    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.unitId,
          quantity: parseFloat(1).toFixed(1),
          storeType: getCookie("storeType"),
          addOns: [],
        }),
        // check multicart auth
        addToCartExFunc(this.props.myCart)
          .then(() => {
            this.props.dispatch(actions.initAddCart(cartData));

            setTimeout(() => {
              this.props.dispatch(actions.getCart());
            }, 100);
          })
          .catch(() => {
            this.props.dispatch(actions.expireCart(true, cartData)); // expire cart action for opening cart option dialog
          }))
      : this.showLoginHandler(window.outerWidth < 576 ? true : false);
  };

  editCart = (cartDetail, products, type, event) => {
    console.log("cartd900", cartDetail, type);
    event ? event.stopPropagation() : "";
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId,
      packId :cartDetail.packId,
      storeType:2
    };
    type == 1
      ? (editCartData["quantity"] = cartDetail.quantity - 1 ,editCartData["increase"]=0)
      : (editCartData["quantity"] = cartDetail.quantity + 1,editCartData["increase"]=1);
      console.log("cartd900", cartDetail, editCartData);
      // this.props.dispatch(actions.editCard(editCartData));
      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout);
     }
 
     this.setState({
        name:editCartData,
        typing: false,
        typingTimeout: setTimeout(() =>{
          this.props.dispatch(actions.editCard(this.state.name));
        //  this.getProducts(this.state.name);
          }, 1000)
     });
  };

  showSideMenu() {
    this.setState({ width: "80%" });
  }

  openLogin() {
    this.showLoginHandler();
  }

  hideSideMenu() {


    this.setState({ width: "100%" });
  }

  changeStore = (store) => {
    console.log("prev storeId", store);
    this.setState({ storeId: store.storeId });
    setCookie("storeName", store.storeName);
    setCookie("storeId", store.storeId);

    let lang = getCookie("lang", "") || "en";

    redirect(
      `/stores/${store.storeName
        .replace(/%20/g, "-")
        .replace(/,/g, "")
        .replace(/& /g, "")
        .replace(/ /g, "-")}?lang=${lang}`
    );

    // this.props.dispatch(actions.changeStoreAction(store))
    // setTimeout(() => {
    //   setCookie('storeId', this.state.storeId)
    //   // redirect('/')
    // }, 500)
    this.headRef.closeSlider();
  };

  showLoginHandler = (isMobile) => {
    this.handleRequestClose();
    this.child.showLoginHandler(isMobile);
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };
  showCart = () => {
    this.child.showCart();
  };

  updateLocation = (data) => {
    this.child.updateLocation(data);
  };

  async deleteAllCookies() {
    await setCookie("locAuthenticated", false);
    await setCookie("authenticatedZone", "");
    await setCookie("authorized", "");
    await setCookie("username", "");
    await setCookie("storeId", "");
    await setCookie("storeName", "");
    await setCookie("token", false);
    await setCookie("locAuthenticated", "");
    await redirect("/");
  }

  startTopLoader = () => this.TopLoader.startLoader();
  checkForError = (error) => {
    this.setState({ loader: false });
    switch (error.status) {
      case 498:
        this.logOutRef.openOptionsDialog(1);
        break;
      case 502:
        "";
        break;
    }
  };

  render() {
    let storename;
   console.log(this.props.selectedStore,"this.props.selectedStore")
    let RTL;
    this.props.selectedLang == "ar" ? (RTL = "rtl") : (RTL = "ltr");

    let title = `${enVariables.APP_NAME} - `;

    this.state.categoryList.data && this.state.categoryList.data.store
      ? (storename = this.state.categoryList.data.store)
      : (storename = "Grocery");
    let StoreNumber = getCookie("StoreNumber");
    let StoreId =getCookie("storeId")
    let normalData =this.props.stores && this.props.stores.data&& this.props.stores.data.length > 0 ?this.props.stores.data:""
    let FavData =this.props.stores && this.props.stores.favStore
      var array3 = normalData.length > 0 ? normalData.concat(FavData).filter(data=>data.storeId ==StoreId) : ""
    let storeDetails =array3&& array3.length > 0 ? array3[0] :""
    // let storeDetails =
    //   this.props.stores &&
    //   this.props.stores.data &&
    //   this.props.stores.data[parseFloat(StoreNumber)]
    //     ? this.props.stores.data[parseFloat(StoreNumber)]
    //     : "";
    console.log("Got the DATA...",this.props.stores.data);

    return (
      <Wrapper>
        {/* setting up custom head tag for SEO html */}
        {/* <CustomHead title={storename && storename.businessName ? title + storename.businessName : title + storename} /> */}

        <CustomHead
          description={enVariables.OG_DESC}
          ogImage={enVariables.OG_LOGO}
          title={enVariables.OG_TITLE}
        />

        <StoreHeader
          onRef={(ref) => (this.headRef = ref)}
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          selectedStore={storename}
          stores={this.props.stores.data}
          hideSideMenu={() => this.hideSideMenu()}
          showCart={this.showCart}
          lat={this.props.stateLat}
          lng={this.props.stateLong}
          showSideMenu={() => this.showSideMenu()}
          changeStore={this.changeStore}
          deleteAllCookies={this.deleteAllCookies}
          componentMounted={true}
          nav1={
            this.state.categoryList &&
            this.state.categoryList.data &&
            this.state.categoryList.data.products.length > 0
              ? true
              : false
          }
          nav2={
            this.state.categoryList &&
            this.state.categoryList.data &&
            this.state.categoryList.data.lowestPrice.length > 0
              ? true
              : false
          }
          nav3={
            this.state.categoryList &&
            this.state.categoryList.data &&
            this.state.categoryList.data.brands.length > 0
              ? true
              : false
          }
          nav4={
            this.state.categoryList &&
            this.state.categoryList.data &&
            this.state.categoryList.data.categories.length > 0
              ? true
              : false
          }
        />

        {/* <Header onRef={ref => (this.headRef = ref)} stickyHeader={this.state.stickyHeader} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized}
          showLocationHandler={this.showLocationHandler} showLocationMobileHandler={this.showLocationMobileHandler} selectedStore={storename} stores={this.props.stores.data}
          hideSideMenu={() => this.hideSideMenu()} showCart={this.showCart} lat={this.props.stateLat} lng={this.props.stateLong}
          showSideMenu={() => this.showSideMenu()} changeStore={this.changeStore} deleteAllCookies={this.deleteAllCookies}

          nav1={this.state.categoryList && this.state.categoryList.data && this.state.categoryList.data.products.length > 0 ? true : false}
          nav2={this.state.categoryList && this.state.categoryList.data && this.state.categoryList.data.lowestPrice.length > 0 ? true : false}
          nav3={this.state.categoryList && this.state.categoryList.data && this.state.categoryList.data.brands.length > 0 ? true : false}
          nav4={this.state.categoryList && this.state.categoryList.data && this.state.categoryList.data.categories.length > 0 ? true : false}
        /> */}

        <div
          class="col-12 py-4 py-lg-4 mobile-hide"
          style={{ background: "#eff5fc" }}
        >
          <div class="row">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <div class="row align-items-center">
                    <div class="col-auto pr-0 mb-3 mb-md-0">
                      <div>
                        <img
                          src={
                            storeDetails.logoImage ||
                            "/static/images/grocer/foodProduct2.png"
                          }
                          width="90"
                          height="90"
                          class="rounded"
                          alt=""
                        />
                      </div>
                    </div>
                    <div class="col-lg-5 col-md-auto col mb-3 mb-md-0">
                      <h5 class=" fntWght700 baseClr mb-1">
                        {storeDetails.storeName}
                      </h5>
                      <p class="fnt12 lightGreyClr mb-0">
                        {storeDetails.storeAddr ||
                          storeDetails.storeBillingAddr}
                      </p>
                    </div>
                    <div class="col-lg col-md-auto col-auto mb-3 mb-md-0">
                      <div class="itemRating fnt18">
                        {storeDetails.averageRating}
                      </div>
                    </div>
                    <div class="col-lg col-md-auto col-6 text-center text-md-left">
                      <div class="fnt13 fntWght700 baseClr mb-1">
                        {storeDetails.avgDeliveryTime &&
                        storeDetails.avgDeliveryTime.length > 0
                          ? storeDetails.avgDeliveryTime + " min"
                          : "--"}{" "}
                      </div>
                      <p class="fnt12 lightGreyClr mb-0">Delivery Time</p>
                    </div>
                    <div class="col-lg col-md-auto col-6 text-center text-md-left">
                      <div class="fnt13 fntWght700 baseClr mb-1">
                        {storeDetails.currencySymbol}{" "}
                        {storeDetails.minimumOrder}
                      </div>
                      <p class="fnt12 lightGreyClr mb-0">Min Order</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8 col-lg-7 col-xl-8 pr-0">
            <SearchBar
              selectedStore={this.props.selectedStore}
              locale={this.props.locale}
            />

            {/* <div class="col-12 p-0">
                <input type="text" class="form-control proSearchInput" placeholder="Search products" />
                <img src="/static/images/grocer/search.svg" width="13" class="searchImg" alt="" />
                <div class="setRightAbs">
                    <button class="btn btn-default proSearchBtn">Search</button>
                </div>
            </div> */}
          </div>
        </div>

        {this.state.categoryList && this.state.categoryList.data ? (
          <ProductsHomeComponent
            currencySymbol={this.props.currencySymbol}
            cartProducts={this.props.cartProducts}
            RTL={RTL}
            getFavtData={this.getFavtData}
            startTopLoader={this.startTopLoader}
            lang={this.props.lang}
            width={this.state.width}
            addToCart={this.addToCart}
            editCart={this.editCart}
            showCart={this.showCart}
            userProfileDetail={this.props.userProfileDetail}
            locale={this.props.locale}
            selStore={storename}
            stores={this.props.stores.data}
            selectedStore={storename}
            {...this.state.categoryList.data}
            height={this.prev}
            isAuthorized={this.state.isAuthorized}
            showLoginHandler={this.showLoginHandler}
            productsList={
              this.state.productsList && this.state.productsList.data
            }
          />
        ) : (
          ""
        )}

        <Authmodals
          onRef={(ref) => (this.child = ref)}
          editCart={this.editCart}
        />

        <LiveTrackSlider onRef={(ref) => (this.LiveTrackRef = ref)} />

        {this.props.reduxState.loading ? <CircularProgressLoader /> : ""}
        <TopLoader onRef={(ref) => (this.TopLoader = ref)} />

        <LogOutDialog onRef={(ref) => (this.logOutRef = ref)} />

        <ExpireCartDialog onRef={(ref) => (this.expRef = ref)} />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    cartProducts: state.cartProducts,
    stores: state.stores,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    userProfileDetail: state.userProfile,
    notifications: state.notifications,
    stateLat: state.lat,
    stateLong: state.long,
    selectedLang: state.selectedLang,
    locale: state.locale,
    myCart: state.cartList,
    selectedStore: state.selectedStore,
    // currencySymbol: state.currencySymbol
  };
};

export default connect(mapStateToProps)(Products);
