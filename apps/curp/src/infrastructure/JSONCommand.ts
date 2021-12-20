import { Response } from 'express';
import { Command } from '../application/CommandBatch.js';

export class JsonCommand implements Command {
  constructor(private response: Response, private code: number = 200) {}

  execute(obj: { [x: string]: string }) {
    this.response.setHeader('Content-Type', 'application/json');
    this.response.set('Access-Control-Allow-Origin', '*');
    this.response.set('Access-Control-Allow-Methods', 'GET');
    return this.response.status(this.code).send(obj ?? {});
  }
}
