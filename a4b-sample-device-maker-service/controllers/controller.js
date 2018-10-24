// Prepare the database.
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ devices: [], awsCredentials: {} }).write();

// Prepare the input validators.
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Set the known product information.
var productMap = require('../products')

// Use default AWS Credentials stored in ~/.aws/credentials.
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
const sts = new AWS.STS({ apiVersion: '2012-08-10' });

// Prepare other libraries
const uuid = require('uuid');

// Display list of all Devices.
exports.device_list = function(req, res) {
    var devices = db.get('devices').value();
    var awsCredentials = db.get('awsCredentials').value();
    res.render('index', { title: 'Devices', devices: devices, iam: awsCredentials});
};

// Display Device create form on GET.
exports.device_create_get = function(req, res) {
    res.render('device_form', { title: 'Setup New Device', products: Object.keys(productMap)});
};
// Handle Device create on POST.
exports.device_create_post = [
    body('dsn').isLength({ min: 1 }).trim().withMessage('DeviceSerialNumber (DSN) must be specified.'),
    body('productId').isLength({ min: 1 }).trim().withMessage('Product ID must be specified.'),
    sanitizeBody('dsn').trim().escape(),
    sanitizeBody('productId').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('device_form', { title: 'Create Device', products: Object.keys(productMap), device: req.body, errors: errors.array() });
            return;
        }
        else {
            var productId = req.body.productId;
            var device = productMap[productId];
            db.get('devices')
                .push({
                    dsn: req.body.dsn,
                    clientId: device.clientId,
                    amazonId: device.amazonId,
                    productId: req.body.productId,
                    isEnabledForA4B: true
                }).write()
            res.redirect('/devices');
        }
    }
];

// Handle Device delete on POST.
exports.device_delete_post = function(req, res) {
    db.get('devices').remove({ dsn: req.body.dsn }).write();
    res.redirect('/devices');
};

// Handle Device update on POST.
exports.device_enableA4B_post = function(req, res) {
    db.get('devices').find({ dsn: req.body.dsn }).assign({ isEnabledForA4B: true}).write();
    res.redirect('/devices');
};

// Handle Device disable on POST. Deregisters device from A4B if found.
exports.device_disableA4B_post = function(req, res) {
    get_assume_role_credentials(function (err, data) {
        if (err) handleFailure(err);
        else {
            var device = db.get('devices').find({ dsn: req.body.dsn }).value();
            const a4b = new AWS.AlexaForBusiness({credentials: data, region: 'us-east-1'});
            const searchDevicesParam = {
                Filters : [
                    {
                        Key : "DeviceType",
                        Values: [device.productId + ":" + device.amazonId]
                    },
                    {
                        Key: "DeviceSerialNumber",
                        Values: [device.dsn]
                    }
                ]
            };
            a4b.searchDevices(searchDevicesParam, function (err, searchDevicesResult) {
                if (err) handleFailure(err);
                else {
                    if(searchDevicesResult.Devices.length == 1) {
                        const deleteDeviceParams = {
                            DeviceArn: searchDevicesResult.Devices[0].DeviceArn
                        };
                        a4b.deleteDevice(deleteDeviceParams, function (err, data) {
                            if (err) handleFailure(err);
                            else {
                                db.get('devices').find({ dsn: req.body.dsn }).assign({ isEnabledForA4B: false}).write();
                                res.redirect('/devices');
                            }
                        });
                    } else {
                        console.log("Device is not registered with A4B yet.");
                        db.get('devices').find({ dsn: req.body.dsn }).assign({ isEnabledForA4B: false}).write();
                        res.redirect('/devices');
                    }
                }
            });
        }
    });
};

exports.store_iam_post = function(req, res) {
    db.set('awsCredentials.externalId', req.body.external_id).write()
    db.set('awsCredentials.arn', req.body.role_arn).write()
    res.redirect('/devices');
};

// Handle Device register on POST.
exports.device_register_post = function(req, res) {
    var reqParams = JSON.parse(Object.keys(req.body)[0]);
    var iam = db.get('awsCredentials').value();
    var device = db.get('devices').find({ dsn: reqParams.DSN }).value();

    if(device == null) {
        handleFailure(new Error("Couldn't retrieve device from the database."));
    }
    if (device.isEnabledForA4B) {
        get_assume_role_credentials(function (err, data) {
            if (err) handleFailure(err);
            else {
                const a4b = new AWS.AlexaForBusiness({credentials: data, region: 'us-east-1'});
                const registerAVSDeviceParams = {
                    ClientId: device.clientId,
                    UserCode: reqParams.Code,
                    ProductId: device.productId,
                    DeviceSerialNumber: device.dsn,
                    AmazonId: device.amazonId
                }
                a4b.registerAVSDevice(registerAVSDeviceParams, function (err, data) {
                    if (err) handleFailure(err);
                    else res.end("Registered device to A4B successfully!")
                });
            }
        });
    } else {
        handleFailure(new Error("Device is not enabled to be registered to A4B."));
    }
};

get_assume_role_credentials = function(callback) {
    var iam = db.get('awsCredentials').value();
    let params = {
        RoleArn: iam.arn,
        ExternalId: iam.externalId,
        RoleSessionName: 'roleSessionName-' + uuid.v4()
    };
    sts.assumeRole(params, function (err, data) {
            if (err) callback(err, null);
            else {
                const accessparams = {
                    accessKeyId: data.Credentials.AccessKeyId,
                    secretAccessKey: data.Credentials.SecretAccessKey,
                    sessionToken: data.Credentials.SessionToken,
                };
                callback(null, accessparams);
            }
        });
}

handleFailure = function(failure) {
    console.log(failure);
    // throw exception; // if needed.
}
