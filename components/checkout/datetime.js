import React from "react"
import frLocale from "date-fns/locale/fr";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DateFnsAdapter from "@material-ui/pickers/adapter/date-fns";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker,LocalizationProvider,MobileDateTimePicker  } from "@material-ui/pickers";

const localeMap = {
    en: enLocale,
    fr: frLocale,
    ru: ruLocale,
  };
  
  const maskMap = {
    fr: "__/__/____",
    en: "__/__/____",
    ru: "__.__.____",
  };
const DateTimeCom =(props)=>{
    const [locale, setLocale] = React.useState("ru");
   return (
       <div>
   <LocalizationProvider dateAdapter={DateFnsAdapter} locale={localeMap[locale]}>
                                                <MobileDateTimePicker
        renderInput={(props) => <TextField {...props} />}
         
        value={props.saveTimeDate}
        onChange={props.onDateTimeChange}
        minDate={new Date()}
         minTime={props.timeSelectionValue}
         
       

        // maxTime={new Date(0, 0, 0, 18, 45)}
      />
         </LocalizationProvider>
       </div>
   )
}
export default DateTimeCom;