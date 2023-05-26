import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGetStartedComponent } from './export-get-started.component';

describe('ExportGetStartedComponent', () => {
  let component: ExportGetStartedComponent;
  let fixture: ComponentFixture<ExportGetStartedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportGetStartedComponent]
    });
    fixture = TestBed.createComponent(ExportGetStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
