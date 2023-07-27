import { AfterContentInit, Component, ElementRef, ViewChild, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import {
  BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import camundaCloudBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';
import * as camundaModdleDescriptors from 'camunda-bpmn-moddle/resources/camunda.json';
import * as palette_tools_class from './custom-palette-provider.json';
import BpmnPalletteModule from 'bpmn-js/lib/features/palette';
import * as custom from './custom.json';
import Modeler from 'bpmn-js/lib/Modeler';
import PropertiesPanel from 'bpmn-js/lib/Modeler';
import { from, Observable } from 'rxjs';

import * as workflow from '../../../assets/json/flows_modified.json'
import { ApiService } from 'src/app/api/api.service';
import { layoutProcess } from 'bpmn-auto-layout';
// import "bpmn-js/dist/assets/diagram-js.css"
@Component({
  selector: 'xnode-bpmn-diagram',
  templateUrl: './bpmn-diagram.component.html',
  styleUrls: ['./bpmn-diagram.component.scss']
})
export class BpmnDiagramComponent implements AfterContentInit, OnDestroy, OnInit {
  bpmnJS: any;
  pallete_classes: any;
  selected_classes: any;
  xml: string = "";
  jsonWorkflow: any;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private api: ApiService) {
    this.api.postWorkFlow(workflow).then(async (response: any) => {
      this.xml = response?.data;
      const layoutedDiagramXML = await layoutProcess(this.xml);
      this.importDiagram(layoutedDiagramXML);
    }).catch(error => {
      console.log('error', error);
    });
  }

  ngOnInit(): void {
    this.bpmnJS = new Modeler({
      container: '#diagramRef',
      features: {
        palette: {
          enabled: true,
          visible: true,
        },
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        // customPropertiesProvider
        CamundaPlatformPropertiesProviderModule,
        camundaCloudBehaviors
      ],
      moddleExtensions: {
        custom: custom,
        camunda: camundaModdleDescriptors
      }, keyboard: {
        bindTo: window
      },
      BpmnPalletteModule
    });


    const propertiesPanel = new PropertiesPanel({
      parent: '#js-properties-panel',
    });
    this.bpmnJS.propertiesPanel = propertiesPanel;

    this.pallete_classes = palette_tools_class;
    this.selected_classes = [
      "entry bpmn-icon-subprocess-expanded",
      "entry bpmn-icon-data-object",
      "entry bpmn-icon-data-store",
      "entry bpmn-icon-participant",
      "entry bpmn-icon-group"
    ];
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(document.getElementById('diagramRef') as HTMLElement);
    const propertiesPanel = this.bpmnJS.get('propertiesPanel');
    propertiesPanel.attachTo(this.propertiesRef!.nativeElement);
  }


  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }
}
