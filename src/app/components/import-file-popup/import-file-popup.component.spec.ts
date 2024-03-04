import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFilePopupComponent } from './import-file-popup.component';

describe('ImportFilePopupComponent', () => {
  let component: ImportFilePopupComponent;
  let fixture: ComponentFixture<ImportFilePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFilePopupComponent]
    });
    fixture = TestBed.createComponent(ImportFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
