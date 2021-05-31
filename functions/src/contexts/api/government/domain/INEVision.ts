import { INEVisionResponse } from './INEVisionResponse';

export interface INEVision {
  derive(): Promise<INEVisionResponse>;
}
