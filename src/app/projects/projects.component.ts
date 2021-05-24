import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';

export interface Project {
  name: string;
  url: string;
  uid: string;
  landing: string;
  img: string;
  title: string;
  type: string;
  typeWeb?: string;
  script?: string;
  html?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  project: Project = {
    name: '',
    title: '',
    landing: '',
    url: '',
    uid: '',
    type: '',
    img: '',
  };
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private functions: AngularFireFunctions
  ) {}

  ngOnInit(): void {
    this.subscription = this.firestore
      .collection('projects')
      .doc(this.route.snapshot.paramMap.get('uid'))
      .valueChanges()
      .pipe(
        switchMap((project: Project) =>
          this.auth.user.pipe(
            map((user) => {
              if (!user && project.landing) {
                project.url = project.landing;
                return project;
              }
              window.addEventListener('message', this.actionByIframe, false);
              return project;
            })
          )
        )
      )
      .subscribe((project: Project) => (this.project = project));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private actionByIframe = async (e: any) => {
    const type = e.data.message;
    if (type == null) {
      return;
    }
    switch (type) {
      case 'database':
        await this.functions.httpsCallable('updateDataUABC')(e.data.value).toPromise();
        break;
    }
  };
}
