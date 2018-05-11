# Build An Alexa for Business Help Desk Skill

[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](./1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-on._TTH_.png)](./2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-off._TTH_.png)](./3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](./4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-off._TTH_.png)](./5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./6-publication.md)

## Setting Up A Lambda Function Using Amazon Web Services

In the [first step of this guide](./1-voice-user-interface.md), we built the Voice User Interface (VUI) for our Alexa skill.  On this page, we will be creating an AWS Lambda function using [Amazon Web Services](http://aws.amazon.com).  You can [read more about what a Lambda function is](http://aws.amazon.com/lambda), but for the purposes of this guide, what you need to know is that AWS Lambda is where our code lives.  When a user asks Alexa to use our skill, it is our AWS Lambda function that interprets the appropriate interaction, and provides the conversation back to the user.

1.  **Go to http://aws.amazon.com and sign in to the console.** If you don't already have an account, you will need to create one.  [If you don't have an AWS account, check out this quick walkthrough for setting it up](https://github.com/alexa/alexa-cookbook/tree/master/aws/set-up-aws.md).

    <a href="https://console.aws.amazon.com/console/home" target="_new"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-1-sign-in-to-the-console._TTH_.png" /></a>

2.  **Click "Services" at the top of the screen, and type "Lambda" in the search box.**  You can also find Lambda in the list of services.  It is in the "Compute" section.

    <a href="https://console.aws.amazon.com/lambda/home" target="_new"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-2-services-lambda._TTH_.png" /></a>

3.  **Check your AWS region.** Make sure you create a Lambda in the US East (N. Virginia) region.

    <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-3-check-region._TTH_.png"/>

4.  **Click the "Create a Lambda function" button.** It should be near the top of your screen.  (If you don't see this button, it is because you haven't created a Lambda function before.  Click the blue "Get Started" button near the center of your screen.)

    <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-4-create-a-lambda-function._TTH_.png" />

5.  **There are two boxes labeled "Author from scratch" and "Blueprints". Click the radio button in the box titled "Blueprints" then choose the blueprint named "alexa-skill-kit-sdk-factskill".** We have created a blueprint as a shortcut to getting everything set up for your skill. You can search for a blueprint using the provided search box.  This blueprint adds the alexa-sdk to your Lambda function so that you don't have to upload it yourself.

    <!-- <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/2-5-blueprint._TTH_.png" />  <!--TODO: THIS IMAGE NEEDS TO BE CUSTOMIZED FOR YOUR SKILL TEMPLATE, THIS ONE IS OUT OF DATE. -->

6.  **Configure your function.** This screen is where we will enter the important parts of our Lambda function.  These values will only ever be visible to you, but make sure that you name your function something meaningful.

  <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-7-configure-your-function._TTH_.png" />

7.  **Set up your Lambda function role.**  To create an associated role for your Lambda function to use, follow this [detailed walkthrough for setting up your first role for Lambda](https://github.com/alexa/alexa-cookbook/tree/master/aws/lambda-role.md).  Follow the instructions there with the exception of the role name- we'll call this "lambda\_basic\_execution\_plus\_a4bResolveRoom."

 Note that we'll need to edit the newly IAM role after creating the function since at this point we haven't added any Alexa for Business permissions.

8. **Click Create Function in the bottom right corner.**  You will need to scroll down to find **Create Function.**

    <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-11-create-function-button._TTH_.png" />


9. **Configure your trigger.** Look at the column on the left called "Add triggers", and select Alexa Skills Kit from the list.  If you don't see Alexa Skills Kit in the list, jump back to step #3 on this page.

    <!-- <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-6-configure-your-trigger._TTH_.png" /> TODO: THIS SCREENSHOT IS OUT OF DATE-->

10. Once you have selected Alexa Skills Kit, scroll down. Under Configure triggers, select Enable for Skill ID verification. A skill ID Edit box should appear. We will now retrieve your Skill ID from the developer portal.

11. Now lets secure this lambda function, so that it can only be invoked by your skill. Open up the [developer portal](https://developer.amazon.com/alexa/console/ask)

12. Underneath your skill name you should see a link called "View Skill ID." Click that link and a popup should appear.
    
13. Copy the **Application ID** provided in the popup window. This is also known as a skill ID, and is unique to your skill.

14. Return back to your lambda function in the AWS console. You may already have this browser tab open from **Step 11**. Otherwise, open the lambda console by clicking here: [AWS Console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions) and selecting the appropriate function. Scroll down to **Configure triggers**, paste the Skill ID in the Skill ID edit box.

15. Click the **Add** button. Then click the **Save** button in the top right. You should see a green success message at the top of your screen. Now, click the box that has the Lambda icon followed by the name of your function and scroll down to the field called "Function code".

16. Delete the contents of the code box, and **copy and paste the [provided code](../lambda/custom/index.js) into the Lambda function code box.**   

 Click "Save".

17. **Scroll to the top of the page. The ARN value for this Lambda function should be in the top right corner. Copy this value for use in the next section of the guide.**

    <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/2-12-copy-ARN._TTH_.png" />  <!--TODO: THIS IMAGE NEEDS TO BE CUSTOMIZED FOR YOUR SKILL TEMPLATE. -->
    
18. **Edit the IAM role for your Lambda function.**  Now we'll add the IAM permissions for the Lambda function to call Alexa for Business' resolveRoom API.

 In the AWS console, click on "Services", then type in "IAM" into the search box and select IAM.  Click on "Roles" in the left nav pane, enter 'lambda\_basic\_execution\_plus\_a4bResolveRoom' into the search box and click the link to view the role.
 
 Click **Add inline policy** at the bottom right of the screen, then select the JSON tab, **delete the contents** of the text box, then **copy and paste** the included [IAM policy](../a4bIAMpolicy.json) into the box.  Click **Review Policy** on the bottom right of the screen, and enter "a4bResolveRead" as the policy name, then click **Create Policy** on the bottom right.
 
 Your Lambda function now has the ability to call the Alexa for Business resolveRoom API.
 
19. **Set up the chat and webhook that your Lambda function will call**

 If your Help Desk skill will call Chime, create a chat room for your Help Desk and a webhook for that room, following these [Chime instructions](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html).
 
 For Slack, create a webhook integration for your Help Desk channel using these [Slack instructions](https://api.slack.com/incoming-webhooks).

 For Teams, create a webhook integration for your Help Desk channel using these [Microsoft Teams instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/connectors#setting-up-a-custom-incoming-webhook).

20. **Edit your lambda function to function with Chime, Slack, or Teams, and provide the webhook uri.**
 In the Lambda console, create two environment variables named CHAT_PROVIDER and WEBHOOK_URI.
 Set the CHAT_PROVIDER environment variable with the vendor you created a webhook for in **Step 19**  valid options are chime, slack, or teams.
 
 Next, update the WEBHOOK_URI environment variable and add the URI path of the webhook you created in **Step 19**.
 Examples: "/services/long-string" or "/webhook/long-string"
 
 Sample of the values set in a case using Teams:

 <img src="./img/EnvironmentVariables.JPG"/>
 
<!--21. **Add the request module to the AWS Lambda function.** - Removed this section as it's not required.  The skill using https, which is a built in node module.
Because we'll use the **request** module to perform our HTTPS POST from the Lambda to the Help Desk chat's webhook uri, we need to add the module to our Lambda function.  We'll do so by exporting the Lambda function's deployment package, adding the additional module in via "**npm install request**," then re-uploading the modified package.

 **Export your existing Lambda function** from the AWS console, by navigating to your Lambda function, then clicking on **Actions > Export function.** Click on **Download deployment package** to get the zip file.  Follow the [instructions for adding a node module to a Lambda package](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html) and add the request module.  For our purposes, and because AWS Lambda already natively supports the AWS SDK, you'll only need 4 node modules: the alexa sdk, the 2 i18next modules, and the request module we're adding.  The other node_modules can be removed for our purposes to keep the Lambda size fairly lean when you re-upload it.  
 
 When ready with your new zipped deployment package, **upload your code** by navigating to the AWS console, and in the section for **Function code** for your Lambda, go to the dropdown box for **Code entry type** and select **Upload a .ZIP file.**  Select your modified Lambda package and upload it. -->

   <br/><br/>
   <a href="./3-connect-vui-to-code.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_connect_vui_to_code._TTH_.png"/></a>
