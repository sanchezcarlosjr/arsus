import { NaturalProcessorLanguage } from '../../../email/domain/NaturalProcessorLanguage';

const MessagingResponse = require('twilio').twiml.MessagingResponse;

export class TelecommunicationCreator {
  private twiml = new MessagingResponse();
  private message = this.twiml.message();

  constructor(private naturalProcessorLanguage: NaturalProcessorLanguage) {}

  async create(requestMessage: string, fromPhone: string): Promise<string> {
    const fulfillmentText = await this.naturalProcessorLanguage.detectIntent(requestMessage, fromPhone);
    this.message.body(fulfillmentText);
    this.setMedia(this.naturalProcessorLanguage.getMedia());
    return this.twiml.toString();
  }

  private setMedia(media: string) {
    if (media) {
      this.message.media(media);
    }
  }
}
