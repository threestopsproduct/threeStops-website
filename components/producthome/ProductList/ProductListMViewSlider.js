import React from "react";
import Router from "next/router";
import Wrapper from "../../../hoc/wrapperHoc";
import CartButtonsPID from "../../cart/CartButtons";


// container used to render product list - (for mongo api data)
const ProductListMViewSlider = props => {
  const { post, index, className, total } = props;
  return (
    <Wrapper>
      {total > 5 && index == total - 1 ?
        <div
          className="col d-flex align-items-center featuredProductsSection border"
          onClick={() =>
            Router.push(
              `/productList?type=${props.bType}&store=${
              props.selectedStore._id
              }`
            ).then(() => window.scrollTo(0, 0))
          }
        >
          <div className="row">
            <div className="col">
              <h5 className="featuredProductsSectionH5">
                See all the products
            </h5>
              <div className="seeMoreLayout">
                <i className="fa fa-angle-right" />
                <span className="seeMoreSpan">see more</span>
              </div>
            </div>
          </div>
        </div>
        :
        <div key={index} className={className ? className : ""}>
          {/* <div
            className={index == total - 1 ? "mobile-hide prodItemCont p-1 border-right" : "mobile-hide prodItemCont p-1"}
            key={"desktopview-Product-" + index}
            style={{ margin: "%" }}
          >
            <div className="card product-container p-1 py-3">
              <a onClick={() => props.openProductDialog(post, props.bType)}>
                <div className="view zoom">
                  {parseInt(post.appliedDiscount) > 0 ? (
                    <div className="promo-discount">
                      {parseFloat(
                        (parseInt(post.appliedDiscount) * 100) / post.priceValue
                      ).toFixed(0)} % OFF
                </div>
                  ) : ("")}
                  <img
                    src={post.mobileImage[0].image || "/static/images/unknown.png"}
                    width="140"
                    height="140"
                    className="img-fluid shine"
                    alt=""
                  />
                  <a>
                    <div className="mask rgba-white-slight" />
                  </a>
                </div>
          
                <div className="card-body px-lg-3 px-3">
                 
                  <div className="product-name floatClass" title={post.productName}>
                    {post.productName}
                  </div>
                  <div
                    className="product-description mobile-hide"
                    style={{ width: "100%" }}
                  >
                    <div className="row py-1 align-items-center">
                      <div className="col-12 pb-2">
                        <span
                          className="product-units floatClass"
                          title={post.unitName}
                        >
                          {post.unitName}
                        </span>
                      </div>
                      <div className="col-6 col-sm-12 col-md-5 col-lg-4 col-xl-5">
                       
                        <div className="product-prices floatClass">
                          <div className="itemPosCont">
                            <div className="product-price-before floatClass">
                              {parseFloat(post.finalPrice).toFixed(2) < parseFloat(post.priceValue).toFixed(2)
                                ? props.currency +
                                parseFloat(post.priceValue).toFixed(2)
                                : ""}
                            </div>
                            <div className="product-price floatClass">
                              {props.currency}
                              {parseFloat(post.finalPrice).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-12 col-md-7 col-lg-8 col-xl-7">
                        {props.cartProducts &&
                          props.cartProducts.findIndex(
                            item => item.childProductId == post.childProductId
                          ) >= 0 &&
                          props.cartProducts[
                            props.cartProducts.findIndex(
                              item => item.childProductId == post.childProductId
                            )
                          ].quantity > 0 ? (
                            <CartButtonsPID cartProducts={props.cartProducts} editCart={props.editCart} addToCart={props.addToCart} post={post} />

                          ) : post.outOfStock ? (
                            <span className="alert-red"> **Out Of Stock </span>
                          ) : (
                              <button
                                onClick={(event) => props.addToCart(post, event)}
                                className="product-add-button"
                                style={{ float: "right" }}
                              >
                                {" "}
                                add to cart{" "}
                              </button>
                            )}
                      </div>
                    </div>
                  </div>

                 
                </div>
              </a>
            </div>
          </div> */}
 <div className="col-lg-auto col-md-6 col-sm-12 mb-5" style={{height:"260px"}}>
                                <div className="col-12 item-inner-sec1" onClick={() => props.openProductDialog(post, props.bType)}>
                                    <div className="text-right fnt12 fntWght500 mb-3"> {post.unitName}</div>
                                    {parseInt(post.appliedDiscount) > 0 ? (
                    <div className="promo-discount">
                      {parseFloat(
                        (parseInt(post.appliedDiscount) * 100) / post.priceValue
                      ).toFixed(0)} % OFF
                </div>
                  ) : ("")}
                                    <div className="mb-2">
                                        <img src={post.mobileImage[0].image} className="item-inner-sec-img" alt="" />
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-9 fnt13 fntWght500 baseClr customTxtShadow">{post.productName}</div>
                                    </div>
                                    <div className="product-price-before floatClass">
                              {parseFloat(post.finalPrice).toFixed(2) < parseFloat(post.priceValue).toFixed(2)
                                ? props.currency +
                                parseFloat(post.priceValue).toFixed(2)
                                : ""}
                            </div>
                                    <div className="text-left fnt12 fntWght500 customTxtShadow">{props.currency}
                              {parseFloat(post.finalPrice).toFixed(2)}</div>
                              <div class="addItemBtnSec">
                                    {props.cartProducts &&
                  props.cartProducts.findIndex(
                    item => item.childProductId == post.childProductId
                  ) >= 0 &&
                  props.cartProducts[
                    props.cartProducts.findIndex(
                      item => item.childProductId == post.childProductId
                    )
                  ].quantity > 0 ? (
                    <CartButtonsPID cartProducts={props.cartProducts} editCart={props.editCart} className="my-2" addToCart={props.addToCart} post={post} />
                  ) : post.outOfStock ||
                    (post.units && post.units.length > 0
                      ? post.units[0].outOfStock
                      : "") ? (
                      <p
                        style={{ width: "100%", paddingTop: "15px" }}
                        className="alert-red"
                      >
                        {" "}
                        **Out Of Stock{" "}
                      </p>
                    ) : (
                      <button
                        onClick={(event) => props.addToCart(post, event)}
                        className="btn btn-default addItemBtn"
                        // style={{ float: "unset", outline: "none" }}
                      >
                        +
                      </button>
                    )}
                                      {/* <button class=""></button> */}
                                    </div>
                                </div>
                            </div>

          {/* mobile-show part -> image, product name, unit name, cart buttons */}
          <div
            className="mobile-show prodItemCont"
            key={"mobileView-Product-" + index}
            style={{ margin: "0%" }}
          >
            <div className="card product-container p-1">
              <a onClick={() => props.handleDetailToggle(post, props.bType)}>
                <div
                  className="view zoom text-center"
               
                >
                  {parseInt(post.appliedDiscount) > 0 ? (
                    <div className="promo-discount">
                      {parseFloat(
                        (parseInt(post.appliedDiscount) * 100) / post.priceValue
                      ).toFixed(0)}
                      % OFF
                </div>
                  ) : (
                      ""
                    )
                   
                  }

                  <img
                    src={post.mobileImage[0].image || "/static/images/unknown.png"}
                    width="140"
                    height="140"
                    className="img-fluid"
                    alt=""
                  />

                </div>
                <div className="card-body px-lg-3 px-3">
                  <div className="row align-items-center px-3">
                    <div className="product-name" title={post.productName}>
                      {post.productName}
                    </div>

                    <div className="col-12 px-0">
                      <span
                        className="product-units floatClass"
                        title={post.unitName}
                      >
                        {post.unitName}
                      </span>
                    </div>
                    <div className="col-6 px-0">
                      <div className="product-prices">

                        {parseFloat(post.finalPrice).toFixed(2) < parseFloat(post.priceValue).toFixed(2) ?
                          <p className="product-price-before">

                            {props.currency +
                              parseFloat(post.priceValue).toFixed(2)
                            }
                          </p>
                          : ""}
                        <p className="product-price p-0 m-0">
                          {props.currency}{parseFloat(post.finalPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="col-6 px-0">
                      {props.cartProducts &&
                        props.cartProducts.findIndex(
                          item => item.childProductId == post.childProductId
                        ) >= 0 &&
                        props.cartProducts[
                          props.cartProducts.findIndex(
                            item => item.childProductId == post.childProductId
                          )
                        ].quantity > 0 ? (
                          <CartButtonsPID cartProducts={props.cartProducts} editCart={props.editCart} className="my-2" addToCart={props.addToCart} post={post} />

                        ) : post.outOfStock ? (
                          <p
                            style={{
                              width: "100%",
                              paddingTop: "15px",
                              float: "unset",
                              paddingTop: "18px",
                              paddingBottom: "18px"
                            }}
                            className="alert-red"
                          >
                            {" "}
                            **Out Of Stock{" "}
                          </p>
                        ) : (
                            <p
                              onClick={(event) => props.addToCart(post, event)}
                              className="product-add-button"
                            >
                              {" "}
                              add{" "}
                            </p>
                          )}
                    </div>
                  </div>

                  
                </div>
              </a>
            </div>
          </div>
        </div>
      }
    </Wrapper>
  );
};

export default ProductListMViewSlider;
