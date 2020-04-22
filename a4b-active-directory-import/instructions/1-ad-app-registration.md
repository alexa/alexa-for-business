#  Build An Alexa for Business Active Directory import function
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

[ ![ AD App Registration ](./images/1_app_reg.png) ](./1-ad-app-registration.md)[ ![ Create Secret Store ](./images/2_sec_man.png) ](./2-secrets-manager.md)[ ![ Create IAM Role ](./images/3_iam_rl.png) ](./3-iam-role.md)[ ![ Lambda Function ](./images/4_lmb_func.png) ](./4-lambda-function.md)[ ![ CloudWatch Event ](./images/5_cld_evnt.png) ](./5-cloudwatch-event.md)[ ![ Verification ](./images/6_ver.png) ](./6-testing.md)

1.  **Go to the [Azure Active Directory Portal](https://portal.azure.com).  In the top-right corner of the screen, click the "Sign In" button.**
(If you don't already have an account, you will be able to create a new one for free.)

2. Once you have signed in, move your mouse over the **Azure Active Directory** text located under the Azure services section and click to enter.

    ![ AD App Registration ](./images/AzureActiveDirectory.png)

3. From the **Microsoft Azure Active Directory console** select the **App registrations** link at the left center side of the screen.

    ![ AD App Registration ](./images/appregistrationlink.png)

4. Click on the **+ New registration** button.

    ![ AD App Registration ](./images/newregistrationbutton.png)

5. In the **Register an application** screen, enter a name for the app. Example: **A4B User and Group Import Application**.

6. Select **Accounts in this organizational directory only (Single tenant)** for the Supported account types.

    ![ AD App Registration ](./images/registerapp.png)

7. Click on the **Register** button near the bottom left side of the screen. The app registration is created and the **Overview** page displays.

8. Copy the **Application ID** for use in your AWS Lambda function. This value is also referred to as the Client ID.

    ![ AD App Registration ](./images/appclientid.png)

9. Next to generate a client secret, select the **Certificates & secrets** page. Select **New client secret**.

10. Provide a **description** for the secret, and an **expires** duration.

11. When done, select **Add**. The value of the secret displays. **Copy and save this value in another location**, becuase you can't retrieve it later. 
     You will provide the secret with the Application ID in your AWS Secrets Manager for the AWS Lambda function to use later.

12. Next to add permissions, select the **API permissions** page. 

    ![ AD App Registration ](./images/apipermissions.png)

13. By default the **User.Read** permission from **Microsoft Graph** is listed. Select the **...** to the far right of the **User.Read** entry and select **Remove permission**.
     Select **Yes, remove** in the Remove permission popup.

14. Click on the **Add a permission** button, select the **Microsoft Graph** API.

     ![ AD App Registration ](./images/addpermission.png)

15. In the Microsoft Graph Request API permission screen, select the **Application permissions** box.

16. In the Application API listing, select the following permissions: **Directory.Read.All, Group.Read.All, GroupMember.Read.All, User.Read.All**.

    ![ AD App Registration ](./images/app_permissions.png)

17. Once you have selected the approrpiate permissions, click on the **Add permissions** button.

18. Next, we need to grant admin consent for the permission added. Select **Grant admin consent for tenant**. Where tenant is the name of your tenant.
     Select **Yes** on the grant admin consent popup page.

    ![ AD App Registration ](./images/grantadminconsent.png)

[![Next](./images/2_secrets_manager.png)](./2-secrets-manager.md)
