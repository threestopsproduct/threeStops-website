import React, { Component } from "react";
import * as enVariables from "../../lib/envariables";
import { getCookie } from "../../lib/session";
import {appConfig} from "../../services/auth"
class  Footer extends Component {
    state={
        footerData :""
    }
  componentDidMount(){
    appConfig().then(data=>{
        // console.log(data.data.data,"appConfig")
        this.setState({footerData:data.data.data})
    })
  }
 render(){
    const { locale } = this.props;
    const lang = this.props.selectedLang || "en";
    let data =this.state.footerData &&this.state.footerData.contactUs &&this.state.footerData.contactUs&&this.state.footerData.contactUs.length > 0?this.state.footerData.contactUs:""
    console.log(data,"appConfig")
    return (
        <>
        <div className="row" style={{paddingTop:"30px",paddingBottom:"30px",background:"#d5e2e9 "}}>
        <div className="container">
            <div className="row justify-content-between">
            <div className="col-md-4 col-lg-auto mb-4 mb-md-0">
                    <div className="row justify-content-center justify-content-md-start">
                        <div className="col-auto pr-0">
                            <img src="/static/images/loopz/Archive 3/Group 8700.png" width="70" height="70" alt="" />
                        </div>
                        <div className="col col-sm-auto col-md col-lg-auto">
                            <h6 className="h6Title baseClr">Save time</h6>
                            <p className="fnt13 lightGreyClr mb-0 w190">Receive your market in less than 1 hour.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-lg-auto mb-4 mb-md-0">
                    <div className="row justify-content-center justify-content-md-start">
                        <div className="col-auto pr-0">
                            <img src="/static/images/loopz/Archive 3/Group 8699.png" width="70" height="70" alt="" />
                        </div>
                        <div className="col col-sm-auto col-md col-lg-auto">
                            <h6 className="h6Title baseClr">In expert hands</h6>
                            <p className="fnt13 lightGreyClr mb-0 w190">A shopper selects your products with love.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-lg-auto">
                    <div className="row justify-content-center justify-content-md-start">
                        <div className="col-auto pr-0">
                            <img src="/static/images/loopz/Archive 3/Group 8698.png" width="70" height="70" alt="" />
                        </div>
                        <div className="col col-sm-auto col-md col-lg-auto">
                            <h6 className="h6Title baseClr">100% quality</h6>
                            <p className="fnt13 lightGreyClr mb-0 w190">If you do not like the status of a product, you
                                do
                                not pay for it!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div className="col-12 py-4 py-lg-5 op9 footerSec">
            <div className="row">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-6 col-md-3 col-lg-auto mb-3 mb-md-0 order-1 order-md-1">
                            <h4 className="whiteClr mb-3">Threestops</h4>
                            <div className="fnt11 whiteClr mb-3">{ data &&data[0] &&data[0].address}</div>
                            {/* <h6 className="h6Title whiteClr fnt13">Call -{data &&data[0] &&data[0].phone}</h6> */}
                            <div className="fnt11 whiteClr pt-2">support@threestops.com</div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 col-xl-3 order-3 order-md-2">
                            <div className="row justify-content-lg-between justify-content-md-around">
                                <div className="col-6 col-md-auto">
                                    <h6 className="h6Title whiteClr fnt14 mb-3">Useful Links</h6>
                                    <ul className="nav flex-column footerUL">
                                        <li className="nav-item">
                                            <a className="nav-link" href={"/about?lang=" + lang}>About Us</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href={"/faq?lang=" + lang}>FAQ</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href={"/terms?lang=" + lang}>Terms & Conditions</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href={"/privacy?lang=" + lang}>Privacy Policy</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-6 col-md-auto">
                                    <h6 className="h6Title whiteClr fnt14 mb-3 invisible">Useful Links</h6>
                                    <ul className="nav flex-column footerUL">
                                        {/* <li className="nav-item">
                                            <a className="nav-link" href={enVariables.BLOG_LINK} target="_blank">Blog</a>
                                        </li> */}
                                        <li className="nav-item">
                                            <a className="nav-link" href={"/contact?lang=" + lang}>Contact Us</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href={"/storeSignup?lang=" + lang}>Join As A Store</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 col-lg-auto order-2 order-md-3 mb-3 mb-md-0">
                            <h6 className="h6Title whiteClr fnt14 mb-3">Follow us</h6>
                            <div className="row mb-3 social-icons-sec">
                                <div className="col-auto pr-0">
                                    <a href="https://www.facebook.com/Threestops-107606561014202/" target="_blank">
                                    <img src="/static/images/grocer/facebook2x.png" alt="" />
                                    </a>
                                </div>
                                <div className="col-auto pr-0">
                                    <a href="https://mobile.twitter.com/Threestops2" target="_blank">
                                    <img src="/static/images/grocer/twitter2x.png" alt="" /></a>
                                </div>
                                <div className="col-auto pr-0">
                                    <a href="https://instagram.com/threestops_india?igshid=347qqgxxc0x7" target="_blank">
                                    <img src="/static/images/grocer/instagram2x.png" alt="" />
                                    </a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-auto w300">
                                    <div className="form-group">
                                        <input type="text" className="form-control newsletterCls" placeholder="Newsletter" />
                                        <img src="/static/images/grocer/right-arrow.svg" width="15" className="rightArrowImg" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="fnt11 whiteClr">Copyright © 2021 Threestops. All rights reserved</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
      );
 }
};
export default Footer;
