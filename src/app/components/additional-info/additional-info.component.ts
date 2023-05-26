import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


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

