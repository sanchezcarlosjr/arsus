import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Article } from '@app/portfolio/news/news.state';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  article: Article = {
    type: '',
    description: '',
    source: { name: '' },
    title: '',
  };
  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.firestore
      .collection('content')
      .doc(this.route.snapshot.paramMap.get('uid'))
      .valueChanges()
      .subscribe((document: Article) => (this.article = document));
  }
}
