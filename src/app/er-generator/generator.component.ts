import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';

// service
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';

// class
import { Data } from './class/data';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Model } from './class/model';
import { ModalDataComponent } from './modal-data/modal-data.component';
import { ModalDownloadComponent } from './modal-download/modal-download.component';
import { ModalModelComponent } from './modal-model/modal-model.component';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';

@Component({
  selector: 'er-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements AfterViewInit, AfterViewChecked {
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

  ngAfterViewInit() {
    console.log('AppComponent.ngAfterViewInit() is called!');
    this.jsPlumbService.init();
  }

  ngAfterViewChecked() {
    //console.log('AppComponent.ngAfterViewChecked() is called!');
    if (this.dataService.flg_repaint) {
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }

  createModel(): void {
    this.bsModalRef = this.bsModalService.show(ModalModelComponent, {
      initialState: {
        mode: 'create',
        model: new Model(),
        // @ts-ignore
        use_laravel_auth: this.dataService.data.use_laravel_auth,
      },
      ignoreBackdropClick: true,
    });
  }

  exportJson(): void {
    console.log('NavbarComponent.exportJson() is called!');

    var theJSON = JSON.stringify(this.dataService.data, null, '  ');
    var uri = this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON)
    );
    this.bsModalRef = this.bsModalService.show(ModalDownloadComponent, {
      initialState: {
        uri: uri,
      },
      ignoreBackdropClick: true,
    });
  }

  importJson(): void {
    console.log('NavbarComponent.importJson() is called!');
    this.bsModalRef = this.bsModalService.show(ModalUploadComponent, {
      ignoreBackdropClick: true,
    });
  }

  dataSetting(): void {
    console.log('NavbarComponent.dataSetting() is called!');

    this.bsModalRef = this.bsModalService.show(ModalDataComponent, {
      initialState: {
        // @ts-ignore
        data: this.dataService.data,
      },
      ignoreBackdropClick: true,
    });
  }
}
