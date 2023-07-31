
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
import { UserUtil } from '../../utils/user-util';
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
  sidebarVisible: any;
  jsonWorkflow: any;
  elementList: any;
  flowInfo: any;
  userTask: any;
  serviceTask: any;
  sP: boolean = false;
  task: boolean = false;
  taskHeader: any;
  generalInfo: any;
  currentUser: any;

  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;

  constructor(private api: ApiService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.api.get('/retrieve_xflows/' + this.currentUser?.email + '/' + localStorage.getItem('record_id')).then(async (response: any) => {
      if (response) {
        this.loadXFlows(response.data);
      } else {
        this.loadXFlows(workflow);
      }
    }).catch(error => {
      console.log('error', error);
      this.loadXFlows(workflow);
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
        CamundaPlatformPropertiesProviderModule,
        camundaCloudBehaviors
      ],
      moddleExtensions: {
        custom: custom,
        camunda: camundaModdleDescriptors
      }, keyboard: {
        bindTo: window
      },
      BpmnPalletteModule,
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
    this.generalInfo = [
      { 'index': 0, 'label': 'Entity', 'value': 'XFLow-Budget' },
      { 'index': 1, 'label': 'Name', 'value': 'Business Model Budgeting Process Collaborative X Flow' },
      { 'index': 2, 'label': 'Element Documentation', 'value': 'Business Model Budgeting Process Collaborative X Flow' },
    ];
    this.jsonWorkflow = JSON.stringify(workflow, null, 2);
    const propertiesPanel = this.bpmnJS.get('propertiesPanel');
    propertiesPanel.attachTo(this.propertiesRef!.nativeElement);
  }

  getElement() {
    this.sidebarVisible = !this.sidebarVisible;
    this.bpmnJS.get('eventBus').on('element.click', 9, (event: any) => {
      if (event.element.type === 'bpmn:Process') {
        this.flowInfo = this.getDisplayProperty(event.element);
        this.sP = false;
        this.task = false;
        this.taskHeader = {
          'label': 'Pool',
          'task': event.element.id,
          'pHeader': 'Flow'
        };
      } else if (event.element.type === 'bpmn:SubProcess') {
        let res = this.getDisplayProperty(event.element)
        this.flowInfo = res.fI;
        this.userTask = res.uT;
        this.serviceTask = res.sT;
        this.sP = true;
        this.task = false;
        this.taskHeader = {
          'label': 'Activity',
          'task': event.element.businessObject.name,
          'pHeader': 'Flow'
        };
      } else if (event.element.type === 'bpmn:UserTask' || event.element.type === 'bpmn:ServiceTask') {
        let pHeader = '';
        this.flowInfo = this.getDisplayProperty(event.element);
        this.task = true;
        this.sP = false;
        this.elementList = event.element;
        if (event.element.type === 'bpmn:UserTask') {
          pHeader = 'UserFlow'
        } else {
          pHeader = 'BackendFlow'
        }
        this.taskHeader = {
          'label': 'Task',
          'task': event.element.businessObject.name,
          'pHeader': pHeader
        };
      } else { }
    });
  }

  getDisplayProperty(element: any) {
    let flowElements = element.businessObject.flowElements;
    let userTasks, serviceTasks;
    if (element.type === 'bpmn:Process') {
      flowElements = flowElements.filter((fe: any) => fe.$type === 'bpmn:SubProcess');
      for (let i = 0; i < flowElements.length; i++) {
        flowElements[i].index = i;
        flowElements[i].label = 'Flow ' + (i + 1);
      }
      return flowElements;
    } else if (element.type === 'bpmn:SubProcess') {
      let flow_Info = [
        { 'index': 0, 'label': 'Name', 'name': element.businessObject.name },
        { 'index': 1, 'label': 'type', 'name': element.type },
        { 'index': 2, 'label': 'Role', 'name': '' },
        { 'index': 3, 'label': 'StartEvent', 'name': flowElements[0].id },
        { 'index': 4, 'label': 'EndEvent', 'name': flowElements[flowElements.length - 1].id },
        { 'index': 5, 'label': 'NextEvent', 'name': element.businessObject.outgoing[0].targetRef?.name },
        { 'index': 6, 'label': 'PreviousEvent', 'name': element.businessObject.incoming[0].sourceRef?.name },
      ];
      userTasks = flowElements.filter((fe: any) => fe.$type === 'bpmn:UserTask');
      serviceTasks = flowElements.filter((fe: any) => fe.$type === 'bpmn:ServiceTask');
      for (let i = 0; i < userTasks.length; i++) {
        userTasks[i].index = i;
      }
      for (let i = 0; i < serviceTasks.length; i++) {
        serviceTasks[i].index = i;
      }
      console.log("subprocess", flow_Info, userTasks, serviceTasks);
      return {
        'fI': flow_Info,
        'uT': userTasks,
        'sT': serviceTasks
      };

    } else if (element.type === 'bpmn:UserTask' || element.type === 'bpmn:ServiceTask') {
      console.log("Task", element);
      let business_obj = element.businessObject;
      let start_event = business_obj.$parent.flowElements.filter((fe: any) => fe.$type === 'bpmn:StartEvent')[0];
      let end_event = business_obj.$parent.flowElements.filter((fe: any) => fe.$type === 'bpmn:EndEvent')[0];
      // flowElements = flowElements.filter((fe:any) => fe.$type ==='bpmn:UserTask');
      console.log("test", start_event)
      let flow_Info = [
        { 'index': 0, 'label': 'UserTask', 'name': business_obj.name },
        { 'index': 1, 'label': 'Role', 'name': business_obj.extensionElements.values[0].candidateGroups },
        { 'index': 2, 'label': 'Entity', 'name': business_obj.$parent.$parent.name },
        { 'index': 3, 'label': 'TaskStatus', 'name': '' },
        { 'index': 4, 'label': 'StartEvent', 'name': start_event.id },
        { 'index': 5, 'label': 'EndEvent', 'name': end_event.id },
        { 'index': 6, 'label': 'NextEvent', 'name': element.businessObject.outgoing[0].targetRef?.name },
        { 'index': 7, 'label': 'PreviousEvent', 'name': element.businessObject.incoming[0].sourceRef?.name },
        { 'index': 8, 'label': 'Condition', 'name': '' },
        { 'index': 9, 'label': 'EntityState', 'name': '' },
      ];
      console.log(flow_Info)
      return flow_Info;
    } else {

    }

  }

  getExtension(element: any, type: any) {
    if (!element) {
      return null;
    }

    return element.filter(function (e: any) {
      return e.$instanceOf(type);
    })[0];
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }

  loadXFlows(xFlowJson: any): void {
    this.api.postWorkFlow(xFlowJson).then(async (response: any) => {
      this.xml = response?.data;
      const layoutedDiagramXML = await layoutProcess(this.xml);
      this.importDiagram(layoutedDiagramXML);
    }).catch(error => {
      console.log('error', error);
    });
  }
}
