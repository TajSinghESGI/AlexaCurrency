/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const AWS = require('aws-sdk');
const Alexa = require('ask-sdk-core');
const moment = require('moment-timezone');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

const util = require('./util');
const interceptors = require('./interceptors');
const logic = require('./logic');
const constants = require('./constants');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   async handle(handlerInput) {
        const {t} = handlerInput;
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();

        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributesManager.setSessionAttributes({});

        const currencyFav = attributes.hasOwnProperty('currencyFav');
        let speechText = currencyFav ? (t('WELCOME_BACK_MSG') + JSON.stringify(attributes["currencyFav"])): t('WELCOME_MSG');
            
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDelegateDirective({
                name: currencyFav ? 'CurrencyConverterIntent' : 'CurrencyFavIntent',
                confirmationStatus: 'NONE',
                slots:{}
            })
            .getResponse();
    }
};

const CurrencyFavIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CurrencyFavIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager, t} = handlerInput;
        const {intent} = requestEnvelope.request;
        
        if (intent.confirmationStatus === 'NONE') {
            const currency = Alexa.getSlotValue(requestEnvelope, 'currencyFav').toString().toUpperCase();
            const attributesManager = handlerInput.attributesManager;
            await attributesManager.deletePersistentAttributes();
            let attributes = {"currencyFav":currency};

            attributesManager.setPersistentAttributes(attributes);
            await attributesManager.savePersistentAttributes();
            
            const sessionAttributes = await attributesManager.getPersistentAttributes();

            let speechOutput = `Vous avez ajouté ${attributes.currencyFav} comme devise favorite !`;

            return handlerInput.responseBuilder
                .speak(speechOutput)
                .getResponse();
        } 
        return responseBuilder
            .speak(t('REJECTED_MSG'))
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }  
};

const CurrencyConverterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CurrencyConverterIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager, t} = handlerInput;
        const {intent} = requestEnvelope.request;
        
        if (intent.confirmationStatus === 'CONFIRMED') {
            const currency = Alexa.getSlotValue(requestEnvelope, 'currency').toString().toUpperCase();
            
            const attributesManager = handlerInput.attributesManager;
            const attributes = await attributesManager.getPersistentAttributes() || {};

            const currencyFav = attributes.hasOwnProperty('currencyFav') ? attributes["currencyFav"] : "EUR";

            const response = await logic.fetchCurrency(currencyFav, currency);
            const taux = response.rates[currency];
            return responseBuilder
            .speak(t('RATE_MSG') + parseFloat(JSON.stringify(taux)).toFixed(2))
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
        } 
        return responseBuilder
            .speak(t('REJECTED_MSG'))
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }  
};

const ConvertCurrencyIntentHandler = {
   canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertCurrencyIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager, t} = handlerInput;
        const {intent} = requestEnvelope.request;
        
        if (intent.confirmationStatus === 'CONFIRMED') {
            const currency = Alexa.getSlotValue(requestEnvelope, 'currency').toString().toUpperCase();
            const price = Alexa.getSlotValue(requestEnvelope, 'price');
            const attributesManager = handlerInput.attributesManager;
            const attributes = await attributesManager.getPersistentAttributes() || {};

            const currencyFav = attributes.hasOwnProperty('currencyFav') ? attributes["currencyFav"] : "EUR";
   
            const response = await logic.fetchCurrency(currencyFav, currency);
            const taux = response.rates[currency]; 
            const converter = logic.convertAmount(price, taux);
            return responseBuilder
            .speak(t('CONVERSION_MSG') + parseFloat(JSON.stringify(converter)).toFixed(2))
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
        } 
        return responseBuilder
            .speak(t('REJECTED_MSG'))
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }   
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {t, attributesManager} = handlerInput
        const sessionAttributes = attributesManager.getSessionAttributes();
        const name = sessionAttributes['name']

        const speakOutput = t('GOODBYE_MSG', {name});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CurrencyFavIntentHandler,
        CurrencyConverterIntentHandler,
        ConvertCurrencyIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    /*.addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)*/
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();