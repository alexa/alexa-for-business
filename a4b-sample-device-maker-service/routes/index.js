var express = require('express');
var router = express.Router();

var controller = require('../controllers/controller');

// GET request for creating Device.
router.get('/device/create', controller.device_create_get);

// POST request for creating Device.
router.post('/device/create', controller.device_create_post);

// POST request to delete Device.
router.post('/device/delete', controller.device_delete_post);

// POST request to update Device to be enabled to be registered for A4B.
router.post('/device/enableA4B', controller.device_enableA4B_post);

// POST request to register device in A4B.
router.post('/device/register', controller.device_register_post);

// POST request to update Device to be disabled for A4B, i.e. deregister the device from A4B.
router.post('/device/disableA4B', controller.device_disableA4B_post);

// POST request to store IAM Credentials.
router.post('/iam/create', controller.store_iam_post);

// GET request to list all Devices.
router.get('/devices', controller.device_list);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/devices');
});

module.exports = router;
