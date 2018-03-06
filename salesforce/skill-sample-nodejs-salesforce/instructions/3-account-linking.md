# Private Alexa Skill With Salesforce Integration

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-done._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-on._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-off._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 3: Account Linking

### Obtain Your Amazon Developer Account Linking Redirect URLs
In order to set up your Salesforce Connected App, you need your Amazon Developer Account Linking Redirect URLs. This is specific to your Amazon Developer account. You do not need to save any settings on this page at this time.

1. Go to ```https://developer.amazon.com/edw/home.html#/skill/<Skill ID>/en_US/configuration```. 
2. Under Account Linking, click **Yes**.
3. Copy and store the three URLs that show next to Redirect URLs. They will look like this: 
  * ```https://alexa.amazon.co.jp/api/skill/link/<Vendor ID> ```
  * ```https://layla.amazon.com/api/skill/link/<Vendor ID> ```
  * ```https://pitangui.amazon.com/api/skill/link/<Vendor ID>```

### Create a Connected App in Salesforce

1. Launch your Trailhead Playground org and click the **Setup** icon in the top right, then select the Setup link.
2. Enter **App Manager** into the Quick Find box and then select **App Manager**.
3. Click **New Connected App**.
4. In the New Connected App form, fill in:
  * Basic Information:
    * Connected App Name: **Alexa Skill**
    * API Name: **Alexa_Skill**
    * Contact Email: **enter your email address**
  * API (Enable OAuth Settings):
    * Check **Enable OAuth Settings**.
    * For Callback URL, use the **Redirect URLs** from the previous step.
    * In Selected OAuth Scopes, select **Access and manage your data (api)**.
    * Click **Add**.
    * In Selected OAuth Scopes, select **Perform requests on your behalf at any time (refresh_token, offline_access)**.
    * Click **Add**. 
  * Click **Save**. 
  * Click **Continue**.
5. Click **App Manager** again. Locate your newly created Alexa Skill and click the dropdown arrow on the far right. Select **View**.
6. Copy and store the **Consumer Key** and the **Consumer Secret** (click the Click to reveal button to see the secret key). You will need this shortly.

### Update Your Skill to Link to Your Salesforce Org
With the details set in your Trailhead Playground Org, we can set up account linking with the Alexa skill we created earlier.

1. Go back to the ASK CLI. Enter the following command and fill out the resulting entries using your Connected App settings:

```
$ ask api create-account-linking -s <Skill ID>
? Authorization URL:  https://login.salesforce.com/services/oauth2/authorize
? Client ID:  <Your Client ID>
? Scopes(separate by comma):  api,refresh_token
? Domains(separate by comma):  
? Authorization Grant Type:  AUTH_CODE
? Access Token URI:  https://login.salesforce.com/services/oauth2/token
? Client Secret:  [hidden] <Your Client Secret>
? Client Authentication Scheme:  REQUEST_BODY_CREDENTIALS
Account Linking created successfully.
```


[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./4-testing.md)
