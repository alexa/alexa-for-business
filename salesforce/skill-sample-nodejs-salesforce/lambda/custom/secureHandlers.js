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

    This sample demonstrates a skill that interacts with Salesforce data.
    
    This file handles intents that occur when a user has provided their 
    voice code successfully and is considered a validated user.
 **/
 'use strict';

var Alexa = require('alexa-sdk');
var bcrypt = require('bcryptjs');

var constants = require('./constants');
var voiceCodeHandlers = require('./voiceCodeHandlers');
var sf = require('./salesforce');

var handlers = Alexa.CreateStateHandler(constants.STATES.SECURE, {
    'LaunchRequest': function() {
        if (!codeCheck(this.attributes)){
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        } else {
            if (this.attributes["CHANGED_CODE"]) {
                var output = this.t("WELCOME_SUCCESS_NEW_CODE");
                this.attributes["CHANGED_CODE"] = null;
                this.emit(":ask", output, this.t("SHORT_HELP"));
            } else if (this.attributes["CREATED_CODE"]) {
                var output = this.t("CODE_SET") + this.t("SHORT_HELP");
                this.attributes["CREATED_CODE"] = null;
                this.emit(":ask", output, this.t("SHORT_HELP"));
            } else {
                var output = this.t("WELCOME_MESSAGE") + this.t("WELCOME_SKILL")
                this.emit(':ask', output, this.t("SHORT_HELP"));
            }
        }
    },
    'AMAZON.StartOverIntent': function() {
        voiceCodeHandlers.resetAttributes(true, this.attributes);
        // Route the user back to the SetupAccount function in voiceCodeHandlers.js if they request to start over.
        this.handler.state = constants.STATES.CODE;
        this.emitWithState("SetupAccount");
    },
    'RecentLead': function() {

        if (!codeCheck(this.attributes)){
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("PromptForCode");
        } else {

            var accessToken = this.event.session.user.accessToken;

            if (accessToken) {
                var currentUserId = this.attributes[constants.SALESFORCE_USER_ID];
                if (currentUserId) {
                    sf.query("Select Name,Company From Lead ORDER BY CreatedDate DESC LIMIT 1", 
                        accessToken, handleLeads, this);
                }
            }
        }
    },
    'RecentOpportunity': function() {

        if (!codeCheck(this.attributes)){
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("PromptForCode");
        } else {

            var accessToken = this.event.session.user.accessToken;

            if (accessToken) {
                var currentUserId = this.attributes[constants.SALESFORCE_USER_ID];
                if (currentUserId) {
                    sf.query("Select Name,StageName From Opportunity Where StageName != 'Closed Won' " +
                        "ORDER BY CreatedDate DESC LIMIT 1", accessToken, handleOpportunities, this);
                }
            }
        }
    },
    'ChangeCode': function() {
        // Route the user back to the PromptForCode function in the CHANGE_CODE state handler
        // in voiceCodeHandlers.js if the user wants to change their code.
        this.handler.state = constants.STATES.CHANGE_CODE;
        this.emitWithState("PromptForCode");
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.CancelIntent': function() {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", this.t("CANCEL_MESSAGE"));
    },
    'SessionEndedRequest': function() {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function() {
        // Route the user to the HELP state handler in voiceCodeHandlers.js
        this.handler.state = constants.STATES.HELP;
        this.emitWithState("helpTheUser");
    },
    'Unhandled': function() {
        console.log("in secureHandler Unhandled");
        // Route the user to the CODE state handler in voiceCodeHandlers.js
        this.handler.state = constants.STATES.CODE;
        this.emitWithState("UnhandledError");
    }
});

module.exports = handlers;

/**
 * Callback function handle a query about a Lead
 */
function handleLeads(err, resp) {
    if (!err) {
        if (resp.records) {
            var output = this.t("LEAD", resp.records[0]._fields.name, resp.records[0]._fields.company) + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
        } else {
            var output = this.t("LEAD_NOT_FOUND") + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
        }
    } else {
        console.log("Error in lead query call: " + JSON.stringify(err));
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
    }
}

/**
 * Callback function handle a query about an Opportunity
 */
function handleOpportunities(err, resp) {
    if (!err) {
        console.log('Opportunity query succeeded! ' + JSON.stringify(resp));

        if (resp.records) {
            var output = this.t("OPPORTUNITY", resp.records[0]._fields.name, resp.records[0]._fields.stagename) + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
        } else {
            var output = this.t("OPPORTUNITY_NOT_FOUND") + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
        }
    } else {
        console.log("Error in opportunity query call: " + JSON.stringify(err));
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
    }
}

/**
 * Helper function to tell if the voice code was last authenticated within an acceptable time range.
 * @return {Boolean} if the code was last authenticated within an acceptable time range.
 */
function codeCheck(attributes) {
    var timeSinceCodeRequest = (Date.now() - attributes['lastRequest'])/60000;
    if (timeSinceCodeRequest  <=  constants.CODE_TIMEOUT_MINUTES) {
        // If code is good, make sure numAttempts is zeroed out.
        attributes['numAttempts'] = 0;
        return true;
    } else {
        // Require the code to be spoken
        attributes['lastRequest'] = null;
        attributes['numAttempts'] = 0;
        return false;
    }
}
