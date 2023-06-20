import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'xnode-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent {
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  iconClicked: any;

  // formGroup!: FormGroup;

  // ngOnInit() {
  //   this.formGroup = new FormGroup({
  //     value: new FormControl(4),
  //   });
  // }
  // val2!: number;

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  };
  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }
  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }
}
