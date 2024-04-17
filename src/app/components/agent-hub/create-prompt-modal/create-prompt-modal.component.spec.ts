import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePromptModalComponent } from './create-prompt-modal.component';

describe('CreatePromptModalComponent', () => {
  let component: CreatePromptModalComponent;
  let fixture: ComponentFixture<CreatePromptModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePromptModalComponent]
    });
    fixture = TestBed.createComponent(CreatePromptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
