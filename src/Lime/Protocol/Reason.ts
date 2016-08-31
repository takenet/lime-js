/**
 * Represents a known reason for events occurred during the client-server
 * interactions.
 */
export class Reason {
  code: number;
  description: string;

  constructor(code: number, description?: string) {
    this.code = code;
    this.description = description || "";
  }

  toString() {
    return `${this.description} (Code ${this.code})`;
  }
}

/**
 * Default server reason codes
 * @const
 */
export const ReasonCodes = {
  /** General error */
  GENERAL_ERROR: 1,
  /** General session error */
  SESSION_ERROR: 11,
  /** The session resource is already registered */
  SESSION_REGISTRATION_ERROR: 12,
  /** An authentication error occurred */
  SESSION_AUTHENTICATION_FAILED: 13,
  /** An error occurred while unregistering the session in the server */
  SESSION_UNREGISTER_FAILED: 14,
  /** The required action is invalid for current session state */
  SESSION_INVALID_ACTION_FOR_STATE: 15,
  /** The session negotiation has timed out */
  SESSION_NEGOTIATION_TIMEOUT: 16,
  /** Invalid selected negotiation options */
  SESSION_NEGOTIATION_INVALID_OPTIONS: 17,
  /** Invalid session mode requested */
  SESSION_INVALID_SESSION_MODE_REQUESTED: 18,
  /** General validation error */
  VALIDATION_ERROR: 21,
  /** The envelope document is null */
  VALIDATION_EMPTY_DOCUMENT: 22,
  /** The envelope document MIME type is invalid */
  VALIDATION_INVALID_RESOURCE: 23,
  /** The request status is invalid */
  VALIDATION_INVALID_STATUS: 24,
  /** The request identity is invalid */
  VALIDATION_INVALID_IDENTITY: 25,
  /** The envelope originator or destination is invalid */
  VALIDATION_INVALID_RECIPIENTS: 26,
  /** The command method is invalid */
  VALIDATION_INVALID_METHOD: 27,
  /** The command URI format is invalid */
  VALIDATION_INVALID_URI: 27,
  /** General authorization error */
  AUTHORIZATION_ERROR: 31,
  /** The sender is not authorized to send messages to the message destination */
  AUTHORIZATION_UNAUTHORIZED_SENDER: 32,
  /** The destination doesn't have an active account */
  AUTHORIZATION_DESTINATION_ACCOUNT_NOT_FOUND: 33,
  /** The envelope quota limit has been exceeded */
  AUTHORIZATION_QUOTA_THRESHOLD_EXCEEDED: 34,
  /** General routing error */
  ROUTING_ERROR: 41,
  /** The message destination was not found */
  ROUTING_DESTINATION_NOT_FOUND: 42,
  /** The message destination gateway was not found */
  ROUTING_GATEWAY_NOT_FOUND: 43,
  /** The message destination was not found */
  ROUTING_ROUTE_NOT_FOUND: 44,
  /** General dispatching error */
  DISPATCH_ERROR: 51,
  /** General command processing error */
  COMMAND_PROCESSING_ERROR: 61,
  /** There's no command processor available for process the request */
  COMMAND_RESOURCE_NOT_SUPPORTED: 62,
  /** The command method is not supported */
  COMMAND_METHOD_NOT_SUPPORTED: 63,
  /** The command method has an invalid argument value */
  COMMAND_INVALID_ARGUMENT: 64,
  /** The requested command is not valid for current session mode */
  COMMAND_INVALID_SESSION_MODE: 65,
  /** The command method was not allowed */
  COMMAND_NOT_ALLOWED: 66,
  /** The command resource was not found */
  COMMAND_RESOURCE_NOT_FOUND: 67,
  /** General message processing error */
  MESSAGE_PROCESSING_ERROR: 61,
  /** The message content type is not supported */
  MESSAGE_UNSUPPORTED_CONTENT_TYPE: 71,
  /** General gateway processing error */
  GATEWAY_ERROR: 81,
  /** The content type is not supported by the gateway */
  GATEWAY_CONTENT_TYPE_NOT_SUPPORTED: 82,
  /** The message destination was not found on gateway */
  GATEWAY_DESTINATION_NOT_FOUND: 83,
  /** The functionality is not supported by the gateway */
  GATEWAY_NOT_SUPPORTED: 84,
  /** General application processing error */
  APPLICATION_ERROR :101
};
