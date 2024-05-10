import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConfigureAgentHeaderComponent } from './create-configure-agent-header.component';

describe('CreateConfigureAgentHeaderComponent', () => {
  let component: CreateConfigureAgentHeaderComponent;
  let fixture: ComponentFixture<CreateConfigureAgentHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateConfigureAgentHeaderComponent]
    });
    fixture = TestBed.createComponent(CreateConfigureAgentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
