/*
Information on configuring webhooks for:
  Chime:  https://docs.aws.amazon.com/chime/latest/ug/webhooks.html
  Slack: https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack 
  Teams:  https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/connectors#setting-up-a-custom-incoming-webhook 
*/

//import required modules
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const https = require('https'); // Node standard package for making https requests

// Only the next two lines require updating as environment variables in Lambda.
const chatProvider = process.env.CHAT_PROVIDER; // Options are "chime", "slack", or "teams".
const webhookPath = process.env.WEBHOOK_URI; // examples: /services/<long string> or /webhook/<long string>

const APP_ID = '';// REPLACE THIS VALUE WITH YOUR Skill ID

// various messages that can be updated for the skill
const welcomeMessage = 'This is a skill to show you how to use the room resolving a.p.i. in Alexa for Business';
const welcomeReprompt = "Sorry I didn't understand.  What kind of issues are you having?";
const HelpMessage = ",Try telling me 'I need help with the projector'";
const goodbyeMessage = 'OK, have a nice day.';

const a4b = new AWS.AlexaForBusiness();

let alexa;

const sessionHandlers = {
  'LaunchRequest': function () {
    const output = welcomeMessage + HelpMessage;
    this.emit(':ask', output, output);
  },
  'sendIssue': function () {
    const params = {
      UserId: this.event.context.System.user.userId,
      SkillId: this.event.context.System.application.applicationId,
    };

    a4b.resolveRoom(params, handleResolveRoom.bind(this));
  },

  'AMAZON.HelpIntent': function () {
    const output = HelpMessage;
    this.emit(':ask', output, output);
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', goodbyeMessage);
  },
  'AMAZON.CancelIntent': function () {
    // Use this function to clear up and save any data needed between sessions
    this.emit(':tell', goodbyeMessage);
  },
  'SessionEndedRequest': function () {
    // Use this function to clear up and save any data needed between sessions
    this.emit('AMAZON.StopIntent');
  },
  'Unhandled': function () {
    const output = HelpMessage;
    this.emit(':ask', output, welcomeReprompt);
  },
};

function handleResolveRoom(err, data) {
  let output = '';
  // parse the issue
  const issueSlot = this.event.request.intent.slots.issue;
  const reportedIssue = issueSlot.value;

  if (err) {
    if (err.code.includes('InvalidParameterException')) {
      if (err.message.includes('User ID')) {
        output += 'This device is either not assigned to a room or is in a personal account.';
      } else {
        output += "I don't recognize the account that is being used for this call. ";
        output += 'Make sure you have placed the skill in a skill group that is assigned to the room with this device.';
      }
      this.emit(':tell', output);
    } else {
      this.emit(':tell', 'I encountered an error with the call.');
    }
  } else {
    if (data && data.RoomName) {
      const textToWebhook = `An issue was reported in ${data.RoomName}: ${reportedIssue}`;// The message that will be posted to the webhook

      switch (chatProvider) {

        // Amazon Chime specific information
        case "chime":
          var webhookHost = "hooks.chime.aws";
          var body = (JSON.stringify({
            Content: textToWebhook, // The message that will be posted to Chime
          }));
          var headerInfo = { 'Content-Type': 'application/json' };
          break;

        case "slack": // Slack specific information:
          var webhookHost = "hooks.slack.com";
          var body = (JSON.stringify({
            username: 'AlexaWebHookBot',
            text: textToWebhook, // The message that will be posted to Slack
          }));
          var headerInfo = { 'Content-Type': 'application/json' };
          break;

        case "teams": // Microsoft Teams specific information:
          var webhookHost = "outlook.office.com";
          var body = JSON.stringify({
            text: textToWebhook, // The message that will be posted to Microsoft Teams
          });
          var headerInfo = {
            'Content-Type': 'application/json',
            'content-length': body.length
          };
          break;

        default: // Amazon Chime specific information in case nothing is specified
          var webhookHost = "hooks.chime.aws";
          var body = (JSON.stringify({
            Content: textToWebhook, // The message that will be posted to Amazon Chime
          }));
          var headerInfo = { 'Content-Type': 'application/json' };
          break;
      }

      const req = https.request({
        method: 'POST',
        hostname: webhookHost,
        path: webhookPath,
        headers: headerInfo,
      }, res => {
        output = `Okay!  I've notified the Help Desk.  They're sending someone to ${data.RoomName}.  I told them you said, ${reportedIssue}`;
        this.emit(':tell', output);
      });

      req.write(body);
      req.end();
      req.on('error', function (e) { console.log(`Error: ${e.message}`); });

    } else {
      output += 'This device is not assigned to a room.';
      this.emit(':tell', output);
    }
  }
}

exports.handler = function (event, context) {
  alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(sessionHandlers);
  alexa.execute();
};