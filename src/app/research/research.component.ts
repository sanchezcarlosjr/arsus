import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '@app/projects/projects.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
})
export class ResearchComponent {
  projects: Observable<Project[]> = this.firestore.collection('projects').valueChanges() as Observable<Project[]>;
  constructor(private firestore: AngularFirestore) {}
}
