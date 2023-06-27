import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFinbuddyComponent } from './welcome-finbuddy.component';

describe('WelcomeFinbuddyComponent', () => {
  let component: WelcomeFinbuddyComponent;
  let fixture: ComponentFixture<WelcomeFinbuddyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeFinbuddyComponent]
    });
    fixture = TestBed.createComponent(WelcomeFinbuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
