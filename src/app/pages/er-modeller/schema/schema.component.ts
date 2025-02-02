// core
import { Component, Input } from '@angular/core';

// ngx-bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// service
import { DataService } from '../service/data.service';
import { JsPlumbService } from '../service/jsPlumb.service';

// component
import { ModalSchemaComponent } from '../modal-schema/modal-schema.component';

// class
import { Schema } from '../class/schema';

@Component({
  selector: 'schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent {

  @Input() mySchema: Schema | any;
  @Input() first: any;
  @Input() last: any;
  @Input() is_pivot: any;

  // @ts-ignore
  public bsModalRef: BsModalRef;

  constructor(public bsModalService: BsModalService, public dataService: DataService, public jsPlumbService: JsPlumbService) { }

  ngAfterViewInit() {
    this.jsPlumbService.initSchema(this.mySchema);
  }

  ngOnDestroy() {
    this.jsPlumbService.destroySchema(this.mySchema);
  }

  public editSchema(): void {
    this.bsModalRef = this.bsModalService.show(ModalSchemaComponent, {
      initialState: {
        mode: 'edit',
        schema: this.mySchema,
        // @ts-ignore
        use_laravel_auth: this.dataService.data.use_laravel_auth,
        // @ts-ignore
        parent_model: this.dataService.data.getModelById(this.mySchema.parent_id)
      },
      ignoreBackdropClick: true
    });
  }

  public deleteSchema() {
    this.dataService.deleteSchema(this.mySchema);
  }

  public moveupSchema() {
    if (!this.first) {
      this.dataService.moveSchema(this.mySchema, -1);
    }
  }

  public movedownSchema() {
    if (!this.last) {
      this.dataService.moveSchema(this.mySchema, 1);
    }
  }
}
