import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-data-dictionary',
  templateUrl: './data-dictionary.component.html',
  styleUrls: ['./data-dictionary.component.scss']
})
export class DataDictionaryComponent implements OnInit {
  @Input() content: any;

  ngOnInit(): void {
  }

  setColumnsToTheTable(data: any) {
    let cols;
    cols = Object.entries(data).map(([field, value]) => ({ field, header: field, value }));
    return cols
  }

}
