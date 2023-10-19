import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-spec-gen-popup',
  templateUrl: './spec-gen-popup.component.html',
  styleUrls: ['./spec-gen-popup.component.scss']
})
export class SpecGenPopupComponent implements OnInit {
  @Input() content: any;
  @Input() showSpecGenaretePopup: any;
  @Input() isTheCurrentUserOwner: any;
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() generateSpec = new EventEmitter<boolean>();
  email: any;
  userId: any;
  product: any;
  consversationList: any;
  constructor() {
  }

  ngOnInit(): void {

  }

  generate(): void {
    this.generateSpec.emit();
  }
}
