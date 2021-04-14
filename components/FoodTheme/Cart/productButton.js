const findCartIndex = (cart, product) => {
  
  return cart.findIndex(
    (item) =>
      item.childProductId == product.childProductId ||
      item.childProductId == product.productId
  )
  
  
  };
  
  const findCartIndexWithPackId = (cart, product) => {
 
    
    return cart.findIndex(
      (item) =>
        item.childProductId == product.childProductId 
        // &&
        // item.packId == product.packId
    );
  };
  
  const findQuantity = (cart, product, cartSection) => {
    var quantity=0;
    let bigCities = cart.filter(city => city.childProductId == product.childProductId);
   let secondValue = bigCities.map(item =>quantity +=item.quantity )
   secondValue++
console.log(quantity,"malambhai");
// bigCities.map(item => item.)
//     let arr =cart.map(item =>item.childProductId)
//     let sorted_arr = arr.slice().sort(); 
//     let results = [];
//     for (let i = 0; i < sorted_arr.length - 1; i++) {
//       if (sorted_arr[i + 1] == sorted_arr[i]) {
//         results.push(sorted_arr[i]);
//       }
//     }
    
//     let sortValue = results.map(item => item )
//     var dataset =arr;
// var results1 = [];
// for (let i=0; i < dataset.length; i++ ){
//     if ( dataset[i] == sortValue ){
//       results1.push( i );
//     }
// }
// let subValue = results.map(item =>item)

// console.log(subValue,"tusharHg")
    let index = cartSection
      ? findCartIndexWithPackId(cart, product)
      : findCartIndex(cart, product);
    
    return cart[index] ? quantity : "";
  };
  
  const ProductCartButton = (props) => {
   
    return(
    <div
      style={{ float: props.float || "right", width: props.width || "82px" }}
      className={"align-items-center calculator-market1" + " "}
    >
      <div
        className="substract"
        onClick={(event) =>
          props.editCart(
            props.cartProducts[
              props.cartProducts.findIndex(
                (item) =>
                  item.childProductId == props.product.childProductId ||
                  item.childProductId == props.product.productId
              )
            ],
            "",
            1,
            event
          )
        }
      />
      <div className="qtyNum">
        {findQuantity(props.cartProducts, props.product, props.cartSection)}
      </div>
      <div
        className="addition"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          props.openOptionsDialog(
            props.product.addOnAvailable > 0 ||
              (props.selectedUnit && props.selectedUnit.addOnAvailable > 0)
              ? props.product
              : props.cartProducts[
                  props.cartProducts.findIndex(
                    (item) =>
                      item.childProductId == props.product.childProductId ||
                      item.childProductId == props.product.productId
                  )
                ],
            2,
            event
          );
        }}
      >
        {/* onClick={() => props.openOptionsDialog(props.product.addOnAvailable > 0 ? props.product : props.cartProducts[props.cartProducts.findIndex((item) => item.childProductId == props.product.childProductId)], 2)}> */}
        +
      </div>
      {/* {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''} */}
    </div>
  );}
  
  export default ProductCartButton;
  