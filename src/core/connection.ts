import Debug from 'debug';
import EventEmitter from 'events';
import { JSONRPC,JSONRPCClient, JSONRPCServer, JSONRPCServerAndClient } from 'json-rpc-2.0';
import WebSocket from 'ws';
import type { JSONRPCRequest, JSONRPCResponse, JSONRPCServerAndClient as JSONRPCServerAndClientT } from 'json-rpc-2.0';
import type { MessageEvent } from 'ws';

import type { SMS, SubscriberInfo } from '../models/line';
const debug = Debug('verifnow:ws');

export declare interface Connection {

  /**
   * Emitted when an error occurs.
   */


  on(event: 'error', listener: (error: Error) => void): this;


  /**
   * Emitted once subscribed to the websocket.
   */
  on(event: 'subscribed', listener: (result: SubscriberInfo) => void): this;


  /**
   * Emitted once unsubscribed from the websocket.
   */
  on(event: 'unsubscribed', listener: (result: 'unsubscribed') => void): this;

  /**
   * Emitted when a new SMS is received.
   */
  on(event: 'smsNotification', listener: (result: SMS) => void): this;

  /**
   * Emitted once per call to getRecentSMS.
   */
  on(event: 'recentSMS', listener: (result: SMS[]) => void): this;

  /**
   * Emitted once per call to getSubscribedUserIds.
   */
  on(event: 'subscribedIDs', listener: (result: number[]) => void): this;
}

export class Connection extends EventEmitter {
  readonly serverAndClient: JSONRPCServerAndClientT;
  readonly apiKey: string;
  subscribed: boolean = false;
  transport: WebSocket;
  username: string | undefined;
  userId: number | undefined;
  nextId: number = 0;

  constructor(apiKey: string = process.env.VERIFNOW_KEY || '') {
      super();
      if (!apiKey) throw new Error('API Key is required - set VERIFNOW_KEY or pass it to the constructor');
      this.apiKey = apiKey;

      this.transport = new WebSocket('wss://sms.verifnow.com/api/ws');
      this.transport.on('open', async () => {
        debug('ws-opened');
        setInterval(async () => {
          await this.ping();
        }, 30 * 1000);
      });
      this.transport.on('error', (error) => this.emit('error', error));
      this.transport.on('close', () => this.transport = new WebSocket('wss://sms.verifnow.com/api/ws')); // reconnect on close

      this.serverAndClient = new JSONRPCServerAndClient(
      new JSONRPCServer(),
      new JSONRPCClient((request) => {
        try {
          debug('request: %O', request)
          this.transport.send(JSON.stringify(request));
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      })
      );
      this.serverAndClient.addMethod('smsNotification', async (request: JSONRPCRequest) => await this.listener(request));

    this.transport.onmessage = async (event: MessageEvent) => await this.serverAndClient.receiveAndSend(JSON.parse(event.data.toString()));
    this.transport.onclose = (event) => this.serverAndClient.rejectAllPendingRequests(`Connection is closed (${event.reason}).`);
  }


  private createID(): number {
    this.nextId += 1;
    return this.nextId;
  }

  /**
   * Unsubscribe from SMS notifications over this websocket connection.
   */
  async unsubscribe(): Promise<void> {
    if (!this.userId) return;
    const jsonRPCRequest: JSONRPCRequest = {
      jsonrpc: JSONRPC,
      id: this.createID(),
      method: "unsubscribe",
      params: {
        userId: this.userId,
      }
    };

    const response: JSONRPCResponse = await this.serverAndClient.requestAdvanced(jsonRPCRequest);
    if (response.error) {
      debug('unsubscribe error: %O', response.error)
      this.emit('error', response.error);
    } else {
      debug('unsubscribed: %s', response.result)
      this.emit('unsubscribed', response.result);
      this.subscribed = false;
    }

  }

  /**
   * Subscribes to SMS notifications over this websocket connection.
   */
  async subscribe(): Promise<void> {
    const jsonRPCRequest: JSONRPCRequest = {
      jsonrpc: JSONRPC,
      id: this.createID(),
      method: "subscribe",
      params: {
        apiKey: this.apiKey,
      }
    };

    const response: JSONRPCResponse = await this.serverAndClient.requestAdvanced(jsonRPCRequest);
    if (response.error) {
      this.emit('error', response.error);
    } else {
      this.emit('subscribed', response.result);
      this.subscribed = true;
    }
  }

  /**
   * Retrieves the IDs of all users subscribed to SMS notifications
   */
  async getSubscribedUserIds(): Promise<void> {
    const jsonRPCRequest: JSONRPCRequest = {
      jsonrpc: JSONRPC,
      id: this.createID(),
      method: "getSubscribedUserIds",
    };

    const response: JSONRPCResponse = await this.serverAndClient.requestAdvanced(jsonRPCRequest);
    if (response.error) {
      this.emit('error', response.error);
    } else {
      debug('getSubscribedUserIds rcvd: %O', response.result)
      this.emit('subscribedIDs', response.result);
    }
  }


  /**
   * Used to retrieve SMS messages for all subscribed user accounts received in the last five minutes.
    This is supposed to be used to ensure so SMS messages were missed since the last connection in case of a temporary disconnect.
    It should not be used to poll for new SMS (there is already a notification for that)!
   */
  async queryRecentSms(): Promise<void> {
    const jsonRPCRequest: JSONRPCRequest = {
      jsonrpc: JSONRPC,
      id: this.createID(),
      method: "queryRecentSms",
    };

    const response: JSONRPCResponse = await this.serverAndClient.requestAdvanced(jsonRPCRequest);
    if (response.error) {
      this.emit('error', response.error);
    } else {
      debug('queryRecentSms: %O', response.result)
      this.emit('recentSMS', response.result);
    }
  }

  /**
  * @internal
  * Internal listener for incoming messages.
  * Emits 'smsNotification' event on incoming SMS.
  */
  private async listener(message: JSONRPCRequest | JSONRPCResponse): Promise<void> {
    if ('method' in message) {
      switch (message.method) {
        case "smsNotification":
          debug('smsNotification: %O', message)
          this.emit('sms', message.params);
          break;
        default:
      }
    } else {
      debug('unsupported message: %O', message)
    }
  }

  /**
  * @internal
   * Internal ping command to keep the connection alive.
   */
  private async ping(): Promise<void> {
    const jsonRPCRequest: JSONRPCRequest = {
      jsonrpc: JSONRPC,
      id: this.createID(),
      method: "ping",
    };

    const response: JSONRPCResponse = await this.serverAndClient.requestAdvanced(jsonRPCRequest);
    if (response.error) {
        debug(`Received an error with code ${response.error.code} and message ${response.error.message}`)
        this.emit('error', response.error);
    } else {
      const { result } = response;
      debug('ping: %s', result)
    }
  }
}
