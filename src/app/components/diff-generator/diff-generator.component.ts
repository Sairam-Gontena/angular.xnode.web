import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-diff-generator',
  templateUrl: './diff-generator.component.html',
  styleUrls: ['./diff-generator.component.scss']
})
export class DiffGeneratorComponent {
  @Input() newContent:string = ''
  @Input() oldContent:string = ''
  @Input() onDiff:boolean = false;
}
