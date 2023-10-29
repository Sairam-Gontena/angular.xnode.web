import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsTabsComponent } from './comments-tabs.component';

describe('CommentsTabsComponent', () => {
  let component: CommentsTabsComponent;
  let fixture: ComponentFixture<CommentsTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsTabsComponent]
    });
    fixture = TestBed.createComponent(CommentsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
