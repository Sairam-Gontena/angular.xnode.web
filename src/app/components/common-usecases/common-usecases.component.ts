import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-common-usecases',
  templateUrl: './common-usecases.component.html',
  styleUrls: ['./common-usecases.component.scss']
})

export class CommonUsecasesComponent {
  @Input() searchTerm: any;
  @Input() useCases: any;
  isInsideUseCases: boolean = false;

  constructor(private router: Router,) {
    if (this.router.url === '/usecases') {
      this.isInsideUseCases = true
    } else {
      this.isInsideUseCases = false
    }
  }

  ngOnInit() {
    console.log(this.useCases, '00000000', this.isInsideUseCases)
  }
}
