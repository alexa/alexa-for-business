/**
    Copyright 2017 Amazon.com, Inc. and its affiliates. All Rights Reserved.

    Licensed under the Amazon Software License (the "License").
    You may not use this file except in compliance with the License.
    A copy of the License is located at

      http://aws.amazon.com/asl/

    or in the "license" file accompanying this file. This file is distributed
    on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express 
    or implied. See the License for the specific language governing
    permissions and limitations under the License.
    
    This sample demonstrates a simple skill that utilizes a voice code to help 
    identify the user.
   
    This file registers all of the different state handler functions in order to route 
    incoming requests to the proper location. It also specifies Alexa settings such as 
    the skill ID that this function should respond to, DynamoDB table name for storing 
    session data, resource strings for localization that are referenced in the handlers, 
    and a general debugging flag that is used to write the event to the logs.
 **/

'use strict';

var Alexa = require('alexa-sdk');
var constants = require('./constants');
var languageStrings = require('./resourceStrings');
var voiceCodeHandlers = require('./voiceCodeHandlers');
var secureHandlers = require('./secureHandlers');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.appId = constants.appId;
    alexa.debug = constants.DEBUG;
    alexa.dynamoDBTableName = constants.dynamoDBTableName;
    alexa.resources = languageStrings;
    alexa.registerHandlers(
        voiceCodeHandlers.newSessionHandlers,
        voiceCodeHandlers.codeStateHandlers,
        voiceCodeHandlers.changeCodeHandlers,
        voiceCodeHandlers.newCodeHandlers,
        voiceCodeHandlers.helpStateHandlers,
        secureHandlers
    );
    if (alexa.debug) {
        console.log("\n" + "******************* REQUEST **********************");
        console.log("\n" + JSON.stringify(event, null, 2));
    }
    alexa.execute();
};