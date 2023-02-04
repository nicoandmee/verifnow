[verifnow](../README.md) / Connection

# Class: Connection

## Hierarchy

- `EventEmitter`

  ↳ **`Connection`**

## Table of contents

### Constructors

- [constructor](Connection.md#constructor)

### Properties

- [apiKey](Connection.md#apikey)
- [nextId](Connection.md#nextid)
- [serverAndClient](Connection.md#serverandclient)
- [subscribed](Connection.md#subscribed)
- [transport](Connection.md#transport)
- [userId](Connection.md#userid)
- [username](Connection.md#username)

### Methods

- [createID](Connection.md#createid)
- [getSubscribedUserIds](Connection.md#getsubscribeduserids)
- [on](Connection.md#on)
- [queryRecentSms](Connection.md#queryrecentsms)
- [subscribe](Connection.md#subscribe)
- [unsubscribe](Connection.md#unsubscribe)

## Constructors

### constructor

• **new Connection**(`apiKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKey` | `string` |

#### Defined in

core/connection.ts:57

## Properties

### apiKey

• `Readonly` **apiKey**: `string`

#### Defined in

core/connection.ts:50

___

### nextId

• **nextId**: `number` = `0`

#### Defined in

core/connection.ts:55

___

### serverAndClient

• `Readonly` **serverAndClient**: `JSONRPCServerAndClient`<`void`, `void`\>

#### Defined in

core/connection.ts:49

___

### subscribed

• **subscribed**: `boolean` = `false`

#### Defined in

core/connection.ts:51

___

### transport

• **transport**: `WebSocket`

#### Defined in

core/connection.ts:52

___

### userId

• **userId**: `undefined` \| `number`

#### Defined in

core/connection.ts:54

___

### username

• **username**: `undefined` \| `string`

#### Defined in

core/connection.ts:53

## Methods

### createID

▸ `Private` **createID**(): `number`

#### Returns

`number`

#### Defined in

core/connection.ts:91

___

### getSubscribedUserIds

▸ **getSubscribedUserIds**(): `Promise`<`void`\>

Retrieves the IDs of all users subscribed to SMS notifications

#### Returns

`Promise`<`void`\>

#### Defined in

core/connection.ts:147

___

### on

▸ **on**(`event`, `listener`): [`Connection`](Connection.md)

Emitted when an error occurs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`error`: `Error`) => `void` |

#### Returns

[`Connection`](Connection.md)

#### Defined in

core/connection.ts:18

▸ **on**(`event`, `listener`): [`Connection`](Connection.md)

Emitted once subscribed to the websocket.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"subscribed"`` |
| `listener` | (`result`: `SubscriberInfo`) => `void` |

#### Returns

[`Connection`](Connection.md)

#### Defined in

core/connection.ts:24

▸ **on**(`event`, `listener`): [`Connection`](Connection.md)

Emitted once unsubscribed from the websocket.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"unsubscribed"`` |
| `listener` | (`result`: ``"unsubscribed"``) => `void` |

#### Returns

[`Connection`](Connection.md)

#### Defined in

core/connection.ts:30

▸ **on**(`event`, `listener`): [`Connection`](Connection.md)

Emitted when a new SMS is received.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"smsNotification"`` |
| `listener` | (`result`: `SMS`) => `void` |

#### Returns

[`Connection`](Connection.md)

#### Defined in

core/connection.ts:35

▸ **on**(`event`, `listener`): [`Connection`](Connection.md)

Emitted once per call to getRecentSMS.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"recentSMS"`` |
| `listener` | (`result`: `SMS`[]) => `void` |

#### Returns

[`Connection`](Connection.md)

#### Defined in

core/connection.ts:40

▸ **on**(`event`, `listener`): [`Connection`](Connection.md)

Emitted once per call to getSubscribedUserIds.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"subscribedIDs"`` |
| `listener` | (`result`: `number`[]) => `void` |

#### Returns

[`Connection`](Connection.md)

#### Defined in

core/connection.ts:45

___

### queryRecentSms

▸ **queryRecentSms**(): `Promise`<`void`\>

Used to retrieve SMS messages for all subscribed user accounts received in the last five minutes.
 This is supposed to be used to ensure so SMS messages were missed since the last connection in case of a temporary disconnect.
 It should not be used to poll for new SMS (there is already a notification for that)!

#### Returns

`Promise`<`void`\>

#### Defined in

core/connection.ts:169

___

### subscribe

▸ **subscribe**(): `Promise`<`void`\>

Subscribes to SMS notifications over this websocket connection.

#### Returns

`Promise`<`void`\>

#### Defined in

core/connection.ts:125

___

### unsubscribe

▸ **unsubscribe**(): `Promise`<`void`\>

Unsubscribe from SMS notifications over this websocket connection.

#### Returns

`Promise`<`void`\>

#### Defined in

core/connection.ts:99
