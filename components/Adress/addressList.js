import React, { useContext } from "react";
import { BASE_COLOR, BLUE_BASE_COLOR } from "../../lib/envariables";
import languageContext from "../../context/languageContext";
const AddressList = props => {
  const { lang } = useContext(languageContext);
  return props.addressList
    ? props.addressList.map((addressDetail, index) => {
      let classesNames = props.selectAddressCheck && props.selectAddressCheck._id == addressDetail._id ? "addNewnDeliverInner p-sm-3 p-xl-3 p-lg-3 addressCardBgW addressCardBgWActive" : "addNewnDeliverInner p-sm-3 p-xl-3 p-lg-3 addressCardBgW"; 
      return(
        <div
          key={"addressDetail" + index}
          onClick={event =>
            props.selectAddress
              ? props.selectAddress(addressDetail, event)
              : console.log("")
          }
          className="col-6"
        >
          <div className={classesNames}>
            <div className="row">
             
              <div className="col pt-1 homeAddressInitialLayout">
               <div className="d-flex" style={{justifyContent:"space-between",alignItems:"center"}}>
                 <div style={{display:"flex",alignItems:"center"}}>
               <div className="col-auto p-0 homeAddressIconLayout">
                {addressDetail.taggedAs == "home" ? (
                  <i className="fa fa-home"></i>
                ) : (
                  <i
                    className="fa fa-briefcase"
                    style={{ fontSize: "16px", marginTop: "3px" }}
                  ></i>
                )}
              </div>

                <h6 className="homeAddressInitial">{addressDetail.taggedAs}</h6>
                </div>
                <div className="">
                <a
                    className="addressEditAndDeleteButton"
                    onClick={event =>
                      props.handleEditAdrSliderOpen(event, addressDetail)
                    }
                  >
                    <span >
                    <button
                                                                        class="btn btn-default ordersBtn">Edit</button>
                    </span>
                  </a>
                  <a
                    className="addressEditAndDeleteButton"
                    onClick={event => props.deleteAddress(event, addressDetail)}
                  >
                    <span style={{ color: "#e94125" }}>
                    <button class="btn btn-default binBtn">
                                                                        <img src="/static/images/grocer/bin.svg" width="12"
                                                                            alt=""/>
                                                                    </button>
                    </span>
                  </a>
                  </div>
                  </div>
                <p className="addressBox">
                  {addressDetail.flatNumber}{" "}
                  {addressDetail.flatNumber.length > 0 ? ", " : ""}
                  {addressDetail.addLine1}
                  {/* {addressDetail.addLine2} */}
                  <br />
                  {/* <br /> */}
                  {addressDetail.landmark &&
                  addressDetail.landmark.length > 0 ? (
                    <span>
                      <span>Landmark:</span> {addressDetail.landmark}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                {/* <div className="editDeleteButtonLayout">
                  <a
                    className="addressEditAndDeleteButton"
                    onClick={event =>
                      props.handleEditAdrSliderOpen(event, addressDetail)
                    }
                  >
                    <span style={{ color: BLUE_BASE_COLOR }}>
                      {lang.edit || "edit"}
                    </span>
                  </a>
                  <a
                    className="addressEditAndDeleteButton"
                    onClick={event => props.deleteAddress(event, addressDetail)}
                  >
                    <span style={{ color: "#e94125" }}>
                      {lang.delete || "delete"}
                    </span>
                  </a>
                  {props.isCheckout ? (
                    <a
                      className="addressEditAndDeleteButton"
                      onClick={event =>
                        props.selectAddress
                          ? props.selectAddress(addressDetail, event)
                          : console.log("")
                      }
                    >
                      <span style={{ color: BASE_COLOR }}>
                        {lang.deliverHear || "deliver here "}
                      </span>
                    </a>
                  ) : (
                    ""
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )})
    : "";
};

export default AddressList;
