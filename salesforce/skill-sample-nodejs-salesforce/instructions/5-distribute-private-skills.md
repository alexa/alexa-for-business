# Private Alexa Skill With Salesforce Integration

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-done._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-done._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-done._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-on._TTH_.png)](./5-distribute-private-skills.md)

## Part 5: Distribute Private Skills

[Alexa for Business](https://aws.amazon.com/) lets you use Alexa to voice-enable your workplace by providing  the tools you need to manage Alexa devices, skills, and users at scale, and  an API to build custom, context-aware voice skills for your organization. 

In this case, let's assume you know the AWS account ID of an Alexa for Business organization that you want to give this Salesforce skill to.

### Publish the Private Skill
The ```skill.json``` that you used to create this skill is already marked as private. In this case, you need to submit the skill to move it to the ```live``` stage.

1.Run the following command using ASK CLI:

```
$ ask api submit -s <Skill ID>
Skill submitted successfully.
```

After the skill has been submitted, it takes about 30 minutes to 2 hours to propagate the skill to the live stage. To grant access to an AWS account, the skill must be in the live stage. 

### Grant Access to an AWS Account

1. Make the following call using ASK CLI to add your private skill to the AWS account’s Alexa for Business organization.

```
$ ask api add-private-distribution-account -s amzn1.ask.skill.<Skill ID> --stage live --account-id arn:aws:iam::<AWS Account ID>:root
Private distribution account added successfully.
```

With these steps, you have been able to create a private Alexa skill that allows you to interact with your Salesforce data. You were able to set up account linking and a personal voice code. Finally, you deployed the skill to an Alexa for Business organization.