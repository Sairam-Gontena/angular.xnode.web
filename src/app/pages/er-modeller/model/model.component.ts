// core
import { Component, Input, ElementRef } from '@angular/core';

// ngx-bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// service
import { DataService } from '../service/data.service';
import { JsPlumbService } from '../service/jsPlumb.service';

// component
import { ModalModelComponent } from '../modal-model/modal-model.component';
import { ModalSchemaComponent } from '../modal-schema/modal-schema.component';

// class
import { Model } from '../class/model';
import { Schema } from '../class/schema';

@Component({
  selector: 'model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent {
  // @ts-ignore
  @Input() myModel: Model;
  @Input() inDiffView:any;

  // @ts-ignore
  public bsModalRef: BsModalRef;

  constructor(
    private bsModalService: BsModalService,
    private dataService: DataService,
    private jsPlumbService: JsPlumbService,
    private el: ElementRef
  ) { }

  ngOnInit(){
    console.log('IN MODEL TS ------------ ',this.myModel)
  }

  ngAfterViewInit() {
    this.jsPlumbService.initModel(this.myModel,this.inDiffView); //,c2c this.inDiffView in params
  }

  ngOnDestroy() {
    this.jsPlumbService.destroyModel(this.myModel);
  }

  public editModel(): void {
    this.bsModalRef = this.bsModalService.show(ModalModelComponent, {
      initialState: {
        mode: 'edit',
        model: this.myModel,
        // @ts-ignore
        use_laravel_auth: this.dataService.data.use_laravel_auth,
      },
      ignoreBackdropClick: true,
    });
  }

  public deleteModel() {
  }

  public addSchema(): void {
    var schema = new Schema();
    schema.parent_id = this.myModel.id;
    // @ts-ignore
    if (this.dataService.data.use_laravel_auth) {
      schema.nullable = true;
    }
    this.bsModalRef = this.bsModalService.show(ModalSchemaComponent, {
      initialState: {
        mode: 'create',
        schema: schema,
        // @ts-ignore
        use_laravel_auth: this.dataService.data.use_laravel_auth,
        // @ts-ignore
        parent_model: this.myModel,
      },
      ignoreBackdropClick: true,
    });
  }

  public contextMenu(params: any): void {
  }

  public startDrag(): void {
    this.jsPlumbService.toggleDraggable(this.myModel);
  }

  public endDrag(): void {
    this.jsPlumbService.toggleDraggable(this.myModel);

    // record position
    let style_left = this.el.nativeElement.querySelectorAll(
      '#' + this.myModel.getElementId()
    )[0].style.left;
    let style_top = this.el.nativeElement.querySelectorAll(
      '#' + this.myModel.getElementId()
    )[0].style.top;
    this.myModel.pos_x = parseInt(style_left, 10);
    this.myModel.pos_y = parseInt(style_top, 10);
  }
}
