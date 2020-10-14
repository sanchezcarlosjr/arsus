import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss']
})
export class RssComponent implements OnInit {
  sources = this.firestore.collection('TypeCommunication', (query) => query.where('type', "==", 'content'))
  .valueChanges().pipe(
    map((docs: []) => {
      return docs.map((doc: {id: string}) => doc.id.split("<")[0])
    })
  );
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

}
