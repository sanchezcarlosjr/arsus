import { StringObject } from '../../../../helpers/StringObject';
import { INEModel } from './INEModel';
import { INEModelEFGH } from '../infrastructure/INEModelEFGH';
import { INEModelD } from '../infrastructure/INEModelD';
import { INEModelC } from '../infrastructure/INEModelC';

export class INEModelType extends StringObject {
  constructor(observe: string) {
    let model = '';
    if (!!observe.match(/NACIO/)) {
      model = 'INEModelEFGH';
    }
    if (!!observe.match(/VIGENCIA/)) {
      model = 'INEModelD';
    }
    if (!!observe.match(/VIGENTE/)) {
      model = 'INEModelC';
    }
    super(model);
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
        throw new Error('No es una credencial válida.');
    }
  }
}
