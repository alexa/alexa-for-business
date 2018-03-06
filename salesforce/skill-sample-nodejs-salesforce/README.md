# Private Alexa Skill With Salesforce Integration

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-off._TTH_.png)](./instructions/1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-off._TTH_.png)](./instructions/2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-off._TTH_.png)](./instructions/3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-off._TTH_.png)](./instructions/4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./instructions/5-distribute-private-skills.md)

## Introduction

This skill demonstrates how to build a private Alexa skill to access  Salesforce data. It includes using account linking, via a connected app in Salesforce, along with a voice code authentication process that stores the code as a custom setting in Salesforce.

## Pre-requisites

This is a NodeJS Lambda function and skill defintion to be used by [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html).

You need to initialize ASK CLI with 

```bash
$ ask init
```

You need an [AWS account](https://aws.amazon.com) and an [Amazon developer account](https://developer.amazon.com) to create an Alexa Skill.

In order to use the ASK CLI features to automatically deploy and manage your Lambda skill, ensure that you have AWS credentials set up with the appropriate permissions on the computer to which you are installing ASK CLI, as described in [Set Up Credentials for an Amazon Web Services (AWS) Account](https://developer.amazon.com/docs/smapi/set-up-credentials-for-an-amazon-web-services-account.html).

Clone or download this repository. Then you need to download NodeJS dependencies :

```bash
$ (cd lambda/custom && npm install)
```

You need a [Salesforce Trailhead Playground](https://trailhead.salesforce.com/en/modules/trailhead_playground_management/units/create-a-trailhead-playground).


## Objectives

Together, we'll build a skill that is invoked with the name Salesforce Demo".

```text
Alexa, open Salesforce Demo
```

Let's get started!

1. **Salesforce Setup** - Set up a Salesforce org using Trailhead Playground.
2. **Deploy** - Customize and deploy the provided skill. 
3. **Account Linking** - Create a Connected App in Salesforce to use for Account Linking to the Alexa skill.
4. **Testing** - Make sure everything works.
5. **Distribute Private Skills** - Learn about Alexa for Business and how to distribute private skills. 

[![Get Started](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_get_started._TTH_.png)](./instructions/1-salesforce-setup.md)

