import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '@app/i18n';
import { CoreModule } from '@core';
import { IonicModule, LoadingController, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        TranslateModule.forRoot(),
        I18nModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        Platform,
        LoadingController,
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
