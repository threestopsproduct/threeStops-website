import ProductCartButton from "../Cart/productButton";
import React, { useState, useEffect, useContext } from "react";
// import languageContext from "../../../context/languageContext";
import PdpDalog from "../../../components/pdp-dialog/pdp-dialog";
import { productDetails } from "../../../services/address";
const inCart = (cart, product) => {
  if (cart) {
    let index = findCartIndex(cart, product);
    if (index >= 0 && cart[index].quantity > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const findCartIndex = (cart, product) => {
  return cart.findIndex(
    (item) => item.childProductId == product.childProductId
  );
};

const findQuantity = (cart, product) => {
  let index = findCartIndex(cart, product);
  return cart[index].quantity;
};

const handleCartAdd = (props) => {
  props.product.addOnAvailable == 1
    ? props.openAddOnDialog(props.product)
    : props.addToCart(props.product);
};

const FoodCard = (props) => {
  const openDialogonetwo = async (flag, event) => {
    console.log("opendialogonetwo", flag);
    try {
      if (flag) {
        let data = await productDetails(props.product.childProductId);
        console.log("product data", data);
        setDialogData(data.data.data);
      }
    } catch (e) {
      console.log("product data", e);
    }

    let copy = { ...open };
    copy.dialog = flag;
    console.log("opendialogonetwo", copy);
    toggle(copy);
    event.stopPropagation();
  };

  const [open, toggle] = useState({ dialog: false });
  const [dialogData, setDialogData] = useState({});
  const lang = {
    starters: "starters",
    add: "add",
    customisable: "customisable",
  };
console.log(props,"tusharHJindabad")
  return (


    <div className="col-xl-4 col-lg-6 col-sm-12 mixCard mb-5">
    <div className="col-12 py-3 bg-white borderLiteAshClr rounded" onClick={openDialogonetwo.bind(null, true)}>
        <div className="mb-3">
              <img src={
          props.product &&
          props.product.mobileImage &&
          props.product.mobileImage.length > 0
            ? props.product.mobileImage[0].image
            : "/static/images/new_imgs/foodDummy.png"
        } width="100%"
                className="gridImg" alt=""/>
        </div>
     
        {/* <div className="veg-cat mb-1"></div> */}
        <h6 className="itemTitle mb-1">{props.product.productName}</h6>

        <div className="row justify-content-between mb-2">
            <div className="col-auto pr-0">
                <div className="catTitle1" style={{fontSize:"12px"}}>{props.product.firstCategoryName}</div>
            </div>
            <div className="col-auto">
                <h6 className="baseClr mb-0 fnt12 fntWght700 customTxtShadow"> {props.currencySymbol || "$"}
               {parseFloat(props.product.finalPrice).toFixed(2)}{" "}</h6>
              { props.product.finalPrice !=props.product.priceValue ?
               <p className="fnt12 product-price-before floatClass"> {props.currencySymbol || "$"}
               {parseFloat(props.product.priceValue).toFixed(2)}{" "}</p> : ""}
            </div>
          
           
        </div>
        {/* <div className="addItemBtnSec"><button
                className="btn btn-default addItemBtn">+</button>
        </div> */}
        {inCart(props.cartProducts, props.product) ? (
          <ProductCartButton
            product={props.product}
            cartLoadProdId={props.cartLoadProdId}
            cartProducts={props.cartProducts}
            editCart={props.editCart}
            openOptionsDialog={props.openOptionsDialog}
            cartSection={true}
          />
        ) : props.product.addOnAvailable == 1 ? (
          // <div className="col-xl-4 col-lg-5 pl-0">
          //   <a
          //     onClick={(e) => {
          //       e.preventDefault(),
          //         e.stopPropagation(),
          //         props.openAddOnDialog(props.product);
          //     }}
          //   >
          //     <span className="addOnBtnDV">+</span>
          //     <button className="btn btn-default prodetailsRecomItemAddBtnDV">
          //       {lang.add}
          //     </button>
          //   </a>
          //   <p className="customisableReminder">{lang.customisable}</p>
          // </div>
          <div className="addItemBtnSec">
          <button
            className="btn btn-default addItemBtn"
            onClick={(e) => {
                    e.preventDefault(),
                      e.stopPropagation(),
                      props.openAddOnDialog(props.product);
                  }}
          >
            +
          </button>
         
        </div>
        ) : (
          // <div className="col-xl-4 col-lg-5 pl-0" style={{ zIndex: 1 }}>
            <div className="addItemBtnSec">
              <button
                className="btn btn-default addItemBtn"
                onClick={(e) => {
                  props.addToCart(props.product);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                +
              </button>
             
            </div>
         
        )}
    </div>
    <PdpDalog
        open={open.dialog}
        lang={lang}
        addToCart={props.addToCart}
        addToCartt={props.addToCartt}
        cartLoadProdId={props.cartLoadProdId}
        cartProducts={props.cartProducts}
        editCart={props.editCart}
        addOnAvailable={props.product.addOnAvailable}
        openAddOnDialog={props.openAddOnDialog}
        openOptionsDialog={props.openOptionsDialog}
        inCart={inCart(props.cartProducts, props.product)}
        product={props.product}
        dialogData={dialogData}
        closeDialog={openDialogonetwo}
      ></PdpDalog>
</div>

    // <div
    //   className="col-6 col-sm-6 pb-3 pb-sm-5  mb-3 mb-sm-0 productDetailSrlSpyItemBxShdw"
    //   onClick={openDialogonetwo.bind(null, true)}
    // >
    //   <img
    //     src={
    //       props.product &&
    //       props.product.mobileImage &&
    //       props.product.mobileImage.length > 0
    //         ? props.product.mobileImage[0].image
    //         : "/static/images/new_imgs/foodDummy.png"
    //     }
    //     width="244"
    //     height="160"
    //     className="popularBrandItemImgRep productDetailrecomItemImg"
    //     alt={props.product.productName}
    //   />
      
    //   <h6
    //     className="productDetailSrlSpyH6Name"
    //     title={props.product.productName}
    //   >
      
    //     <img src="/static/images/grocer/veg.png" className="vegIcon" />
    //     {props.product.productName}{" "}
    //   </h6>
    //   <p className="productDetailSrlSpyNameCat">{lang.starters}</p>
    //   <div className="row align-items-start">
    //     {props.product.priceValue == props.product.finalPrice ? (
    //       <div className="col-lg py-1">
    //         <h5 className="productDetailSrlSpyNamePrice">
    //           {" "}
    //           {props.currencySymbol || "$"}
    //           {props.product.priceValue}{" "}
    //         </h5>
    //       </div>
    //     ) : (
    //       <div className="col-lg py-1">
    //         <span className="scratch">
    //           {props.currencySymbol || "$"}
    //           {props.product.priceValue}
    //         </span>
    //         <span className="productDetailSrlSpyNamePrice">
    //           {" "}
    //           {props.currencySymbol || "$"}
    //           {props.product.finalPrice}{" "}
    //         </span>
    //       </div>
    //     )}

    //     {inCart(props.cartProducts, props.product) ? (
    //       <FoodCartButtons
    //         product={props.product}
    //         cartLoadProdId={props.cartLoadProdId}
    //         cartProducts={props.cartProducts}
    //         editCart={props.editCart}
    //         openOptionsDialog={props.openOptionsDialog}
    //       />
    //     ) : props.product.addOnAvailable == 1 ? (
    //       <div className="col-xl-4 col-lg-5 pl-0">
    //         <a
    //           onClick={(e) => {
    //             e.preventDefault(),
    //               e.stopPropagation(),
    //               props.openAddOnDialog(props.product);
    //           }}
    //         >
    //           <span className="addOnBtnDV">+</span>
    //           <button className="btn btn-default prodetailsRecomItemAddBtnDV">
    //             {lang.add}
    //           </button>
    //         </a>
    //         <p className="customisableReminder">{lang.customisable}</p>
    //       </div>
    //     ) : (
    //       <div className="col-xl-4 col-lg-5 pl-0" style={{ zIndex: 1 }}>
    //         <div className="addCartBtnCont">
    //           <button
    //             className="btn btn-default prodetailsRecomItemAddBtnDV"
    //             onClick={(e) => {
    //               props.addToCart(props.product);
    //               e.preventDefault();
    //               e.stopPropagation();
    //             }}
    //           >
    //             {lang.add}
    //           </button>
    //           {props.cartLoadProdId == props.product.childProductId ? (
    //             <span className="cartProg"></span>
    //           ) : (
    //             ""
    //           )}
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   <PdpDalog
    //     open={open.dialog}
    //     lang={lang}
    //     addToCart={props.addToCart}
    //     addToCartt={props.addToCartt}
    //     cartLoadProdId={props.cartLoadProdId}
    //     cartProducts={props.cartProducts}
    //     editCart={props.editCart}
    //     addOnAvailable={props.product.addOnAvailable}
    //     openAddOnDialog={props.openAddOnDialog}
    //     openOptionsDialog={props.openOptionsDialog}
    //     inCart={inCart(props.cartProducts, props.product)}
    //     product={props.product}
    //     dialogData={dialogData}
    //     closeDialog={openDialogonetwo}
    //   ></PdpDalog>
    // </div>
   
  );
};

export default FoodCard;
