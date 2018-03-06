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
    
    This file represents different states relating to voice code entry when a 
    user is creating their first code, validating an existing code, or changing
    their code.
 **/

'use strict';

const Alexa = require('alexa-sdk');
const bcrypt = require('bcryptjs');

const constants = require('./constants');
const sf = require('./salesforce');

var voiceCodeHandlers = {
    newSessionHandlers : Alexa.CreateStateHandler(constants.STATES.START, {
        'LaunchRequest': function() {
            if (Object.keys(this.attributes).length === 0) {
                resetAttributes(true, this.attributes);
            }
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        },
        'AMAZON.StartOverIntent': function() {
            resetAttributes(true, this.attributes);
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        },
        'AMAZON.HelpIntent': function() {
            this.handler.state = constants.STATES.HELP;
            this.emitWithState("helpTheUser");
        },
        "Unhandled": function() {
            if (Object.keys(this.attributes).length === 0) {
                resetAttributes(true, this.attributes);
            }
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        }
    }),

    codeStateHandlers : Alexa.CreateStateHandler(constants.STATES.CODE, {
        "SetupAccount": function() {
            // Access token is passed through the session information
            var accessToken = this.event.session.user.accessToken;
            var speechOutput;
            var repromptText;

            // Check to see if the user has linked their account
            if (accessToken) {

                var salesforceUserId = this.attributes[constants.SALESFORCE_USER_ID];
                var hasCode = this.attributes["HAS_CODE"];
                if (salesforceUserId && salesforceUserId.value && hasCode && hasCode.value) {
                    // We know the salesforce user ID and that the person has a code
                    speechOutput = this.t("WELCOME_MESSAGE") + this.t("WELCOME_HAS_CODE");
                    this.attributes['HAS_CODE'] = true;
                    this.emit(":ask", speechOutput);
                } else {
                    // Get the user's ID
                    sf.getIdentity(accessToken, identityCallback, this);
                }
            } else {
                // No account is linked. 
                speechOutput = this.t("ACCOUNT_REQUIRED_MESSAGE");
                this.emit(':tellWithLinkAccountCard',speechOutput);
            }
        },
        "PromptForCode": function() {
            var firstAttempt = this.attributes['numAttempts'] === 0;
            var speechOutput = firstAttempt ? this.t("CODE_REQUEST") : this.t("CODE_REPEAT_REQUEST");

            this.emit(":ask", speechOutput, speechOutput);
        }, 
        "CodeIntent": function() {
            validateCode.call(this);
        },
        "AMAZON.StartOverIntent": function() {
            resetAttributes(true, this.attributes);
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        },
        "AMAZON.HelpIntent": function() {
            this.handler.state = constants.STATES.HELP;
            this.emitWithState("helpTheUser");
        },
        "AMAZON.StopIntent": function() {
            resetAttributes(false, this.attributes);
            this.emit(":tell", this.t("STOP_MESSAGE"));
        },
        "AMAZON.CancelIntent": function() {
            resetAttributes(false, this.attributes);
            this.emit(":tell", this.t("CANCEL_MESSAGE"));
        },
        "Unhandled": function() {
            console.log("in CODE unhandled");
            this.emitWithState("SetupAccount");
        },
        "SessionEndedRequest": function() {
            console.log("Session ended waiting for a code: " + this.event.request.reason);
        },
        "UnhandledError": function() {
            console.log("In constants.STATES.CODE UnhandledError");

            if (Object.keys(this.attributes).length === 0) {
                resetAttributes(true, this.attributes);
            }
            this.emit(":tell", this.t("UNKNOWN_ERROR"));
        }
    }),

    changeCodeHandlers : Alexa.CreateStateHandler(constants.STATES.CHANGE_CODE, {
        "PromptForCode": function() {
            var firstAttempt = this.attributes['numAttempts'] === 0;
            var speechOutput = firstAttempt ? this.t("CHANGE_PROVIDE_CODE") : this.t("CODE_REPEAT_REQUEST");

            this.emit(":ask", speechOutput, speechOutput);
        },
        "CodeIntent": function() {
            validateCode.call(this);
        },
        "AMAZON.StartOverIntent": function() {
            resetAttributes(true, this.attributes);
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        },
        "AMAZON.HelpIntent": function() {
            this.handler.state = constants.STATES.HELP;
            this.emitWithState("helpTheUser");
        },
        "AMAZON.StopIntent": function() {
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("AMAZON.StopIntent");
        },
        "AMAZON.CancelIntent": function() {
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("AMAZON.CancelIntent");
        },
        "Unhandled": function() {
            console.log("in Change Code unhandled");
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("UnhandledError");
        },
        "SessionEndedRequest": function() {
            console.log("Session ended in CHANGE_CODE state: " + this.event.request.reason);
        }
    }),

    newCodeHandlers : Alexa.CreateStateHandler(constants.STATES.NEW_CODE, {
        "PromptForCode": function() {
            var firstAttempt = this.attributes['numAttempts'] === 0;
            var speechOutput = firstAttempt ? this.t("CHANGE_NEW_CODE") : this.t("CODE_REPEAT_REQUEST");

            this.emit(":ask", speechOutput, speechOutput);
        },
        "CodeIntent": function() {
            validateCode.call(this);
        },
        "AMAZON.StartOverIntent": function() {
            resetAttributes(true, this.attributes);
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        },
        "AMAZON.HelpIntent": function() {
            this.handler.state = constants.STATES.HELP;
            this.emitWithState("helpTheUser");
        },
        "AMAZON.StopIntent": function() {
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("AMAZON.StopIntent");
        },
        "AMAZON.CancelIntent": function() {
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("AMAZON.CancelIntent");
        },
        "Unhandled": function() {
            console.log("in New Code unhandled");
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("UnhandledError");
        },
        "SessionEndedRequest": function() {
            console.log("Session ended in NEW_CODE state: " + this.event.request.reason);
        }
    }),
    helpStateHandlers : Alexa.CreateStateHandler(constants.STATES.HELP, {
        "helpTheUser": function() {
            var speechOutput = this.t("HELP_MESSAGE");
            var repromptText = this.t("SHORT_HELP");
            // Defaulting to secure state for the next question, if the customer
            // doesn't have their code set, it will redirect to the code prompt process
            this.handler.state = constants.STATES.SECURE;
            this.emit(":ask", speechOutput, repromptText);
        },
        "AMAZON.StartOverIntent": function() {
            resetAttributes(true, this.attributes);
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("SetupAccount");
        },
        "AMAZON.HelpIntent": function() {
            this.emitWithState("helpTheUser");
        },
        "AMAZON.StopIntent": function() {
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("AMAZON.StopIntent");
        },
        "AMAZON.CancelIntent": function() {
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("AMAZON.CancelIntent");
        },
        "Unhandled": function() {
            console.log("in Help unhandled");
            this.handler.state = constants.STATES.CODE;
            this.emitWithState("UnhandledError");
        },
        "SessionEndedRequest": function() {
            console.log("Session ended in help state: " + this.event.request.reason);
        }
    })
}

/**
 * Callback function to handle getIdentity
 */
function identityCallback(err, resp) {
    var speechOutput = "";
    if (!err) {
        // get Salesforce User ID
        var splitString = resp.identity.split('/');
        var userId = splitString[splitString.length-1]

        this.attributes[constants.SALESFORCE_USER_ID] = userId;
        var accessToken = this.event.session.user.accessToken;
        
        // Check to see if the user has a voice code or not
        sf.getVoiceCode(userId, accessToken, getVoiceCodeCallback, this);
    } else {
        console.log("Error in getIdentity call: " + JSON.stringify(err));
        if (err.errorCode == "INVALID_SESSION_ID") {
            console.log("invalid session ID, prompt to relink");
            speechOutput = this.t("ACCOUNT_RELINK_MESSAGE")
            this.emit(":tellWithLinkAccountCard", speechOutput);
        } else {
            console.log("Other unknown error during getIdentity call")
            speechOutput = this.t("UNKNOWN_SALESFORCE_ERROR");
            this.emit(":tell", speechOutput);
        }
    }
}

/**
 * Callback function to handle getVoiceCode
 */
function getVoiceCodeCallback(err, resp) {
    var speechOutput = "";
    if (!err) {
        if (resp.records.length > 0) {
            // User has a code, prompt them to say it.
            speechOutput = this.t("WELCOME_MESSAGE") + this.t("WELCOME_HAS_CODE");
            this.attributes['HAS_CODE'] = true;
            this.emit(":ask", speechOutput);
        } else {
            // User doesn't have a code, prompt them to create one
            speechOutput = this.t("WELCOME_MESSAGE") + this.t("WELCOME_NO_CODE");
            this.attributes['HAS_CODE'] = false;
            this.emit(":ask", speechOutput);
        }
    } else {
        console.log("Error in voice code query: " + JSON.stringify(err));
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
    }
}

/**
 * Helper function to reset session attributes to make code request begin again.
 */
function resetAttributes(resetTime, attributes) {
    if (resetTime) {
        attributes['lastRequest'] = null;
    }
    attributes['numAttempts'] = 0;
    attributes['HAS_CODE'] = null;
    attributes['CHANGED_CODE'] = null;
    attributes['CREATED_CODE'] = null;
}

module.exports = voiceCodeHandlers;
module.exports.resetAttributes = resetAttributes;

/**
 * Function to wrap checking the user's code and if it's valid, passing it on to see if it's correct.
 */
function validateCode() {
    var isCodeValid = isCodeSlotValid(this.event.request.intent);
    
    if (isCodeValid) {
        var code = parseInt(this.event.request.intent.slots.VOICE_CODE.value);
        
        if (this.handler.state == constants.STATES.NEW_CODE) {
            // Creating a new code
            setNewCode.call(this, code);
        } else {
            // Check for matching existing code
            var accessToken = this.event.session.user.accessToken;
            var salesforceUserId = this.attributes[constants.SALESFORCE_USER_ID];
            var hasCode = this.attributes["HAS_CODE"];

            // Check to see if the user has a voice code or not
            sf.getVoiceCode(salesforceUserId, accessToken, handleGetVoiceCode, this);
        }
    } else {
        // Invalid code entered
        this.attributes['numAttempts'] = parseInt(this.attributes['numAttempts']) + 1;
        //prompt user again for code
        this.emitWithState("PromptForCode");
    }
}

/**
 * Callback function for getVoiceCode to determine if the code provided matches the user's set code.
 */
function handleGetVoiceCode(err, resp) {
    if (!err) {
        var code = parseInt(this.event.request.intent.slots.VOICE_CODE.value);

        if (resp.records.length > 0) {
            // User has a code, check the hashes
            var hashed_code = resp.records[0]._fields.code__c;

            // Check to see if the code provided matches the hash
            if (!bcrypt.compareSync(code.toString(), hashed_code)) {
                this.attributes['numAttempts'] = parseInt(this.attributes['numAttempts']) + 1;
                
                this.emitWithState("PromptForCode");
            } else {
                this.attributes["lastRequest"] = Date.now();
                this.attributes['numAttempts'] = 0;
                var speechOutput = "";
                // If we're just authenticating, move to secure state. 
                // If we're in change code state, move on to get the new code
                switch (this.handler.state) {
                    case constants.STATES.CODE:
                        this.handler.state = constants.STATES.SECURE;
                        speechOutput = this.t("WELCOME_SUCCESS_CODE");
                        this.emit(":ask", speechOutput, speechOutput);
                        break;
                    case constants.STATES.CHANGE_CODE:
                        this.handler.state = constants.STATES.NEW_CODE;
                        speechOutput = this.t("CHANGE_NEW_CODE");
                        this.emit(":ask", speechOutput, speechOutput);
                        break;
                }
            }
        } else {
            // User doesn't have a code, set it 
            setNewCode.call(this, code);
        }
    } else {
        console.log("Error in voice code query: " + JSON.stringify(err));
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
    }
}

/**
 * Creats a bcrypt hash of the code and saves it to Salesforce.
 */
function setNewCode(code) {
    var accessToken = this.event.session.user.accessToken;
    var salesforceUserId = this.attributes[constants.SALESFORCE_USER_ID];

    // Hash the code - you can choose a different # of rounds, 10 is default
    // See https://www.npmjs.com/package/bcryptjs for more details.
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(code.toString(), salt);

    // Add the code to Salesforce
    if (this.handler.state == constants.STATES.CODE) {
        sf.createVoiceCode(hash, salesforceUserId, accessToken, handleCreateCode, this);
    } else if (this.handler.state == constants.STATES.NEW_CODE) {
        sf.updateVoiceCode(hash, salesforceUserId, accessToken, handleUpdateCode, this);
    }
}

/**
 * Callback function used to create a voice code
 */
function handleCreateCode(err, resp) {
    if (!err) {
        this.handler.state = constants.STATES.SECURE;
        this.attributes["lastRequest"] = Date.now();
        this.attributes["numAttempts"] = 0;
        this.attributes["CREATED_CODE"] = true;
        this.emitWithState("LaunchRequest");
    } else {
        console.log('Error in insert custom setting method - ' + JSON.stringify(err));
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
    }
}

/**
 * Callback function used to update a voice code
 */

function handleUpdateCode(err, resp) {
    if (!err) {
        this.handler.state = constants.STATES.SECURE;
        this.attributes["lastRequest"] = Date.now();
        this.attributes["numAttempts"] = 0;
        this.attributes["CHANGED_CODE"] = true;
        this.emitWithState("LaunchRequest");
    } else {
        console.log('Error in update custom setting method - ' + JSON.stringify(err));
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
    }
}

/**
 * Validates that the code provided to the skill is a number between 0000 and 9999.
 * @return {Boolean} if the code was a 4-digit number.
 */
function isCodeSlotValid(intent) {
    // Check to see if the intent has a code slot, the code slot is filled, the code slot is a number, and the number is between 0 and 9999 (a four digit number)
    var codeSlotFilled = intent && intent.slots && intent.slots.VOICE_CODE && intent.slots.VOICE_CODE.value;
    var codeSlotIsInt = codeSlotFilled && !isNaN(parseInt(intent.slots.VOICE_CODE.value));
    return codeSlotIsInt && parseInt(intent.slots.VOICE_CODE.value) <= (9999) && parseInt(intent.slots.VOICE_CODE.value) >= 0;
}