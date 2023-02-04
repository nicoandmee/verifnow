import got from 'got'
import { Logger } from 'tslog'

import type { AccountInfo } from '../models'
import type { LineInfo } from '../models/line'
import type { PhoneNumber } from '../models/number'
import type { ServiceAvailability } from '../models/service'

const VERIFNOW_KEY: string = process.env.VERIFNOW_KEY || ''

const type = process.env.DEBUG ? 'pretty' : 'hidden'
const log = new Logger({ name: "APILogger", type: type });

const client = got.extend({
  handlers: [
    (options, next) => {
      Error.captureStackTrace(options.context)
      return next(options)
    }
  ],
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error
        if (response && response.body) {
          error.message = `${response.statusMessage} (${response.statusCode})`
        }
        if (error?.options.context?.stack) {
          error.stack = (error.options.context.stack as string).split('\n').slice(1).join('\n')
        }
        return error
      }
    ]
  },
  prefixUrl: 'https://sms.verifnow.com',
  headers: {
    Accept: 'application/json',
    'X-API-Key': VERIFNOW_KEY
  },
  https: { rejectUnauthorized: false },
  responseType: 'json',
  retry: {
    limit: 3
  },
  mutableDefaults: true
})

/**
 * Returns username, credit balance and the last 100 transactions for your account.
 */
export const getAccountInfo = async (): Promise<AccountInfo> => {
  const response = await client.get('api/account')
  const { body } = response
  log.debug('getAccountInfo', body)

  return body as unknown as AccountInfo
}

/**
 * Returns current phone number, SMS connection status and incoming SMS for your line.
 * NOTE: Do not call this endpoint in rapid succession to poll SMS, instead consider using the websocket API.
 */
export const getCurrentLine = async (): Promise<LineInfo> => {
  const response = await client.get('api/line')
  const { body } = response
  log.debug('getCurrentLine', body)

  return body as unknown as LineInfo
}

/**
 * Checks Line availability based on selected service and zip code (optional) combination.
 */
export const checkService = async (services: string[], zip?: string): Promise<ServiceAvailability> => {
  const response = await client.get('api/checkService', {
    json: {
      services,
      zip
    }
  })
  const { body } = response
  log.debug('checkService', body)

  return body as unknown as ServiceAvailability
}

/**
 * Requests a new line with new services, zip code (optional) combination.
 */
export const getLine = async (services: string[], zip?: string): Promise<PhoneNumber> => {
  const response = await client.post('api/line/changeService', {
    json: {
      services,
      zip
    }
  })
  const { body } = response
  log.debug('changeService', body)

  return body as unknown as PhoneNumber
}
