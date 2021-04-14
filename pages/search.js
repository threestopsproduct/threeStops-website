import { Component } from "react";
import { connect } from "react-redux";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import * as actions from "../actions/index";
import { setCookie, getCookie, getCookiees } from "../lib/session";
import * as $ from "jquery";
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
import Router from "next/router";
import "../assets/login.scss";
import "../assets/style.scss";
import { addToCartExFunc } from "../lib/cart/addToCart";
import ExpireCartDialog from "../components/dialogs/expireCart";

class SearchComp extends Component {
  static async getInitialProps({ ctx }) {
    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    let storeId = ctx.query.store || getCookiees("storeId", ctx.req);
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

    return { token, queries, category, storeId, zoneID, lang };
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
    Categories: [],
    manufacturers: [],
    emptyMessage: "",
    loading: true,
    sort1: "",
    sort2: "",
    sort3: "",
    filterQuery: [],
    sortQuery: [],
    sortText: "",
    categorySelected: "",
    subcategorySelected: "",
    subsubcategorySelected: "",
    priceCurrency: "",
    maxPrice: "",
    typingTimeout: 0
  };

  constructor(props) {
    super(props);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.showLoginHandler = this.showLoginHandler.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.applyPriceFilter = this.applyPriceFilter.bind(this);
  }

  async componentDidMount() {
    $(document).ready(function(){
      $(this).scrollTop(0);
  });
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
      categoryId: getCookie("categoryId"),
    };

    this.props.dispatch(actions.getStoresByType(getStoresPayload));

    await console.log("this.props.stores.data", this.props);

    // this.props.queries.store &&
    // this.props.queries.store != "undefined" &&
    // this.props.queries.name
    //   ? (setCookie("storeId", this.props.queries.store),
    //     setCookie("catQuery", this.props.queries.name))
    //   : "";
    let storeId = getCookie("storeId", "") || this.props.storeId;
    let zoneID = this.props.zoneID;
    let queryName = this.props.queries.name || getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "pName.en": queryName } };

    await this.getProducts(storeId, zoneID);

    this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : "";

    this.getFilters(0, 20, 0);

    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(storeId));
      this.updateAuth();
    }, 2000);

    // let sid = getCookie('sid');
    // let mqttTopic = localStorage.getItem('dlvMqtCh');
    // this.child.mqttConnector(sid, mqttTopic);
  }

  getFilters(from, to, type) {
    let storeId = getCookie("storeId", "") || this.props.storeId;
    let zoneID = this.props.zoneID;
    let queryName = this.props.queries.name || getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "productname.en": queryName } };

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
        getFilterParams(0, 1, from, to, storeId, false, query)
          .then(({ data }) => {
            console.log("******************", data);
            // this.setState({ subCategories: data.data })
            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
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
              Categories: this.state.Categories.concat(data.data),
              CatPenCount: data.penCount,
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
            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => console.log("Something went wrong !", err));
        break;
    }
  }

  componentDidUpdate(prevProps) {
    prevProps.queries.name != this.props.queries.name ||
    prevProps.queries.store != this.props.queries.store
      ? (this.clearAll(), this.componentDidMount())
      : "";
  }
  UNSAFE_componentWillReceiveProps() {
    this.updateAuth();
  }

  updateAuth = () =>
    this.setState({
      isAuthorized: getCookie("authorized") || this.props.isAuthorized,
    });
  handleScroll = (event) => {
    this.prev = window.scrollY;
    this.prev > 70
      ? this.setState({ stickyHeader: true })
      : this.setState({ stickyHeader: false });
  };

  clearAll = () => {
    this.setState({
      categoryList: [],
      brandsList: [],
      manufacturers: [],
      Categories: [],
    });
  };

  getProducts(storeId, zoneID, qname) {
    this.setState({ loading: true });
    let queryName = this.props.queries.name || getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "productname.en": queryName } };
    searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
      .then(
        ({ data }) => {
          this.setState({
            categoryList: data.data,
            loading: false,
            showEmpty: false,
          });
          console.log("******* query ***********", this.state.categoryList);
        },
        (error) => {
          console.log("******* query error***********", error);
          this.setState({ categoryList: [], loading: false, showEmpty: true });
        }
      )
      .catch((err) => console.log("Something went wrong !", err));
  }

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

    let queryName =this.props.queries.name|| getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "pName.en": queryName } };
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

  applyPriceFilter(query) {
    this.applySearchFilter(query);
  }
  // UNSAFE_componentWillReceiveProps(newProp){
  //     // this.props.isAuthorized && newProp.isAuthorized && this.props.isAuthorized != newProp.isAuthorized ? this.setState({isAuthorized: newProp.isAuthorized}) : ''
  //     console.log(newProp)
  //     this.setState({isAuthorized: newProp.isAuthorized})
  // }

  searchFilter(query) {
    query.length < 1
      ? this.setState({
          categoryList: this.props.getCategoryList,
          filterQuery: [],
        })
      : (this.setState({ filterQuery: query }), this.applySearchFilter(query));
  }

  async applySearchFilter(query) {
    console.log("*******query*******", query);
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;

    let queryName = await this.props.queries.name|| getCookie("catQuery", "");
    let query2 = { match_phrase_prefix: { "productname.en": queryName } };

    await query.push(query2);

    await console.log("*******query******* query.push(query2)", query);

    (await query.length) <= 0
      ? this.getProducts(storeId, zoneID)
      : this.setState({ filterQuery: query });

    this.state.sortQuery.length < 1
      ? searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
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
          10,
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
    console.log("addToCart data", data);
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

    return (
      <Wrapper>
        <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showLocation={true}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          userProfileDetail={this.props.userProfileDetail}
          hideSideMenu={() => this.hideSideMenu()}
          showSideMenu={() => this.showSideMenu()}
          showCart={this.showCart}
          selectedStore={this.props.selectedStore}
          stores={this.props.stores.data}
          deleteAllCookies={this.deleteAllCookies}
        >
          <div className="col-12">
            <div className="row">
              <div className="col-2 pl-0">
                <IconButton
                  onClick={() => Router.back()}
                  style={{ height: "35px", padding: "6px" }}
                >
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
                <IconButton
                  onClick={() => this.mainRefs.opendrawer()}
                  style={{ height: "35px", padding: "6px" }}
                >
                  <img
                    src="/static/icons/Common/Filter.imageset/filter@3x.png"
                    width="24"
                  />
                </IconButton>
              </div>
            </div>
          </div>
        </Header>

        <CategoryProductsList
          onRef={(ref) => (this.mainRefs = ref)}
          heading={heading}
          lang={this.props.lang}
          selectedStore={this.props.selectedStore}
          list={this.state.categoryList}
          brandsList={this.state.brandsList}
          Categories={this.state.Categories}
          manufacturers={this.state.manufacturers}
          searchFilter={this.searchFilter}
          applyPriceFilter={this.applyPriceFilter}
          height={this.prev}
          updateSlug={this.updateSlug}
          sortProducts={this.sortProducts}
          sortText={this.state.sortText}
          sort1={this.state.sort1}
          sort2={this.state.sort2}
          sort3={this.state.sort3}
          cartProducts={this.props.cartProducts}
          loading={this.state.loading}
          addToCart={this.addToCart}
          editCart={this.editCart}
          showSubCategory={false}
          getFilters={this.getFilters}
          categorySelected={this.state.categorySelected}
          subcategorySelected={this.state.subcategorySelected}
          subsubcategorySelected={this.state.subsubcategorySelected}
          brandPenCount={this.state.brandPenCount}
          CatPenCount={this.state.CatPenCount}
          ManuPenCount={this.state.ManuPenCount}
          priceCurrency={this.state.priceCurrency}
          showEmpty={this.state.showEmpty}
          showLoginHandler={this.showLoginHandler}
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
        />

        <Authmodals
          onRef={(ref) => (this.child = ref)}
          editCart={this.editCart}
        />

        <ExpireCartDialog onRef={(ref) => (this.expRef = ref)} />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    cartProducts: state.cartProducts,
    isAuthorized: state.authorized,
    userProfileDetail: state.userProfile,
    stores: state.stores,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    selectedStore: state.selectedStore,
    selectedLang: state.selectedLang,
    myCart: state.cartList,
  };
};

export default connect(mapStateToProps)(SearchComp);
