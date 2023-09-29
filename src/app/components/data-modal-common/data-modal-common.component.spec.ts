import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModalCommonComponent } from './data-modal-common.component';

describe('DataModalCommonComponent', () => {
  let component: DataModalCommonComponent;
  let fixture: ComponentFixture<DataModalCommonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataModalCommonComponent]
    });
    fixture = TestBed.createComponent(DataModalCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
