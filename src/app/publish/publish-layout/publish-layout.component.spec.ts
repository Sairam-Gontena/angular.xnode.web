import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishLayoutComponent } from './publish-layout.component';

describe('PublishLayoutComponent', () => {
  let component: PublishLayoutComponent;
  let fixture: ComponentFixture<PublishLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishLayoutComponent]
    });
    fixture = TestBed.createComponent(PublishLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
