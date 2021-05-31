import { StringObject } from '../../../../helpers/StringObject';
import { INEModel } from './INEModel';
import { INEModelEFGH } from '../infraestructure/INEModelEFGH';
import { INEModelD } from '../infraestructure/INEModelD';
import { INEModelC } from '../infraestructure/INEModelC';

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
