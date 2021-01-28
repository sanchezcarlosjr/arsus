import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private src = '';
  private audio: HTMLAudioElement;

  constructor() {}

  public get isThereAudio() {
    return !!this.audio && !this.audio.ended;
  }

  public async play(src: string) {
    if (this.src === src) {
      this.stop();
      this.src = '';
      return;
    }
    this.stop();
    this.src = src;
    this.audio = new Audio(this.src);
    await this.audio.play();
  }

  public stop() {
    if (this.isThereAudio) {
      this.audio.pause();
    }
  }
}
