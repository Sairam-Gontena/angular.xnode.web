import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDictionaryComponent } from './data-dictionary.component';

describe('DataDictionaryComponent', () => {
  let component: DataDictionaryComponent;
  let fixture: ComponentFixture<DataDictionaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataDictionaryComponent]
    });
    fixture = TestBed.createComponent(DataDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
