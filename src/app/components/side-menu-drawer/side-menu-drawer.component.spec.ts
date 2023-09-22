import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuDrawerComponent } from './side-menu-drawer.component';

describe('SideMenuDrawerComponent', () => {
  let component: SideMenuDrawerComponent;
  let fixture: ComponentFixture<SideMenuDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuDrawerComponent]
    });
    fixture = TestBed.createComponent(SideMenuDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
