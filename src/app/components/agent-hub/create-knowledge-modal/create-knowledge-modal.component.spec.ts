import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKnowledgeModalComponent } from './create-knowledge-modal.component';

describe('CreateKnowledgeModalComponent', () => {
  let component: CreateKnowledgeModalComponent;
  let fixture: ComponentFixture<CreateKnowledgeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateKnowledgeModalComponent]
    });
    fixture = TestBed.createComponent(CreateKnowledgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
