import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBuilderComponent } from './template-builder.component';

describe('TemplateBuilderComponent', () => {
  let component: TemplateBuilderComponent;
  let fixture: ComponentFixture<TemplateBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateBuilderComponent]
    });
    fixture = TestBed.createComponent(TemplateBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
