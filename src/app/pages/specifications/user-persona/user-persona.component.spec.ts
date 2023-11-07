import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPersonaComponent } from './user-persona.component';

describe('UserPersonaComponent', () => {
  let component: UserPersonaComponent;
  let fixture: ComponentFixture<UserPersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPersonaComponent]
    });
    fixture = TestBed.createComponent(UserPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
