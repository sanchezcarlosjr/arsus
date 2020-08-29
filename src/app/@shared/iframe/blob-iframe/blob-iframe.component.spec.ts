import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobIframeComponent } from './blob-iframe.component';

describe('IframeComponent', () => {
  let component: BlobIframeComponent;
  let fixture: ComponentFixture<BlobIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlobIframeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlobIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
