import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivityTableComponent } from './recent-activity-table.component';

describe('RecentActivityTableComponent', () => {
  let component: RecentActivityTableComponent;
  let fixture: ComponentFixture<RecentActivityTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecentActivityTableComponent]
    });
    fixture = TestBed.createComponent(RecentActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
