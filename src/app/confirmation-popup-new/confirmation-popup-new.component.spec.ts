import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPopupNewComponent } from './confirmation-popup-new.component';

describe('ConfirmationPopupNewComponent', () => {
  let component: ConfirmationPopupNewComponent;
  let fixture: ComponentFixture<ConfirmationPopupNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationPopupNewComponent]
    });
    fixture = TestBed.createComponent(ConfirmationPopupNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
