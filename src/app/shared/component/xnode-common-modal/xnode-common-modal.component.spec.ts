import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XnodeCommonModalComponent } from './xnode-common-modal.component';

describe('XnodeCommonModalComponent', () => {
  let component: XnodeCommonModalComponent;
  let fixture: ComponentFixture<XnodeCommonModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XnodeCommonModalComponent]
    });
    fixture = TestBed.createComponent(XnodeCommonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
