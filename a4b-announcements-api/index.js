var AWS = require("aws-sdk");
var A4B = new AWS.AlexaForBusiness({ region: "us-east-1" });

function getToken() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function sendAnnouncement(
    roomName,
    message = "Hello folks, this is a default announcement",
    ttl = 300
) {
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
                Key: "RoomName" /* required */,
                Values: [/* required */ roomName],
            },
            /* more items */
        ],
        TimeToLiveInSeconds: ttl,
    };
    await A4B.sendAnnouncement(params, function (err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
    });
}

sendAnnouncement(
    "war room",
    "This room as reached MAX capacity and no one else can be admitted into this room"
);