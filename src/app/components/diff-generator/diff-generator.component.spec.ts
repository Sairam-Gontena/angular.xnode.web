import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffGeneratorComponent } from './diff-generator.component';

describe('DiffGeneratorComponent', () => {
  let component: DiffGeneratorComponent;
  let fixture: ComponentFixture<DiffGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiffGeneratorComponent]
    });
    fixture = TestBed.createComponent(DiffGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
