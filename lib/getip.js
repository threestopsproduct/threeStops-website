import axios from "axios";
export const getGeoInfo = async () => {
  try {
    let response = await axios.get("https://ipapi.co/json/");
    console.log("ip", response);
    let data = response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
};
