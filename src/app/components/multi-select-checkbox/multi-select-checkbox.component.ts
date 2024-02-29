import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';



@Component({
  selector: 'xnode-multi-select-checkbox',
  templateUrl: './multi-select-checkbox.component.html',
  styleUrls: ['./multi-select-checkbox.component.scss']
})
export class MultiSelectCheckboxComponent implements OnInit{
  @Input() options!: any[]; // Data for the dropdown

  @Input() showToggleAll: boolean = false; // Flag to show/hide the "Select All" option

  @Input() showHeader: boolean = false; // Flag to show/hide the header

  @Input() filter: boolean = false; // Flag to enable/disable filtering
  @Input() placeholder!: string; // Placeholder text for the input field
  @Input() optionLabel!: string; // Label for the options
  @Input() displaySelectedLabel: boolean = false;
  @Input() styleClass!: string;

  @Input() showIconOnly: boolean = false;
  @Input() hamburgerIconUrl = '../../../assets/agent-hub/menu-hamnburger.svg'

  @Input() customStyle = {}


  @Output() changeEvent = new EventEmitter<{ event: any, val: string }>();

  onChangeHandler(event: any) {
    this.changeEvent.emit(event);
  }

  constructor() {}

  ngOnInit() {
    this.customStyle = {
      'background-image': this.showIconOnly ? 'url(' + this.hamburgerIconUrl + ')' : 'none',
      'background-repeat': 'no-repeat',
      'background-position': 'bottom'
     }
  }
}
