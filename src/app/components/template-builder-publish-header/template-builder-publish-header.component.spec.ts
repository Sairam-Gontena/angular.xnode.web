import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBuilderPublishHeaderComponent } from './template-builder-publish-header.component';

describe('TemplateBuilderPublishHeaderComponent', () => {
  let component: TemplateBuilderPublishHeaderComponent;
  let fixture: ComponentFixture<TemplateBuilderPublishHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateBuilderPublishHeaderComponent]
    });
    fixture = TestBed.createComponent(TemplateBuilderPublishHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
