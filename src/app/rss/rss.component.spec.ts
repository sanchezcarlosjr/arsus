import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RssComponent } from './rss.component';

describe('RssComponent', () => {
  let component: RssComponent;
  let fixture: ComponentFixture<RssComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RssComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
