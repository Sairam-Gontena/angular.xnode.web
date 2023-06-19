import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'xnode-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent {
  formGroup!: FormGroup;

  ngOnInit() {
    this.formGroup = new FormGroup({
      value: new FormControl(4)
    });
  }
}
