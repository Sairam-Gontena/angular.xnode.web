import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageAppSideMenuComponent } from './homepage-app-side-menu.component';

describe('HomepageAppSideMenuComponent', () => {
  let component: HomepageAppSideMenuComponent;
  let fixture: ComponentFixture<HomepageAppSideMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageAppSideMenuComponent]
    });
    fixture = TestBed.createComponent(HomepageAppSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
