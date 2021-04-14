const FoodCartButtons = (props) => {
  console.log("food cart bytttsdd", props);
  const findCartIndex = (cart, product) => {
    return cart.findIndex(
      (item) =>
        item.childProductId == product.childProductId ||
        item.childProductId == product.productId
    );
  };

  const findCartIndexWithPackId = (cart, product) => {
    return cart.findIndex((item) => {
      console.log("carts items", item, props.unitId);
      return item.unitId == props.unitId;
    });
  };

  const findQuantity = (cart, product, cartSection) => {
    console.log("find quantity", cart, "find quantity", product, cartSection);
    let index = findCartIndexWithPackId(cart, product);
    console.log(
      "find index",
      index,
      cart[index] ? cart[index].quantity : "no rpoduycs",
      index
    );
    return cart[index] ? cart[index].quantity : "";
  };

  return (
    <div
      style={{ float: props.float || "right", width: props.width || "70px" }}
      className={"align-items-center calculator-market" + " "}
    >
      <div
        className="substract"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          props.editCart(
            props.cartProducts[
              props.cartProducts.findIndex(
                (item) => item.unitId == props.unitId
              )
            ],
            "",
            1,
            event,
            props.unitId
          );
        }}
      />
      <div className="qtyNum">
        {findQuantity(props.cartProducts, props.product, props.cartSection)}
      </div>
      <div
        className="addition wa wdwqe"
        onClick={(e) => {
          console.log("product edit stop propogation", e);
          e.stopPropagation();
          e.preventDefault();
          props.openOptionsDialog(
            props.product.addOnAvailable > 0 ||
              (props.selectedUnit && props.selectedUnit.addOnAvailable > 0)
              ? props.product
              : props.cartProducts[
                  props.cartProducts.findIndex(
                    (item) => item.unitId == props.unitId
                  )
                ],
            2,
            e,
            props.unitId
          );
        }}
      >
        {/* onClick={() => props.openOptionsDialog(props.product.addOnAvailable > 0 ? props.product : props.cartProducts[props.cartProducts.findIndex((item) => item.childProductId == props.product.childProductId)], 2)}> */}
        +
      </div>
      {/* {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''} */}
    </div>
  );
};

export default FoodCartButtons;
