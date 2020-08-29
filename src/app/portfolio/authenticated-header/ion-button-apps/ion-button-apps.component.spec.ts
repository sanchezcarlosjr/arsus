import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonButtonAppsComponent } from './ion-button-apps.component';

describe('IonButtonAppsComponent', () => {
  let component: IonButtonAppsComponent;
  let fixture: ComponentFixture<IonButtonAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IonButtonAppsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonButtonAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
