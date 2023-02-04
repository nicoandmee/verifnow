# verifnow

![verifnow-sms](https://i.imgur.com/dDdvFr3.png)

> A hacker-friendly interface to bypass SMS verification, using WebSockets.

- Intended for automated systems, scripts, bots and the like that need to circumvent SMS number verification.
- Handles hundreds of known services (google/gmail, uber, facebook, twitter, etc)
- Typescript-powered, with an events based API

Currently supports [verifnow](https://sms.verifnow.com), including their websocket API. They use bidirectional JSON-RPC 2.0, making it unique in this space (most use ancient HTTP polling). The specification for JSON-RPC 2.0 can be found [here](https://www.jsonrpc.org/specification). "Bidirectional" in this context means that the server will also send notification messages to the client (as if the roles were reversed). This isn't specified in JSON-RPC 2.0 itself, but it can simply be imagined as having two JSON-RPC connections with opposite directions overlaid on the same websocket connection.

Aside from being technically interesting, this allows for nearly instant delivery of messages, and seems to lack some of the pain/bugginess you see with other services. Note that there is a two-step process:

- Using HTTP API, request a clean number for an array of services, in a particular zip code (optional)
- Using WebSocket API, listen for incoming SMS via the `smsNotification` event - note that multiple subscriptions can be active simultaneously, so for safety it is recommended to filter out any
messages that you aren't interested in.

## Installation

Use [npm](https://www.npmjs.com/) or other pm of choice.

```bash
npm i -g verifnow
export VERIFNOW_KEY='YOUR_KEY'
```

## Usage

```js
import { getLine, Connection } from 'verifnow'
import parse from 'parse-otp-message' // optional, makes extracting the numeric OTP a breeze

// Establish WebSocket connection to API, subscribe to incoming messages
const conn = new Connection()
await conn.subscribe()

// Fetch a line for twitter/gmail verification, in area code 805 (central coast)
const { phoneNumber } = await getLine(['GMAIL', 'TWITTER'], 93446)

// Perform your async work that triggers SMS verification

// Listen for new messages
const notif = await new Promise((resolve) => conn.on('smsNotification', (data) => data.phoneNumber === phoneNumber && resolve(data)))
const { code, service } = parse(notif.text) // extract numeric code from message

// Profit
```

## Documentation

The snippet above demonstrates only a small part of the API. Consult the documentation [here](docs/README.md) for a full list of supported
methods and their signatures.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## TODO

Support for other providers (using a common interface)

- <https://smspva.com>
- <https://getsmscode.com>

- Add tests
- Refactor `Connection` class into a common interface with HTTP API.


## Credits

Heavily inspired by [sms-number-verifier](https://github.com/transitive-bullshit/sms-number-verifier#readme) <3

## License

[MIT](https://choosealicense.com/licenses/mit/)
