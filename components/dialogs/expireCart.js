import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux'
import { getCookie, getCookiees, setCookie } from '../../lib/session'
import redirect from '../../lib/redirect'
import RaisedButton from 'material-ui/RaisedButton'
import * as actions from '../../actions'
import { clearOutCart } from '../../services/cart'

const buttonRed = {
    backgroundColor: "#fff",
    height: '35px',
    lineHeight: '35px'
}
const overlayStyle = {
    height: '35px',
}

const lableFill = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fc7800'
}

class ExpireCartDialog extends React.Component {

    state = {
        open: false,
        product: [],
        type: ''
    };

    openOptionsDialog = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({
            open: false,
        })
        this.props.dispatch(actions.expireCart(false, []))
    };

    componentDidMount() {
        this.props.onRef(this)
    }

    componentDidUpdate(prevProps, prevState) {
console.log(prevProps,this.props.expireCart,"componentDidUpdate")
        if (prevProps.expireCart !== this.props.expireCart && this.props.expireCart == true) {
            this.openOptionsDialog()
        }
    }


    clearTheCart = () => {
        let data = {
            customerId: getCookie('sid', ''),
            cartId: this.props.myCart.cartId
        }
        console.log("CartClearData ",data);
        clearOutCart(data).then((result) => {
            result.error ?
                result.status == 498 ?
                    this.props.dispatch(actions.expSession())
                    : ''
                : (
                    this.props.dispatch(actions.initAddCart(this.props.expCartData))
                )
            this.handleClose();
        })
    }



    render() {
        console.log("mycart ",this.props.expCartData,this.props.expireCart);
        return (
            <div style={{ marginTop: '50px' }}>
                <Dialog
                    modal={true}
                    open={this.state.open}
                    autoDetectWindowHeight={false}
                    bodyStyle={{ maxHeight: '550px' }}
                    onRequestClose={this.handleClose}
                    contentStyle={{ marginTop: "0px", width: '100%', maxWidth: '450px', }}
                >

                    <div className="col-12 text-center">
                        <h4 className="modal-title"> Items already in cart </h4>

                        <p className="my-3">
                            Your cart contains items from other store.
                            Would you like to reset your cart for adding items from this store?
                            </p>
                        <div className="row">
                            <div className="col-6">
                                <button className="_1gPB8 w-100" onClick={this.handleClose}>No</button>
                            </div>
                            <div className="col-6">
                                <button onClick={this.clearTheCart} className="foodCheckoutRest w-100">Yes, Start Afresh</button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        expireCart: state.expireCart,
        expCartData: state.expCartData,
        myCart: state.cartList,
    };
};

export default connect(mapStateToProps)(ExpireCartDialog);