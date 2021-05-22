import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appHref]',
})
export class HrefDirective {
  @Input() appHref: string[];
  constructor(private router: Router, private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'pointer';
  }
  @HostListener('click', ['$event']) onClick() {
    switch (this.appHref[0]) {
      case 'appWeb':
        return this.router.navigateByUrl(this.appHref[1]);
      case 'redirect':
        return window.open(this.appHref[1], '_blank');
    }
  }
}
