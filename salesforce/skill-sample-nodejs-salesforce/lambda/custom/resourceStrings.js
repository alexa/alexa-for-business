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

    This file stores localized strings that are used within the skill in a single location.

    This sample supports en-US lauguage. Future language support would be added to this file.
 **/
 var languageString = {
    "en": {
        "translation": {
            /* General messaging */
            "CANCEL_MESSAGE": "Goodbye",
            "PROMPT": "How else can I help?",
            "STOP_MESSAGE": "Ok, bye!",
            "WELCOME_HAS_CODE": "Please say your 4-digit voice code to get started. ",
            "WELCOME_MESSAGE": "Welcome to the sample Alexa skill with Salesforce integration. ",
            "WELCOME_NO_CODE": "To use this skill, you need to set a 4-digit voice code first. Please say a voice code now. ",
            "WELCOME_SKILL": "Your voice code is still valid, so you can ask away. I can help with your most recent lead or opportunity, just ask. ",           
            "WELCOME_SUCCESS_CODE": "Great, I verified your identity using your voice code. How can I help? ",
            "WELCOME_SUCCESS_NEW_CODE": "I've changed your voice code. What else can I help with? ",

            /* Help messaging */
            "HELP_MESSAGE": "This skill can be used to see how Alexa can work with Salesforce to set a voice code, and how to " + 
                            "access Salesforce data through the account linking process. Try asking for a recent lead, or opportunity. " + 
                            "For testing the voice code process, try asking me to start over, so you will have to authenticate again. "+
                            "You can also ask to change your voice code. How can I help? ",
            "SHORT_HELP": "You can ask about your most recent lead or opportunity. What would you want to do?",

            /* Account/Voice Code Related messages */
            "ACCOUNT_RELINK_MESSAGE": "You need to relink your Salesforce account in order to use this skill. " +
                                      "I've placed more information on a card in your Alexa app. ",
            "ACCOUNT_REQUIRED_MESSAGE": "A Salesforce account is required to use this skill. I've placed more " +
                                        "information on a card in your Alexa app. ",
            "ACCOUNT_REQUIRED_CARD": "Relink your account. To relink your account, open the skill within the Alexa " +
                                     "App and click re-link account. ", 
            "CODE_REPEAT_REQUEST": "Please try your code one more time. ",
            "CHANGE_NEW_CODE": "Say your new, 4-digit voice code now. ",
            "CHANGE_PROVIDE_CODE": "Before proceeding with a voice code change, please say your current voice code. ",
            "CODE_REQUEST": "Please say your voice code. ",
            "CODE_SET": "I've saved your voice code. You'll need to use it the next time you use this skill, so don't forget it! " +
                       "You now have access to your Salesforce data. ",

            /* Salesforce related messages */
            "LEAD": "Your most recent lead is for %s from %s. ",
            "LEAD_NOT_FOUND": "I didn't find any leads. What else can I do?", 
            "OPPORTUNITY": "Your most recent opportunity that's not closed is for %s and it's in the %s stage. ",
            "OPPORTUNITY_NOT_FOUND": "I didn't find any opportunities. What else can I do?",


            /* Error messages */
            "UNKNOWN_SALESFORCE_ERROR": "I encountered an error when trying reach Salesforce. Please try again later.",
            "UNKNOWN_ERROR": "I ran into a problem with that request. Please try again later. ",
        }
    }
};

module.exports = languageString;