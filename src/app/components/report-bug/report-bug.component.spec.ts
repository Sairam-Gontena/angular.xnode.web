import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBugComponent } from './report-bug.component';

describe('ReportBugComponent', () => {
  let component: ReportBugComponent;
  let fixture: ComponentFixture<ReportBugComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportBugComponent]
    });
    fixture = TestBed.createComponent(ReportBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
