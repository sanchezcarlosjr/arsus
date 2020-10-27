import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';

export interface CurpResponse {
   curp: string;
}

@Component({
  tag: 'gov-form',
  styleUrl: 'gov-form.css',
  shadow: false
})
export class GovForm {
  @Prop() apikey: string;
  @State() curp: string = '';
  @Event() completed: EventEmitter<CurpResponse>;

  async handleSubmit(event) {
    event.preventDefault()
    try {
      const response = await fetch(`https://us-west4-arsus-production.cloudfunctions.net/curp?curp=${this.curp}&apiKey=${this.apikey}`);
      this.completed.emit(await response.json());
    } catch(error) {
       this.completed.emit(error);
    }
  }

  handleChange(event) {
    this.curp = event.target.value;
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
          <div>
               <div>
                  <label class="desc" id="labelCurp" htmlfor="curp"  >CURP: </label>
               </div>
               <div>
                  <input type="text"  id="Field1" name="" class="field text fn" value={this.curp} onInput={(event) => this.handleChange(event)} />
               </div>
          </div>
         <div>
            <div>
              <input id="saveForm" name="saveForm" class="submit" type="submit" value="Submit" />
          </div>
         </div>
      </form>
    );
  }

}
