import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmnCommonComponent } from './bpmn-common.component';

describe('BpmnCommonComponent', () => {
  let component: BpmnCommonComponent;
  let fixture: ComponentFixture<BpmnCommonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BpmnCommonComponent]
    });
    fixture = TestBed.createComponent(BpmnCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
