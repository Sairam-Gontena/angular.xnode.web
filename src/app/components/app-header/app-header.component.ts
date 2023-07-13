import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';



@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  showOptions = false;

  headerItems: any;

  selectedValue: any;
  values: any;

  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    this.headerItems = HeaderItems;
    this.values = [
      { name: 'Logout', code: 'lg' },
      // { name: '', code: '' }
    ];

  }
  onOptionSelected(event: any) {
    console.log(event.value.code, '1245')
    if (event.value.code === 'lg') {
      localStorage.clear();
      this.router.navigate(['/'])
      // window.location.href = '/';
    }
  }

}
