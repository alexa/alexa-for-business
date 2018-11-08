# Alexa for Business-Sample device maker service

This is a Node.js application that serves as an example of how an Alexa Voice Service (AVS) device maker can
manage their customer's devices built with AVS in Alexa for Business.

## Overview

The app has two major components.

- **Console (Client)**

   This allows the user to:
    - Store AWS IAM Credentials needed to call Alexa for Business.
    - Set up devices by providing a Device Serial Number (DSN) and a Product ID.
    - Enable devices to be registered to Alexa for Business when they are turned on.
    - Disable devices to be registered to Alexa for Business which also deregisters them.
    - Delete devices that were setup.

- **Service (Server)**

    - Demonstrates how to talk to AWS IAM and Alexa for Business using the AWS SDK.
    - Provides a `/device/register` API that can be called from an AVS device, which will in turn call
    Alexa for Business to register it there.
    - Provides API's for the operations that can be performed on the console, which can also be called
    using HTTP requests.

## Prerequisites

To build and run these examples, you'll need to:

  - Install Node.js. For more information, see the [Node.js
    website](https://nodejs.org/en/). You can find downloads of the
    current and LTS versions of Node.js for a variety of operating
    systems at <https://nodejs.org/en/download/current/>.
  - Log in or create new AWS account for AVS device maker service.
  - Go to AWS IAM console and create IAM user with programmatic access.
    For more information see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html
  - Create IAM policy. https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html

    Add the following permissions to the policy document.

    ``` sh
    {
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Action": "sts:AssumeRole",
        "Resource": "*"
      }]
    }
    ```

    This policy allows AVS device maker's AWS account user to assume role in customer account. For more information,
    see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_control-access_enable-create.html.
  - Store AWS credentials of IAM user created in above step in a shared credentials file.
    For more information about how to set up a shared credentials file, see
    [Loading Credentials in Node.js from the Shared Credentials
    File](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
    in the *AWS SDK for JavaScript Developer Guide*.
  - Use AVS device SDK v1.10.0 or above and implement the revoke authorization directive as a requirement.

## Running the Sample AVS device maker service locally
Pull this git repository locally and run the following commands.

``` sh
npm install
```
``` sh
npm start
```

Then, go to <http://localhost:3000/> to use the console.

## Making AVS Sample app work with Sample AVS device maker service
The AVS Sample application which is bundled within AVS device SDK needs some modification before it can be used with
Alexa for Business Sample device maker service to register AVS device with Alexa for Business. Following are the modifications
needed to AVS sample app as per AVS client SDK version 1.10:

  1. Changes in AlexaClientSDKConfig.json: The AlexaClientSDKConfig.json file stores configurations used by AVS Sample app.
     Open and edit file, located at {PATH_TO_AVS_CLIENT_SDK_SRC_FOLDER}/Integration/AlexaClientSDKConfig.json. Locate the
     "sampleApp" object and add
       - A boolean "registerWithA4B" set it to "true".
       - A string "deviceMakerServiceEndpoint" and set it to IP address of AVS device maker service, for example
       "http://localhost:3000/device/register".

  2. Changes in UIManager.cpp: The changes made in AlexaClientSDKConfig.json will be consumed by UIManager.cpp. The change is
     needed in onRequestAuthorization method to check if "registerWithAlexa for Business" is set to true in AlexaClientSDKConfig.json,
     then call "deviceMakerServiceEndpoint" for registration.

For convenience the two files you need to modify are bundled within this package under "avs-device-sdk-override". Run following
commands before you compile AVS device SDK on your device. Note, this assumes you are using AVS device SDK 1.10 and running AVS
device maker service and AVS Sample app on same device.

``` sh
cd {PATH_TO_SAMPLE_DEVICE_MAKER_APP}/avs-device-sdk-override
```
``` sh
cp Integration/AlexaClientSDKConfig.json {PATH_TO_AVS_CLIENT_SDK_SRC_FOLDER}/Integration
```
``` sh
cp SampleApp/src/UIManager.cpp {PATH_TO_AVS_CLIENT_SDK_SRC_FOLDER}/SampleApp/src
```


## Reference

You can find detailed documentation for the AWS SDK for JavaScript at:

  - [AWS SDK for JavaScript Developer
    Guide](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide)
  - [AWS SDK for JavaScript API
    Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
