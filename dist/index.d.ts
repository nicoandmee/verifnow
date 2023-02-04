import EventEmitter from 'events';
import WebSocket from 'ws';
import { JSONRPCServerAndClient } from 'json-rpc-2.0';

interface AccountInfo {
    /**
     * The user's current credit balance
     */
    balance: number;
    /**
      * The user's username
    */
    username: string;
    /**
     * The user's last 100 transactions
     */
    transactions: Transaction[];
}
interface Transaction {
    id: string;
    amount: number;
    timestamp: Date;
    recipient?: string | null;
    description: string;
}

interface PhoneNumber {
    phoneNumber: string;
}

interface ServiceAvailability {
    /**
     * Whether the service is available
     */
    available: boolean;
    /**
     * All available zip codes for the service
     */
    availableZips: string[];
    /**
     * All available services
     */
    availableServices: string[];
}

interface SubscriberInfo {
    userId: number;
    username: string;
}
interface LineInfo {
    /**
     * The currently assigned phone number for this line. May be null.
     */
    phoneNumber: string | null;
    /**
     * The status of the connection to the SMS receiving system. Some of the possible values are Ready, Pending, Error and Disconnected. Any other value indicates an internal problem.
     */
    status: 'Ready' | 'Pending' | 'Error' | 'Disconnected';
    /**
     * Time at which your line will expire. May be null if you have permanent access to a line.
     */
    expirationTime: Date;
    /**
     * The available services for this line.
     */
    currentServices: string[];
    /**
     * The SMS messages which this phone number has received.
     */
    sms: SMS[];
}
interface SMS {
    /**
     * The ID of the message
     */
    id: number;
    /**
     * The user ID of the user that sent the message
     */
    userId: number;
    /**
     * The time the message was received
     */
    timestamp: Date;
    /**
     * The phone number that sent the message
     */
    sender: string;
    /**
     * The phone number that received the message
     */
    receiver: string;
    /**
     * The text of the message
     */
    text: string;
}

/**
 * Returns username, credit balance and the last 100 transactions for your account.
 */
declare const getAccountInfo: () => Promise<AccountInfo>;
/**
 * Returns current phone number, SMS connection status and incoming SMS for your line.
 * NOTE: Do not call this endpoint in rapid succession to poll SMS, instead consider using the websocket API.
 */
declare const getCurrentLine: () => Promise<LineInfo>;
/**
 * Checks Line availability based on selected service and zip code (optional) combination.
 */
declare const checkService: (services: string[], zip?: string) => Promise<ServiceAvailability>;
/**
 * Requests a new line with new services, zip code (optional) combination.
 */
declare const getLine: (services: string[], zip?: string) => Promise<PhoneNumber>;

declare interface Connection {
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
declare class Connection extends EventEmitter {
    readonly serverAndClient: JSONRPCServerAndClient;
    readonly apiKey: string;
    subscribed: boolean;
    transport: WebSocket;
    username: string | undefined;
    userId: number | undefined;
    nextId: number;
    constructor(apiKey?: string);
    private createID;
    /**
     * Unsubscribe from SMS notifications over this websocket connection.
     */
    unsubscribe(): Promise<void>;
    /**
     * Subscribes to SMS notifications over this websocket connection.
     */
    subscribe(): Promise<void>;
    /**
     * Retrieves the IDs of all users subscribed to SMS notifications
     */
    getSubscribedUserIds(): Promise<void>;
    /**
     * Used to retrieve SMS messages for all subscribed user accounts received in the last five minutes.
      This is supposed to be used to ensure so SMS messages were missed since the last connection in case of a temporary disconnect.
      It should not be used to poll for new SMS (there is already a notification for that)!
     */
    queryRecentSms(): Promise<void>;
    /**
    * @internal
    * Internal listener for incoming messages.
    * Emits 'smsNotification' event on incoming SMS.
    */
    private listener;
    /**
    * @internal
     * Internal ping command to keep the connection alive.
     */
    private ping;
}

export { Connection, checkService, getAccountInfo, getCurrentLine, getLine };
