import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'xnode-common-modal',
  templateUrl: './xnode-common-modal.component.html',
  styleUrls: ['./xnode-common-modal.component.scss']
})
export class XnodeCommonModalComponent {
  @Input() commonModalDetail: any;
  visible: boolean = true;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.commonModalDetail?.currentValue) {
      this.commonModalDetail = changes.commonModalDetail.currentValue;
    }
  }

}
