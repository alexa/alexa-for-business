# Build An Alexa for Business Help Desk Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png" />

[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-off._TTH_.png)](1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-off._TTH_.png)](2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-off._TTH_.png)](3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-off._TTH_.png)](5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](6-publication.md)

# How to Build An Alexa for Business Help Desk Skill


## What You Will Learn
*  [AWS Lambda](http://aws.amazon.com/lambda)
*  [Alexa Skills Kit (ASK)](https://developer.amazon.com/alexa-skills-kit)
*  Voice User Interface (VUI) Design
*  Submitting an Alexa for Business private skill
*  Distributing a private skill to an Alexa for Business organization
*  Creating a room in Alexa for Business
*  Adding a device to a room
*  Adding a skill to a skill group
*  Adding a skill group to a room
*  AMAZON.Literal Slot usage
*  Making a webhook POST call from AWS Lambda to Amazon Chime, Slack, or Microsoft Teams

## What You Will Need
*  [Amazon Developer Portal Account](http://developer.amazon.com)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code provided in this repository.
*  An Echo Plus, Echo, or Echo Dot (2nd generation)
*  A Chime room or Slack channel with webhook integration

## What Your Skill Will Do
This is a sample Help Desk skill where a user in a conference room can simply tell Alexa about an in-room issue, saying for example, 'Alexa, tell Help Desk the projector is broken,' and the issue is reported to to a Help Desk team via a webhook call to Chime, Slack, or Teams.

## Location aware skills using resolveRoom API
This Help Desk skill demonstrates the ability for a private skill deployed on a [shared device](https://docs.aws.amazon.com/a4b/latest/ag/getting-started.html) to use the resolveRoom API, to determine the location of the user.

### Not GPS / address
Note that this is not GPS / address awareness.  If a user grants the appropriate permissions, an Alexa skill can discover the configured address of the user's device which is useful for purposes of fulfilling their request.  "Order a pizza," for example, might discover the user's address to check pricing or delivery range.

### Deployment location use cases
However, for enterprise skills, oftentimes the address isn't enough- for example, knowing which conference room the request is coming from may be important for a Help Desk skill.  With Alexa for Business, a device can be assigned to a specific conference room, so that when someone in that room says, "Tell Help Desk the projector lamp needs to be replaced", the skill can determine the room name without the user having to provide that information.

Location awareness provided by Alexa for Business' resolveRoom API may also be useful for scenarios involving print/copy stations, kitchen equipment, utility meters, and so on.

<a href="1-voice-user-interface.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_get_started._TTH_.png" /></a>

<img height="1" width="1" src="https://www.facebook.com/tr?id=1847448698846169&ev=PageView&noscript=1"/>
