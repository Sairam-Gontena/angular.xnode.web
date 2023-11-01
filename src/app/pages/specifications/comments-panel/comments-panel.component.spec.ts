import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPanelComponent } from './comments-panel.component';

describe('CommentsPanelComponent', () => {
  let component: CommentsPanelComponent;
  let fixture: ComponentFixture<CommentsPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsPanelComponent]
    });
    fixture = TestBed.createComponent(CommentsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
