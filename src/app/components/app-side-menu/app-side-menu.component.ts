import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  href: any;
  constructor(private router: Router, private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    this.selectedMenuIndex = 2;
    this.sideMenuItems = AppSideMenuItems;
    this.sideMenuItems.map((item: any, index: any) => {
      let href = this.location.path();
      if ("/" + item?.path == href) {
        this.selectedMenuIndex = index;
      }
    });
    // this.route.url.subscribe(console.log);
  }

  onClickMenuItem(item: any, i: any): void {
    this.selectedMenuIndex = i;
    console.log(this.selectedMenuIndex)
    this.router.navigate(['/' + item.path])
  }
}
