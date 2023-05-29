import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviseTemplateComponent } from './advise-template.component';

describe('AdviseTemplateComponent', () => {
  let component: AdviseTemplateComponent;
  let fixture: ComponentFixture<AdviseTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdviseTemplateComponent]
    });
    fixture = TestBed.createComponent(AdviseTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
