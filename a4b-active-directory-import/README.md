#  Build An Active Directory to Alexa for Business import function (US)
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

## Overview

In this workshop you will create a function called A4BUserGroupImport that imports 
Azure Active Directory users and groups into Alexa for Business Directory.
When launched, this AWS Lambda function will authenticate with Active Directory,
retrieve Users and Groups based on a filter you enter. Once all of the required information
is collected, it will then create contacts from the users and Address Books from the group names.

Through this workshop, you'll learn how to use advanced Alexa for Business and 
AWS Secrets Manager features to create and configure an AWS Lambda function. The features you'll
learn to use are using OAuth2 authentication and Active Directory api calls to retrieve users and groups.
You will also learn how to leverage the AWS Secrets Manager to securely store the applicationId and 
clientSecret used for OAuth2 authentication. Finally you will use the Alexa for Business API calls to create
or update contact and address books. All this done through automation via CloudWatch events.

If you are familiar with AWS Serverless Application Model, the repository comes with a **template.yaml** to run the creation of the IAM role with specific permissions, Lambda function, and CloudWatch Event Schedule for you. So all you have to do is configure the first two sections dealing with Azure Active Directory and AWS Secrets Manager, then test! 


To **Get Started** click the button below:
 
[![Get Started](https://camo.githubusercontent.com/db9b9ce26327ad3bac57ec4daf0961a382d75790/68747470733a2f2f6d2e6d656469612d616d617a6f6e2e636f6d2f696d616765732f472f30312f6d6f62696c652d617070732f6465782f616c6578612f616c6578612d736b696c6c732d6b69742f7475746f7269616c732f67656e6572616c2f627574746f6e732f627574746f6e5f6765745f737461727465642e5f5454485f2e706e67)](./instructions/1-ad-app-registration.md)

## Additional Resources

### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Understand Alexa for Business](https://developer.amazon.com/en-US/docs/alexa/alexa-for-business/understand-alexa-for-business.html) - A great resource for learning Alexa for Business.

### Documentation
* [Official Alexa for Business kit Node.js SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AlexaForBusiness.html) - The Official Node.js SDK Documentation
* [Azure App Identity](https://docs.microsoft.com/en-us/azure-stack/operator/azure-stack-create-service-principals?view=azs-1910) - How to create an app identity in Azure
* [Microsoft Graph Filter parameters](https://docs.microsoft.com/en-us/graph/query-parameters#filter-parameter) - Offical documentation on Microsoft Graph filter parameters
* [Alexa for Business service limits](https://docs.aws.amazon.com/general/latest/gr/alexaforbusiness.html) - Official Alexa for Business service limits
