import FoodCartButtons from "../Cart/CartButtons";

const inCart = (cart, product) => {
    if (cart) {
        let index = findCartIndex(cart, product);
        if (index >= 0 && cart[index].quantity > 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

const findCartIndex = (cart, product) => {
    return cart.findIndex((item) => item.childProductId == product.childProductId);
}

const findQuantity = (cart, product) => {
    let index = findCartIndex(cart, product);
    return cart[index].quantity
}

const FoodListCard = (props) =>{
  console.log(props.cartProducts,props.product,"from the food list")

    return(
        <div className="row productDetailSrlSpyItemsListInnerSpl">

        {/* items  */}
        <div className="col-md col-9">
            <h6 className="productDetailSrlSpyH6Name" title={props.product.productName}>
                {/* <img src="/static/images/grocer/veg.png" className="vegIcon" /> */}
                {props.product.productName}
            </h6>
            <h5 className="productDetailSrlSpyNamePrice">
            ₹{props.product.units ? props.product.units[0].unitPrice : props.product.priceValue}
            </h5>
        </div>

        {inCart(props.cartProducts, props.product) ?
            <div className="col-md-2 col-3 productDetailSrlSpyH6Name cartAfterAddBtn" id="afterAddBtnID">
                <FoodCartButtons product={props.product} cartProducts={props.cartProducts} editCart={props.editCart} openOptionsDialog={props.openOptionsDialog} />
            </div>
            :
            (
                props.product.addOnAvailable == 1 ?
                    <div className="col-md-2 col-3 productDetailSrlSpyH6Name pl-0">
                        <span className="addOnBtnDV">+</span>
                        <button onClick={() => props.openAddOnDialog(props.product)} className="btn btn-default prodetailsRecomItemAddBtnDV">
                            add
                        {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''}
                        </button>
                        <p className="customisableReminder">Customisable</p>
                    </div>
                    :
                    <div className="col-md-2 col-3 productDetailSrlSpyH6Name pl-0">
                        <button onClick={(event) => props.addToCart(props.product, )} className="btn btn-default prodetailsRecomItemAddBtnDV">
                            add
                        {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''}
                        </button>
                    </div>
            )}
    </div>
)
}

export default FoodListCard;