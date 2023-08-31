import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCentreComponent } from './help-centre.component';

describe('HelpCentreComponent', () => {
  let component: HelpCentreComponent;
  let fixture: ComponentFixture<HelpCentreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCentreComponent]
    });
    fixture = TestBed.createComponent(HelpCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
