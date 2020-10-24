import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';

export interface CurpResponse {
   curp: string;
}

@Component({
  tag: 'gov-form',
  styleUrl: 'gov-form.css',
  shadow: true,
})
export class GovForm {
  @Prop() apikey: string;
  @State() curp: string;
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
        <label>
          CURP:
          <input type="text" value={this.curp} onInput={(event) => this.handleChange(event)} />
        </label>
        <input class="submit" type="submit" value="Submit" />
      </form>
    );
  }

}
