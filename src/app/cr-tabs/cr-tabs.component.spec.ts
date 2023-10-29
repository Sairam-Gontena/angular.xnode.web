import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrTabsComponent } from './cr-tabs.component';

describe('CrTabsComponent', () => {
  let component: CrTabsComponent;
  let fixture: ComponentFixture<CrTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrTabsComponent]
    });
    fixture = TestBed.createComponent(CrTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
