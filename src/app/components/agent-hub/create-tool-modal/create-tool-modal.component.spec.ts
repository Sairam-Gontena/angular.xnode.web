import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateToolModalComponent } from './create-tool-modal.component';

describe('CreateToolModalComponent', () => {
  let component: CreateToolModalComponent;
  let fixture: ComponentFixture<CreateToolModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateToolModalComponent]
    });
    fixture = TestBed.createComponent(CreateToolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
