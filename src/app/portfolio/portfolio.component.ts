import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { FetchNews, GetNews } from './news/news.actions';
import { Article, NewsState } from '@app/portfolio/news/news.state';
import { Observable, Subscription } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { BlobIframeComponent } from '@shared/iframe/blob-iframe/blob-iframe.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthStateModule } from '@store/auth/auth.state';
import { MusicService } from '@app/portfolio/music/music.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  @Select(NewsState.articles) articles: Observable<Article[]>;
  userUID = '';
  dialogFlow = '';
  itHasFinishedPlaying = false;
  private subscription = new Subscription();

  constructor(
    private store: Store,
    public modalController: ModalController,
    private firestore: AngularFirestore,
    private music: MusicService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetNews());
    this.subscription = this.store.select(AuthStateModule.uid).subscribe((uid) => (this.userUID = uid));
    this.dialogFlow =
      '<df-messenger\n' +
      '    intent="WELCOME"\n' +
      '    chat-title="😀 Carlos Sanchez"\n' +
      '    chat-icon="assets/icons/icon-72x72.png"\n' +
      '    agent-id="695979d8-2719-43a8-98b2-25747f9d2602"\n' +
      '    language-code="en"\n' +
      '  ></df-messenger>';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async share(article: Article) {
    await this.interaction(article.uid);
    const { Share } = Plugins;
    await Share.share({
      title: article.title,
      text: article.description,
      url: article.url,
      dialogTitle: "It's very important.",
    });
  }

  async interaction(articleUID: string) {
    await this.firestore.collection('UserInteractions').add({
      userUID: this.userUID,
      created_at: new Date(),
      type: 0,
      articleUID,
    });
  }

  async seeMore(description: string, articleUID: string) {
    const modal = await this.modalController.create({
      component: BlobIframeComponent,
      componentProps: {
        description,
      },
    });
    await modal.present();
    await this.interaction(articleUID);
  }

  async playMusic(src: string) {
    this.itHasFinishedPlaying = !this.itHasFinishedPlaying;
    await this.music.play(src);
  }

  loadData(event: any): void {
    this.store.dispatch(
      new FetchNews({
        error: () => '',
        complete: () => event.target.complete(),
      })
    );
  }
}
