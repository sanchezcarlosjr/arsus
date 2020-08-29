import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { Select, Store } from '@ngxs/store';
import { ThemeStateModule } from '@store/theme/theme.state';
import { Observable } from 'rxjs';
import { SetThemeAction } from '@store/theme/theme.actions';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  @Select(ThemeStateModule.isDarkTheme) theme$: Observable<boolean>;
  // @ts-ignore
  isInstalledPWA = window.deferredPrompt;

  constructor(private quoteService: QuoteService, private store: Store, private toast: ToastController) {}

  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }

  change() {
    this.store.dispatch(new SetThemeAction());
  }

  async install() {
    try {
      // @ts-ignore
      await window.deferredPrompt.prompt();
    } catch (e) {
      const toast = await this.toast.create({
        message: e.message,
        duration: 2000,
      });
      await toast.present();
    }
  }
}
