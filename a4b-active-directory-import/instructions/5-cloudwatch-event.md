# Build An Alexa for Business Active Directory import function
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

[ ![ AD App Registration ](./images/1_app_reg.png) ](./1-ad-app-registration.md)[ ![ Create Secret Store ](./images/2_sec_man.png) ](./2-secrets-manager.md)[ ![ Create IAM Role ](./images/3_iam_rl.png) ](./3-iam-role.md)[ ![ Lambda Function ](./images/4_lmb_func.png) ](./4-lambda-function.md)[ ![ CloudWatch Event ](./images/5_cld_evnt.png) ](./5-cloudwatch-event.md)[ ![ Verification ](./images/6_ver.png) ](./6-testing.md)

## Setting Up A AWS CloudWatch Event Using Amazon Web Services

At this point, you should have a working copy of our A4B import of AD Users and Groups function.  In order to make it automated, you will need to create an AWS CloudWatch event to kick off the AWS Lambda function on a daily basis.  Here are the things you will need to do:

1. **Go to http://aws.amazon.com and sign in to the console.** 

    [![Developer Console](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/2-1-sign-in-to-the-console._TTH_.png)](https://console.aws.amazon.com/console/home)

2. **Click "Services" at the top of the screen, and type "CloudWatch" in the search box.**  You can also find CloudWatch in the list of services.  It is in the "Management & Governance" section.

    [![CloudWatch Events](./images/CloudWatch_Search.png)](https://console.aws.amazon.com/cloudwatch/home)

3. **Click "Events" link on the left side of the screen.** Then click the **Get started** button.

    ![CloudWatch Events](./images/Events.png)

4. Click the **Get started** button.

    ![CloudWatch Events](./images/get_started_button.png)

5. In the **Step 1: Create rule** screen, select "Schedule" under the **Event Source** section.
    Set the **Fixed rate of** to 1 for duration and type to Days.

6. Under the **Targets** section, click on the **Add target** button.

7. Ensure the drop down shows **Lambda function** for the target.

8. Search for the **Function** named "A4BUserGroupImport" in the drop down.

    ![CloudWatch Events](./images/create_rule.png)

9. Click on the **Configure details** button.

10. In the **Step 2: Configure rule details** screen, enter a Name and Description for the timed event. Click on the **Create rule** button to complete the rule.

    ![CloudWatch Events](./images/configure_rule.png)

**Note** at this point the rule will be active and start running the import process!


[![Next](./images/6_verification.png)](6-testing.md)
