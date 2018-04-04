/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This AWS Lambda code sample demonstrates how to use SSML <say-as> tags to control speech output.
 * It uses the nodejs skill development kit.
 * This is built on the example located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'A4B Concierge';

const wifipass = "abc123";


const HELP_MESSAGE = 'This is an Alexa for Business Concierge Skill.  You can ask me for things like the guest wireless password, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const handlers = {
  'LaunchRequest': function () {
    const speechOutput = HELP_MESSAGE;
    const repromptSpeech = this.t('HELP_REPROMPT');
    this.emit(':askWithCard', speechOutput, repromptSpeech, SKILL_NAME, speechOutput);
  },

  'askWiFi': function () {
    /*
    Since the guest WiFi isn't actually a word, we want the password to be spelled out, so we use the "say-as" element with
    attribute interpret-as="characters" to have Alexa spell out our response
    */
    const charprefix = '<say-as interpret-as="characters">';
    const charsuffix = '</say-as>';
    const spelledoutwifi = wifipass;//comment this out and uncomment the next line to have Alexa spell out the password letters
//      const spelledoutwifi = charprefix + wifipass + charsuffix;
// Another use of interjections is to have Alexa interpret text in a more energetic way!
//        const spelledoutwifi = charprefix + wifipass + charsuffix + ' .<say-as interpret-as="interjection">Woohoo!</say-as>';
    const speechOutput = "The guest WiFi password is " + spelledoutwifi;
    this.response.cardRenderer(SKILL_NAME, "The guest WiFi password is: " + wifipass);
    this.response.speak(speechOutput);
    this.emit(':responseReady');
  },

  'askBus': function () {
    const speechOutput = "The bus arrives on the half hour at Depot 1.";
    this.response.cardRenderer(SKILL_NAME, "Bus Schedule Info: " + speechOutput);
    this.response.speak(speechOutput);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'Unhandled': function() {  // if we get any intents other than the above
    this.response.speak('Sorry, I didn\'t get that.').listen('Try again');
    this.emit(':responseReady');
  },
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
