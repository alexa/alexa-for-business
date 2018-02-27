## Location aware skills using resolveRoom API
Here you'll find skill samples that are location aware using the resolveRoom API, available via the "shared device" deployment model of Alexa for Business.
https://docs.aws.amazon.com/a4b/latest/ag/getting-started.html

### Not GPS / address
Note that this is not GPS / address awareness.  If a user grants the appropriate permissions, an Alexa skill can discover the configured address of the user's device which is useful for purposes of fulfilling their request.  "Order a pizza," for example, might discover the user's address to check pricing or delivery range.

### Deployment location use cases
However, for enterprise skills, oftentimes the address isn't enough- for example, knowing which conference room the request is coming from may be important for a Help Desk skill.  With Alexa for Business, a device can be assigned to a specific conference room, so that when someone in that room says, "Tell Help Desk the projector lamp needs to be replaced", the skill can determine the room name without the user having to provide that information.

Location awareness provided by Alexa for Business' resolveRoom API may also be useful for scenarios involving print/copy stations, kitchen equipment, utility meters, and so on.

### For more information
You can read more about the resolveRoom API here:
https://docs.aws.amazon.com/a4b/latest/APIReference/API_ResolveRoom.html
