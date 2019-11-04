/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var AWS = require("aws-sdk");
var alexaforbusiness = new AWS.AlexaForBusiness({region: 'us-east-1'});

var MODE = 'VOICE';

Object.prototype.isEmpty = function() {
    for(var key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
};

function get_devices()
{
    var params = {
        Filters: [
            {
                Key: 'DeviceStatus',
                Values: ['READY','PENDING','WAS_OFFLINE','DEREGISTERED']
            }
        ]
    };

    return new Promise((resolve) => { 
        let devicesPromise = alexaforbusiness.searchDevices(params).promise();

        devicesPromise.then(
            function(data, err) {
                if (err) {
                    console.log(err, err.stack);
                    resolve({'ok': false, 'error': err});
                } else {
                    resolve({'ok': true, 'result': data});
                }
            }
        ).catch(
            function(err) {
                console.log(err, err.stack);
                resolve({'ok': false, 'error': err});
            }
        );
    });
}

function delete_device_usage(device)
{
    var params = {
        DeviceArn: device.DeviceArn,
        DeviceUsageType: MODE
    };

    return new Promise((resolve) => {
        let deletePromise = alexaforbusiness.deleteDeviceUsageData(params).promise();

        deletePromise.then(
            function(data, err) {
                if (!device.RoomName){
                    device.RoomName = 'Not Defined';
                }
                if ((data.TotalCount > 0) || (data.isEmpty())) {
                    resolve({'ok': true, 'result': data});
                } else if (err) {
                    console.log(err, err.stack);
                    resolve({'ok': false, 'error': err});
                }
            }
        ).catch(
            function(err) {
                console.log(err, err.stack);
                resolve({'ok': false, 'error': err});
            }
        );
    });
}

exports.handler = async (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    let devicesRequest = get_devices();
    await devicesRequest.then(
        function(deviceResults) {
            if (deviceResults.ok) {
                deviceResults.result.Devices.forEach(function(device) {
                    let deleteRequest = delete_device_usage(device);
                    deleteRequest.then(
                        function(deleteResult) {
                            if ((deleteResult.ok) && ((deleteResult.result.statusCode == 200) || (deleteResult.result.isEmpty()))) {
                                console.log('Data for device serial number: ' + device.DeviceSerialNumber + ' in room ' + device.RoomName + ' has been removed.');
                            } else {
                                console.log('Data for device serial number: ' + device.DeviceSerialNumber + ' in room ' + device.RoomName + ' has not been removed at this time because it has already been called today.');
                            }
                        }
                    );
                });
            } else {
                console.log('ERROR, Failed to retrieve Alexa for Business devices with error: ', deviceResults.error);
            }
        }
    );

    callback(null, 'Data Removal Request complete');
};