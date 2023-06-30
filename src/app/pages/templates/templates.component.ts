import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})

export class TemplatesComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  onClickCreateNewTemplate(): void {
    this.router.navigate(['/design']);
  }
  onClickgotoxPilot() {
    this.router.navigate(['/x-pilot']);
  }
}
