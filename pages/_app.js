import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import axios from "axios";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import createStore from "../store";
import { APP_NAME } from "../lib/envariables";
import { connect } from "react-redux";
import * as actions from "../actions";
import { getCookiees } from "../lib/session";
import LanguageContext from "../context/languageContext";
import $ from "jquery";
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "rgb(30, 198, 159)"
  },
  datePicker: {
    selectColor: "rgb(30, 198, 159)",
    headerColor: "rgb(30, 198, 159)",
    buttonTextColor: "rgb(30, 198, 159)",
    calendarYearBackgroundColor: "rgb(30, 198, 159)"
  },

  timePicker: {
    selectColor: "rgb(30, 198, 159)",
    headerColor: "rgb(30, 198, 159)",
    accentColor: "rgb(30, 198, 159)",
    clockColor: "rgb(30, 198, 159)"
    // clockCircleColor: "rgb(30, 198, 159)",
  }
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    let lang = getCookiees("lang", ctx.req) || "en";

    await ctx.store.dispatch(actions.updateLocale(lang));

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }
componentDidMount=()=>{
  //  localStorage.openpages = Date.now();
  // var onLocalStorageEvent = function(e){
  //   // console.log(e ,"kaik to de yar")
  //     if(e.key == "openpages"){
  //         // Listen if anybody else is opening the same page!
  //         localStorage.page_available = Date.now();
  //         $(window).on("storage", function(e) {
  //           console.log(e,"storageValue")
  //           var event = e.originalEvent; // Get access to the storage-specifics
  //           if (event.key == "openpages") { // Or whatever
  //               location.reload()
  //           }
  //       });
         
  //     }
  //     if(e.key == "page_available"){
  //         alert("One more page already open");
  //         //  location.reload()
  //     }
  // };
  // window.addEventListener('storage', onLocalStorageEvent, false);
//   window.addEventListener("storage", function(e) {
//     var event = e&&e.originalEvent; // Get access to the storage-specifics
//      console.log(e,"new value")
//      $(window).on("storage", function(e) {
//       var event = e.originalEvent; // Get access to the storage-specifics
//       if (event.key == "aws.test-storage") { // Or whatever
//           // Do something with event.newValue
//           //  location.reload()
//            alert("biji tab")
//       }
//   });
 
 
// });

$(window).on("storage", function(e) {
  var event = e.originalEvent; // Get access to the storage-specifics
  if (event.key == "foo") { // Or whatever
      // Do something with event.newValue
     location.reload()
  }
});
}
  render() {
    const { Component, pageProps, store } = this.props;
   
    return (
      <Container>
        {/* setting up defualt title for all the pages */}
        {/* <title>{APP_NAME}</title> */}

        <Provider store={store}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <LanguageContext.Provider value={{ lang: this.props.lang,selectedLang:this.props.selectedLang }}>
              <Component {...pageProps} />
            </LanguageContext.Provider>
          </MuiThemeProvider>
        </Provider>
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    lang: state.locale,
    selectedLang:state.selectedLang
  };
};
export default withRedux(createStore)(
  withReduxSaga({ async: true })(connect(mapStateToProps)(MyApp))
);
