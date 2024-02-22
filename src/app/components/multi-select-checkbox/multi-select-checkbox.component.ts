import { Component, Input } from '@angular/core';



@Component({
  selector: 'xnode-multi-select-checkbox',
  templateUrl: './multi-select-checkbox.component.html',
  styleUrls: ['./multi-select-checkbox.component.scss']
})
export class MultiSelectCheckboxComponent {
  @Input() options!: any[]; // Data for the dropdown

  @Input() showToggleAll: boolean = false; // Flag to show/hide the "Select All" option

  @Input() showHeader: boolean = false; // Flag to show/hide the header

  @Input() filter: boolean = false; // Flag to enable/disable filtering
  @Input() placeholder!: string; // Placeholder text for the input field
  @Input() optionLabel!: string; // Label for the options
}
