import { Component } from '@angular/core';

@Component({
  selector: 'xnode-template-side-menu',
  templateUrl: './template-side-menu.component.html',
  styleUrls: ['./template-side-menu.component.scss']
})
export class TemplateSideMenuComponent {
  
  selectedMenuIndex: any;

  sidebarVisible: boolean = true;
  constructor() {
  }
 

  ngOnInit() {
    
   }

  
}
