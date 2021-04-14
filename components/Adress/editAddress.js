// absolute imports
import React from "react";
import TextField from "material-ui/TextField";
import GoogleMapReact from "google-map-react";
import { FontIcon, IconButton } from "material-ui";
import RaisedButton from "material-ui/RaisedButton";
// relative imports
import CustomSlider from "../ui/sliders/customSlider";
import LocationSearchInput from "../location/map";
import MapMarker from "../location/marker";
import { addAddress, getAddress, patchAddress } from "../../services/address";
import { BASE_COLOR } from "../../lib/envariables";
import LanguageWrapper from "../../hoc/language";
import { lang } from "moment";
const officeIconActive = (
  <FontIcon className="material-icons">
    {" "}
    <i
      className="fa fa-building activeCustomFaComm checkoutcustomFaComm"
      aria-hidden="true"
    ></i>
  </FontIcon>
);
const officeIcon = (
  <FontIcon className="material-icons">
    {" "}
    <i className="fa fa-building" aria-hidden="true"></i>
  </FontIcon>
);

const homeIconActive = (
  <FontIcon className="material-icons">
    {" "}
    <i
      className="fa fa-home activeCustomFaComm checkoutcustomFaComm"
      aria-hidden="true"
    ></i>
  </FontIcon>
);
const homeIcon = (
  <FontIcon className="material-icons">
    {" "}
    <i className="fa fa-home" aria-hidden="true"></i>
  </FontIcon>
);

const button = {
  root: {
    color: "#fff !important",
    border: "1px solid #999",
    background: "#fff",
    height: "46px",
    width: "178px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#333",
    margin: "0px 18px"
  },
  overlayStyle: {
    height: "46px",
    padding: "5px"
  }
};
const buttonActive = {
  root: {
    color: "#fff !important",
    border: "1px solid #444",
    background: "#444",
    height: "46px",
    width: "178px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#fff",
    margin: "0px 18px"
  },
  overlayStyle: {
    height: "46px",
    padding: "5px"
  }
};

class EditAddressSlider extends React.Component {
  state = {
    stepIndex: 0,
    open: false,
    SliderWidth: 450,
    address: "",
    flatNumber: "",
    landmark: "",
    home: this.props.home,
    office: this.props.office,
    taggedAs: "home",
    draggable: true,
    zoom: 15,
    lat: "",
    lng: ""
  };

  constructor(props) {
    super(props);
    this.saveAddressHandler = this.saveAddressHandler.bind(this);
    // this.LocationRef = this.LocationRef.bind(this)
  }

  onCircleInteraction = (childKey, childProps, mouse) => {
    // function is just a stub to test callback
    this.setState({
      draggable: false
    });
    let data = {
      lat: mouse.lat,
      lng: mouse.lng
    };
    this.props.updateCoords(data);
  };

  onCircleInteraction3 = (childKey, childProps, mouse) => {
    // function is just a stub to test callback
    this.setState({
      draggable: true
    });
  };

  _onChange = ({ center, zoom }) => {
    this.setState({ zoom: zoom });
    this.getAddress(center.lat, center.lng);
  };

  getAddress = (lat, lng) => {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    let data = {
      lat: lat,
      lng: lng
    };

    geocoder.geocode({ latLng: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        data["address"] = results[0].formatted_address;
        this.props.updateLocation(data);
        // this.child.handleChange(results[0].formatted_address);
      }
    });
  };

  printMap(center) {
    return (
      <GoogleMapReact
        panControl={false}
        onChange={this._onChange}
        draggable={this.state.draggable}
        streetViewControl={false}
        fullscreenControl={false}
        resetBoundsOnResize={true}
        zoom={this.state.zoom}
        bootstrapURLKeys={{ key: "AIzaSyBJ2LWIMnZNdsoYmUREgbN_4VEksPnoW8w" }}
        defaultCenter={{
          lat: parseFloat(center.lat),
          lng: parseFloat(center.lng)
        }}
        defaultZoom={this.state.zoom}
        onChildClick={() => console.log("child click")}
        onChildMouseDown={(childKey, childProps, mouse) =>
          this.onCircleInteraction(childKey, childProps, mouse)
        }
        onChildMouseUp={(childKey, childProps, mouse) =>
          this.onCircleInteraction3(childKey, childProps, mouse)
        }
        onChildMouseMove={(childKey, childProps, mouse) =>
          this.onCircleInteraction(childKey, childProps, mouse)
        }
        onClick={() => console.log("mapClick")}
        center={{ lat: parseFloat(center.lat), lng: parseFloat(center.lng) }}
        zoom={this.state.zoom}
      >
        <MapMarker
          lat={parseFloat(center.lat)}
          lng={parseFloat(center.lng)}
          text={"Me"}
        />
      </GoogleMapReact>
    );
  }

  inputForm(data) {
    return (
      <TextField
        type="text"
        floatingLabelText={data.label}
        floatingLabelFocusStyle={{
          color: BASE_COLOR,
          transform: "scale(0.75) translate(0px, -20px)"
        }}
        floatingLabelShrinkStyle={{
          transform: "scale(0.75) translate(0px, -10px)"
        }}
        floatingLabelStyle={{
          top: "12px",
          transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
        }}
        inputStyle={{ marginTop: "3px", marginLeft: "5px" }}
        style={{ height: "50px" }}
        underlineShow={false}
        margin="normal"
        value={data.value}
        onChange={data.onChange}
        autoComplete="off"
      />
    );
  }

  saveAddressHandler() {
    let splitAdd = null;
    let country = null;
    let state = null;

    let city = null;
    let data = {};

    if (this.props.center && this.props.center.place) {
      splitAdd = this.props.center.place.split(",");
      country = splitAdd[splitAdd.length - 1];
      state = splitAdd[splitAdd.length - 2];

      city = splitAdd[splitAdd.length - 3];

      data = {
        addressId: this.state.adrId,
        addLine1: this.props.center.place,
        country: country,
        city: city,
        state: state,
        latitude: this.props.center.lat,
        longitude: this.props.center.lng
      };
    } else {
      data = {
        addressId: this.state.selAddress._id,
        addLine1: this.state.selAddress.addLine1,
        country: this.state.selAddress.country,
        city: this.state.selAddress.city,
        state: this.state.selAddress.state,
        latitude: this.state.selAddress.latitude,
        longitude: this.state.selAddress.longitude
      };
    }
    this.props.taggedAs
      ? (data["taggedAs"] = this.props.taggedAs)
      : (data["taggedAs"] = this.state.selAddress.taggedAs);
    this.state.flatNumber
      ? (data["flatNumber"] = this.state.flatNumber)
      : (data["flatNumber"] = this.state.selAddress.flatNumber);
    this.state.landmark
      ? (data["landmark"] = this.state.landmark)
      : (data["landmark"] = this.state.selAddress.landmark);

    patchAddress(data).then(({ data }) => {
      console.log("sdsadasd", data);
      data.error
        ? ""
        : (this.props.updateAdress(data.data),
          this.clearAddressForm(),
          this.closeDrawer());
    });
  }

  clearAddressForm() {
    this.setState({
      home: false,
      office: false,
      landmark: "",
      flatNumber: ""
    });
    this.props.clearAddressForm();
    // this.LocationRef.clearState()
    this.props.getGeoLocation();
  }

  createMapOptions = maps => {
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [
        {
          stylers: [
            { saturation: -100 },
            { gamma: 0.8 },
            { lightness: 4 },
            { visibility: "on" }
          ]
        }
      ]
    };
  };

  closeDrawer = () => {
    this.CustomRef.handleLeftSliderClose();
    this.clearAddressForm();
  };
  handleClose = () => {
    this.setState({ SliderWidth: 0 });
  };
  updateLandMark = e => {
    this.setState({ landmark: e.target.value });
  };
  updateFlatNo = e => {
    this.setState({ flatNumber: e.target.value });
  };

  handleLeftSliderToggle = async (address, isMobile) => {
    let width = isMobile ? "100%" : 450;
    await setTimeout(() => {
      this.setState({
        SliderWidth: width,
        selAddress: address,
        address: address.addLine1,
        flatNumber: this.props.addressDetail.flatNumber,
        landmark: this.props.addressDetail.landmark,
        adrId: this.props.addressDetail._id,
        taggedAs: this.props.addressDetail.taggedAs
      });
      this.CustomRef.handleLeftSliderToggle();
    }, 100);
  };

  handleLeftSliderToggleForMobile = () => {
    this.setState({ SliderWidth: "100%" });
    this.CustomRef.handleLeftSliderToggle();
  };
  componentDidMount() {
    // passing ref to parent to call children functions
    this.props.onRef(this);
  }

  render() {
    let lang = this.props.lang;
    let homeSelectButton;
    let officeSlectButton;
    let othersSelectButton;
    const { home, office, others } = this.props;

    const { taggedAs } = this.state;

    (taggedAs == "home" || home == true) && office == false && others == false
      ? (homeSelectButton = "active")
      : (homeSelectButton = "");
    (taggedAs == "office" || office == true) && others == false && home == false
      ? (officeSlectButton = "active")
      : (officeSlectButton = "");
    (taggedAs == "others" || others == true) && office == false && home == false
      ? (othersSelectButton = "active")
      : (othersSelectButton = "");

    return (
      <CustomSlider
        onRef={ref => (this.CustomRef = ref)}
        width={this.state.SliderWidth}
        handleClose={this.handleClose}>
        
        <div className="col-12 pt-3 text-right"
          style={{
            position: "sticky",
            zIndex: "9",
            top: "0px",
            background: "#fff",
          }}>
          <button
              style={{"fontSize":"16px","fontWeight" : "300","height": "20px","width":"20px","background":"red","borderRadius" : "50%","color":"white"}}
              type="button"
              className="close"
              onClick={this.closeDrawer}
            >&times;
          </button>
        </div>

        <div className="col-12 px-3 px-sm-5">
          {/* <div
            className="col-12 py-3 px-1"
            style={{
              position: "sticky",
              zIndex: "9",
              top: "0px",
              background: "#fff",
              borderBottom: "1px solid #eee"
            }}>
            <div className="col-12">
              <div className="row align-items-center">
                <div className="col-10 px-0 text-left">
                  <h6 className="innerPage-heading lineSetter">
                    {lang.editDeliveryAdd || " Edit Delivery Address"}
                  </h6>
                </div>
                <div className="col-2 pt-1 pl-0 text-right">
                  <button
                    type="button"
                    className="close"
                    onClick={this.closeDrawer}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="col-12 addNewAddressModalBtSec">
            <div
              className="row pb-4 pt-2"
              style={{
                position: "sticky",
                zIndex: "9",
                top: "0px",
                background: "#fff",
                borderBottom: "1px solid #eee"
              }}>
                <div className="col-10 px-0 text-left">
                  <h6 className="innerPage-heading lineSetter">
                    {lang.editDeliveryAdd || " Edit Delivery Address"}
                  </h6>
                </div>
            </div>
            <div className="row" style={{ marginTop: "0px",marginBottom: "15px" }}>
              <div
                style={{ height: "200px", width: "100%",borderRadius:"10px","padding":0,"overflow":"hidden" }}>
                {/* <img src="/static/icons/save_address.png" width="250" /> */}
                {this.printMap(this.props.center)}
              </div>
              <div className="col-12 p-0 check-out-address addressBar">
                <LocationSearchInput
                  address={this.state.address}
                  updateLocation={this.props.updateLocation}
                  onRef={ref => (this.LocationRef = ref)}
                  inputClassName="form-control form-control-liteGrey1 mb-3 mt-3 overflow-ellipsis"
                />
              </div>
              {/* <div className="col-12">
                <div className="outline-box">
                  {this.inputForm({
                    label: lang.door || "Door / Flat no.",
                    value: this.state.flatNumber,
                    onChange: this.updateFlatNo
                  })}
                </div>
              </div> */}

              <div className=" col-12 p-0 addressBar check-out-address d-flex " style={{paddingBottom: "5px"}}>
                <div className="col-6"  style={{"paddingLeft": "0px"}}>
                    <input type="text"
                        className="form-control form-control-liteGrey1 fnt10 bgCustomrLightGrey mb-2"
                        value={this.state.flatNumber}  onChange={this.updateFlatNo} placeholder="Door / Flat no."/>
                </div>
                <div className="col-6"  style={{"paddingRight": "0px"}}>
                    <input type="text"
                        className="form-control form-control-liteGrey1 fnt10 bgCustomrLightGrey mb-2"
                        value={this.state.landmark}  onChange={this.updateLandMark} placeholder="Landmark"/>
                </div>
              </div>

              {/* <div className="col-12" style={{marginTop:"10px"}}>
                <div
                  className="outline-box"
                  style={{ marginTop: "0px", borderTop: "0px" }}>
                  {this.inputForm({
                    label: lang.landMark || "Landmark",
                    value: this.state.landmark,
                    onChange: this.updateLandMark
                  })}
                </div>
              </div> */}

            <div className="col-12 p-0 pt-2">
              <div className="form-row mb-3">
                <div className="col">
                    <div className="switch" style={{"height":"36px"}}>
                        <input type="radio" name="placeCat"  onClick={() => this.props.updateTaggedAs("home")} checked={homeSelectButton == "active" ? true : false}/>
                        <label > <i className="fa fa-home" style={{"paddingTop":"9px"}}></i>&nbsp; Home</label>
                    </div>
                </div>
                <div className="col">
                    <div className="switch" style={{"height":"36px"}}>
                        <input type="radio" name="placeCat" onClick={() => this.props.updateTaggedAs("office")} checked={officeSlectButton == "active" ? true : false}/>
                        <label> <i class="fa fa-briefcase" style={{"paddingTop":"9px"}}></i>&nbsp; Work</label>
                    </div>
                </div>
                <div className="col">
                    <div className="switch" style={{"height":"36px"}}>
                        <input type="radio" name="placeCat" onClick={() => this.props.updateTaggedAs("others")} checked={othersSelectButton == "active" ? true : false}/>
                        <label> <i class="fa fa-map-marker" style={{"paddingTop":"9px"}}></i>&nbsp; Other</label>
                    </div>
                </div>
              </div>
            </div>

              {/* <div className="col-12 addAddressLandMarkSec" style={{marginTop:"10px"}}>
                <div
                  className="outline-box"
                  style={{ marginTop: "0px", borderTop: "0px" }}>
                  <div className="row">
                    <div className="col-4 text-center addAddressLandMark">
                      <a
                        className={homeSelectButton}
                        onClick={() => this.props.updateTaggedAs("home")}>
                        <i className="fa fa-home"></i>
                        <span className="addAddressLandMark">
                          {lang.home || "Home"}
                        </span>
                      </a>
                    </div>
                    <div className="col-4 text-center border-left border-right addAddressLandMark">
                      <a
                        className={officeSlectButton}
                        onClick={() => this.props.updateTaggedAs("office")}>
                        <i className="fa fa-briefcase"></i>
                        <span className="addAddressLandMark">
                          {lang.work || "Work"}
                        </span>
                      </a>
                    </div>
                    <div className="col-4 text-center addAddressLandMark">
                      <a
                        className={othersSelectButton}
                        onClick={() => this.props.updateTaggedAs("others")}>
                        <i className="fa fa-map-pin"></i>
                        <span className="addAddressLandMark">
                          {lang.other || "Other"}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="col-12 mt-2 pt-0">
                              <div className="row">
                                  <div className="col-6 pr-1">
                                      <RaisedButton
                                          label="Home"
                                          labelPosition="after"
                                          primary={true}
                                          onClick={() => this.props.updateTaggedAs('home')}
                                          icon={homeIcon}
                                          buttonStyle={homeSelectButton.root}
                                          labelStyle={homeSelectButton.label}
                                          overlayStyle={homeSelectButton.overlayStyle}
                                      />
                                  </div>
                                  <div className="col-6 pl-1">
                                      <RaisedButton
                                          label="Office"
                                          labelPosition="after"
                                          primary={true}
                                          onClick={() => this.props.updateTaggedAs('office')}
                                          icon={officeIcon}
                                          buttonStyle={officeSlectButton.root}
                                          labelStyle={officeSlectButton.label}
                                          overlayStyle={officeSlectButton.overlayStyle}
                                      />
                                  </div>
                              </div>
                          </div> */}
              <div className="col-12 p-0" style={{marginBottom:"10px"}}>
                <button
                  onClick={this.saveAddressHandler}
                  type="submit"
                  className="btn btn-default add-new-btn w-100 rounded py-2"
                >
                  {lang.updateAddres || "UPDATE ADDRESS"}
                </button>
              </div>

              {/* <div className="col-12 pt-0">
                <button
                  onClick={this.saveAddressHandler}
                  type="submit"
                  className="btn loginAndSignUpButton"
                  style={{margin: "10px 0px"}}>
                  {lang.updateAddres || "UPDATE ADDRESS"}
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </CustomSlider>
    );
  }
}

export default LanguageWrapper(EditAddressSlider);
