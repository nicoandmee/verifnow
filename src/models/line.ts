export interface SubscriberInfo {
  userId: number;
  username: string;
}

export interface LineInfo {

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
  expirationTime: Date

  /**
   * The available services for this line.
   */
  currentServices: string[]

  /**
   * The SMS messages which this phone number has received.
   */
  sms: SMS[]
}

export interface ActiveLine {
  userId: number;
  phoneNumber: string;
  currentServices: string[];
  expirationTime: Date;
}

export interface SMS {

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

export interface ChangeServiceResponse {
  phoneNumber: string
}
export interface LineExtensionResponse {
  expirationTime: string
}

