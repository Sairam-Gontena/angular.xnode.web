import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonUsecasesComponent } from './common-usecases.component';

describe('CommonUsecasesComponent', () => {
  let component: CommonUsecasesComponent;
  let fixture: ComponentFixture<CommonUsecasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonUsecasesComponent]
    });
    fixture = TestBed.createComponent(CommonUsecasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
