import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrIntegrationComponent } from './cr-integration.component';

describe('CrIntegrationComponent', () => {
  let component: CrIntegrationComponent;
  let fixture: ComponentFixture<CrIntegrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrIntegrationComponent]
    });
    fixture = TestBed.createComponent(CrIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
