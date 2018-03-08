# Build An Alexa Help Desk Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-off._TTH_.png)](./instructions/1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-off._TTH_.png)](./instructions/2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-off._TTH_.png)](./instructions/3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](./instructions/4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-off._TTH_.png)](./instructions/5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./instructions/6-publication.md)

This Alexa sample skill is a template for a basic Help Desk skill that will use the Alexa for Business resolveRoom API to post an issue from a user to Amazon Chime or Slack, using a simple web-hook https POST.  

# Let's Get Started
If this is your first time here, you're new to Alexa Skills Development, or you're looking for more detailed instructions, click the **Get Started** button below:

<p align='center'>
<a href='./instructions/0-intro.md'><img src='https://camo.githubusercontent.com/db9b9ce26327ad3bac57ec4daf0961a382d75790/68747470733a2f2f6d2e6d656469612d616d617a6f6e2e636f6d2f696d616765732f472f30312f6d6f62696c652d617070732f6465782f616c6578612f616c6578612d736b696c6c732d6b69742f7475746f7269616c732f67656e6572616c2f627574746f6e732f627574746f6e5f6765745f737461727465642e5f5454485f2e706e67'></a>
</p>


Be sure to take a look at the [Additional Resources](#additional-resources) at the bottom of this page!


## About
**Note:** The rest of this readme assumes you have your developer environment ready to go and that you have some familiarity with CLI (Command Line Interface) Tools, [AWS](https://aws.amazon.com/), and the [ASK Developer Portal](https://developer.amazon.com/alexa-skills-kit). If not, [click here](./instructions/0-intro.md) for a more detailed walkthrough.



### Usage

```text
Alexa, tell Help Desk the projector lamp is broken
>>> Okay, I've notified the Help Desk.  They're sending someone to <your room location>.  I've told them you said, "<uses your literal utterance>".
>>> (your Chime or Slack web-hook is called as well at this time)
```

### Repository Contents
* `/.ask`	- [ASK CLI (Command Line Interface) Configuration](https://developer.amazon.com/docs/smapi/ask-cli-intro.html)	 
* `/lambda/custom` - Back-End Logic for the Alexa Skill hosted on [AWS Lambda](https://aws.amazon.com/lambda/)
* `/models` - Voice User Interface and Language Specific Interaction Models
* `/instructions` - Step-by-Step Instructions for Getting Started
* `skill.json`	- [Skill Manifest](https://developer.amazon.com/docs/smapi/skill-manifest.html)

## Setup w/ ASK CLI

### Pre-requisites

* Node.js (> v6.10)
* Register for an [AWS Account](https://aws.amazon.com/)
* Register for an [Amazon Developer Account](https://developer.amazon.com/)
* Install and Setup [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)

### Installation
1. Clone the repository.

	```bash
	$ git clone https://github.com/alexa/alexa-for-business/location-aware
	```

2. Initialize the [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) by Navigating into the repository and running npm command: `ask init`. Follow the prompts.

	```bash
	$ cd HelpDesk
	$ ask init
	```

3. Install npm dependencies by navigating into the `/lambda/custom` directory and running the npm command: `npm install`

	```bash
	$ cd lambda/custom
	$ npm install
	```
4. Uncomment 2 sections inside the Lambda index.js code in the `/lambda/custom` directory, depending on whether you'll be using Chime or Slack (there will be 2 sections to uncomment), and **replace the values for your chat channel and web-hook**.

5. Edit .ask/config if you're using a different ASK profile, by replacing "default" with your profile name.

### Deployment

ASK CLI will create the skill and the Lambda function for you. The Lambda function will be created in ```us-east-1 (Northern Virginia)``` by default.

1. Deploy the skill and the Lambda function in one step by running the following commands, from the top level directory:

	```bash
	$ cd HelpDesk
	$ ask deploy -t all --profilename <your profile name>
	```
 Note that this will deploy your Lambda function but not the IAM policy for the Lambda to use resolveRoom, so we'll need to add that in a later step.
 
### Submit your skill
Now that the skill and Lambda function are deployed you'll want to submit the skill as a private skill.  (Note the skill.json is already set to PRIVATE distribution.)

    $ ask api submit -s <skill id> --profilename <your profile name>

### Add the IAM policy for your Lambda
While waiting for the skill to go to LIVE stage, open the Lambda function in your AWS console.  The Lambda will be named **a4b-helpdesk**.  Delete and re-add the trigger if you'd like to restrict by your Skill ID (recommended).  Then scroll down past the Lambda code in the console, to **Execution role**.  

 You'll see a basic execution role has been created called **ask-lambda-Help-Desk**.  Go to IAM | Roles in the AWS console, and edit this role.  Leave the existing basic execution policy in place and add an inline policy, replacing the default contents with the policy in the file provided in the repository, **a4bIAMpolicy.json**.  You can name the inline policy something like **a4bAllowResolveRoom**.

### Distribute your skill
When your skill reaches **LIVE** stage (this may take up to 2 hours), distribute your skill to your company's Alexa for Business org.

	$ ask api add-private-distribution-account <-s|--skill-id {skillId}> --stage live <--account-id {IAM ARN of the Alexa for Business org that you want to distribute to}>

The account id above will be in the format of: ```arn:aws:iam::123456789012:root``` where the 12 digit number is the AWS account id of the Alexa for Business org that you want to distribute your skill to.

### Testing

1. To test this skill, since it uses Alexa for Business' resolveRoom API to determine room location, you'll need to have an Alexa for Business room setup with an assigned device, then add this as a (LIVE) private skill to a skill group assigned to the room.  If you're not familiar with Alexa for Business device, room, and skill group setup, see the instructions in [**Connect VUI to Code**](instructions/3-connect-vui-to-code.md) in this repository.

2. Once your skill is enabled and assigned to a room with a shared device via a skill group, your skill can be tested on that device by saying:

	```text
	Alexa, tell Help Desk <whatever the reported issue is>
	```

 Alexa will respond back with a confirmation, and will chat the issue along with the room name associated with the device you reported the issue on, via a web-hook to Chime or Slack, based on the parameters that you provided in the Lambda function.

## Customization

1. ```./skill.json```

   Change the skill name, example phrase, icons, testing instructions etc ...

   Remember that many information is locale-specific and must be changed for each locale (en-GB and en-US)

   See the Skill [Manifest Documentation](https://developer.amazon.com/docs/smapi/skill-manifest.html) for more information.

2. ```./lambda/custom/index.js```

   Modify messages, and facts from the source code to customize the skill.

3. ```./models/*.json```

	Change the model definition to replace the invocation name and the sample phrase for each intent.  Repeat the operation for each locale you are planning to support.

## Additional Resources

### Alexa for Business
* [Alexa for Business Getting Started](
### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Voice Design Guide](https://developer.amazon.com/designing-for-voice/) - A great resource for learning conversational and voice user interface design.
* [CodeAcademy: Learn Alexa](https://www.codecademy.com/learn/learn-alexa) - Learn how to build an Alexa Skill from within your browser with this beginner friendly tutorial on CodeAcademy!

###Documentation
* [Official Alexa Skills Kit Node.js SDK](https://www.npmjs.com/package/alexa-sdk) - The Official Node.js SDK Documentation
*  [Official Alexa Skills Kit Documentation](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html) - Official Alexa Skills Kit Documentation

<img height="1" width="1" src="https://www.facebook.com/tr?id=1847448698846169&ev=PageView&noscript=1"/>
