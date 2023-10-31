import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecSectionsLayoutComponent } from './spec-sections-layout.component';

describe('SpecSectionsLayoutComponent', () => {
  let component: SpecSectionsLayoutComponent;
  let fixture: ComponentFixture<SpecSectionsLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecSectionsLayoutComponent]
    });
    fixture = TestBed.createComponent(SpecSectionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
