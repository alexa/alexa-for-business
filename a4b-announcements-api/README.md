## :rocket: Using the Amazon Alexa for Business (A4B) API to send announcements

### Introduction

This sample code shows how to [Send Announcements](https://docs.aws.amazon.com/a4b/latest/ag/announcements.html) to rooms in A4B using the [JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AlexaForBusiness.html#sendAnnouncement-property) or the [Python SDK](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/alexaforbusiness.html#AlexaForBusiness.Client.send_announcement). It uses passed in string messages. For the rooms, the script uses the Key RoomName, or Room ARN.

The message is case-insensitive and the Room name / Room ARN is case-sensitive.

### Prerequisites

This code should be run using AWS credentials with AlexaForBusinessFullAccess permissions.
