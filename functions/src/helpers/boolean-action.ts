export abstract class ActionBoolean {
  abstract execute(): Promise<any>;
}

export class BooleanAdapter {
  private actionMediator: ActionBoolean;
  constructor(private variable: boolean) {}

  builder(trueAction: ActionBoolean, falseAction?: ActionBoolean) {
    if (this.variable) {
      this.actionMediator = trueAction;
    } else {
      this.actionMediator = falseAction;
    }
    return this;
  }

  execute() {
    return this.actionMediator.execute();
  }

  action(a: any, b: any) {
    return this.variable ? a : b;
  }
}
