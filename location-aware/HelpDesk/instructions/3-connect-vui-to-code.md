# Build An Alexa for Business Help Desk Skill
[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](./1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-locked._TTH_.png)](./2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-on._TTH_.png)](./3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](./4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-off._TTH_.png)](./5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./6-publication.md)

## Connecting Your Voice User Interface To Your Lambda Function

On [page #1](./1-voice-user-interface.md) of this guide, we created a voice user interface for the intents and utterances we expect from our users.  On [page #2](./2-lambda-function.md), we created a Lambda function that contains all of our logic for the skill.  On this page, we need to connect those two pieces together.

1.  **Go back to the [Amazon Developer Portal](https://developer.amazon.com/edw/home.html#/skills/list) and select your skill from the list.** You may still have a browser tab open if you started at the beginning of this tutorial.

2. Select the **Endpoint** tab on the left side navigation panel.

3.  **Select the "AWS Lambda ARN" option for your endpoint.** You have the ability to host your code anywhere that you would like, but for the purposes of simplicity and frugality, we are using AWS Lambda. ([Read more about Hosting Your Own Custom Skill Web Service](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service).)  With the AWS Free Tier, you get 1,000,000 free requests per month, up to 3.2 million seconds of compute time per month. Learn more at https://aws.amazon.com/free/.  In addition, Amazon now offers [AWS Promotional Credits for developers who have live Alexa skills that incur costs on AWS related to those skills](https://developer.amazon.com/alexa-skills-kit/alexa-aws-credits).

4.  Paste your Lambda's ARN (Amazon Resource Name) into the textbox provided for **Default Region**.

5. Click the **Save Endpoints** button at the top of the main panel.

## Setting up Alexa for Business
Because our skill calls Alexa for Business' resolveRoom API, and we want to keep the skill private to our company, we'll need to setup an Alexa for Business organization and privately publish our Help Desk skill.

1. **Setup a device and room in Alexa for Business.**  Follow the instructions for the Alexa for Business [Getting Started with Shared Devices,](https://docs.aws.amazon.com/a4b/latest/ag/getting-started.html) to provision an Echo device, create a room and assign the device to that room, and create an empty skill group, and assign it to that same room.  We'll add our new private skill to that group once it's enabled, so that room can access the skill.

 *N.B.: After assigning the device to a room, make sure to unplug and re-plug in the device.  This is necessary any time you change the room assignment for a device.*

## Publish your skill privately
1. **Publish and distribute the skill privately.**  Our Lambda function will be able to access the resolveRoom API once our private skill reaches the "LIVE" stage.  Therefore in order to test the skill properly, we'll need to first privately publish it.  Follow the steps in the Alexa documentation to [Publish and Distribute a Private Skill](https://developer.amazon.com/docs/alexa-for-business/create-and-publish-private-skills-devconsole.html).  The distribution account id should match the AWS account id of your Alexa for Business organization.

### After you've marked your skill private per the above instructions:
Below are some general tips for filling out the rest of the information:

We need to add the metadata that your skill will use in the [Alexa app](http://alexa.amazon.com/spa/index.html#skills).  

1. Select the **Launch** link  from the top navigation menu.

2. Fill out the form fields per the guidance on the screen. Hover over the question mark icons for details regarding each respective field. **Fields marked with an asterisk are required!**

3.  **Write your skill descriptions.**

       *  **Spend some time coming up with an clear description of how your skill can be used.**  These descriptions show up in the list of skills available in the [Alexa app](http://alexa.amazon.com/spa/index.html#skills) for enrolled users, and in the Alexa for Business console for IT admins to assign to shared device locations.

4.  **For your example phrases, come up with the three most exciting ways a user can talk to your skill.**

    *  **Make sure that each of your example phrases are a perfect match with one of your Sample Utterances.**  We have provided a short list of things to consider as you write your example phrases:

       | Tips for Example Phrases |
       | ----------------------------------------- |
       | Example phrases **must** adhere to the [supported phrases](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/supported-phrases-to-begin-a-conversation). |
       | Example phrases **must** be based on sample utterances specified in your Intent Schema. |
       | Your first example phrase **must** include a wake word and your invocation name. |
       | Example phrases **must** provide a contextual response. |

    *  **Choose three example phrases that are likely to be the most common ways that users will attempt to interact with your skill.**  Make sure that each of them works well, and provides an excellent user experience.

5.  **Create your skill's icons.**  You need two sizes of your icon: 108x108px and 512x512px.


    *  **Make sure you have the rights to the icons you create.** Please don't violate any trademarks or copyrights.
    *  **If you don't have software to make icons, try one of these free options:**

       *  [GIMP](https://www.gimp.org/) (Windows/Mac/Linux)
       *  [Paint.NET](http://www.getpaint.net/index.html) (Windows)
       *  [Inkscape](http://inkscape.org) (Windows/Mac/Linux)
       *  [Iconion](http://iconion.com/) (Windows/Mac)

    *  To make it easier to get started, we've created blank versions of these icons in both sizes for many formats:

       *  [PSD](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/psd._TTH_.zip)
       *  [PNG](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/png._TTH_.zip)
       *  [GIF](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/gif._TTH_.zip)
       *  [PDF](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/pdf._TTH_.zip)
       *  [JPG](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/jpg._TTH_.zip)
       *  [SVG](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/svg._TTH_.zip)
       *  [PDN](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/pdn._TTH_.zip) - for [Paint.NET](http://www.getpaint.net/index.html)
       *  [XCF](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/xcf._TTH_.zip) - for [GIMP](https://www.gimp.org/)

6. Choose the most appropriate category for your skill.

7.  **Provide a list of keywords for users that are searching for new skills.**  This is an optional field, you can leave it blank for this Help Desk skill.

8. **Privacy Policy URL.** This is an optional field, and should not be required for this Help Desk skill sample.  You can leave it blank.

9. **Terms of Use URL.** This is also optional, and you can leave it blank.

10. When you're ready, click **Save and Continue** at the bottom of the screen to move onto **Privacy & Compliance**

11. *  **Does this skill allow users to make purchases or spend real money?** 
	 
	 For this Help Desk skill, the answer is no.  For future skills, make sure you answer this appropriately.

   *  **Does this Alexa skill collect users' personal information?** 
    
	 Again, for this Help Desk skill, the answer is no.  If you do collect information about a user, such as names, email addresses, phone numbers, and so forth, ensure that you answer Yes to this question.
        *  Answering "yes" to this question will also require you to provide a link to your Privacy Policy at the bottom of the page.

   *  **Is your skill directed to children under the age of 13?** 
   
	 Because you customized this skill with data you provided, it is possible that you created a skill that targets children under the age of 13.  For this Help Desk skill, the answer is **no** because it doesn't target a specific age group.
        * Factors to consider in determining if this skill is directed to children under 13 include:
            * Subject matter of the skill
            * Presence of child-oriented activities and incentives
            * Type of language used in the skill
            * Music and other audio content in the skill
            * How the skill is described and marketed
            * Intended audience for the skill

            If you're not sure, please see the [FTC's COPPA Guidance and FAQ](https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions) for more information.

12.  **Export Compliance.** Be certain that you agree with all of the conditions.  If you do, check this box. 

13. **Provide testing instructions.**  A value is required in this box but this is related to certification and is not required- simply put some text in here that advises that this is a private skill and does not require certification.

14. Click the **Save and Continue** button at the bottom of the page.

15. **You're done with your private skill submission!**  Here are a few things you might need to know:

    *  **Although private skills don't need certification, it may take up to 2 hours to reach LIVE stage.** You can check the list of skills from the Developer Console to see when your skill reaches LIVE stage.  Until that time you cannot distribute your skill to any Alexa for Business organizations.

    *  **Did something go wrong?** A team of Alexa evangelists run [online office hours every Tuesday from 1-2pm Pacific Time](https://attendee.gotowebinar.com/rt/8389200425172113931).  They can help answer any questions you might have on Alexa skills in general.

## Once your private skill is LIVE

1. **Enable the skill and add it to your skill group.**  Once your private skill has reached the **LIVE** stage, navigate to the Alexa for Business AWS console, and click on "**Skills**" in the left nav pane.  Click on the "Private Skills" tab, find the Help Desk skill you created, then click on **Review** and **Enable**.  

2. **Add your Help Desk skill to the room's skill group.**  Next, add the skill you enabled to the skill group you created in **Step 1 of Setting up Alexa for Business,** by following the instructions under ["To add or remove skills for an existing skill group."](https://docs.aws.amazon.com/a4b/latest/ag/manage-skill-groups.html)

 At this point, your Help Desk skill is enabled, and assigned to your Alexa for Business room, because it's a member of the skill group assigned to that room.  Furthermore, the device you have provisioned is also assigned to that same room, meaning that requests invoked from that device will be able to access the Help Desk skill.

3. **Click the "Next" button to continue to page #4 of this guide.**

 <br/><br/>
<a href="./4-testing.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_testing._TTH_.png" /></a>
