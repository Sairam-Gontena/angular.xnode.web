import { Component } from '@angular/core';
import { Data } from '../class/data';
import { Model } from '../class/model';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../service/data.service';
import { JsPlumbService } from '../service/jsPlumb.service';

@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss']
})
export class ErModellerComponent {
  data: Data;

  public isCollapsed: boolean = true;
  // @ts-ignore
  public bsModalRef: BsModalRef;
  showSchemaModel: boolean = false;
  emptyModel: Model = new Model();

  constructor(
    private dataService: DataService,
    private jsPlumbService: JsPlumbService,
    private bsModalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    console.log('AppComponent.constructor() is called!');
    // @ts-ignore
    this.data = this.dataService.data;
  }


}
