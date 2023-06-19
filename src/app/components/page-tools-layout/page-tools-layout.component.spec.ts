import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageToolsLayoutComponent } from './page-tools-layout.component';

describe('PageToolsLayoutComponent', () => {
  let component: PageToolsLayoutComponent;
  let fixture: ComponentFixture<PageToolsLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageToolsLayoutComponent]
    });
    fixture = TestBed.createComponent(PageToolsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
