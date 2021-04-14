import React from 'react';
import { Step, Stepper, StepButton, StepContent } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import frLocale from "date-fns/locale/fr";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";
import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DateFnsAdapter from "@material-ui/pickers/adapter/date-fns";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker,LocalizationProvider,MobileDateTimePicker  } from "@material-ui/pickers";
import TimePicker from 'material-ui/TimePicker';
import { getCookie } from '../../lib/session';
import Wrapper from '../../hoc/wrapperHoc';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import AddressList from '../Adress/addressList';
import { BASE_COLOR } from '../../lib/envariables';
import moment, { Moment } from "moment";

const localeMap = {
    en: enLocale,
   
  };
  
  const maskMap = {
  
    en: "__/__/____",
   
  };
const stepButtonStyle = {
    padding: '15px 0px 0px',
    backgroundColor: '#fff'
}

const iconBoxStyle = {
    position: 'absolute',
    left: '-20px'
}

const buttonStyleOutline = {
    width: '130px',
    color: BASE_COLOR + " !important",
    border: '1px solid ' + BASE_COLOR,
    background: '#fff'
}

const lableOutline = {
    fontSize: '13px',
    fontWeight: '700',
    color: BASE_COLOR,
    letterSpacing: '0.6px'
}

const stepButtonStyle2 = {
    padding: '0px 0px 0px',
    backgroundColor: '#fff'
}

const buttonStyleFill = {
    width: '100%',
    color: "#fff !important",
    border: '1px solid #07FFFF' ,
    background: "#07FFFF",

}

const lableFill = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#000',
    letterSpacing: '0.6px',
    // padding: "16px 50px"
}

const fullWidthButtonStyleFill = {
    color: "#fff !important",
    border: '1px solid ' + BASE_COLOR,
    background: BASE_COLOR,

}

const styles = theme => ({
    colorSwitchBase: {
        color: BASE_COLOR,
        '&$colorChecked': {
            color: BASE_COLOR,
            '& + $colorBar': {
                backgroundColor: BASE_COLOR,
            },
        },
    },
    colorBar: {},
    colorChecked: {},
})

const CheckoutStepper = (props) => {
    const { stepIndex, pickupStepIndex, divider, firstIcon, secondIcon, thirdIcon, NowButton, NowLabel, LaterButton, LaterLabel, walletBalance, isDeliveryType, deliveryFeesTotal,deliveryCard,deliveryCash } = props;
    const { classes } = props;
    const [locale, setLocale] = React.useState("ru");
    const [value, setValue] = React.useState (new Date());
    let bufferTime =parseFloat(getCookie("bufferTime")) /60
console.log(bufferTime,"tusharH")
    const orderTimeStepContent = (
        <div className="row">
            <div className="col-12 orderTypeSection">
                
                <div className="modal fade" id="orderTypeModal" style={{ zIndex: '1000' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">

                            
                            <div className="modal-header text-center">
                                <h4 className="modal-title">Order time</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            
                            <div className="modal-body">
                                <div className="col-12 orderTypeModalBody">
                                    <h3 className="selectType mt-3">Select date of order?</h3>

                                    {props.printTime()}

                                    <div>
                                        <div className="float-left">
                                            <div style={{ cursor: 'pointer' }} className="customradioBigLabel">
                                                <span >Select</span><br />
                                                <span style={{ fontWeight: '700', fontSize: '20px' }}>
                                              
                                                    {/* <DatePicker
                                                        minDate={new Date()}
                                                        placeholder="dd/mm"
                                                        value={props.DatePickervalue} onChange={props.onChangeDatePicker} autoOk={true}
                                                        textFieldStyle={{ fontSize: '11px', width: '60px', marginTop: '0px', height: 'unset', textAlign: 'center' }}
                                                        floatingLabelStyle={{ top: '28px', margin: '0px' }} inputStyle={{ marginTop: '0px', fontSize: '11px', textAlign: 'center' }}
                                                        underlineShow={false} floatingLabelFixed={true}
                                                    /> */}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Modal footer --> */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">NEXT</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- The Modal --> */}

                <div>
                    {/* <div className="col-12 p-0 mb-4">
                        <div className="row">
                            <div className="col-auto">
                                <RaisedButton
                                    label='Now'
                                    disableTouchRipple={true}
                                    disableFocusRipple={true}
                                    primary={true}
                                    style={{ marginRight: 12, marginTop: 18 }}
                                    buttonStyle={NowButton}
                                    labelStyle={NowLabel}
                                    onClick={() => props.selectBookingType(1)}
                                />
                            </div>
                            <div className="col-auto pl-0">
                                <RaisedButton
                                    label='Schedule'
                                    disableTouchRipple={true}
                                    disableFocusRipple={true}
                                    primary={true}
                                    style={{ marginRight: 12, marginTop: 18 }}
                                    buttonStyle={LaterButton}
                                    labelStyle={LaterLabel}
                                    onClick={() => props.selectBookingType(2)}
                                    data-toggle="modal" data-target="#orderTypeModal"
                                />
                            </div>
                        </div>
                    </div> */}
                     <div className="row mx-0">
                                           
                                            <label className="filter-container mb-3 col-lg-6">
                                                <div>
                                                <input type="radio" name="orderType" style={{position:"absolute",left:"10px",top:"6px"}} onChange={()=>props.handleSelectionTime("now")}
                                                onClick={() => props.selectBookingType(1)}/>
                                                <span className="checkmark"></span>
                                                    <div className="fnt12 fntWght500 baseClr">Now</div>
                                                    {/* <div className="fnt10 ashLiteClr w190">This is the fastest way to
                                                        get a delivery but you will be changed on extra $ 3.00
                                                    </div> */}
                                                    <div className="row">
                                                   {props.selectionTime=="now" ?
                                                        <div className="col-lg-4 col-md-3 col-sm-4 pt-2">
                                                            
                                                            <button
                                                                className="btn btn-default add-new-btn rounded  py-1 fnt10" onClick={props.handleNext}>Next</button>
                                                        </div>
                                                        :""}
                                                    </div>
                                                </div>
                                               
                                                {/* <span className="checkmark"></span> */}
                                            </label>
                                            <label className="filter-container mb-3 col-lg-6">
                                                <div>
                                                <input type="radio" name="orderType" style={{position:"absolute",left:"10px",top:"6px"}} onChange={()=>props.handleSelectionTime("Schedule")} onClick={() => props.selectBookingType(2)}/>
                                                <span className="checkmark"></span>
                                                    <div className="fnt12 fntWght500 baseClr">Schedule</div>
                                                    <div className="fnt10 ashLiteClr ">Select a pickup time on your
                                                        preferred day
                                                    </div>
                                                    {/* <div className="fnt12 fntWght500 baseClr mb-2">Today, 6:30 pm</div> */}
                                                    <div className="row">
                                                   {props.selectionTime=="Schedule" ?
                                                        <div className="col-lg-4 col-md-3 col-sm-4 pt-2">
                                                            
                                                            <button
                                                                className="btn btn-default add-new-btn rounded py-1 fnt10" onClick={props.handleNext}>Next</button>
                                                        </div>
                                                        :""}
                                                    </div>
                                                </div>
                                                
                                                {/* <span className="checkmark"></span> */}
                                            </label>
                                           
                                        </div>
                </div>
                <div className="row">
                    <div className="col-12 orderTypeSectionLayout">

                        <div className="row mb-1">
                            {props.bookingType == 2 ?
                                <div className="col">
                                    <div className="row">
                                        {/* <div className="col-6">
                                            <h6 className="srtTimingsCommTitleStatic">Delivery Date</h6>
                                            <span data-toggle="modal" data-target="#orderTypeModal" className="srtTimingsCommTitleDyna dateTimeStyle pt-0">{props.bookingDate}</span>
                                        </div> */}
                                        <div className="col-6">
                                        <LocalizationProvider dateAdapter={DateFnsAdapter} locale={localeMap[locale]}>
                                                <MobileDateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={`time gap must ${bufferTime} min`}
        value={props.saveTimeDate}
        onChange={props.onDateTimeChange}
        minDate={new Date()}
         minTime={props.timeSelectionValue}
         okLabel="Text"
    clearLabel="Text"
    cancelLabel="Text"
       

        // maxTime={new Date(0, 0, 0, 18, 45)}
      />
         </LocalizationProvider>
                                            {/* <h6 className="srtTimingsCommTitleStatic">Delivery Time</h6> */}
                                           
                                            {/* <div className="float-left text-center pt-0 checkoutCartDelTime" style={{ width: '100%' }}>
                                                <TimePicker value={props.timeSelectionValue} autoOk={true} onChange={props.onTimeChange} 
                                                 
                                                 minTime= {props.timeSelectionValue}
                                            //    disableMinutes={ true }
                                                hintText="hh:mm"
                                                />
                                               
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="col-6">
                                    <h6 className="srtTimingsCommTitleStatic">Delivery Date</h6>
                                    <span style={{ borderBottom: 'none ' }} className="srtTimingsCommTitleDyna dateTimeStyle pt-0">{props.bookingDate}</span>
                                </div>
                            }
                            {props.bookingType == 2 ?
                                isDeliveryType ?
                                    <p className="checkoutOrderTimeCaption">Scheduled orders are meant to place orders where you can pick up your order at the selected time slot.</p> :
                                    <p className="checkoutOrderTimeCaption">Scheduled orders are meant to place orders where the courier delivers your order at the selected time slot.</p>
                                :
                                isDeliveryType ?
                                    <p className="checkoutOrderTimeCaption">Now orders are meant to place orders where the courier delivers your order ASAP.</p> :
                                    <p className="checkoutOrderTimeCaption">Now orders are meant to place orders where you can pick up your order ASAP.</p>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const paymentStepContent = (
        <div className="row pt-3 pb-5">
            {/* <div className="col-sm-auto col-12 py-3 pr-0 mx-lg-3" id="afteraddPaymentCoLayout"> */}
            <div className="col-sm-auto col-lg-auto col-xl-auto col-12 py-3 pr-0 mx-xl-3" id="afteraddPaymentCoLayout">
                <ul className="nav nav-pills flex-column" role="tablist" id="ordersSideMenuLayoutULId">
                {deliveryCash == 1 ? 
                    <li className="nav-item">
                        <a className={`nav-link ${deliveryCash == 1 ? "active show": "" } `} id="paymentsid" data-toggle="pill" href="#pod">{"Pay On Delivery"}</a>
                    </li>
             : ""}
                 {deliveryCard == 1 ? 
                   
                   <li className="nav-item">
                        <a className={`nav-link ${deliveryCash == 0 ? "active show": "" } `} id="addressesid" data-toggle="pill" href="#card" >{"Online Payment"}</a>
                    </li>
                      : ""}
                      {deliveryCard == 1 ?
                    <li className="nav-item">
                        <a className="nav-link" id="walletid" data-toggle="pill" href="#wallet">{"Wallet"}</a>
                    </li>
                  :""}
                    {/* <li className="nav-item">
        <a className="nav-link" id="wishListid" data-toggle="pill" href="#quickcard">Quick Card</a>
    </li> */}
                </ul>

            </div>
            <div className="col-sm col-12 py-3 py-lg-3">
           
                <div className="tab-content" id="pills-tabContent">
                    {/* card tab content - start */}
                    {deliveryCard == 1  ? 
                    <div className={`tab-pane fade ${deliveryCash == 0 ? "active show": "" } `} id="card" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <div className="col-12">
                            <div className="row">
                                {/* <div className="col-12"> */}
                                <div className="col-12 px-3 px-sm-0 px-lg-0 px-xl-3">
                                    <div className="row">

                                        {walletBalance > 0 ?
                                            <Wrapper>
                                                <div className="col-12 text-left">
                                                    <div className="row">
                                                        <div className="col-6 text-left" >Wallet Balance </div>
                                                        <div className="col-6 text-right" >{
                                                            props.myCart && props.myCart.cart && props.myCart.cart.length > 0 ?
                                                                props.myCart.cart[0].currencySymbol : ''}
                                                            {walletBalance}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6 text-left" style={{ lineHeight: '50px' }}>Include Wallet</div>
                                                <div className="col-6 pr-0 text-right">
                                                    <Switch
                                                        checked={props.includeWallet}
                                                        onChange={props.handleWallet}
                                                        classes={{
                                                            switchBase: classes.colorSwitchBase,
                                                            checked: classes.colorChecked,
                                                            bar: classes.colorBar,
                                                        }}
                                                    />
                                                </div>
                                            </Wrapper>
                                            : ''}

                                        <div className="col-12  px-sm-0 px-lg-0">
                                            {/* {props.printCards()} */}

                                            {props.selectedCard ?
                                                // <div className="row">
                                                <div className="col-12">
                                                    {/* <RaisedButton
                                                        label={"Checkout"}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginTop: 0, width: "100%" }}
                                                        buttonStyle={fullWidthButtonStyleFill}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.checkOut(1)}
                                                    /> */}
                                                    {/* </div> */}
                                                </div> : ''
                                            }

                                            {props.printCards()}
                                            {props.selectedCard ?
                                                
                                                <div className="col-12">
                                                    <RaisedButton
                                                         label={props.couponBenifit ?
                                                            " PAY " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)-parseFloat(walletBalance)).toFixed(2))
                                                            : "Pay " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0) +parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginTop: 0, width: "100%" }}
                                                        buttonStyle={fullWidthButtonStyleFill}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.handleErrorWithMin(1)}
                                                    />
                                                   
                                                </div> : ''
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   :""}
                    {/* card tab content - end */}

                    {/* pay on delivery tab content - start */}
                    {deliveryCash == 1 ? 
                    <div className={`tab-pane fade ${deliveryCash == 1 ? "active show": "" } `} id="pod" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 py-3 mb-3">
                                    <img alt="get-money" title="get-money" width="60" className="mb-2" src="/static/images/get-money.png" />
                                    <h6 className="paymentTitleCo">Cash</h6>
                                    <p className="paymentDescCo py-2">Please keep exact change handy to help us serve you better</p>
                                    <div className="row">
                                        <div className="col-12 px-3 py-3" style={{ background: '#fff' }}>
                                            <div className="col p-0" >
                                                <div className="row">
                                                    {walletBalance > 0 ?
                                                        <Wrapper>
                                                            <div className="col-12 text-left">
                                                                <div className="row">
                                                                    <div className="col-6 text-left" >Wallet Balance </div>
                                                                    <div className="col-6 text-right" >{
                                                                        props.myCart && props.myCart.cart && props.myCart.cart.length > 0 ?
                                                                            props.myCart.cart[0].currencySymbol : ''}
                                                                        {walletBalance}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 text-left" style={{ lineHeight: '50px' }}>Include Wallet</div>
                                                            <div className="col-6 pr-0 text-right">
                                                                <Switch
                                                                    checked={props.includeWallet}
                                                                    onChange={props.handleWallet}
                                                                    classes={{
                                                                        switchBase: classes.colorSwitchBase,
                                                                        checked: classes.colorChecked,
                                                                        bar: classes.colorBar,
                                                                    }}
                                                                />
                                                            </div>
                                                        </Wrapper>
                                                        : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {
                                            // props.myCart.finalTotalIncludingTaxes ?

                                            props.includeWallet && (walletBalance < props.myCart.finalTotalIncludingTaxes) ?
                                                <div className="col-12 text-center">
                                                    <RaisedButton
                                                        label={props.couponBenifit ?
                                                            "Pay " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)-parseFloat(walletBalance)).toFixed(2))
                                                            : "Pay " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0) +parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginRight: 12, marginTop: 18 }}
                                                        buttonStyle={buttonStyleFill}
                                                        disabled={props.stopCheckout}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.handleErrorWithMin(2)}
                                                    />
                                                </div>
                                                :
                                                <div className="col-12 text-center">
                                                    <RaisedButton
                                                        label={props.couponBenifit ? "Pay " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)).toFixed(2)) : "Pay " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginRight: 12, marginTop: 18 }}
                                                        buttonStyle={buttonStyleFill}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.handleErrorWithMin(2)}
                                                    />
                                                </div>
                                            // : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 :""}
                 {/* pay on delivery tab content - end */}

                    {/* wallet tab content - start */}
                    <div className="tab-pane fade" id="wallet" role="tabpanel" aria-labelledby="pills-wallet-tab">
                        <div className="col-12">
                            <div className="row">
                                {/* <div className="col-12"> */}
                                <div className="col-12 px-3 px-sm-0 px-lg-0 px-xl-3">
                                    <div className="row">
                                        {/* <div className="col-12"> */}
                                        <div className="col-12 px-3 px-sm-0 px-lg-0 px-xl-3">
                                            <div className="row px-3 px-xl-0 align-items-center">
                                                <div className="col-12 col-md-12 col-xl-6">
                                                    <h5 className="mb-3 addPaymentCard">Wallet</h5>
                                                </div>
                                                <div className="col-6 text-right">

                                                    <RaisedButton
                                                        label="  Add Money   "
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={() => props.handleWalletSlider()}
                                                        style={{ marginTop: 1 }}
                                                        buttonStyle={buttonStyleOutline}
                                                        labelStyle={lableOutline}
                                                    />
                                                </div>
                                            </div>
                                            {/* {props.printCards()} */}
                                        </div>
                                        <div className="col-12 px-3 px-sm-3 px-lg-3 px-xl-3 mt-3">
                                            <div className="row">
                                                <div className="col-8 col-md-12 col-lg-12 col-xl-8">
                                                    <h5 className="mb-3 mb-md-1 addPaymentCard">Wallet Balance</h5>
                                                </div>
                                                <div className="col-4">
                                                    <p className="text-right mb-md-3 walletBalanceLarge">
                                                        {
                                                            props.myCart && props.myCart.cart && props.myCart.cart.length > 0 ?
                                                                props.myCart.cart[0].currencySymbol : ''}
                                                        {walletBalance}</p>
                                                </div>
                                            </div>
                                            {/* {props.printCards()} */}
                                        </div>
                                        {props.myCart.finalTotalIncludingTaxes ?

                                            walletBalance > props.myCart.finalTotalIncludingTaxes ?
                                                <div className="col-12 px-3 px-sm-3 px-lg-3 px-xl-3">
                                                    <RaisedButton
                                                        label={props.couponBenifit ?
                                                            " PAY " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0) +parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)).toFixed(2)) :
                                                            " PAY " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={() => props.handleErrorWithMin(3)}
                                                        style={{ marginTop: 1, width: "100%" }}
                                                        buttonStyle={buttonStyleFill}
                                                        labelStyle={lableFill}
                                                    />
                                                </div> : <div className="col-12 px-3 px-sm-3 px-lg-3 px-xl-3">
                                                    <p className="d-sm-none d-md-block d-lg-block d-xl-none d-none"><span>Amount: </span><b>{props.couponBenifit ?
                                                        props.myCart.cart[0].currencySymbol + "" + (parseFloat(props.getFloatSum(props.myCart.finalTotalIncludingTaxes, deliveryFeesTotal)).toFixed(2) - props.couponBenifit.discountAmount) :
                                                        props.myCart.cart[0].currencySymbol + "" + parseFloat(props.getFloatSum(props.myCart.finalTotalIncludingTaxes, deliveryFeesTotal)).toFixed(2)}</b></p>
                                                    <RaisedButton
                                                        label={props.couponBenifit ?
                                                            "ADD MONEY & PAY " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)).toFixed(2)) :
                                                            "ADD MONEY & PAY " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={() => props.handleWalletSlider()}
                                                        style={{ marginTop: 1, width: "100%" }}
                                                        buttonStyle={buttonStyleFill}
                                                        labelStyle={lableFill}
                                                    />
                                                </div>

                                            : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* wallet tab content - end */}

                    {/* quick card tab content - start */}
                    <div className="tab-pane fade" id="quickcard" role="tabpanel" aria-labelledby="pills-contact-tab">
                        {props.showIframe ?
                            <div className="col-12 py-3 mb-3">
                                <iframe width="500" height="300" src={props.appConfig.quickCardCustomer.baseUrl + "/oauth/authorize?client_id=" + props.appConfig.quickCardCustomer.clientId + "&redirect_uri=https://www.google.co.in&state=website"}></iframe>
                            </div> :
                            <div className="col-12  border text-center py-3 mb-3">
                                <img src="/static/icons/EmptyScreens/EmptyCard.imageset/card@3x.png" width='60' className="mb-2" height='80' />
                                <div className="row text-center">
                                    <div className="col-12 py-2">
                                        {props.appConfig && props.appConfig.quickCardCustomer && props.appConfig.quickCardCustomer.baseUrl ?
                                            <RaisedButton
                                                label="  Link Card   "
                                                disableTouchRipple={true}
                                                disableFocusRipple={true}
                                                primary={true}
                                                href={props.appConfig.quickCardCustomer.baseUrl + "/oauth/authorize?client_id=" + props.appConfig.quickCardCustomer.clientId + "&redirect_uri=http://localhost:3000/checkout&state=website"}
                                                target="_blank"
                                                // onClick={props.showIframe}
                                                style={{ marginTop: 18 }}
                                                buttonStyle={buttonStyleFill}
                                                labelStyle={lableFill}
                                            />
                                            : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    {/* quick card tab content - end */}
                </div>
            </div>
        </div>
    )
    return (

     props.DPO==true  ?
            <Stepper
                activeStep={stepIndex}
                linear={false}
                orientation="vertical"
                connector={<div style={divider} />}
            >
 <Step style={{ background: '#fff', boxShadow: "0 2px 8px #d4d5d9" }}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={thirdIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(0)}>
                        <div className="row">
                            <div className="col-12 px-0">
                                {stepIndex == 0 ? <h3 className="accountHeaderActive">Order Type</h3> : <h3 className="accountHeader">Order Type</h3>}
                            </div>
                        </div>
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 0px dashed rgb(189, 189, 189)' }}>
                       
                    <div className="panel-body">
                                        <div className="form-row justify-content-center mb-3">
                                            <div className="col-lg-3 col-md-3 col-sm-4">
                                                <button
                                                    className="btn btn-default ordersBtn  rounded fnt12 py-1" onClick={props.handleNext}>Delivery</button>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-4">
                                                <button
                                                    className="btn btn-default add-new-btn  rounded py-1" onClick={()=>props.handleSelectPickUp(false,2)} >Pickup</button>
                                                    {/* onClick={()=>props.handleSelectPickUp()} */}
                                            </div>
                                        </div>
                                        <p className="mb-0 fnt12 text-center fntWght500 baseClr customTxtShadow">Select how
                                            do want to get your order</p>
                                    </div>
                    </StepContent>
                </Step>
              {!props.pickUp ?
                <Step style={{ background: '#fff', minHeight: '140px', boxShadow: "0 2px 8px #d4d5d9" }} disabled={props.hideAddress}>
                     <StepButton disableTouchRipple={true} style={stepButtonStyle} icon={firstIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(1)}>
                        {stepIndex == 1 ? <h3 className="accountHeaderActive">Choose a delivery address</h3> :
                            <div className="row text-left" onClick={() => props.setStepIndex(1)} style={{ marginTop: '50px', width: '100%' }}>
                               
                                <div className="col-10 p-0" >
                                    <a>
                                        <h3 className="accountHeader">Delivery address {props.selectedAddress ? <span className="sucTick"><i className="fa fa-check-circle" aria-hidden="true"></i></span> :""}</h3>
                                    </a>
                                </div>
                               
                              {props.selectedAddress ?
                                <div className="col-2 pt-3 text-center">
                                    <a className="stepChangeLnk">Change</a>
                                </div>
                                :""}
                                <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                                    {props.selectedAddress ? <div className="text-muted"> <p style={{ textTransform: 'capitalize', fontWeight: '700', margin: "5px auto" }}>{props.selectedAddress.taggedAs}</p> {props.selectedAddress.addLine1} </div>  : ''}
                                    {/* : props.deliveryType != 2 ? <p style={{ fontWeight: '500', color: '#ff0000' }}> Delivery Address Required**</p> */}
                                </div>
                            </div>}
                    </StepButton>
                    <StepContent style={{ padding: '35px 40px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
                   {/* <div className="d-flex" style={{justifyContent:"space-between",alignItems:"center"}}>
                    <div className="savedAddress">
                                <p>Saved Address</p>
                           </div>
                           <div className="button_">
                           <RaisedButton
                                                label="+ Address"
                                                disableTouchRipple={true}
                                                disableFocusRipple={true}
                                                primary={true}
                                                onClick={props.opendrawer}
                                                style={{ marginRight: 12, marginTop: 0, float: 'left' }}
                                                buttonStyle={buttonStyleOutline}
                                                labelStyle={lableOutline}
                                            />
                           </div>
                           </div> */}
                           <div className="row justify-content-between align-items-center mb-3 mx-1">
                                            <div className="col-auto">
                                                <div className="fnt12 fntWght500 baseClr">Saved Address</div>
                                            </div>
                                            <div className="col-auto py-1"
                                                style={{border:" 1px solid #06FFFF",borderRadius: "20px",cursor:"pointer"}}>
                                                <div className="fnt10 fntWght500 baseClr" onClick={props.opendrawer}>+ Address</div>
                                            </div>
                                        </div>
                        <div className="row">
                          
                            {/* <div className="col-6">
                                <div className="addNewnDeliverInner p-xl-3 p-lg-3 border">
                                    <div className="row">
                                        <div className="col-auto pr-0 homeAddressIconLayout">
                                            <img src="/static/images/new_imgs/pin.svg" style={{ height: "20px", marginTop: "6px" }} />
                                            
                                        </div>
                                        <div className="col pt-1 homeAddressInitialLayout">
                                            <div style={{ fontSize: '15px', fontWeight: '500', textAlign: 'left', textTransform: 'capitalize', letterSpacing: '0.3px', marginBottom: '10px' }}>Add new Address</div>
                                            <p className="addressBox" style={{ marginBottom: "1px" }}>{props.currentAddress}</p>
                                            <RaisedButton
                                                label="ADD NEW"
                                                disableTouchRipple={true}
                                                disableFocusRipple={true}
                                                primary={true}
                                                onClick={props.opendrawer}
                                                style={{ marginRight: 12, marginTop: 0, float: 'left' }}
                                                buttonStyle={buttonStyleOutline}
                                                labelStyle={lableOutline}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <AddressList addressList={props.addressList} selectAddressCheck={props.selectAddressCheck} selectAddress={props.selectAddress} isCheckout={true}
                                handleEditAdrSliderOpen={props.handleEditAdrSliderOpen} deleteAddress={props.deleteAddress} />
<div className="col-12">
<div className="addNewSec" style={{left: "15px",bottom: "15px"}}>
                                            <button className="btn btn-default add-new-btn" onClick={ props.selectedAddress && props.selectedAddress.addLine1 &&props.selectedAddress.addLine1.length > 0 ? props.handleNext:""}>Next</button>
                                        </div>
                                        </div>
                            {/* // dashed-box */}
                        </div>
                    </StepContent>
                </Step>
  : ""}
                
                {!props.pickUp ? 
                <Step style={{ background: '#fff', minHeight: '120px', boxShadow: "0 2px 8px #d4d5d9" }} >
                     {/* disabled={ !props.selectedAddress} */}
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={secondIcon} disabled={ !props.selectedAddress} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(2)}>
                        {( stepIndex == 2) ? <h3 className="accountHeaderActive">Select Order time</h3> :
                            <div className="row text-left" style={{ marginTop: '50px', width: '100%' }}>
                                <div className="col-10 p-0">
                                    <h3 className="accountHeader">Order time  {stepIndex > 1 ? <span className="sucTick"><i className="fa fa-check-circle" aria-hidden="true"></i></span> : ''}</h3>
                                </div>
                                <div className="col-2 pt-3 text-center">
                                    {props.selectedAddress ? <a className="stepChangeLnk" onClick={() => props.setStepIndex(2)} >Change</a> : ''}
                                </div>
                                <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                                    {props.bookingType == 2 ?
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700', color: "#333" }}>Order Later</span>
                                            <br /> {props.bookingDate + ",  Time:" + props.bookingTime} </p> :
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700', color: '#333' }}>Order Now</span>
                                            <br /> {props.bookingDate} </p>
                                    }
                                </div>
                            </div>}
                    </StepButton>
                    <StepContent style={{ padding: '15px 45px 15px', marginLeft: '-9px', marginTop: '-13px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
                       
                        {orderTimeStepContent}
                    </StepContent>
                </Step>
:<Step style={{ background: '#fff', minHeight: '120px', boxShadow: "0 2px 8px #d4d5d9" }} disabled={props.selectedAddress}>
<StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={secondIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(1)}>


    {stepIndex == 1 ? <h3 className="accountHeaderActive">Order time</h3> :
        <div className="row text-left" style={{ marginTop: '50px', width: '100%' }}>
            <div className="col-10 p-0">
                <h3 className="accountHeader">Order time</h3>
            </div>
            <div className="col-2 pt-3 text-center">
                <a className="stepChangeLnk" onClick={() => props.setStepIndex(1)} >Change</a>
            </div>
            <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                {props.bookingType == 2 ?
                    <p className="text-muted">
                        <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>Order Later</span>
                        <br /> {props.bookingDate + ",  Time:" + props.bookingTime} </p> :
                    <p className="text-muted">
                        <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>Order Now</span>
                        <br /> {props.bookingDate} </p>
                }
            </div>
        </div>}

</StepButton>
<StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-12px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
    {orderTimeStepContent}
</StepContent>
</Step>}
                <Step style={{ background: '#fff', boxShadow: "0 2px 8px #d4d5d9" }} disabled={!props.selectedAddress}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={thirdIcon} iconContainerStyle={iconBoxStyle} onClick={props.pickUp ?()=>props.setStepIndex(2):() => props.setStepIndex(3)}>
                        <div className="row">
                            <div className="col-12 px-0">
                                {(props.pickUp ?stepIndex == 2: stepIndex == 3) ? <h3 className="accountHeaderActive">Choose Payment Method</h3> : <h3 className="accountHeader">Payment</h3>}
                            </div>
                        </div>
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 0px dashed rgb(189, 189, 189)' }}>
                        {paymentStepContent}
                        {/* {props.renderStepActions(1)} */}
                    </StepContent>
                </Step>
         
            </Stepper>

            :

            <Stepper
                activeStep={pickupStepIndex}
                linear={false}
                orientation="vertical"
                connector={<div style={divider} />}
            >
 <Step style={{ background: '#fff', boxShadow: "0 2px 8px #d4d5d9" }}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={thirdIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setPickupStepIndex(0)}>
                        <div className="row">
                            <div className="col-12 px-0">
                                {pickupStepIndex == 0 ? <h3 className="accountHeaderActive">Order Type</h3> : <h3 className="accountHeader">Order Type</h3>}
                            </div>
                        </div>
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 0px dashed rgb(189, 189, 189)' }}>
                       
                    <div className="panel-body">
                                        <div className="form-row justify-content-center mb-3">
                                            <div className="col-lg-3 col-md-3 col-sm-4">
                                                <button
                                                    className="btn btn-default ordersBtn  rounded fnt12 py-1" onClick={(e)=>props.handleSelectPickUp(true,1)}>Delivery</button>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-4">
                                                <button
                                                    className="btn btn-default add-new-btn  rounded py-1" onClick={()=>props.handleSelectPickUp(false,2)} >Pickup</button>
                                                    {/* onClick={()=>props.handleSelectPickUp()} */}
                                            </div>
                                        </div>
                                        <p className="mb-0 fnt12 text-center fntWght500 baseClr customTxtShadow">Select how
                                            do want to get your order</p>
                                    </div>
                    </StepContent>
                </Step>
                <Step style={{ background: '#fff', minHeight: '120px', boxShadow: "0 2px 8px #d4d5d9" }} disabled={!props.selectedAddress}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={secondIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setPickupStepIndex(1)}>


                        {pickupStepIndex == 1 ? <h3 className="accountHeaderActive">Order time</h3> :
                            <div className="row text-left" style={{ marginTop: '50px', width: '100%' }}>
                                <div className="col-10 p-0">
                                    <h3 className="accountHeader">Order time</h3>
                                </div>
                                <div className="col-2 pt-3 text-center">
                                    <a className="stepChangeLnk" onClick={() => props.setPickupStepIndex(1)} >Change</a>
                                </div>
                                <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                                    {props.bookingType == 2 ?
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>Order Later</span>
                                            <br /> {props.bookingDate + ",  Time:" + props.bookingTime} </p> :
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>Order Now</span>
                                            <br /> {props.bookingDate} </p>
                                    }
                                </div>
                            </div>}

                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-12px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
                        {orderTimeStepContent}
                    </StepContent>
                </Step>

                <Step style={{ background: '#fff', boxShadow: "0 2px 8px #d4d5d9" }}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={thirdIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setPickupStepIndex(1)}>
                        <div className="row">
                            <div className="col-12 px-0">
                                {stepIndex == 1 ? <h3 className="accountHeaderActive">Payment</h3> : <h3 className="accountHeader">Payment</h3>}
                            </div>
                        </div>
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 0px dashed rgb(189, 189, 189)' }}>
                        {paymentStepContent}
                        {/* {props.renderStepActions(1)} */}
                    </StepContent>
                </Step>
            </Stepper>
    )
}

export default withStyles(styles)(CheckoutStepper)