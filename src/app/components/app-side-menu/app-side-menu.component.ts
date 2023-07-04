import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  href: any;
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const storedMenuIndex = localStorage.getItem('selectedMenuIndex');
    if (storedMenuIndex) {
      this.selectedMenuIndex = parseInt(storedMenuIndex);
    } else {
      this.selectedMenuIndex = 0;
    }
    // this.selectedMenuIndex = 2;
    this.sideMenuItems = AppSideMenuItems;
    this.route.url.subscribe(console.log);
  }

  onClickMenuItem(item: any, i: any): void {
    this.selectedMenuIndex = i;
    localStorage.setItem('selectedMenuIndex', i.toString());
    this.router.navigate(['/' + item.path])
  }
}
