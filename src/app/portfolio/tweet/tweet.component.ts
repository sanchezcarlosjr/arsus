import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { ThemeStateModule } from '../../../store/theme/theme.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'ng-tweet',
  template: '<ng-content></ng-content>',
})
export class TweetComponent implements OnInit, AfterViewInit {
  @Input() id: string;
  @Output() createdTweet = new EventEmitter();
  @Select(ThemeStateModule.isDarkTheme) theme$: Observable<boolean>;

  constructor(private readonly _elementRef: ElementRef) {}

  ngOnInit() {
    if (this.id) {
      window['twttr'].ready((twttr: any) => {
        this.theme$.subscribe((isDarkTheme: boolean) => {
          twttr.widgets
            .createTweet(this.id, this._elementRef.nativeElement, {
              align: 'center',
              theme: isDarkTheme ? 'dark' : '',
            })
            .then(() => this.createdTweet.emit());
        });
      });
    }
  }

  ngAfterViewInit() {}
}
