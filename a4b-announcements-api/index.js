var AWS = require("aws-sdk");
var A4B = new AWS.AlexaForBusiness({ region: "us-east-1" });

/**
 * @description Return a unique ID
 */
function getToken() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * @description Send in string messages using the A4B sendAnnouncement API operation
 * @param  {String} roomName=undefined This is a case-sensitive parameter to specify the room name
 * @param  {String} roomARN=undefined This is a case-sensitive parameter to specify the room ARN
 * @param  {String} message="Hello folks this is a default announcement" This is a case-insensitive parameter to specify the message to send
 * @param  {integer} ttl=300
 * @example <caption> Example of usage with Room Name</caption>
 * sendAnnouncement("Room Name", undefined,"Please leave the room until it reaches it's max capacity!");
 * @example <caption> Example of usage with Room ARN</caption>
 * sendAnnouncement( undefined,"Room ARN","This room as reached MAX capacity and no one else can be admitted into this room");
 */
async function sendAnnouncement(
    roomName = undefined,
    roomARN = undefined,
    message = "Hello folks, this is a default announcement",
    ttl = 300
) {
    var roomKey = "RoomName";
    var room = roomName;

    if (!roomName && roomARN) {
        roomKey = "RoomArn";
        room = roomARN;
    }

    var params = {
        ClientRequestToken: getToken(),
        Content: {
            TextList: [
                {
                    Locale: "en-US",
                    Value: message,
                },
            ],
        },
        RoomFilters: [
            {
                Key: roomKey,
                Values: [room],
            },
        ],
        TimeToLiveInSeconds: ttl,
    };
    await A4B.sendAnnouncement(params, function (err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
    });
}