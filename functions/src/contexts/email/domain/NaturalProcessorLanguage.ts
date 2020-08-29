export interface NaturalProcessorLanguage {
  detectIntent(message: string, sessionId: string): Promise<string>;
  getMedia(): string;
}
