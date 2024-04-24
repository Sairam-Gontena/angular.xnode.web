import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptOverviewComponent } from './prompt-overview.component';

describe('PromptOverviewComponent', () => {
  let component: PromptOverviewComponent;
  let fixture: ComponentFixture<PromptOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptOverviewComponent]
    });
    fixture = TestBed.createComponent(PromptOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
