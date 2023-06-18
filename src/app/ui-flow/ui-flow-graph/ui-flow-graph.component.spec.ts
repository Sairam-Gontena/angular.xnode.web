import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFlowGraphComponent } from './ui-flow-graph.component';

describe('UiFlowGraphComponent', () => {
  let component: UiFlowGraphComponent;
  let fixture: ComponentFixture<UiFlowGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiFlowGraphComponent]
    });
    fixture = TestBed.createComponent(UiFlowGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
