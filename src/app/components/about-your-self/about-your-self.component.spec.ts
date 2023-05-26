import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutYourSelfComponent } from './about-your-self.component';

describe('AboutYourSelfComponent', () => {
  let component: AboutYourSelfComponent;
  let fixture: ComponentFixture<AboutYourSelfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutYourSelfComponent]
    });
    fixture = TestBed.createComponent(AboutYourSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
