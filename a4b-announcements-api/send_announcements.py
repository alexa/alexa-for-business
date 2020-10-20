""" Alexa for Business (A4B) announcements example

This is a sample code to show how to send announcements to a room using the A4B API
parameters: 
    room_name: The name of the room in the Alexa for business instance
    room_arn: In case you don't use room names, you can use the room arn asigned to a room in A4B
    message: the string message to be sent to the room
    ttl: The time to live for the announcement
"""

import boto3
import uuid

a4b = boto3.client('alexaforbusiness')

def send_announcement(room_name, room_arn, message, ttl):
    room_key = "RoomName"
    room = room_name
    
    if(room_name is None and room_arn is not None):
        room_key = "RoomArn"
        room = room_arn

    result = a4b.send_announcement(
        RoomFilters=[
            {
                "Key": room_key,
                "Values": [room],
            },
        ],
        Content={
                'TextList': [
                    {
                        'Locale': 'en-US',
                        'Value': message
                    },
                ]
        },
        TimeToLiveInSeconds = ttl,
        ClientRequestToken = str(uuid.uuid4())
    )

    return result

send_announcement(room_name = "war room", room_arn= None, message = "Hello folks, this is a default announcement", ttl = 300)