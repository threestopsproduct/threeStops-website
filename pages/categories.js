import { Component } from "react";
import { connect } from "react-redux";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import * as actions from "../actions/index";
import { setCookie, getCookie, getCookiees } from "../lib/session";
import SearchBar from '../components/search/seachBar';
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
import "../assets/style.scss";
import "../assets/login.scss";
import { multiStoreCartCheck } from "../lib/multiStoreCartCheck";
import ExpireCartDialog from "../components/dialogs/expireCart";
import { addToCartExFunc } from "../lib/cart/addToCart";

class Products extends Component {
  static async getInitialProps({ ctx }) {
    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const userName = await getCookiees("username", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let zoneDetails = (await getCookiees("zoneDetails", ctx.req)) || null;
    const queries = ctx.query;
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    const category = queries;

    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }

    return { isAuthorized, token, queries, category, zoneID, lang };
  }

  prev = 0;

  state = {
    username: this.props.userName,
    isAuthorized: this.props.isAuthorized,
    loading: false,
    categoryList: [],
    width: "100%",
    stickyHeader: false,
    brandsList: [],
    subCategories: [],
    subSubCategory: [],
    manufacturers: [],
    emptyMessage: "",
    sort1: "",
    sort2: "",
    sort3: "",
    filterQuery: [],
    sortQuery: [],
    sortText: "",
    categorySelected: "",
    subcategorySelected: "",
    subsubcategorySelected: "",
    showEmpty: false,
    priceCurrency: "",
    maxPrice: "",
    start: 10,
    typingTimeout:0
  };

  constructor(props) {
    super(props);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.getSubSubCategory = this.getSubSubCategory.bind(this);
    this.showLoginHandler = this.showLoginHandler.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.applyPriceFilter = this.applyPriceFilter.bind(this);
  }

  async componentDidMount() {
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
      type: getCookie("categoryType"),
      categoryId: getCookie("categoryId"),
    };
    this.props.dispatch(actions.getStoresByType(getStoresPayload));

    this.props.queries.store && this.props.queries.name
      ? (setCookie("storeId", this.props.queries.store),
        setCookie("catQuery", this.props.queries.name))
      : "";
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };

    await this.getProducts(storeId, zoneID);

    this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : "";

    this.getFilters(1, 50, 0);

    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(storeId));
      window.addEventListener("scroll", this.handleScroll);
    }, 2000);

    // let sid = getCookie('sid');
    // let mqttTopic = localStorage.getItem('dlvMqtCh');
    // this.child.mqttConnector(sid, mqttTopic);
  }

  getFilters(from, to, type) {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };
    console.log("myType ", type);
    switch (type) {
      case 0:
        getFilterParams(0, 4, from, to, storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              brandsList: data.data,
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        getFilterParams(0, 5, from, to, storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        getFilterParams(0, 2, from, to, storeId, false, query)
          .then(({ data }) => {
            console.log("SubCategoryData", data);
            this.setState({ subCategories: data.data });
          })
          .catch((err) => console.log("Something went wrong vivek !", err));
        getFilterParams(0, 6, from, to, storeId, false, query)
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
        getFilterParams(0, 4, from, to, storeId, false, query)
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
        getFilterParams(0, 5, from, to, storeId, false, query)
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
        getFilterParams(0, 2, from, to, storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({
              subCategories: this.state.subCategories.concat(data.data),
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;
      case 4:
        getFilterParams(0, 4, from, to, storeId, false, query)
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
        getFilterParams(0, 5, from, to, storeId, false, query)
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
        getFilterParams(0, 2, from, to, storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            this.setState({ subCategories: data.data });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;
    }
  }

  getSubSubCategory = (subCatName) => {
    let storeId = getCookie("storeId", "");
    let queryName = getCookie("catQuery", "");
    let query = [
      { match_phrase_prefix: { "catName.en": queryName } },
      { match_phrase_prefix: { "subCatName.en": subCatName } },
    ];
    getFilterParams(0, 3, 0, 10, storeId, false, query)
      .then(
        ({ data }) => {
          console.log("*******subSubCategory***********", data);
          this.setState({ subSubCategory: data.data });
        },
        (error) => {
          console.log("******* sortFilterParams error***********", error);
          this.setState({ subSubCategory: [] });
        }
      )
      .catch((err) => console.log("Something went wrong !", err));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });
    }
    if (
      prevProps.reduxState.categoryList !== this.props.reduxState.categoryList
    ) {
      this.setState({ categoryList: this.props.reduxState.categoryList });
      setCookie("place", this.state.categoryList.data.store.storeAddr);
    }
  }

  //   handleScroll = event => {
  //     this.prev = window.scrollY;
  //     this.prev > 70
  //       ? this.setState({ stickyHeader: true })
  //       : this.setState({ stickyHeader: false });
  //   };

  showSideMenu() {
    console.log("showSideMenu");
    this.setState({ width: "80%" });
  }

  hideSideMenu() {
    console.log("hideSideMenu");
    this.setState({ width: "100%" });
  }

  showLoginHandler = () => {
    this.child.showLoginHandler();
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };

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

    let queryName = getCookie("catQuery", "");
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
          20,
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

  updateSlug = (
    categorySelected,
    subcategorySelected,
    subsubcategorySelected
  ) => {
    this.setState({
      categorySelected: categorySelected,
      subcategorySelected: subcategorySelected,
      subsubcategorySelected: subsubcategorySelected,
    });
  };

  applyPriceFilter(query) {
    this.applySearchFilter(query);
  }

  searchFilter(query) {
    query.length < 1
      ? this.setState({
          categoryList: this.props.getCategoryList,
          filterQuery: [],
        })
      : (this.setState({ filterQuery: query }), this.applySearchFilter(query));
  }

  applySearchFilter(query) {
    console.log("*******query hits ***********", query);
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;

    query.length <= 0
      ? this.getProducts(storeId, zoneID)
      : this.setState({ filterQuery: query });
    this.state.sortQuery.length < 1
      ? searchFilterParams(0, 0, 200, storeId, zoneID, false, query)
          .then(
            ({ data }) => {
              this.setState({ categoryList: data.data, showEmpty: false });
            },
            (error) => {
              console.log("******* query error***********", error);
              query.length > 0
                ? this.setState({ categoryList: [], showEmpty: true })
                : "";
            }
          )
          .catch((err) => console.log("Something went wrong !", err))
      : sortFilterParams(
          0,
          0,
          200,
          storeId,
          zoneID,
          false,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.setState({ categoryList: data.data, showEmpty: false });
              console.log("******* sortFilterParams***********", data.data);
            },
            (error) => {
              console.log("******* sortFilterParams error***********", error);
              query.length > 0
                ? this.setState({ categoryList: [], showEmpty: true })
                : "";
            }
          )
          .catch((err) => console.log("Something went wrong !", err));
  }

  handleScroll = (event) => {
    console.log("call handler scroll", this.state.categoryList);
    let deskListSection = document.getElementById("mainSectionDesk");
    let currentScroll = window.scrollY;
    let sectionHeight = deskListSection ? deskListSection.clientHeight : 350;
    console.log("call handler currentscroll", currentScroll, sectionHeight);
    if (currentScroll > sectionHeight - 600) {
      if (
        !this.state.callingApi &&
        this.state.categoryList &&
        this.state.categoryList.products &&
        this.state.categoryList.products.length < this.state.penCount
      ) {
        console.log("call handler scroll1", this.state.categoryList);
        // console.log("WINDOW.SCR API", window.scrollY, deskListSection.clientHeight);
        this.getMoreProducts();
      }
    }
    // this.prev = window.scrollY;
    // this.prev > 70 ? this.setState({ stickyHeader: true }) : this.setState({ stickyHeader: false })
  };

  //  manish

  getMoreProducts = () => {
    this.setState({ loading: true, callingApi: true });
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };
    let storeId = getCookie("storeId");
    let zoneID = getCookie("zoneid");
    searchFilterParams(
      0,
      (this.state.categoryList &&
        this.state.categoryList.products &&
        this.state.categoryList.products.length) ||
        0,
      30,
      storeId,
      zoneID,
      false,
      query
    )
      .then(
        ({ data }) => {
          if (data && data.data && data.data.products) {
            let oldProducts = this.state.categoryList
              ? this.state.categoryList
              : [];
            console.log("BOTH ARRAY", oldProducts.products, data);
            oldProducts["products"] = [
              ...oldProducts.products,
              ...data.data.products,
            ];
            this.setState({
              categoryList: oldProducts,
              loading: false,
              showEmpty: false,
              callingApi: false,
              start: oldProducts.products.length,
              penCount: data.penCount || 1000,
            });
          }
        },
        (error) => {
          this.setState({ loading: false });
          query.length > 0
            ? this.setState({
                categoryList: [],
                showEmpty: true,
                loading: false,
                callingApi: false,
              })
            : "";
        }
      )
      .catch((err) => console.log("Something went wrong !", err));
  };

  getProducts(storeId, zoneID) {
    this.setState({ loading: true });
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };
    searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
      .then(
        ({ data }) => {
          this.setState({
            categoryList: data.data,
            loading: false,
            showEmpty: false,
            penCount: data.penCount ||1000,
          });
          console.log("MyProducts", this.state.categoryList);
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
          // console.log("cartd900", cartDetail, editCartData);
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

  addToCart = (data, event) => {
    event.stopPropagation();
    console.log("addToCart data", data,this.state.isAuthorized);
    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.units[0].unitId,
          quantity: parseFloat(1).toFixed(1),
          storeType: getCookie("storeType"),
          addOns: [],
        }),
        // check multicart auth
        addToCartExFunc(this.props.myCart)
          .then(() => {
            this.props.dispatch(actions.initAddCart(cartData));
            console.log("tusharGhodadramalam")
            setTimeout(() => {
              this.props.dispatch(actions.getCart());
            }, 100);
          })
          .catch(() => {
            this.props.dispatch(actions.expireCart(true, cartData)); // expire cart action for opening cart option dialog
          }))
      : this.showLoginHandler();
  };

  showCart = () => {
    this.child.showCart();
  };
  deleteAllCookies() {
    document.cookie.split(";").forEach((c) => {
      document.cookie =
        c.trim().split("=")[0] +
        "=;" +
        "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    });
    redirect("/");
  }
  render() {
    let heading = this.props.queries.name || getCookie("catQuery", "");

    let storename;

    this.state.categoryList &&
    this.state.categoryList.data &&
    this.state.categoryList.data.store
      ? (storename = this.state.categoryList.data.store)
      : (storename = "");
    console.log(this.props,this.state,"tusharGh")
    return (
      <Wrapper>
        <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showChildren={true}
          className="fixed-top"
           id="headerWrapID"
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          showLocation={true}
          hideSideMenu={() => this.hideSideMenu()}
          showSideMenu={() => this.showSideMenu()}
          showCart={this.showCart}
          stores={this.props.stores.data}
          selectedStore={this.props.selectedStore}
          deleteAllCookies={this.deleteAllCookies}
          cartProducts={this.props.cartProducts}
        >
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col-2 pl-0">
                <IconButton href="/" style={{ height: "30px", padding: "6px" }}>
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </IconButton>
              </div>
              <div className="col-8 text-center">
                <h6 className="innerPage-heading lineSetter">{heading}</h6>
              </div>

              <div className="col-2">
                {/* <IconButton onClick={() => this.mainRefs.opendrawer()} style={{ height: '30px', padding: '6px' }}>
                                    <img src='/static/icons/Common/Filter.imageset/filter@3x.png' width="24" />
                                </IconButton> */}
              </div>
            </div>
          </div>
        </Header>
        <div class="col-12 py-4 py-lg-4" style={{background: "#eff5fc"}}>
        <div class="row">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="row align-items-center">
                            <div class="col-auto pr-0 mb-3 mb-md-0">
                                <div>
                                    <img src={this.props.selectedStore && this.props.selectedStore.logoImage &&this.props.selectedStore.logoImage.length > 0 ?this.props.selectedStore.logoImage :"/static/images/grocer/foodProduct2.png" }width="90" height="90"
                                        class="rounded" alt="" />
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-auto col mb-3 mb-md-0">
                                <h5 class=" fntWght700 baseClr mb-1">{  this.props.selectedStore &&this.props.selectedStore.storeName &&this.props.selectedStore.storeName.length > 0 ? this.props.selectedStore.businessName || this.props.selectedStore.storeName:""}</h5>
                                <p class="fnt12 lightGreyClr mb-0">{this.props.selectedStore &&this.props.selectedStore.storeAddr && this.props.selectedStore.storeAddr.length > 0 ?  
                                  this.props.selectedStore.businessAddress || this.props.selectedStore.storeAddr:""}</p>
                            </div>
                            <div class="col-lg col-md-auto col-auto mb-3 mb-md-0">
                                <div class="itemRating fnt18">{  this.props.selectedStore  &&this.props.selectedStore.averageRating &&this.props.selectedStore.averageRating.length > 0 ?  this.props.selectedStore.averageRating:"0"}</div>
                            </div>
                            <div class="col-lg col-md-auto col-6 text-center text-md-left">
                                <div class="fnt13 fntWght700 baseClr mb-1">{ this.props.selectedStore && this.props.selectedStore.avgDeliveryTime &&this.props.selectedStore.avgDeliveryTime.length > 0 ? this.props.selectedStore.avgDeliveryTime + " min":""} </div>
                                <p class="fnt12 lightGreyClr mb-0">Delivery Time</p>
                            </div>
                            <div class="col-lg col-md-auto col-6 text-center text-md-left">
                                <div class="fnt13 fntWght700 baseClr mb-1">{this.props.selectedStore &&this.props.selectedStore.currencySymbol &&this.props.selectedStore.currencySymbol.length > 0? this.props.selectedStore.currencySymbol:""} {this.props.selectedStore && this.props.selectedStore.minimumOrder &&this.props.selectedStore.minimumOrder.length > 0 ?this.props.selectedStore.minimumOrder:""}</div>
                                <p class="fnt12 lightGreyClr mb-0">Min Order</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='col-8 col-lg-7 col-xl-8 pr-0'>
        <SearchBar selectedStore={this.props.selectedStore} locale={this.props.locale} />
                                                  
            {/* <div class="col-12 p-0">
                <input type="text" class="form-control proSearchInput" placeholder="Search products" />
                <img src="/static/images/grocer/search.svg" width="13" class="searchImg" alt="" />
                <div class="setRightAbs">
                    <button class="btn btn-default proSearchBtn">Search</button>
                </div>
            </div> */}
        </div>
    </div>
    
        <CategoryProductsList
          onRef={(ref) => (this.mainRefs = ref)}
          heading={heading}
          getFilters={this.getFilters}
          lang={this.props.lang}
          list={this.state.categoryList}
          brandsList={this.state.brandsList}
          subSubCategory={this.state.subSubCategory}
          subCategories={this.state.subCategories}
          manufacturers={this.state.manufacturers}
          searchFilter={this.searchFilter}
          applyPriceFilter={this.applyPriceFilter}
          height={this.prev}
          sortProducts={this.sortProducts}
          sortText={this.state.sortText}
          sort1={this.state.sort1}
          sort2={this.state.sort2}
          sort3={this.state.sort3}
          cartProducts={this.props.cartProducts}
          updateSlug={this.updateSlug}
          addToCart={this.addToCart}
          editCart={this.editCart}
          isFromCategory={true}
          showSubCategory={true}
          getSubSubCategory={this.getSubSubCategory}
          slug={5}
          loading={this.state.loading}
          brandPenCount={this.state.brandPenCount}
          CatPenCount={this.state.CatPenCount}
          ManuPenCount={this.state.ManuPenCount}
          showEmpty={this.state.showEmpty}
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
          priceCurrency={this.state.priceCurrency}
          showLoginHandler={this.showLoginHandler}
          subcategorySelected={this.state.subcategorySelected}
          subsubcategorySelected={this.state.subsubcategorySelected}
          selectedStore={this.props.selectedStore}
        />

        <Authmodals
          onRef={(ref) => (this.child = ref)}
          editCart={this.editCart}
        />

        <ExpireCartDialog onRef={(ref) => (this.expRef = ref)} />

        {/* {this.state.loading ? <CircularProgressLoader /> : ''} */}
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
    selectedLang: state.selectedLang,
    myCart: state.cartList,
  };
};

export default connect(mapStateToProps)(Products);
