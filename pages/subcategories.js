import { Component } from "react";
import { connect } from "react-redux";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals";
import * as actions from "../actions";
import Slider from "react-slick";
import { setCookie, getCookie, getCookiees } from "../lib/session";

import { redirectIfNotAuthenticated } from "../lib/auth";
import CategoryProductsList from "../components/productList/categoryProductList";
import {
  getFilterParams,
  searchFilterParams,
  sortFilterParams,
} from "../services/filterApis";
import { IconButton } from "material-ui";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import redirect from "../lib/redirect";
import ProductDetails from "../components/sideBar/productDetails";
import ProductDialog from "../components/dialogs/productDialog";
import Footer from "../components/footer/Footer";
import * as enVariables from "../lib/envariables";
import Router from "next/router";
import CartFooter from "../components/cart/cartFooter";

import MobileViewFilters from "../components/sideBar/mobileViewFilter";
import CustomSlider from "../components/ui/sliders/customSlider";
import ProductListMViewSlider from "../components/producthome/ProductList/ProductListMViewSlider";
import ProductListMView from "../components/producthome/ProductList/ProductListMView";
import ProductListPView from "../components/producthome/ProductList/ProductListPView";

import "../assets/login.scss";
import "../assets/style.scss";

class SubCategories extends Component {
  static async getInitialProps({ ctx }) {
    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }

    let productsList = [];

    let token = getCookiees("token", ctx.req);

    let zoneId = getCookiees("zoneid", ctx.req);
    const storeId = await getCookiees("storeId", ctx.req);
    const catId = await getCookiees("catId", ctx.req);
    const subCatId = await getCookiees("subCatID", ctx.req);
    const lat = await getCookiees("lat", ctx.req);
    const lng = await getCookiees("long", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    const subCatName = await decodeURIComponent(
      getCookiees("subCatName", ctx.req)
    );
    const catName = await decodeURIComponent(getCookiees("catName", ctx.req));
    const queries = ctx.query;
    // const jwt = getJwt(ctx);

    const getCategory = await fetch(
      enVariables.API_HOST +
        "/business/products/" +
        zoneId +
        "/" +
        catId +
        "/" +
        subCatId +
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
    productsList = await getCategory.json();
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    let StoreName = getCookiees("storeName", ctx.req);
    return {
      productsList,
      isAuthorized,
      token,
      queries,
      zoneId,
      StoreName,
      storeId,
      catName,
      subCatName,
      lang,
    };
  }

  state = {
    username: "",
    isAuthorized: this.props.isAuthorized,
    loading: false,
    SliderWidth: "100%",
    filterWidth: 0,
    open: false,
    brandsList: [],
    Categories: [],
    manufacturers: [],
    maxPrice: "",
    priceCurrency: "",
    sort1: "",
    sort2: "",
    sort3: "",
    sortQuery: [],
    filterList: [],
    appliedFilters: false,
    loading: false,
    typingTimeout: 0
  };

  constructor(props) {
    super(props);
    this.showLoginHandler = this.showLoginHandler.bind(this);
    this.openProductDialog = this.openProductDialog.bind(this);
    this.handleDetailToggle = this.handleDetailToggle.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
  }

  componentDidMount() {
    this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : "";
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
    this.props.dispatch(actions.getStoresByType(getStoresPayload));

    this.getFilters(1, 20, 0);
    this.getProducts(getCookie("storeId"), getCookie("zoneid"));

    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(this.props.storeId));
    }, 2000);
  }

  getProducts(storeId, zoneID) {
    // this.setState({ loading: true })
    let queryName = getCookie("catQuery", "");

    let q1 = {
      match_phrase_prefix: { "catName.en": this.props.catName.toString() },
      match_phrase_prefix: {
        "subCatName.en": this.props.subCatName.toString(),
      },
    };
    // let q2 = { "match_phrase_prefix": { 'subCatName.en': this.props.subCatName.toString() } }

    // let query = { "match_phrase_prefix": { 'catName.en': queryName } }
    let query = q1;

    searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
      .then(
        ({ data }) => {
          this.setState({
            loading: false,
            showEmpty: false,
            filterList: data.data,
            appliedFilters: true,
          });
          console.log("******* query ***********", data);
        },
        (error) => {
          console.log("******* query error***********", error);
          this.setState({ loading: false });
          query.length > 0
            ? this.setState({
                categoryList: [],
                showEmpty: true,
                loading: false,
              })
            : "";
        }
      )
      .catch((err) => console.log("Something went wrong !", err));
  }

  openProductDialog(product) {
    console.log(
      "*******************************************************************",
      product
    );
    // this.child.openProductDialog(product)
  }

  handleDetailToggle = (post) => {
    console.log(
      "*******************************************************************",
      post
    );
    // this.setState({ SliderWidth: "100%" })
    // this.prodRef.handleDetailToggle(post)
    Router.push(`/details?id=${post.childProductId}`).then(() =>
      window.scrollTo(0, 0)
    );
  };

  opendrawer() {
    this.setState({ filterWidth: "100%" });
    this.customChild.handleLeftSliderToggle();
  }

  handleClose = () => {
    this.setState({ SliderWidth: 0, filterWidth: 0 });
  };

  handleLeftSliderToggle = () => {
    this.customChild.handleLeftSliderToggle();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });
    }
  }

  editCart = (cartDetail, products, type, event) => {
    console.log("cartd900", cartDetail, type);
    event ? event.stopPropagation() : "";
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId,
      packId :cartDetail.packId,
      storeType:1
    };
    type == 1
      ? (editCartData["quantity"] = cartDetail.quantity - 1 ,editCartData["increase"]=0)
      : (editCartData["quantity"] = cartDetail.quantity + 1,editCartData["increase"]=1);
      console.log("cartd900", cartDetail, editCartData);
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
      // this.props.dispatch(actions.editCard(editCartData));
  };
  addToCart = (data, event) => {
    event.stopPropagation();
    console.log("addToCart data", data);
    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.unitId || data.units[0].unitId,
          quantity: parseFloat(1).toFixed(1),
          storeType: getCookie("storeType"),
          addOns: [],
        }),
        this.props.dispatch(actions.initAddCart(cartData)),
        setTimeout(() => {
          this.props.dispatch(actions.getCart());
        }, 100))
      : this.showLoginHandler();
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  showLoginHandler = () => {
    this.handleRequestClose();
    this.authRef.showLoginHandler(window.outerWidth <= 580);
  };
  showLocationHandler = () => {
    this.authRef.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.authRef.showLocationMobileHandler();
  };
  showCart = () => {
    this.authRef.showCart();
    console.log("opening cart...");
  };

  getFilters(from, to, type) {
    console.log(
      "catName, subCatName",
      decodeURIComponent(this.props.catName),
      decodeURIComponent(this.props.subCatName)
    );

    let query = [
      { match: { "catName.en": this.props.catName } },
      { match: { "subCatName.en": this.props.subCatName } },
    ];

    switch (type) {
      case 0:
        getFilterParams(0, 4, from, to, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************brands**************", data);
            this.setState({
              brandsList: data.data,
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        getFilterParams(0, 5, from, to, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        getFilterParams(0, 3, from, to, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log(
              "******************filter category list**********",
              data
            );
            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        getFilterParams(0, 6, from, to, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************filter price list**********", data);
            this.setState({
              minPrice: 1,
              maxPrice: data.data[0],
              priceCurrency: data.currency,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;

      case 1:
        getFilterParams(0, 4, 4, 100, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              brandsList: this.state.brandsList.concat(data.data),
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;

      case 2:
        getFilterParams(0, 5, 4, 100, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              manufacturers: this.state.manufacturers.concat(data.data),
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;

      case 3:
        getFilterParams(0, 1, 1, 100, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("***********now category******", data);

            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;
      case 4:
        getFilterParams(0, 4, 1, 4, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              brandsList: data.data,
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;

      case 5:
        getFilterParams(0, 5, 1, 4, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;

      case 6:
        getFilterParams(0, 1, 1, 4, this.props.storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;
    }
  }

  searchFilter(query) {
    console.log("*******query hits ***********", query);

    query.length <= 0
      ? this.setState({ loading: true, appliedFilters: false, filterQuery: [] })
      : this.setState({ appliedFilters: true, filterQuery: query });

    let storeId = this.props.storeId;
    let zoneID = this.props.zoneID;

    this.state.sortQuery.length < 1
      ? searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
          .then(
            ({ data }) => {
              console.log("******* query ***********", data);

              this.setState({ filterList: data.data, loading: false });
            },
            (error) => {
              console.log("******* query error***********", error);
              query.length > 0
                ? this.setState({ categoryList: [], loading: false })
                : "";
            }
          )
          .catch((err) => console.log("Something went wrong !", err))
      : sortFilterParams(
          0,
          0,
          10,
          storeId,
          zoneID,
          false,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.setState({ filterList: data.data, loading: false });
              console.log("******* sortFilterParams***********", data.data);
            },
            (error) => {
              console.log("******* sortFilterParams error***********", error);
              query.length > 0
                ? this.setState({ categoryList: [], loading: false })
                : "";
            }
          )
          .catch((err) => console.log("Something went wrong !", err));
  }

  sortProducts = async (sortType, text) => {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;

    if (sortType == "") {
      await this.getProducts(storeId, zoneID);
      return;
    }

    await this.setState({
      sort1: "",
      sort2: "",
      sort3: "",
      sortText: "",
      [sortType]: "active",
      sortText: text,
    });

    console.log("sort hits");

    let queryName = getCookie("catName", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };
    (await this.state.sort1) == "active"
      ? this.setState({ sortQuery: { createdTimestamp: { order: "asc" } } })
      : this.state.sort2 == "active"
      ? this.setState({ sortQuery: { "units.floatValue": { order: "asc" } } })
      : this.state.sort3 == "active"
      ? this.setState({ sortQuery: { "units.floatValue": { order: "desc" } } })
      : "";

    console.log("this.state.query", this.state.sortQuery);

    this.state.filterQuery.length > 0
      ? await this.searchFilter(this.state.filterQuery)
      : await sortFilterParams(
          0,
          0,
          10,
          storeId,
          zoneID,
          false,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.setState({ categoryList: data.data });
              console.log("******* sortFilterParams***********", data.data);
            },
            (error) => {
              console.log("******* sortFilterParams error***********", error);
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => console.log("Something went wrong !", err));
  };

  render() {
    const settings = {
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 3,
      responsive: [
        { breakpoint: 1600, settings: { slidesToShow: 6, slidesToScroll: 4 } },
        { breakpoint: 1300, settings: { slidesToShow: 5, slidesToScroll: 4 } },
        {
          breakpoint: 900,
          settings: {
            arrows: true,
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 3,
          },
        },
        { breakpoint: 550, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ,
        { breakpoint: 420, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      ],
    };

    console.log(
      "************************productsList********************",
      this.props.productsList
    );
    return (
      <Wrapper>
        <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showChildren={true}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          stores={this.props.stores.data}
          hideSideMenu={() => this.hideSideMenu()}
          selectedStore={this.props.selectedStore}
          showSideMenu={() => this.showSideMenu()}
          showCart={this.showCart}
          deleteAllCookies={this.deleteAllCookies}
        >
          <div className="col-12 py-1">
            <div className="row align-items-center">
              <div className="col-2 pl-0">
                <IconButton
                  onClick={() => Router.back()}
                  style={{ height: "30px", padding: "6px" }}
                >
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </IconButton>
              </div>
              <div className="col-8 text-center">
                <h6 className="innerPage-heading lineSetter">
                  {this.props.subCatName.replace(/%20/g, "")}
                </h6>
              </div>

              <div className="col-2">
                {/* <IconButton onClick={() => this.opendrawer()} style={{ height: '30px', padding: '6px' }}>
                                    <img src='/static/icons/Common/Filter.imageset/filter@3x.png' width="24" />
                                </IconButton> */}
              </div>
            </div>
          </div>
        </Header>

        <Wrapper>
          <main className="add-margin">
            <div className="col-12 wrapper mb-4">
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="row align-items-center align-items-md-start padLeftNRightMulti">
                    {this.state.appliedFilters == false &&
                    this.props.productsList &&
                    this.props.productsList.data &&
                    this.props.productsList.data.subSubCategories
                      ? this.props.productsList.data.subSubCategories.map(
                          (subcategory, index) => (
                            <Wrapper>
                              <section className="col-12 catTitle customBgWhiteSection">
                                {/* <div className="row px-3"> */}
                                <div className="row">
                                  <h3 className="col-auto">
                                    {subcategory.subSubCategoryName}
                                  </h3>
                                  {/* <Link href={`/productList?type=${this.props.bType}&store=${this.props.selectedStore._id}`}>
                                                                    <span className="col-auto ml-auto mobile-show">View all</span>
                                                                </Link> */}
                                </div>
                              </section>
                              <section className="col-12 mb-sm-4 wrapLayout customBgWhiteSection">
                                <div className="row">
                                  <div
                                    className="col-12 p-1 featuredItems product-card featuredItemsId"
                                    style={{ background: "#f9f9f9" }}
                                  >
                                    <Slider {...settings}>
                                      {subcategory.products
                                        ? subcategory.products.map(
                                            (post, index) => (
                                              <ProductListMViewSlider
                                                post={post}
                                                currency={this.props.currency}
                                                openProductDialog={
                                                  this.openProductDialog
                                                }
                                                handleDetailToggle={
                                                  this.handleDetailToggle
                                                }
                                                cartProducts={
                                                  this.props.cartProducts
                                                }
                                                editCart={this.editCart}
                                                addToCart={this.addToCart}
                                                index={index}
                                                selectedStore={
                                                  this.props.selectedStore
                                                }
                                                // bType={props.bType}
                                                total={
                                                  subcategory.products.length
                                                }
                                              />
                                            )

                                            // <div key={index}>
                                            //     <div className="mobile-hide" key={"desktopview-Product-" + index} style={{ margin: '%' }}>
                                            //         <div className="card product-container p-1">
                                            //             <div className="view zoom" onClick={() => this.openProductDialog(post)}>
                                            //                 {parseInt(post.appliedDiscount) > 0 ?
                                            //                     <div className="promo-discount">{parseFloat(parseInt(post.appliedDiscount) * 100 / (post.priceValue)).toFixed(1)}%</div> :
                                            //                     ''
                                            //                 }
                                            //                 <img src={post.mobileImage[0].mobile || "/static/images/unknown.png"} width="140" height="140" className="img-fluid shine" alt="" />
                                            //                 <a >
                                            //                     <div className="mask rgba-white-slight"></div>
                                            //                 </a>
                                            //             </div>
                                            //             <div className="card-body px-lg-3 px-0">
                                            //                 <div className="product-saving"> {parseInt(post.appliedDiscount) > 0 ? "Save " + "$" + parseFloat(post.appliedDiscount).toFixed(2) || 0 : ''}</div>
                                            //                 <div className="product-prices">
                                            //                     <div className="product-price">{"$"} {parseFloat(post.finalPrice).toFixed(2)}</div>
                                            //                     <div className="product-price-before">{parseInt(post.appliedDiscount) > 0 ? "$" + " " + parseFloat(post.priceValue).toFixed(2) : ''}</div>
                                            //                 </div>
                                            //                 <div className="product-name" title={post.productName} >{post.productName}</div>
                                            //                 <div className="product-description mobile-hide" style={{ width: '100%' }}>
                                            //                     <div className="row py-1 align-items-center">
                                            //                         <div className="col-sm-6">
                                            //                             <span className='product-units' title={post.unitName}>{post.unitName}</span>
                                            //                         </div>
                                            //                         <div className="col-sm-6">
                                            //                             {this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
                                            //                                 this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
                                            //                                 ?
                                            //                                 <div className="text-center">
                                            //                                     <button onClick={() => this.editCart(props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
                                            //                                     <span className="prod-qnty">{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
                                            //                                     <button onClick={() => this.editCart(props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
                                            //                                 </div> : post.outOfStock ? <span className="alert-red"> **Out Of Stock </span> :
                                            //                                     <span onClick={() => this.addToCart(post)} className="product-add-button" style={{ float: 'right' }}> add </span>}
                                            //                         </div>
                                            //                     </div>
                                            //                 </div>

                                            //                 <div className="product-description mobile-show">
                                            //                     <p>{post.unitName}</p>
                                            //                     {
                                            //                         this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
                                            //                             this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
                                            //                             ?
                                            //                             <div className="text-center pt-2">
                                            //                                 <button onClick={() => this.editCart(props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
                                            //                                 <span className="prod-qnty" style={{ fontSize: '16px' }}>{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
                                            //                                 <button onClick={() => this.editCart(props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
                                            //                             </div>
                                            //                             :
                                            //                             post.outOfStock ? <p className="alert-red" style={{ width: '100%', paddingTop: '15px', float: 'unset', paddingTop: '18px', paddingBottom: '18px' }}> **Out Of Stock </p> :
                                            //                                 <a onClick={() => this.addToCart(post)} className="product-add-button" style={{ float: 'right' }}> add </a>
                                            //                     }
                                            //                 </div>

                                            //             </div>
                                            //         </div>
                                            //     </div>

                                            //     <div className="mobile-show" key={"mobileView-Product-" + index} style={{ margin: '0%' }}>
                                            //         <div className="card product-container p-1">
                                            //             <div className="view zoom" onClick={() => props.handleDetailToggle(post)}>
                                            //                 {parseInt(post.appliedDiscount) > 0 ?
                                            //                     <div className="promo-discount">{parseFloat(parseInt(post.appliedDiscount) * 100 / (post.priceValue)).toFixed(1)}%</div> : ''
                                            //                     // <div className="promo-discount">-</div>
                                            //                 }

                                            //                 <img src={post.mobileImage[0].mobile || "/static/images/unknown.png"} width="140" height="140" className="img-fluid shine" alt="" />
                                            //                 <a >
                                            //                     <div className="mask rgba-white-slight"></div>
                                            //                 </a>
                                            //             </div>
                                            //             <div className="card-body px-lg-3 px-0">

                                            //                 <div className="product-name" title={post.productName} >{post.productName}</div>
                                            //                 <div className="product-prices">
                                            //                     <div className="product-price">{"$"} {parseFloat(post.finalPrice).toFixed(2)}</div>
                                            //                     <div className="product-price-before ">{parseInt(post.appliedDiscount) > 0 ? "$" + " " + parseFloat(post.priceValue).toFixed(2) : ''}</div>
                                            //                 </div>
                                            //                 <div className="product-description mobile-hide" style={{ width: '100%' }}>
                                            //                     <span className='product-units' title={post.unitName}>{post.unitName}</span>
                                            //                     <span className="product-add-button" style={{ float: 'right' }}> add </span>
                                            //                 </div>

                                            //                 <div className="product-description mobile-show">

                                            //                     {
                                            //                         this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
                                            //                             this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
                                            //                             ?
                                            //                             <div className="text-center" style={{ margin: '13px 0px' }}>
                                            //                                 <button onClick={() => this.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
                                            //                                 <span className="prod-qnty">{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
                                            //                                 <button onClick={() => this.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
                                            //                             </div>
                                            //                             :
                                            //                             post.outOfStock ? <p style={{ width: '100%', paddingTop: '15px', float: 'unset', paddingTop: '18px', paddingBottom: '18px' }} className="alert-red"> **Out Of Stock </p> :
                                            //                                 <p onClick={() => this.addToCart(post)} className="product-add-button"> add </p>
                                            //                     }
                                            //                 </div>

                                            //             </div>
                                            //         </div>
                                            //     </div>
                                            // </div>
                                          )
                                        : ""}
                                      {subcategory.products.length > 5 ? (
                                        // <Link href={`/productList?type=${this.props.bType}&store=${this.props.selectedStore._id}`}>
                                        <div className="col d-flex align-items-center featuredProductsSection border">
                                          <div className="row">
                                            <div className="col">
                                              <h5 className="featuredProductsSectionH5">
                                                See all the products
                                              </h5>
                                              <div className="seeMoreLayout">
                                                <i className="fa fa-angle-right"></i>
                                                <span className="seeMoreSpan">
                                                  see more
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        // </Link>
                                        ""
                                      )}
                                    </Slider>
                                    {/* <!--/.Card--> */}
                                  </div>
                                </div>
                              </section>

                              <ProductDetails
                                onRef={(ref) => (this.prodRef = ref)}
                                width={this.state.SliderWidth}
                                handleClose={this.handleClose}
                                showLoginHandler={this.showLoginHandler}
                              />
                            </Wrapper>
                          )
                        )
                      : ""}

                    {this.state.appliedFilters == true ? (
                      this.state.filterList &&
                      this.state.filterList.products ? (
                        this.state.filterList.products.map(
                          (post, index) => (
                            // <div key={'product-container-' + index} className="col-5 col-sm-5 col-md-3 mx-sm-3 mx-md-4 mx-lg-1 col-lg-2 p-0 view-all-single-product" >
                            <ProductListPView
                              post={post}
                              currency={post.currencySymbol}
                              openProductDialog={this.openProductDialog}
                              addToCart={this.addToCart}
                              handleDetailToggle={this.handleDetailToggle}
                              editCart={this.editCart}
                              index={index}
                              total={this.state.filterList.products.length}
                              cartProducts={this.props.cartProducts}
                            />
                          )

                          // <div key={'product-container-' + index} className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-2 py-2 py-sm-4 view-all-single-product fixed-width">
                        )
                      ) : (
                        <div className="col-12 py-5 text-center">
                          <img
                            src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png"
                            width=""
                            height=""
                            className="img-fluid"
                            alt="search"
                          />
                          <p>
                            <strong>Sorry! No matching Products Found !</strong>
                          </p>
                        </div>
                      )
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <CartFooter />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer lang={this.props.lang} />
          </main>
        </Wrapper>

        <ProductDialog
          onRef={(ref) => (this.child = ref)}
          showLoginHandler={this.showLoginHandler}
        />

        <Authmodals onRef={(ref) => (this.authRef = ref)} />

        <CustomSlider
          onRef={(ref) => (this.customChild = ref)}
          width={this.state.filterWidth}
          handleClose={this.handleClose}
        >
          <MobileViewFilters
            brandsList={this.state.brandsList}
            searchFilter={this.state.searchFilter}
            Categories={this.state.Categories}
            manufacturers={this.state.manufacturers}
            searchFilter={this.searchFilter}
            sortProducts={this.sortProducts}
            hideCats={true}
            overFlow="unset"
            catName={this.props.catName}
            subCatName={this.props.subCatName}
            closeFilters={this.handleLeftSliderToggle}
            minPrice={this.state.minPrice}
            maxPrice={this.state.maxPrice}
            priceCurrency={this.state.priceCurrency}
          />
        </CustomSlider>

        {this.props.reduxState.loading ? <CircularProgressLoader /> : ""}

        {this.state.loading ? <CircularProgressLoader /> : ""}
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
    selectedStore: state.selectedStore,
  };
};

export default connect(mapStateToProps)(SubCategories);
