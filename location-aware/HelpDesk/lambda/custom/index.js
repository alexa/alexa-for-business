const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const https = require('https'); // Node standard package for making https requests

const a4b = new AWS.AlexaForBusiness();

const APP_ID = '';// REPLACE THIS VALUE WITH YOUR APP ID

const welcomeMessage = 'This is a skill to show you how to use the room resolving a.p.i. in Alexa for Business';

const welcomeReprompt = "Sorry I didn't understand.  What kind of issues are you having?";

const HelpMessage = ",Try telling me 'I need help with the projector'";

const goodbyeMessage = 'OK, have a nice day.';

let alexa;

//  IF YOU USE CHIME, UNCOMMENT THE FOLLOWING SECTION AND REPLACE THE VALUE FOR "webhookPath"

/*
    const webhookHost = "hooks.chime.aws";
    const webhookPath = "<REPLACE WITH YOUR WEBHOOK PATH>";//such as /incomingwebhooks/<long string>
*/

//  IF USING SLACK, UNCOMMENT FOLLOWING SECTION AND REPLACE VALUES FOR "webhookPath" and "sChannel"

/*
    const webhookHost = "hooks.slack.com";
    const webhookPath = "<REPLACE WITH YOUR WEBHOOK PATH>";//such as /services/<long string>
    const sChannel = "<REPLACE WITH #CHANNEL NAME>"// your channel name such as "#helpdesk"
    const sIconEmoji = ":robot_face:";
*/

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
      const textToWebhook = `An issue was reported in ${data.RoomName}: "${reportedIssue}".`;// The message that will be posted to the webhook

      const req = https.request({
        method: 'POST',
        hostname: webhookHost,
        path: webhookPath,
        headers: { 'Content-Type': 'application/json' },
      }, res => {
        output = `Okay!  I've notified the Help Desk.  They're sending someone to ${data.RoomName}.  I told them you said, "${reportedIssue}"`;
      this.emit(':tell', output);
    });

      req.on('error', function (e) { console.error(`Error: ${e.message}`); });

      // UNCOMMENT NEXT BLOCK IF USING CHIME
      /*
      req.write(JSON.stringify({
        Content: textToWebhook, // The message that will be posted to Chime
      }));
      */

      // UNCOMMENT NEXT BLOCK IF USING SLACK
      /*
      req.write(JSON.stringify({
        channel: sChannel,
        username: 'webhookbot',
        text: textToWebhook,
        IconEmoji: sIconEmoji, // The message that will be posted to Slack
      }));
      */

      req.end();
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
