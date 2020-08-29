import { Database } from '../database/database';

const vision = require('@google-cloud/vision');

export interface Vertex {
  x: number;
  y: number;
}

export interface BoundingPoly {
  vertices: Vertex[];
}

export interface TextAnnotation {
  locale: string;
  description: string;
  boundingPoly: BoundingPoly;
}

export interface DetectedLanguage {
  languageCode: string;
  confidence: number;
}

export interface Property {
  detectedLanguages: DetectedLanguage[];
}

export interface DetectedLanguage2 {
  languageCode: string;
  confidence: number;
}

export interface Property2 {
  detectedLanguages: DetectedLanguage2[];
}

export interface Vertex2 {
  x: number;
  y: number;
}

export interface BoundingBox {
  vertices: Vertex2[];
}

export interface DetectedLanguage3 {
  languageCode: string;
  confidence: number;
}

export interface Property3 {
  detectedLanguages: DetectedLanguage3[];
}

export interface Vertex3 {
  x: number;
  y: number;
}

export interface BoundingBox2 {
  vertices: Vertex3[];
}

export interface DetectedLanguage4 {
  languageCode: string;
}

export interface Property4 {
  detectedLanguages: DetectedLanguage4[];
}

export interface Vertex4 {
  x: number;
  y: number;
}

export interface BoundingBox3 {
  vertices: Vertex4[];
}

export interface DetectedLanguage5 {
  languageCode: string;
}

export interface DetectedBreak {
  type: string;
}

export interface Property5 {
  detectedLanguages: DetectedLanguage5[];
  detectedBreak: DetectedBreak;
}

export interface Vertex5 {
  x: number;
  y: number;
}

export interface BoundingBox4 {
  vertices: Vertex5[];
}

export interface Symbol {
  property: Property5;
  boundingBox: BoundingBox4;
  text: string;
}

export interface Word {
  property: Property4;
  boundingBox: BoundingBox3;
  symbols: Symbol[];
}

export interface Paragraph {
  property: Property3;
  boundingBox: BoundingBox2;
  words: Word[];
}

export interface Block {
  property: Property2;
  boundingBox: BoundingBox;
  paragraphs: Paragraph[];
  blockType: string;
}

export interface Page {
  property: Property;
  width: number;
  height: number;
  blocks: Block[];
}

export interface FullTextAnnotation {
  pages: Page[];
  text: string;
}

export interface Respons {
  textAnnotations: TextAnnotation[];
  fullTextAnnotation: FullTextAnnotation;
}

export class UserId {
  private database = new Database();

  constructor(private userUID: string, private temp: any) {}

  public async storeReverse(): Promise<null> {
    const client = new vision.ImageAnnotatorClient();
    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await client.textDetection(this.temp);
        const respons: any = response[0];
        return this.database.collection(`users/${this.userUID}/providers`).storeWith('REVERSE_INE', {
          fullTextAnnotation: respons.fullTextAnnotation.text,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async store(): Promise<null> {
    const client = new vision.ImageAnnotatorClient();
    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await client.textDetection(this.temp);
        const respons: any = response[0];
        return this.database.collection(`users/${this.userUID}/providers`).storeWith('INE', {
          fullTextAnnotation: respons.fullTextAnnotation.text,
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
