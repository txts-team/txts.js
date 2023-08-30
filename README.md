# txts-js-wrapper
This is an API wrapper to interact with txts, made in Javascript.
## How to use
```
npm install txts.js
```
```js
const client = new txtsClient("https://txts.sudokoko.xyz") // txtsClient takes one parameter, the URL of the instance you are trying to interact with.

// All methods return a promise, so you have to handle them with a .then block, and for error handling you can add a .catch block.

// Editing txts
let status
await client.editTxt("speedyman77", "YOURSECRETHERE", "API wrapper").then(e=>status = e) // takes three parameters, username, page secret and the content you want to add in
// returns true if the request succeeded, false if it didn't

// Viewing txts
let txtHtmlContent
await client.getTxt("speedyman77").then(e=>txtHtmlContent = e) // takes one parameter which is username
// returns HTML content of the user's page

// Viewing verified status
let verifiedStatus
await client.isVerified("speedyman77").then(e=>verifiedStatus = e) // takes one parameter in which is username
// returns true if user is verified, false if the user is not
```
Creating txts is coming soon!