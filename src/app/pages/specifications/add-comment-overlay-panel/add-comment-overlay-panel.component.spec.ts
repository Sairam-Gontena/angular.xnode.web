import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentOverlayPanelComponent } from './add-comment-overlay-panel.component';

describe('AddCommentOverlayPanelComponent', () => {
  let component: AddCommentOverlayPanelComponent;
  let fixture: ComponentFixture<AddCommentOverlayPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCommentOverlayPanelComponent]
    });
    fixture = TestBed.createComponent(AddCommentOverlayPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
