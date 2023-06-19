import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  constructor(private router: Router) { }

  startChatWithBot(): void {
    this.router.navigate(['/x-pilot']);
  }

}
