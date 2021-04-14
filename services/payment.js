import { post } from "../lib/request";
import { PAYMENT_API_HOST, PAYMENT_API_HOST_LIVE } from "../lib/envariables";
import axios from "axios";

export const paymentValidation = async (data) => {
    try {
        const response = await axios.post(PAYMENT_API_HOST + '/paymentDone/', data);
        return response;
    } catch (error) {

        console.log("errr0099", error)
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
}

export const paymentValidationRedirect = async (data) => {
    try {
        const response = await axios.post(PAYMENT_API_HOST_LIVE + '/paymentDone/', data);
        return response;
    } catch (error) {

        console.log("errr0099", error)
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
}