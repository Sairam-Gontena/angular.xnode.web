import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCrVersionComponent } from './create-new-cr-version.component';

describe('CreateNewCrVersionComponent', () => {
  let component: CreateNewCrVersionComponent;
  let fixture: ComponentFixture<CreateNewCrVersionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewCrVersionComponent]
    });
    fixture = TestBed.createComponent(CreateNewCrVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
