import React from "react";
import Wrapper from "../../../hoc/wrapperHoc";
import CartButtonsPID from "../../cart/CartButtons";
import Router from "next/router";
 import ProductCartButton from "../../FoodTheme/Cart/productButton";
// container used to render product list - (for python api data)
const ProductListPView = props => {
  const { post, index } = props;
  console.log(post,"tusharMAlam")
  return (
    <Wrapper>
      {/* <div
        key={"product-container-" + index}
        className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 py-2 py-sm-4 px-2 view-all-single-product fixed-width"
      > */}
        {/* <a onClick={() => props.openProductDialog(post)}>
          <div className="card product-container">
            <div
              className="view zoom mobile-hide"
              // onClick={() => props.openProductDialog(post)}
            >
              {post.finalPriceList &&
                post.finalPriceList[0] &&
                parseInt(post.finalPriceList[0].discount_value) > 0 ? (
                  <div className="promo-discount">
                    {parseFloat(
                      (parseInt(post.finalPriceList[0].discount_value) * 100) / post.finalPriceList[0].unitPrice
                    ).toFixed(0)}
                    % OFF
              </div>
                ) : (
                  ""
                )}

              <img
                src={post.mobileImage && post.mobileImage.length>0 && post.mobileImage[0].image ? post.mobileImage[0].image : ""}
                width="140"
                height="140"
                className="img-fluid shine"
                alt=""
              />
              <a>
                <div className="mask rgba-white-slight" />
              </a>
            </div>
            <div
              className="view zoom mobile-show"
              onClick={() => props.handleDetailToggle(post)}
            >
              {post.finalPriceList &&
                post.finalPriceList[0] &&
                parseInt(post.finalPriceList[0].discount_value) > 0 ? (
                  <div className="promo-discount">
                    {parseFloat(
                      (parseInt(post.finalPriceList[0].discount_value) * 100) / post.finalPriceList[0].unitPrice
                    ).toFixed(0)}
                    % OFF
              </div>
                ) : (
                  ""
                )}

              <img
                  src={post.mobileImage && post.mobileImage.length>0 && post.mobileImage[0].image ? post.mobileImage[0].image : ""}
                width="140"
                height="140"
                className="img-fluid shine"
                alt=""
              />
              <a>
                <div className="mask rgba-white-slight" />
              </a>
            </div>

            <div className="card-body px-lg-2 px-0">
             

              <div className="product-name" title={post.productName}>
                {post.productName}
              </div>
              <div
                className="product-description mobile-hide"
                style={{ width: "100%" }}
              >
                <div className="row py-1 align-items-center">
                  <div className="col-12 pb-2">
                    {post.units && post.units[0] ? (
                      <span
                        className="product-units"
                        title={post.units[0].unitName}
                      >
                        {post.units[0].unitName}
                      </span>
                    ) : (
                        ""
                      )}
                  </div>

                  <div className="col-6 col-sm-12 col-md-5 col-lg-4 col-xl-5">
                   
                    <div className="product-prices floatClass">
                      <div className="itemPosCont">
                        <div className="product-price floatClass">
                          {post.currencySymbol}
                          {post.finalPriceList && post.finalPriceList[0]
                            ? parseFloat(
                              post.finalPriceList[0].finalPrice
                            ).toFixed(2)
                            : ""}
                        </div>
                        <div className="product-price-before floatClass">
                          {post.finalPriceList &&
                            post.finalPriceList[0] &&
                            parseInt(post.finalPriceList[0].discount_value) > 0
                            ? 
                            post.currencySymbol +
                            parseFloat(
                              post.finalPriceList[0].unitPrice
                            ).toFixed(2)
                            : 
                            ""}
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

              <div className="product-description mobile-show">
                <div className="row">
                  <div className="col-12 pb-2">
                    {post.units && post.units[0] ? (
                      <span
                        className="product-units"
                        title={post.units[0].unitName}
                      >
                        {post.units[0].unitName}
                      </span>
                    ) : (
                        ""
                      )}
                  </div>
                  <div className="col-12">
                    <div className="product-prices floatClass">
                      <div className="itemPosCont">
                        <div className="product-price floatClass">
                          {post.currencySymbol}
                          {post.finalPriceList && post.finalPriceList[0]
                            ? parseFloat(
                              post.finalPriceList[0].finalPrice
                            ).toFixed(2)
                            : ""}
                        </div>
                        <div className="product-price-before floatClass">
                          {post.finalPriceList &&
                            post.finalPriceList[0] &&
                            parseInt(post.finalPriceList[0].discount_value) > 0
                            ? 
                            post.currencySymbol +
                            parseFloat(
                              post.finalPriceList[0].unitPrice
                            ).toFixed(2)
                            : 
                            ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                        className="product-add-button"
                        style={{ float: "unset", outline: "none" }}
                      >
                        {" "}
                        Add to Cart{" "}
                      </button>
                    )}
              </div>
            </div>
          </div>
        </a> */}
         <div class="col-lg-auto col-md-6 col-sm-12 item-outer-sec mb-5">
                                <div class="col-12 item-inner-sec" onClick={() => props.openProductDialog(post)}>
                                {post.finalPriceList &&
                post.finalPriceList[0] &&
                parseInt(post.finalPriceList[0].discount_value) > 0 ? (
                  <div className="promo-discount">
                    {parseFloat(
                      (parseInt(post.finalPriceList[0].discount_value) * 100) / post.finalPriceList[0].unitPrice
                    ).toFixed(0)}
                    % OFF
              </div>
                ) : (
                  ""
                )}
                                {post.units && post.units[0] ? (
                      <span
                        className="text-right fnt12 fntWght500 mb-3"
                        title={post.units[0].unitName}
                        style={{display:"flex",justifyContent:"flex-end"}}>
                        {post.units[0].unitName}
                      </span>
                    ) : (
                        ""
                      )}
                                    {/* <div class="text-right fnt12 fntWght500 mb-3">100 gm</div> */}
                                    <div class="mb-2">
                                        <img src={post.mobileImage && post.mobileImage.length>0 && post.mobileImage[0].image ? post.mobileImage[0].image : ""}class="item-inner-sec-img" alt="" />
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-9 fnt13 fntWght500 baseClr customTxtShadow">{post.productName}</div>
                                    </div>
                                    <div class="text-right fnt12 fntWght500 customTxtShadow">{post.currencySymbol}{post.units[0].finalPrice}</div>
                                    <div className="product-price-before text-right floatClass" style={{width:"100%"}}>
                          {post.finalPriceList &&
                            post.finalPriceList[0] &&
                            parseInt(post.finalPriceList[0].discount_value) > 0
                            ? //   ? post.currencySymbol + " " + post.finalPriceList && post.finalPriceList[0]
                            post.currencySymbol +
                            parseFloat(
                              post.finalPriceList[0].unitPrice
                            ).toFixed(2)
                            : // : parseFloat(post.units[0].floatunitPrice).toFixed(
                            //     2
                            //   )
                            ""}
                        </div>
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
      {/* </div> */}
    </Wrapper>
  );
};

export default ProductListPView;
