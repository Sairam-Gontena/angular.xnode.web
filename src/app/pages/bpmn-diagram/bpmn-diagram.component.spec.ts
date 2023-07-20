import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmnDiagramComponent } from './bpmn-diagram.component';

describe('BpmnDiagramComponent', () => {
  let component: BpmnDiagramComponent;
  let fixture: ComponentFixture<BpmnDiagramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BpmnDiagramComponent]
    });
    fixture = TestBed.createComponent(BpmnDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
