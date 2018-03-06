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
    
    This file holds common values that are referenced in this project.
 **/

'use strict';

module.exports = Object.freeze({
    
    // App-ID. TODO: set to your own Skill App ID from the developer portal.
    appId : '',

    // Salesforce Constants
    INSTANCE_URL : '', // TODO Set your own
    VOICE_CODE_OBJECT_NAME : 'voice_code__c',
    VOICE_CODE_FIELD_NAME : 'code__c',

    // Custom Skill Settings
    dynamoDBTableName : 'Salesforce_Skill',
    CODE_TIMEOUT_MINUTES : 5,
    SALESFORCE_USER_ID : 'salesforceUserId',

    // For code debugging
    DEBUG : false,

    // States for state handlers
    STATES : {
        START : '',
        HELP : '_HELP_MODE', 
        CODE : '_WAITING_FOR_CODE_MODE', // User needs to provide a voice code
        CHANGE_CODE : '_CHANGE_CODE', // User wants to change their voice code, confirming current code
        NEW_CODE : '_NEW_CODE', // User wants to set their new voice code
        SECURE : '_SECURE' // voice code validated
    }
});
