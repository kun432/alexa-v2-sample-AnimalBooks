const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.name === 'AMAZON.HelpIntent');
  },
  handle(handlerInput) {
    console.log(`Session start!!!`)
    const speechText = 'アレクサ、アニマルブックスのおすすめの商品を教えて、と声をかけてください。';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const RecommendIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecommendIntent';
  },
  handle(handlerInput) {
    const speechText = '本のおすすめでよろしいですか？';
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.state = 'RecommendHandler';
    handlerInput.attributesManager.setSessionAttributes(attributes);
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const RecommendHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;
    return attributes.state === 'RecommendHandler' &&
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.YesIntent' || request.intent.name === 'AMAZON.NoIntent');
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request.intent;
    let speechText;
    if (request.name === 'AMAZON.YesIntent') {
      speechText = 'おすすめの商品はアレクサ開発ガイドです';
    } else {
      speechText = 'おすすめの商品はアレクサです';
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
      || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'キャンセルしました';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('エラーが発生しました')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RecommendIntentHandler,
    RecommendHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();