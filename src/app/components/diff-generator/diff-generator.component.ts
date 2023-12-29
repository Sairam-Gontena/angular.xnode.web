import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-diff-generator',
  templateUrl: './diff-generator.component.html',
  styleUrls: ['./diff-generator.component.scss']
})
export class DiffGeneratorComponent implements OnInit {
  @Input() newContent:string = ''
  @Input() oldContent:string = ''
  @Input() onDiff:boolean = false;
  constructor(){
    console.log('onDiff constructor',this.onDiff)
    console.log('oldContent',this.oldContent)
    console.log('newContent',this.newContent)
  }
  ngOnInit(): void {
    console.log('onDiff ngOnInit',this.onDiff)
    console.log('oldContent',this.oldContent)
    console.log('newContent',this.newContent)
  }
}
