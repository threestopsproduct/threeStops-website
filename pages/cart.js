import React from 'react'
import { connect } from 'react-redux'

import { setCookie, getCookiees, getCookie } from '../lib/session'
import CartContent from '../components/cart/cartContent'
import * as actions from '../actions/index'
import Router from "next/router";
import LabelBottomNavigation from '../components/footer/BottomNavigation'


class Cart extends React.Component {

    static async getInitialProps({ ctx }) {

        let authorized = await getCookiees("authorized", ctx.req);

        return { authorized }
    }

    state = {
        width: '100%',
        maxWidth: '100%',
        open: false,
        windowWidth: 580
    }

    constructor(props) {
        super(props);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.setDeliveryType = this.setDeliveryType.bind(this);
    }


    closeDrawer() {
        // Router.push("/");
        Router.back();
    }

    componentDidMount() {
        this.props.dispatch(actions.getCart());
        this.setState({ windowWidth: window.outerWidth });
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
          this.props.dispatch(actions.editCard(editCartData));
      };
    setDeliveryType(type) {
        this.props.dispatch(actions.deliveryType(type))
        Router.push('/checkout');
    }
    render() {
        return (

            <div>
                <CartContent myCart={this.props.myCart} handleClose={this.closeDrawer} setDeliveryType={this.setDeliveryType} editCart={this.editCart} mobile={true} windowWidth={this.state.windowWidth} />

                <div className="row fixed-bottom mobile-show z-top">
                    <LabelBottomNavigation index={3} count={this.props.cartProducts ? this.props.cartProducts.length : 0} isAuthorized={this.props.authorized} selectedStore={this.props.selectedStore} />
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        myCart: state.cartList,
        cartProducts: state.cartProducts,
    };
};

export default connect(mapStateToProps)(Cart);