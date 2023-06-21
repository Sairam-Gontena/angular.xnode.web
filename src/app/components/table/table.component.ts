import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  // @Input() data:any[];
  
  constructor(){
  }
  ngOnInit(): void {
    console.log("dfljdl")
    this.getData()

  }
  tablekey:any=[]
  tablevalue:any=[]
  array:any =[
    {
      "Version":"3.0",
      "Deployed On":"2023-07-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"pending"
    },
    {
      "Version":"2.0",
      "Deployed On":"2023-05-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"deployed"

    },
    {
      "Version":"1.0",
      "Deployed On":"2023-04-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"deployed"

    },
    {
      "Version":"0.1",
      "Deployed On":"2023-03-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"deployed"

    },
  ]

  getData(){
    this.array.forEach((element:any) => {
      this.tablekey=Object.keys(element);
      this.tablevalue.push(Object.values(element))
    });

  }

}
