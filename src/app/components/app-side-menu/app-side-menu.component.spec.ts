import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSideMenuComponent } from './app-side-menu.component';

describe('AppSideMenuComponent', () => {
  let component: AppSideMenuComponent;
  let fixture: ComponentFixture<AppSideMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppSideMenuComponent]
    });
    fixture = TestBed.createComponent(AppSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
