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

    This sample demonstrates a way to abstract using the nforce Salesforce library.
    
    For more details, see https://github.com/kevinohara80/nforce/
 **/
'use strict';

var constants = require('./constants');
var nforce = require('nforce');

/*
 These are set to NA as they are not used, due to the fact that we are using 
 Alexa's account linking process to obtain an acess token, not the default
 nforce createConnection and authenticate methods.
 */
var org = nforce.createConnection({
    clientId: "NA",
    clientSecret: "NA",
    redirectUri: "NA"
});

var sf = {
    getIdentity : function(accessToken, callback, origContext) {
        org.getIdentity({oauth: getOauthObject(accessToken)}, callback.bind(origContext));
    },
    getVoiceCode : function(userId, accessToken, callback, origContext) {
        var q = "Select " + constants.VOICE_CODE_FIELD_NAME + " From " + constants.VOICE_CODE_OBJECT_NAME + 
                " Where Name = '" + userId + "' LIMIT 1";
        org.query({oauth: getOauthObject(accessToken), query: q}, callback.bind(origContext));
    },
    query : function(query, accessToken, callback, origContext) {
        var q = query;
        org.query({oauth: getOauthObject(accessToken), query: q}, callback.bind(origContext));
    },
    updateVoiceCode : function(code, userId, accessToken, callback, origContext ) {
        var q = "Select Id From " + constants.VOICE_CODE_OBJECT_NAME + 
                " Where Name = '" + userId + "' LIMIT 1";

        org.query({oauth: getOauthObject(accessToken), query: q}).then(function(resp) {
            var updated_code = nforce.createSObject(constants.VOICE_CODE_OBJECT_NAME);
            updated_code.set(constants.VOICE_CODE_FIELD_NAME, code);
            updated_code.set("Id", resp.records[0]._fields.id);
            updated_code.set("Name", userId);
            org.update({ sobject: updated_code, oauth: getOauthObject(accessToken) }, callback.bind(origContext));
        });
        
    },
    createVoiceCode : function(code, userId, accessToken, callback, origContext ) {
        var new_code = nforce.createSObject(constants.VOICE_CODE_OBJECT_NAME);
        new_code.set(constants.VOICE_CODE_FIELD_NAME, code);
        new_code.set("Name", userId);
        org.insert({ sobject: new_code, oauth: getOauthObject(accessToken) }, callback.bind(origContext));
    }
}

module.exports = sf;

function getOauthObject(accessToken) {
    // Construct our OAuth token based on the access token we were provided from Alexa
    var oauth = {};
    oauth.access_token = accessToken;
    oauth.instance_url = constants.INSTANCE_URL;
    return oauth;
}