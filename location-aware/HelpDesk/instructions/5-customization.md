# Build An Alexa for Business Help Desk Skill

[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](./1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-locked._TTH_.png)](./2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-locked._TTH_.png)](./3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-locked._TTH_.png)](./4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-on._TTH_.png)](./5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](./6-publication.md)


## Customize the Skill to be Yours

At this point, you should have a working copy of our Help Desk skill.  In order to make it your own, you can customize it with your own response to help requests, or potentially replace the webhook POST to a chat channel, with a system call to a ticketing system or whatever workflow fits your company's systems and processes.  

As examples of this, [WeWork integrated their backend ZenDesk system](https://www.wework.com/blog/posts/alexa-ask-wework-to-extend-my-meeting) using Alexa for Business for Help Desk issues.  ServiceNow [created a whitepaper](https://community.servicenow.com/community?id=community_blog&sys_id=b53e6e6ddbd0dbc01dcaf3231f9619c5&view_source=searchResult) detailing how to use Alexa skills to access their system.

1.  **Any changes to the skill require you to re-publish the skill privately.**

	 Keep in mind that any changes you make to the skill model itself, intents, slots, utterances, etc., will require you to re-publish the skill privately.
 
2.  **Changes to the Lambda function do not require you to re-publish the skill.** 

	 On the other hand, you can make any changes you like to the Lambda function without needing to re-publish your private skill.

<br/><br/>

<a href="./6-publication.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png" /></a>


<img height="1" width="1" src="https://www.facebook.com/tr?id=1847448698846169&ev=PageView&noscript=1"/>
