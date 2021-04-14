import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux'
import $ from 'jquery'
import * as actions from '../../../actions/index';
import CircularProgress from 'material-ui/CircularProgress';
import { getCookie } from '../../../lib/session';
import { getProductDetails } from '../../../services/category';
import { editAddOnCart } from '../../../services/cart';
import { BASE_COLOR } from '../../../lib/envariables';


const styles = {
    block: {
        maxWidth: 250,
    },
    checkbox: {
        marginBottom: 16,
        fontSize: "13px",
        fontWeight: 300,
        borderBottom: "0px solid #999",
        padding: "0px 10px"
    },
};




class EditAddOns extends React.Component {

    state = {
        listOpen: false,
        addOnList: [],
        product: [],
        mandatoryAddOns: [],
        allAreMarked: false,
        selectedAddons: [],
        addOnArrayforCart: [],
        addOnPrice: 0,
        showAll: false,
        cartProduct: [],
        selectedAddonArr: []
    };

    constructor(props) {
        super(props);
        this.openProductDialog = this.openProductDialog.bind(this);
    }

    openProductDialog = async (cartProduct) => {
        let lat = getCookie("lat", '');
        let lng = getCookie("long", '');
        let token = getCookie("token", '');

        getProductDetails(cartProduct.childProductId, lat, lng, token).then(({ data }) => {
            console.log("err---> ", cartProduct)
            data.error ? '' : this.setState({ listOpen: true, cartProduct: cartProduct, addOnList: data.data.units[0].addOns, product: data.data, selectedAddOns: cartProduct.selectedAddOns }, () => {
                this.afterSetStateFinished();

                console.log("cartProduct", this.state.cartProduct)

                setTimeout(() => {
                    // this.state.addOnList && this.state.addOnList.map((addonItem) => {
                    //     addonItem.addOnGroup.map((addonSubItem) => {
                    //         this.inCart(this.state.cartProduct.addOns, addonItem, addonSubItem, (addonSubItem.name).replace(/[^A-Za-z]/g, ""))
                    //     })
                    // })
                    this.selectAddons(cartProduct.selectedAddOns)
                }, 400)
            })
        })
    };

    afterSetStateFinished = async () => {
        let mandatory = [];
        await this.state.addOnList && this.state.addOnList.length > 0 ? this.state.addOnList.map((item) => {
            item.mandatory == 1 ? mandatory.push(item) : ''
        }) : '';

        await this.setState({ mandatoryAddOns: mandatory })
    }

    selectAddons = (selectedAddons) => {
        let allAddons = this.state.addOnList;
        let selectedAddonArr = [];
        allAddons.map((mainAddon) => {
            mainAddon.addOnGroup.map((subAddon) => {
                selectedAddons.map((selectedAddon) => {
                    if (selectedAddon.id == subAddon.id) {
                        console.log("sel-add", selectedAddon)
                        $("#" + selectedAddon.id).prop("checked", true);
                        selectedAddonArr.push({
                            addOn: subAddon,
                            id: mainAddon.id
                        })

                    }
                })
            })
        })
        let total = 0;
        selectedAddons.map((addOn) => total += +parseFloat(addOn.price).toFixed(2))
        this.setState({ addOnPrice: total, selectedAddonArr: selectedAddonArr })
    }

    inCart = (cart, parentArray, product, name) => {
        let index = this.findCartIndex(cart, product.id);

        if (index >= 0) {
            this.pushToSelected(parentArray, product)
            // this.onChangeRadio(parentArray, product)
            $("#" + name).prop("checked", true);
            return true
        } else {
            return false
        }
    }

    pushToSelected = (parentArray, childArray) => {
        let index;
        let selectedAddons = [...this.state.addOnList];

        let data = {
            addOnGroup: childArray,
            id: parentArray.id
        }

        selectedAddons.length < 1 ?
            selectedAddons.push(data)
            : (
                index = selectedAddons.findIndex((item) => item.id == data.id),
                index >= 0 ?
                    (
                        selectedAddons[index] = data
                    )
                    :
                    selectedAddons.push(data)
            )

        this.state.selectedAddons.length != selectedAddons.length ?
            this.setState({ selectedAddons: selectedAddons }, () => {
                this.calculateTotal(this.state.selectedAddons)
            })
            : ''
    }

    findCartIndex = (cart, product) => {
        return cart.findIndex((item) => item.addOnGroup[0] == product)
    }

    togleShowAll = () => {
        this.setState({ showAll: !this.state.showAll })
    }

    onChangeRadio = async (parentArray, childArray) => {

        // let allAreMarked = true; let index;
        // let finalAddOns = await [...this.state.selectedAddons];

        // console.log("finalAddOns", finalAddOns)

        // let data = {
        //     addOnGroup: childArray,
        //     id: parentArray.id
        // }

        // finalAddOns.length > 0
        // await finalAddOns.length < 1 ?
        //     finalAddOns.push(data)
        //     : (
        //         index = finalAddOns.findIndex((item) => item.id == parentArray.id),
        //         index >= 0 ?
        //             (
        //                 finalAddOns[index] = data
        //             )
        //             :
        //             finalAddOns.push(data)
        //     )


        // await this.state.mandatoryAddOns.map((item) => {
        //     if ($(`input[name=${(item.name).replace(/[^A-Za-z]/g, "")}]:checked`).length > 0) {
        //         // do something here
        //     } else {
        //         return (allAreMarked = false)
        //     }
        // }
        // )
        // await this.setState({ allAreMarked: allAreMarked, selectedAddons: finalAddOns }, () =>
        //     this.pushToAddonFinal(this.state.selectedAddons),
        //     this.calculateTotal(finalAddOns)
        // )

        let allAreMarked = true; let index;
        let finalAddOns = await [...this.state.selectedAddonArr];


        // get all the checkbox inside particular addon group
        let $allInp = $(".addAdon" + parentArray.id + " .addAddonCB");

        let selectionLimit = parentArray.maximumLimit;
        if (parentArray.multiple == "0" && parentArray.maximumLimit == "0") {
            console.log("Select only 1");
            selectionLimit = 1;
        }
        if (parentArray.multiple == 1 && parentArray.maximumLimit == 0) {
            console.log("Select all");
            selectionLimit = "all";
        }
        if (parentArray.minimumLimit > 0 && parentArray.maximumLimit >= parentArray.minimumLimit) {
            console.log("Handle according to minimum and maximum limit");
            selectionLimit = parentArray.maximumLimit;
        }
        console.log("selection limit", selectionLimit, $allInp.filter(':checked').length)
        if ($allInp && $allInp.length > 0 && $allInp[0].type === "checkbox" && $allInp.filter(':checked').length > selectionLimit) {
            $("#" + childArray.id).prop("checked", false);  // uncheck the checkbox
        }

        // check if the addon maximum limit reaches, prevent checking more boxes
        // if ($allInp.filter(':checked').length >= parentArray.maximumLimit && parentArray.mandatory != 1) {
        //     $("#" + childArray.id).prop("checked", false);  // uncheck the checkbox
        // }

        let data = {
            addOn: childArray,
            id: parentArray.id,
        }
        // console.log("before--", finalAddOns)
        if ($allInp && $allInp.length > 0 && $allInp[0].type === "checkbox" && $("#" + childArray.id).prop("checked")) {
            // finalAddOns.length > 0
            // await finalAddOns.length < 1 ?
            finalAddOns.push(data)
            //   (
            //         index = finalAddOns.findIndex((item) => item.id == parentArray.id),
            //         index >= 0 ?
            //             // (
            //             //     finalAddOns[index] = data
            //             // )
            //             // :
            //             finalAddOns.push(data) : ''
            //     ) : ''

        } else if ($allInp && $allInp.length > 0 && $allInp[0].type === "radio") {
            let index = finalAddOns.findIndex((item) => item.id == parentArray.id);
            console.log("match index", index, parentArray, finalAddOns);
            index > -1 ? finalAddOns.splice(index, 1) : ''
            finalAddOns.push(data);
            console.log("match index control", $(".addAdon" + parentArray.id + " input:checked"), $(".addAdon" + parentArray.id + " input:checked").attr("data-value"))
        } else {
            let indexToRemove = finalAddOns.findIndex((item) => item.addOn.id == childArray.id);
            indexToRemove >= 0 ? finalAddOns.splice(indexToRemove, 1) : ''
        }

        await this.state.mandatoryAddOns.map((item) => {
            if ($(`input[name=${(item.name || item.name.en).replace(/[^A-Za-z]/g, "")}]:checked`).length > 0) {
                // do something here
            } else {
                return (allAreMarked = false)
            }
        })
        await this.setState({ allAreMarked: allAreMarked, selectedAddons: finalAddOns, selectedAddonArr: finalAddOns }, () =>
            this.pushToAddonFinal(this.state.selectedAddons), this.calculateTotal(finalAddOns)
        )

        console.log("final last---", finalAddOns)
    }

    pushToAddonFinal(selectedAddons) {
        // console.log("selectedAddons", selectedAddons)
        let addOnArrayforCart = [];
        selectedAddons.map((item) => {
            // addOnArrayforCart.push({
            //     addOnGroup: [item.id || item.addOnGroup[0]],
            //     id: item.id
            // })
            addOnArrayforCart.push({
                addOnGroup: [item.addOn.id],
                id: item.id
            })
        })
        this.setState({ addOnArrayforCart: addOnArrayforCart }, () => console.log(""))
    }

    calculateTotal(finalAddOns) {
        // console.log("addOnPrice")
        let addOnPrice = 0;
        finalAddOns.map((item) => {
            addOnPrice += +item.addOn.price;
        })
        console.log("addOnPrice", addOnPrice)
        this.setState({ addOnPrice: addOnPrice })
    }

    handleClose = () => {
        this.setState({
            listOpen: false,
            addOnList: [],
            product: [],
            mandatoryAddOns: [],
            allAreMarked: false,
            selectedAddons: [],
            addOnArrayforCart: [],
            addOnPrice: 0,
            showAll: false,
            loading: false
        });
    };

    getAddonSelectMsg = (addOnData) => {
        // console.log("add on data", addOnData)
        // switch(addOnData.maximumLimit){

        // }
        switch (addOnData.multiple) {
            case 0:
                if (addOnData.maximumLimit == 0)
                    return "You can choose upto " + 1 + " option"
                if (addOnData.minimumLimit > 0 && addOnData.maximumLimit > 0)
                    return "Select minimum of " + addOnData.minimumLimit + " and maximum of " + addOnData.maximumLimit + " option"
            case 1:
                if (addOnData.maximumLimit == 0)
                    return "You can choose upto " + addOnData.addOnGroup.length + " option"
                if (addOnData.minimumLimit > 0 && addOnData.maximumLimit > 0)
                    return "Select minimum of " + addOnData.minimumLimit + " and maximum of " + addOnData.maximumLimit + " option"
        }
        return "You can choose upto " + addOnData.maximumLimit + " option"
    }

    handleChange = name => e => {
        e.target.checked ? (this.selectedOptions(e, name)) : this.removedOptions(e, name)
    };

    editTheCart = () => {
        let cartData;
        this.setState({ loading: true })
        this.props.isAuthorized ?
            (cartData = {
                cartId: this.props.myCart.cartId,
                childProductId: this.state.cartProduct.childProductId,
                addOns: this.state.addOnArrayforCart,
                storeType: 1,
                unitId: this.state.cartProduct.unitId,
                packId: this.state.cartProduct.addedToCartOn.toString()
            },

                editAddOnCart(cartData).then((data) => {
                    this.setState({ loading: false });
                    this.handleClose();
                    this.props.dispatch(actions.getCart());
                })
                // this.props.dispatch(actions.initAddCart(cartData)),
                // setTimeout(() => {
                //     this.props.dispatch(actions.getCart())
                // }, 100)
            ) : this.props.showLoginHandler();
    }


    componentDidMount() {
        this.props.onRef(this);
    }

    handleSection = (id) => {
        // console.log("asdasdasdasd")
        // // Make sure this.hash has a value before overriding default behavior
        // // if (this.hash !== "") {
        // // Prevent default anchor click behavior
        // event.preventDefault();

        // // Store hash
        // var hash = "#" + id;

        // // Using jQuery's animate() method to add smooth page scroll
        // // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        // $('.modal-body').animate({
        //     scrollTop: $(hash).offset().top
        // }, 1000, function () {

        //     // Add hash (#) to URL when done scrolling (default click behavior)
        //     window.location.hash = hash;
        // });
        // // } // End if
    }


    scrollTo(id) {
        console.log("id", id)
        let divId = "#" + id;
        console.log("$(divId).offset().top ", $(divId).offset().top)
        $(document).ready(() => {
            $('.modal-body').animate({ 'scrollTop': $(divId).offset().top }, 2000)
        })
        // $('.modal-body').animate({ 'scrollTop': $("#" + id).scrollTop() })
    }


    render() {
         console.log("this.st--addon", this.props.currencySymbol)
        return (
            this.state.listOpen ?
                <div style={{ marginTop: '20px' }}>
                    <Dialog
                        modal={false}
                        open={this.state.listOpen}
                        autoDetectWindowHeight={false}
                        overlayStyle={{ zIndex: "800" }}
                        bodyStyle={{ maxHeight: '530px' }}
                        onRequestClose={this.handleClose}
                        contentStyle={{ marginTop: "-50px", width: '45%', maxWidth: 'none', zIndex: "900" }}
                    >

                        <div className="col-12 addOnsModalSec addOnsModal">

                            <div className="row">
                                <div className="col-12 pt-3 text-right" style={{ top: "20px", background: "#fff", }}>
                                    <button style={{"fontSize":"16px","fontWeight" : "300","height": "20px","width":"20px","background":"red","borderRadius" : "50%","color":"white"}} type="button" className="close" onClick={this.handleClose} >&times; </button>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <img src={
                                            this.state.product &&
                                            this.state.product.mobileImage &&
                                            this.state.product.mobileImage.length > 0
                                            ? this.state.product.mobileImage[0].image
                                            : "/static/images/new_imgs/foodDummy.png"
                                        } width="100%" className="gridImg" />
                                    </div>
                                    <div className="col-8 text-left" style={{paddingTop:"30px"}}>
                                    <h6 className="modal-title" style={{"fontSize": "18px","fontWeight":"700"}}>
                                        {this.state.product
                                        ? this.state.product.itemName ||
                                            this.state.product.productName
                                        : ""} {" "}
                                        <img
                                            src="/static/images/grocer/veg.png"
                                            className="vegIcon"
                                        />
                                    </h6>
                                    <h6 className="modal-title" style={{fontSize: "16px",paddingTop:"10px"}}>
                                        {"₹"||this.props.currencySymbol || "₹"}
                                        {parseFloat(
                                        this.state.product.priceValue ||
                                            this.state.product.unitPrice ||
                                            this.state.product.units[0].finalPrice
                                        ).toFixed(2)}
                                    </h6>
                                    </div>
                                </div>
                            </div>

                            <div className="row pt-4">
                                <div className="col-sm-12">
                                    <ul className="nav nav-pills ordersContentLayoutOuterULClass" style={{width:"100% "}} id="ordersContentLayoutOuterULIdNew" role="tablist">
                                        {this.state.addOnList.length > 0
                                        ? this.state.addOnList.map((addonItem,index) => {
                                            let pillIds = "pills-tab-"+index;
                                            let classNameList = index == 0 ? "nav-link active" : "nav-link"; 
                                            return(
                                            <li className="nav-item">
                                                <a className={classNameList} id={pillIds} data-toggle="pill" href={
                                                    "#" +
                                                    (addonItem.name || addonItem.name.en).replace(
                                                    /[^A-Za-z]/g,
                                                    ""
                                                    )
                                                } role="tab" aria-controls="pills-profile"
                                                    aria-selected="false">{addonItem.name || addonItem.name.en}</a>
                                            </li>
                                            )})
                                        : ""}
                                    </ul>
                                </div>
                            </div>


                            <div className="modal-body scroller" id="scrollId">
                                <div className="col-12 totLayoutResCom p-0">
                                    <div className="tab-content" id="pills-tabContent" style={{paddingTop:"5px"}}>
                                        {this.state.addOnList.length > 0 ? this.state.addOnList.map((addonItem,index) => {
                                        let pillIds = "pills-tab-"+index;
                                        let classNameList = index == 0 ? "tab-pane fade show active" : "tab-pane fade"; 
                                            return(
                                                <div className={classNameList} id={(addonItem.name || addonItem.name.en).replace( /[^A-Za-z]/g, "")} role="tabpanel" aria-labelledby={pillIds}>
                                                    <div className="pastOrdersLayout">
                                                        <div className="accordion" id="accordionEx" role="tablist" aria-multiselectable="true"> 
                                                        <p style={{ fontSize: "12px","fontWeight" : "500",color:"#152241","paddingBottom": "12px" ,margin: "10px 0 0" }}>
                                                            {this.getAddonSelectMsg(addonItem)}
                                                            {addonItem.mandatory == 1 ? ( <span className={ addonItem.valid ? "addOnRequired done" : "addOnRequired active" } > Required </span> ) : ( "" )}
                                                        </p>
                                                        <div className="modal-body scroller" id="scrollId">
                                                            <div className="row">
                                                            <div data-spy="scroll" data-target="#navbarExample1" data-offset="0" className="col-12 addonsULSec">
                                                                <ul
                                                                id={(addonItem.name || addonItem.name.en).replace(
                                                                    /[^A-Za-z]/g,
                                                                    ""
                                                                )}
                                                                className={
                                                                    "nav flex-column radioUL " +
                                                                    "addAdon" +
                                                                    addonItem.id
                                                                }
                                                                >
                                                                {/* {addOnArr = addonItem.addOnGroup || addonItem.addOns} */}
                                                                <div className="row">
                                                                {addonItem.addOnGroup.map((addonSubItem) => (
                                                                    <div className="col-6 pr-0">
                                                                    {/* <Checkbox
                                                                                                    label={addonSubItem.name.en}
                                                                                                    labelPosition="right"
                                                                                                    style={styles.checkbox}
                                                                                                /> */}
                                                                    {/* parentArray.multiple == 1 && parentArray.maximumLimit == 0 */}
                                                                    <li className="nav-item">
                                                                        {/* <img src="/static/images/grocer/veg.png" className="vegIcon" /> */}
                                                                        <label
                                                                        className="addOnLabelNew"
                                                                        for={addonSubItem.id}
                                                                        >
                                                                        <span className="actualAddonName">
                                                                            {addonSubItem.name}
                                                                        </span>
                                                                        <input
                                                                            type={
                                                                            (addonItem.multiple == 1 &&
                                                                                addonItem.maximumLimit == 0) ||
                                                                            (addonItem.minimumLimit > 0 &&
                                                                                addonItem.maximumLimit >=
                                                                                addonItem.minimumLimit)
                                                                                ? "checkbox"
                                                                                : "checkbox"
                                                                            }
                                                                            data-price={parseFloat(
                                                                            addonSubItem.price
                                                                            ).toFixed(2)}
                                                                            id={addonSubItem.id}
                                                                            className="addAddonCB"
                                                                            data-value={parseFloat(
                                                                            addonSubItem.price
                                                                            ).toFixed(2)}
                                                                            onChange={() =>
                                                                            this.onChangeRadio(
                                                                                addonItem,
                                                                                addonSubItem
                                                                            )
                                                                            }
                                                                            name={(
                                                                            addonItem.name || addonItem.name.en
                                                                            ).replace(/[^A-Za-z]/g, "")}
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                        <span className="addOnItemPrice">
                                                                            {"₹"||this.props.currencySymbol || "₹"}
                                                                            {parseFloat(addonSubItem.price).toFixed(2)}
                                                                        </span>
                                                                        </label>
                                                                    </li>
                                                                    </div>
                                                                ))}
                                                                </div>
                                                                </ul>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )})
                                        : ""}
                                    </div>
                                </div>
                            </div>

                            <div className="fixed-bottom mx-0">
                                <div className="col-12 cartBottomSec  mt-2">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-9 mb-2 setTwoLines">
                                                    {this.state.allAreMarked ?
                                                        this.state.showAll ?
                                                            this.state.selectedAddons.map((item, index) =>
                                                                <span className="addonsDyna">{index > 0 ? ',' : ''}{item.addOn.name}</span>
                                                            )
                                                            :
                                                            (this.state.selectedAddons.length < 3 ?
                                                                this.state.selectedAddons.map((item, index) =>
                                                                    <span className="addonsDyna">{index > 0 ? ',' : ''}{item.addOn.name}</span>
                                                                )
                                                                :
                                                                this.state.selectedAddons.map((item, index) =>
                                                                    index < 2 ?
                                                                        <span className="addonsDyna">{index > 0 ? ',' : ''}{item.addOn.name}</span>
                                                                        : ''
                                                                )
                                                            )

                                                        :
                                                        <span className="addonsDyna"> All addons marked with ** should be selected  </span>
                                                    }
                                                </div>
                                                <div className="col-3">
                                                    {this.state.allAreMarked ?
                                                        this.state.showAll ?
                                                            <a onClick={this.togleShowAll} className="float-right pt-1 addonsDyna">Hide</a>
                                                            :
                                                            this.state.selectedAddons.length >= 3 ?
                                                                <a onClick={this.togleShowAll} className="float-right pt-1 addonsDyna">+{this.state.selectedAddons.length - 2} Add On</a>
                                                                :
                                                                ''
                                                        : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 cartTotalPriceSec">

                                            {this.state.allAreMarked ?
                                                <div className="cartTotalPriceSecInner" onClick={this.editTheCart}>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <span className="cartTotalStaticPrice">total</span>
                                                            <span className="cartTotalDynaPrice"> {"₹"||this.props.currencySymbol || "₹"}{parseFloat((this.state.product.priceValue || this.state.product.units[0].finalPrice) + this.state.addOnPrice).toFixed(2)}</span>
                                                        </div>
                                                        <div className="col-6 text-right">
                                                            <span className="cartTotalDynaPrice">edit item</span>
                                                        </div>
                                                    </div>
                                                    {this.state.loading ?
                                                        <div className="bttnLoader">
                                                            <div className="">
                                                                <CircularProgress color={BASE_COLOR} size={30} thickness={3} />
                                                            </div>
                                                        </div>
                                                        : ''}
                                                </div>
                                                : <div className="cartTotalPriceSecInnerDeactive">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <span className="cartTotalStaticPrice">total</span>
                                                            <span className="cartTotalDynaPrice"> {"₹"||this.props.currencySymbol || "₹"}{parseFloat((this.state.product.priceValue || this.state.product.units[0].finalPrice) + this.state.addOnPrice).toFixed(2)}</span>
                                                        </div>
                                                        <div className="col-6 text-right">
                                                            <span className="cartTotalDynaPrice">edit item</span>
                                                        </div>
                                                    </div>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Dialog>

                </div>

                : ''
        );
    }
}


const mapStateToProps = state => {
    return {
        reduxState: state,
        myCart: state.cartList,
        cartProducts: state.cartProducts,
        loading: state.loading
    };
};

export default connect(mapStateToProps)(EditAddOns);