import { DialogflowConversation } from 'actions-on-google';

export interface RichResponse {
  platform: (platform: string) => void;
  type: number;
  speech: string;
}

export interface Card extends RichResponse {
  buttons: any[];
  text: string;
  postback: string;
  imageUrl: string;
  subtitle: string;
  title: string;
}

export interface Reply extends RichResponse {
  replies: string[];
}

export interface Google extends RichResponse {
  displayText: string;
  textToSpeech: string;
}

export interface Agent {
  /**
   * @return The agent version (v1 or v2) based on Dialogflow webhook request
   */
  agentVersion: string;

  /**
   * @return Dialogflow intent name or null if no value
   */
  intent: string;

  /**
   * @return Dialogflow action or null if no value
   */
  action: string;

  /**
   * @return Dialogflow contexts included in the request or null if no value
   */
  contexts: string;

  /**
   * @return Dialogflow source included in the request or null if no value
   */
  requestSource: string;

  /**
   * @return Dialogflow original request object from detectIntent/query or platform integration (Google Assistant, Slack, etc.) in the request or null if no value
   */
  originalRequest: string;

  /**
   * @return Original user query as indicated by Dialogflow or null if no value
   */
  query: string;

  /**
   * @return Original request language code or locale (i.e. "en" or "en-US")
   */
  locale: string;

  /**
   * @return Dialogflow input contexts included in the request or null if no value Dialogflow v2 API only https://dialogflow.com/docs/reference/api-v2/rest/v2beta1/WebhookRequest#FIELDS.session
   */
  session: string;

  /**
   * @return List of messages defined in Dialogflow's console for the matched intent https://dialogflow.com/docs/rich-messages
   */
  consoleMessages: any[];

  /**
   * @return List of alternative query results Query results can be from other Dialogflow intents or Knowledge Connectors https://cloud.google.com/dialogflow-enterprise/alpha/docs/knowledge-connectors Note:this feature only availbe in Dialogflow v2
   */
  alternativeQueryResults: string;

  /**
   * @params string, string[], RichResponse, RichResponse[]
   * Add a response or list of responses to be sent to Dialogflow
   */
  add: (response: string | string[] | RichResponse | RichResponse[] | DialogflowConversation) => void;

  /**
   * @return Dialogflow parameters included in the request or null if no value
   */
  parameters: any;

  /**
   *
   * @params string, string[], RichResponse, RichResponse[]
   * Add a response or list of responses to be sent to Dialogflow and end the conversation Note: Only supported on Dialogflow v2's telephony gateway, Google Assistant and Alexa integrations
   */
  end: (response: string | string[] | RichResponse | RichResponse[]) => void;

  /**
   * @params string, string[], RichResponse, RichResponse[]
   * List of alternative query results Query results can be from other Dialogflow intents or Knowledge Connectors https://cloud.google.com/dialogflow-enterprise/alpha/docs/knowledge-connectors Note:this feature only availbe in Dialogflow v2
   */
  addResponse: (response: string | string[] | RichResponse | RichResponse[]) => void;

  /**
   * Handles the incoming Dialogflow request using a handler or Map of handlers Each handler must be a function callback.
   * map of Dialogflow action name to handler function or function to handle all requests (regardless of Dialogflow action)
   * @params string, string[], RichResponse, RichResponse[]
   */
  handleRequest: (handler: any) => Promise<void>;

  setContext: (context: any) => Promise<void>;

  clearOutgoingContexts: (context: string) => Agent;

  getContext: (contextName: string) => any;

  context: any;

  setFollowupEvent: (event: string | any) => any;

  /**
     * Example
     js const { WebhookClient } = require('dialogflow-webhook');
     const agent = new WebhookClient({request: request, response: response});
     let conv = agent.conv();
     conv.ask('Hi from the Actions on Google client library');
     agent.add(conv);
     */
  conv: () => DialogflowConversation | null;
}
