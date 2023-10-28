import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsCrPanelComponent } from './comments-cr-panel.component';

describe('CommentsCrPanelComponent', () => {
  let component: CommentsCrPanelComponent;
  let fixture: ComponentFixture<CommentsCrPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsCrPanelComponent]
    });
    fixture = TestBed.createComponent(CommentsCrPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
