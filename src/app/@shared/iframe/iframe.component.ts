import { Component, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

@Component({
  selector: 'ngx-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IframeComponent implements OnChanges, OnDestroy {
  @Input() src = '';
  @Input() script = '';
  @Input() html = '';
  height = '0';

  constructor(
    private platform: Platform,
    private readonly elementRef: ElementRef,
    private renderer: Renderer2,
    private loading: LoadingController
  ) {
    this.height = `100%`;
  }

  async ngOnChanges() {
    if (this.script) {
      const loading = await this.loading.create({
        message: 'Please wait...',
      });
      await loading.present();
      const script = this.renderer.createElement('script');
      script.src = this.script;
      script.onload = async () => {
        window.fbAsyncInit = () => {
          window.FB.init({
            xfbml: true,
            version: 'v8.0',
          });
        };
        await loading.dismiss();
      };
      this.renderer.appendChild(this.elementRef.nativeElement, script);
    }
  }

  // TODO
  ngOnDestroy() {
    if (this.script) {
    }
  }
}
