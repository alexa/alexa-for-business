# Salesforce Setup

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-on._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-off._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-off._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-off._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 1: Create a Salesforce Trailhead Playground

In order to build our skill, you need a Salesforce org to interact with. A Salesforce Trailhead Playground is free and allows you to create everything you will need to complete this skill.

1. Go to the [Trailhead Playground Management Module](https://trailhead.salesforce.com/modules/trailhead_playground_management) to create a Trailhead Playground (TP) org.
2. Complete units 1 & 2 in order to set up your TP and obtain your username and login credentials. 

## Part 2: Create a Voice Code Custom Setting.

A voice code can help identify the current user. The first time someone uses an Alexa skill with a voice code requirement, the user will be able to set a 4-digit code. You store the code in a custom setting in Salesforce.

### Create a protected custom setting.
1. Enter **Custom Settings** into the Quick Find box and then select **Custom Settings**.
2. Click **New**.
3. In the new Custom Setting Definition form, fill in:
  * Label: **Voice Code**
  * Object name: **Voice_Code**
  * Setting Type: **List**
  * Visibility: **Protected**
  * Click **Save**.
4. In the Voice Code Custom Settings Definition page, click **New** in the Custom Fields table.
5. Choose type **Text**.
6. Click **Next**.
7. In the New Custom Field form, fill in:
  * Field Label: **code**
  * Length: **60**
  * Field Name: **code**
  * Required: **Check the box** to require a value when saving a record
  * Click **Next**.
8. Click **Save**.

## Extra Credit

To earn a Trailhead badge, go back and finish up unit 3 in the [Trailhead Playground Management Module](https://trailhead.salesforce.com/modules/trailhead_playground_management) .

[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./2-deploy.md)
