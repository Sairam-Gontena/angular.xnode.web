import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateHeaderComponent } from './template-header.component';

describe('TemplateHeaderComponent', () => {
  let component: TemplateHeaderComponent;
  let fixture: ComponentFixture<TemplateHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateHeaderComponent]
    });
    fixture = TestBed.createComponent(TemplateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
