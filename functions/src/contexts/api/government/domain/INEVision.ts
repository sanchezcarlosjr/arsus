import { INEVisionResponse } from './INE';

export interface INEVision {
  derive(): Promise<INEVisionResponse>;
}
