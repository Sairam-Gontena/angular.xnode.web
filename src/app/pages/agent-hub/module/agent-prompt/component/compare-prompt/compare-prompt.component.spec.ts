import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparePromptComponent } from './compare-prompt.component';

describe('ComparePromptComponent', () => {
  let component: ComparePromptComponent;
  let fixture: ComponentFixture<ComparePromptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComparePromptComponent]
    });
    fixture = TestBed.createComponent(ComparePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
