# SSML and spelling out words

If you have a concierge skill, you may want Alexa to spell out the guest WiFi password instead of trying to speak "abc123" as a word.  This AWS Lambda function is a simple modification of the fact skill Lambda, and shows how you can use different \<say-as\> SSML markup tags to modify the way your skill output is spoken.

The index.js in this repo includes three variants on speaking a WiFi password.  The first does not use any specific SSML markup and therefore Alexa will try to say "abc123" as a spoken word.

In order to spell out a given string, you can use the "\<say-as\>" tag with the "interpret-as" attribute with a value of "characters":

~~~
<say-as interpret-as="characters">abc123</say-as>
~~~

The above example will have Alexa spell out each character, as "a-b-c-1-2-3".

The other example shown is the ability to use the same <say-as> tag to liven up your skill's voice- using one of several built in "interjections" which include exclamations and other spoken output that comes across more casual and natural.

The example shown in the Lambda code uses the built in interjection "Woohoo!":

~~~
<say-as interpret-as="interjection">Woohoo!</say-as>
~~~

For more information on SSML support in Alexa skills, see the [Alexa documentation on SSML](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html).

Have fun building with \<say-as\>!
