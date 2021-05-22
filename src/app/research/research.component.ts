import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '@app/projects/projects.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
})
export class ResearchComponent {
  projects: Observable<Project[]> = this.firestore.collection('projects').valueChanges() as Observable<Project[]>;
  constructor(private firestore: AngularFirestore, private router: Router) {}
  goTo(project: Project) {
    const type = project.typeWeb || project.type;
    switch (type) {
      case 'appWeb':
        return this.router.navigate(['/', project.name, project.uid]);
      case 'redirect':
        return window.open(project.url, '_blank');
    }
  }
}
