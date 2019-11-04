## Using Lambda and Alexa for Business APIs to automate voice recording deletion

The code represents an lambda script, containing the code of the related Lambda function in NodeJS.

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

## INSTALLATION GUIDE

### Pre-requirements

Choose the Virginia (us-east-1) region where you want to create the infrastructure and verify if Lambda can access the Alexa for Business configuration (this feature is not available everywhere yet).
The demo has been tested in Virginia (us-east-1) but you can change the region if needed.

1. The following node.js modules will need to be loaded for the script to operate: (https://aws.amazon.com/sdk-for-node-js/)
	* latest version of aws-sdk

2. Create an IAM role throught the AWS Console that will be associated with the Lambda function. Here are the policies needed: (https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html)
	* AlexaForBusinessFullAccess
	* CloudWatchLogsFullAccess


## Create the Lambda function

Create the Lambda function:

3.	Click "Functions" in the Lambda console

4.	Click on "Create function" in the Functions screen.

5.	In the "Create function" screen enter the following information:
    * Function name: myDeleteA4BDeviceUsageData
    * Runtime: Node.js 8.10
    * Choose or create an execution role: Use an existing role
    * Existing role: <Name of role created in Step 1>

6.	Click on "Create function":

7.	In the "myDeleteA4BDeviceUsageData" screen, ensure that the box labeled "myDeleteA4BDeviceUsageData" is selected in the Designer section.

8.  Scroll down to the "Function code" section and enter the following information:
    * Code entry type: Upload a .zip
	* Runtime: Node.js 8.10
	* Handler: index.handler

9.  Click on the Upload button
	* Navigate to the location of the downloaded lambda code
	* Select the .zip file and click Open
	
10.  Scroll down to the "Basic settings" section and enter the following information:
	* Description: Delete device usage data from Alexa for Business Shared devices
	* Memory: 128 MB
	* Timeout: 30 sec
	
11. Click on "Save" at the top right hand corner of the screen to complete your lambda function.

## Create the CloudWatch Event

After the successful creation of the function script in Lambda, you have to do the following actions:

12.	Click on "Events", located in the left hand side of the CloudWatch console.

13. In the "Events" screen, select "Get started".

14. In the "Step 1: Create rule" screen, enter the following information for the Event Source:
	* Event Source: Schedule
	* Cron Expression: selected and enter "10 12 * * ? *"
	
15. In the "Step 1: Create rule", click on "Add target".

16. In the "Step 1: Create rule" screen, enter the following information for thet target:
	* Lambda function: selected from drop down
	* Function: myDeleteA4BDeviceUsageData
	
17. Click on "Configure details".

18. In the "Step 2. Configure rule details", enter the following information:
	* Name: DeleteA4BDeviceUsageData
	* Description: Rule to delete Alexa for Business Shared Device Usage Data
	* State: Checked for Enabled
	
19. Click on "Create rule".

## Check the CloudWatch log

After a successful run of the lambda script, check the script's CloudWatch log to confirm the script ran a request to delete data to the devices.

20. In the Lambda console, select "Functions", located on the right side.

21. Locate and click the function named "myDeleteA4BDeviceUsageData"

22. In the "myDeleteA4BDeviceUsageData" screen, select the "Monitoring" link.

23. Click on "View logs in CloudWatch"

24. Click on the latest Log stream and check to see that each device serial number is displayed and either indicates that data has/has not been removed.
