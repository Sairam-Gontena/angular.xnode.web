import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModelCommonComponent } from './data-model-common.component';

describe('DataModelCommonComponent', () => {
  let component: DataModelCommonComponent;
  let fixture: ComponentFixture<DataModelCommonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataModelCommonComponent]
    });
    fixture = TestBed.createComponent(DataModelCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
