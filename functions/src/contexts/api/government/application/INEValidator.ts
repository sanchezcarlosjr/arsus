import { INEVision } from '../domain/INEVision';

export class INEValidator {
  constructor(private uid: string, private ineVision: INEVision) {}

  async validate() {
    const ine = await this.ineVision.derive();
    return ine.type.scrape(this.uid);
  }
}
