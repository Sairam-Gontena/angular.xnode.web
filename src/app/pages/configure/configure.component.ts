import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {
  getconfigureLayout: any;
  layout: any;
  dashboard: any;
  layoutColumns: any;
  ngOnInit(): void {
  }

  getLayout(layout: any): void {
    console.log('layout', layout);
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

}
