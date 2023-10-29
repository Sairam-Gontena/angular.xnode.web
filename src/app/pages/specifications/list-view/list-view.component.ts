import { Component, Input } from '@angular/core';
import { Section } from 'src/models/section';

@Component({
  selector: 'xnode-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  @Input() content!: Array<Section>;
  @Input() searchTerm!: string;

}
