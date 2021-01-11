import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { ThemeStateModule } from '../../../store/theme/theme.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timeline',
  template: '<ng-content></ng-content>',
})
export class TimelineComponent implements OnInit {
  @Select(ThemeStateModule.isDarkTheme) theme$: Observable<boolean>;

  constructor(private readonly _elementRef: ElementRef) {}

  ngOnInit(): void {
    window['twttr'].ready((twttr: any) => {
      this.theme$.subscribe((isDarkTheme: boolean) => {
        twttr.widgets
          .createTimeline(
            {
              sourceType: 'profile',
              screenName: 'CharllierJr',
            },
            this._elementRef.nativeElement,
            {
              align: 'center',
              width: '50%',
              height: 600,
              'tweet-limit': 3,
              theme: isDarkTheme ? 'dark' : '',
            }
          )
          .then(() => {});
      });
    });
  }
}
