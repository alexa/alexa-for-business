# Deploy
 
[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-on._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-off._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-off._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 2: Customize and Deploy the Skill 

In this part, we will deploy our skill and create the AWS Lambda function that powers it. First, you need to update the constants.js file in order to match your setup.

### Setup

1. ```./lambda/custom/constants.js```

   Modify these values in constants.js file : Salesforce instance URL and the name of your Voice Code custom setting and field name. There are other fields here we will modify later, so this won't be the last time you will be edit this file.

```javascript
    // Salesforce Constants
    INSTANCE_URL : '', // TODO Set your own
    VOICE_CODE_OBJECT_NAME : 'voice_code__c', // TODO set your own or use this value when configuring Salesforce
    VOICE_CODE_FIELD_NAME : 'code__c', // TODO set your own or use this value when configuring Salesforce
```


### Deployment

ASK will create the skill and the lambda function for you.

Lambda function will be creadted in ```us-east-1``` (Northern Virginia) by default.

1. You deploy the skill and the lambda function in one step :

```bash
$ ask deploy 
-------------------- Create Skill Project --------------------
ask profile for the deployment: default
Skill Id: amzn1.ask.skill.<Skill ID>
Skill deployment finished.
Model deployment finished.
Lambda deployment finished.
```

2. Make sure to save your skill ID returned in the previous output. We’ll use that often in the future steps.

### Grant Permission for Lambda to Call DynamoDB

The standard execution role that is used for Lambda doesn’t allow permission to access DynamoDB. In order to fix that, you need to add a policy to the role that runs the Lambda function. 

1. From the AWS Console, type **IAM** in the AWS services search box at the top of the page.
2. Click **Roles**.
3. Find the role that was automatically created for this Lambda function. It should be called **ask-lambda-Salesforce-Demo**. Click on it.
4. In the Permissions tab, click **Attach policy**.
5. In the search box, search for **AmazonDynamoDBFullAccess** and then check the box next to the policy that shows up.
6. Click **Attach policy** at the bottom right.

### Enable Testing

In order to test the skill before publishing, you need to enable testing on the  Alexa Developer Console.

You can directly jump to the page by substituting your Skill ID into the following URL: ```https://developer.amazon.com/edw/home.html#/skill/<Skill ID>/en_US/testing```

Click the slider next to Disabled for testing. It should now say Enabled.

### Simulate

1. Run the following command to execute a command against your skill:

```
$ ask simulate -l en-US -t "alexa, open salesforce"
✓ Simulation created for simulation id: 0c857923-0753-43a5-b44c-ee2fca137aab
◜ Waiting for simulation response{
  "status": "SUCCESSFUL",
  "result": {
...
```

2. Check for the output message to also see what Alexa would have said:

```
...
"outputSpeech": {
  "type": "SSML",
  "ssml": "<speak> Welcome to the Salesforce Integration Skill. You can ask for your identity, your contacts or to set your voice code. </speak>"
},
...
```

## Extra Credit

### Modify Lambda to Only Respond to Your Skill (optional but recommended)

1. Modify the following value in ```./lambda/custom/constants.js``` file using the skill ID you just obtained: appId

```javascript
    appId: '';
```
2. Run the deploy command again to update your Lambda function with the latest change.

```bash
$ ask deploy 
```

[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./3-account-linking.md)
