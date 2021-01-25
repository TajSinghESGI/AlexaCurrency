const moment = require('moment-timezone'); // will help us do all the dates math while considering the moment-timezone
const util = require('./util');
const axios = require('axios');

const fetchCurrency = (base, symbols) => {
    const ENDPOINT = 'https://api.exchangeratesapi.io/latest';
    // list of actors with pictures and date of birth for a given day and month
    const url = `${ENDPOINT}?base=${base.toUpperCase()}&symbols=${symbols.toUpperCase()}`;
    const config = {
        timeout: 6500, // timeout API call before we reach Alexa's 8 second timeout, or set globally via axios.defaults.timeout
    };
    async function getJsonResponse(url, config) {
        const res = await axios.get(url, config);
        console.log(res.data);
        return res.data;
    }
    return getJsonResponse(url, config)
        .then((result) => result)
        .catch((error) => null)
}

const convertAmount = (amount, currency) => {
    return parseFloat(amount) * parseFloat(currency);
}

module.exports = {
    fetchCurrency,
    convertAmount,
}