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
  values: MenuItem[] | undefined;

  constructor(private router: Router) {
    this.values = [
      // { name: 'Rymond Nelson', code: 'rn', disabled: true },
      { label: 'Logout' }

      ,];
  }

  ngOnInit(): void {
    this.headerItems = HeaderItems;

  }

  onOptionSelected(value: any) {
    console.log(value.code)
    if (value.code == 'lg') {
      localStorage.clear();
      this.router.navigate(['/'])
      // window.location.href = '/';
    }
  }

}
