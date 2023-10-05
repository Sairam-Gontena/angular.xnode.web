import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandSpecificationComponent } from './expand-specification.component';

describe('ExpandSpecificationComponent', () => {
  let component: ExpandSpecificationComponent;
  let fixture: ComponentFixture<ExpandSpecificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandSpecificationComponent]
    });
    fixture = TestBed.createComponent(ExpandSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
