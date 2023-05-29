import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'xnode-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent {
  @Input() visible: boolean | undefined;

  constructor(private router: Router) {

  }

  navigateToOnBoarding(): void {
    this.router.navigate(['/onboarding']);
  }
}

