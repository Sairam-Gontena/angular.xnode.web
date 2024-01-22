// core
import { Injectable } from '@angular/core';

// ngx-bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// service
import { DataService } from './data.service';

// component
import { ModalRelationComponent } from '../modal-relation/modal-relation.component';

// class
import { Model } from '../class/model';
import { Schema } from '../class/schema';

import { jsPlumb } from 'jsplumb';

@Injectable()
export class JsPlumbService {
  private _instance: any;
  private bsModalRef: BsModalRef | undefined;

  constructor(
    private dataService: DataService,
    private bsModalService: BsModalService
  ) { }

  public init(obj?:any): void {
    if(obj?.inDiffView){
      obj.ids.forEach((item:any)=>{
        console.log('check item',item)
        this._instance = jsPlumb.getInstance({
          Container: 'canvas-2',
          Anchor: ['RightMiddle', 'LeftMiddle'],
          ConnectionsDetachable: false,
        });
      })
    }else{
      console.log('check me on else')
      this._instance = jsPlumb.getInstance({
        Container: 'canvas',
        Anchor: ['RightMiddle', 'LeftMiddle'],
        ConnectionsDetachable: false,
      });
    }
  }

  public initModel(model: Model,inDiff?:boolean): void {  //c2c second param

    // draggable
    this._instance.draggable(model.getElementId());
    this._instance.toggleDraggable(model.getElementId());

    // add endpoint
    if (model.is_pivot === false) {
      let modalPoint:any
      if(inDiff){//c2c about indiff
        modalPoint = model.getElementH2Id(true)
      }else{
        modalPoint = model.getElementH2Id();
      }
      console.log(model.getElementH2Id())
      this._instance.addEndpoint(modalPoint, { //model.getElementH2Id()
        isSource: true,
        isTarget: true,
        cssClass: 'model-default-endpoint',
        beforeDrop: (params: { sourceId: string; targetId: string }) => {
          this.bsModalRef = this.bsModalService.show(ModalRelationComponent, {
            initialState: {
              source_model: this.dataService.data?.getModelByElementH2Id(
                params.sourceId
              ),
              target_model: this.dataService.data?.getModelByElementH2Id(
                params.targetId
              ),
            },
          });
          return false;
        },
      });
    }

    // load jsplumb connection
    // @ts-ignore
    for (let i = 0; i < this.dataService.data.models.length; i++) {
      // @ts-ignore
      for (let j = 0; j < this.dataService.data.models[i].schemas.length; j++) {
        // @ts-ignore
        this.initSchema(this.dataService.data.models[i].schemas[j], inDiff); // c2c 2nd param
      }
    }
  }

  public destroyModel(model: Model, inDiff?:boolean) { // c2c secnd param
    // delete myself endpoint
    let modalPoint:any;
    if(inDiff){
      modalPoint = model.getElementH2Id(true)
    }else{
      modalPoint = model.getElementH2Id();
    }
    this._instance
      .selectEndpoints({
        source: modalPoint,
      })
      .delete();//model.getElementH2Id(),  c2c

    // check connection exists as destroy-model source
    var connections_to_delete = this._instance.getConnections({
      source: modalPoint,
    });//model.getElementH2Id() c2c

    for (let i = 0; i < connections_to_delete.length; i++) {
      var schema_to_delete = this.dataService.data?.getSchemaByElementId(
        connections_to_delete[i].targetId
      );
      if (schema_to_delete) {
        this.dataService.deleteSchema(schema_to_delete);
      }
    }
  }

  // @ts-ignore
  public initSchema(schema: Schema | null | undefined) {
    if (!schema) {
      return new Schema();
    }

    if (schema?.belongsto) {
      var source_id =
        this.dataService.data
          ?.getModelByName(schema?.belongsto)
          ?.getElementH2Id() ?? '';
      var target_id = schema.getElementId();
      var option = {
        source: source_id,
        target: target_id,
        connector: 'StateMachine',
        paintStyle: { stroke: '#456', strokeWidth: 1 },
        overlays: [
          ['Custom', {
            create:(component:any) => {
                const d = document.createElement("h1")
                d.innerHTML = "c"
                return d
            } , width: 1, length: 1, location: 1 }],
          // @ts-ignore
          [
            'Label',
            {
              label:
                '<div class="text-center">' +
                this.dataService.data?.getModelByName(schema?.belongsto)?.name + ' ( 1:N ) '+
                '<br>' +
                this.dataService.data?.getModelById(schema?.parent_id)?.name +
                '</div>',
              id: source_id + '_' + target_id,
            },
          ],
        ],
      };
      if (this._instance.getConnections(option).length === 0) {
        var connection = this._instance.connect(option);
        // if (connection) {
        //   connection.bind('contextmenu', function (conn: any) {
        //   });
        // }
      } else {
      }
    }
    this.dataService.flg_repaint = true;
  }

  public destroySchema(schema: Schema) {
    if (schema.belongsto) {
      const option = {
        target: schema.getElementId(),
      };
      const connections_to_delete = this._instance.getConnections(option);
      for (let i = 0; i < connections_to_delete.length; i++) {
        this._instance.deleteConnection(connections_to_delete[i]);
      }
    }
  }

  public toggleDraggable(model: Model): void {
    this._instance.toggleDraggable(model.getElementId());
  }

  public repaintEverything(): void {
    this._instance.repaintEverything();
  }

  public deleteAll(): void {
    this._instance.deleteEveryEndpoint();
  }
}
