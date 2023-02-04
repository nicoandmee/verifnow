verifnow

# verifnow

## Table of contents

### Classes

- [Connection](classes/Connection.md)

### Functions

- [checkService](README.md#checkservice)
- [getAccountInfo](README.md#getaccountinfo)
- [getCurrentLine](README.md#getcurrentline)
- [getLine](README.md#getline)

## Functions

### checkService

▸ **checkService**(`services`, `zip?`): `Promise`<`ServiceAvailability`\>

Checks Line availability based on selected service and zip code (optional) combination.

#### Parameters

| Name | Type |
| :------ | :------ |
| `services` | `string`[] |
| `zip?` | `string` |

#### Returns

`Promise`<`ServiceAvailability`\>

#### Defined in

core/api.ts:74

___

### getAccountInfo

▸ **getAccountInfo**(): `Promise`<`AccountInfo`\>

Returns username, credit balance and the last 100 transactions for your account.

#### Returns

`Promise`<`AccountInfo`\>

#### Defined in

core/api.ts:51

___

### getCurrentLine

▸ **getCurrentLine**(): `Promise`<`LineInfo`\>

Returns current phone number, SMS connection status and incoming SMS for your line.
NOTE: Do not call this endpoint in rapid succession to poll SMS, instead consider using the websocket API.

#### Returns

`Promise`<`LineInfo`\>

#### Defined in

core/api.ts:63

___

### getLine

▸ **getLine**(`services`, `zip?`): `Promise`<`PhoneNumber`\>

Requests a new line with new services, zip code (optional) combination.

#### Parameters

| Name | Type |
| :------ | :------ |
| `services` | `string`[] |
| `zip?` | `string` |

#### Returns

`Promise`<`PhoneNumber`\>

#### Defined in

core/api.ts:90
