import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InActiveTimeoutPopupComponent } from './inactive-timeout-popup.component';


describe('InActiveTimeoutPopupComponent', () => {
  let component: InActiveTimeoutPopupComponent;
  let fixture: ComponentFixture<InActiveTimeoutPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InActiveTimeoutPopupComponent]
    });
    fixture = TestBed.createComponent(InActiveTimeoutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
