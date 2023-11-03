import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaViewComponent } from './para-view.component';

describe('ParaViewComponent', () => {
  let component: ParaViewComponent;
  let fixture: ComponentFixture<ParaViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParaViewComponent]
    });
    fixture = TestBed.createComponent(ParaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
