import { StringObject } from '../../../../helpers/StringObject';
import { INEModel } from './INEModel';
import { INEModelEFGH } from '../infrastructure/INEModelEFGH';
import { INEModelD } from '../infrastructure/INEModelD';
import { INEModelC } from '../infrastructure/INEModelC';

export class INEModelType extends StringObject {
  constructor(value: string) {
    super(value);
    this.value = !!value.match(/NACIO/) ? 'INEModelEFGH' : 'INEModelD';
  }

  factory(): INEModel {
    switch (this.value) {
      case 'INEModelEFGH':
        return new INEModelEFGH('', '');
      case 'INEModelD':
        return new INEModelD('', '');
      case 'INEModelC':
        return new INEModelC('', '', '');
      default:
        return null;
    }
  }
}
