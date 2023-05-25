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
  }

  onClickCreateNewTemplate(): void {
    localStorage.setItem('currentUser', String(true));
    this.router.navigate(['/template-builder']);
  }

}
