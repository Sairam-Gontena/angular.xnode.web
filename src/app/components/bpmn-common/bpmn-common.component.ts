import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import camundaCloudBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';
import * as camundaModdleDescriptors from 'camunda-bpmn-moddle/resources/camunda.json';
import * as palette_tools_class from '../../pages/bpmn-diagram/custom-palette-provider.json';
import BpmnPalletteModule from 'bpmn-js/lib/features/palette';
import * as custom from '../../pages/bpmn-diagram/custom.json';
import Modeler from 'bpmn-js/lib/Modeler';
import PropertiesPanel from 'bpmn-js/lib/Modeler';
import { Observable, delay, of } from 'rxjs';
import * as workflow from '../../../assets/json/flows_modified.json';
import { layoutProcess } from 'bpmn-auto-layout';
import { UserUtil } from '../../utils/user-util';
import * as d3 from 'd3';
import { UtilsService } from 'src/app/components/services/utils.service';
import { MenuItem } from 'primeng/api';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { WorkflowApiService } from 'src/app/api/workflow-api.service';

@Component({
  selector: 'xnode-bpmn-common',
  templateUrl: './bpmn-common.component.html',
  styleUrls: ['./bpmn-common.component.scss'],
})
export class BpmnCommonComponent implements OnDestroy, OnInit {
  @ViewChild('propertiesRef', { static: true }) private propertiesRef:
    | ElementRef
    | undefined;
  @ViewChild('bpmngraph')
  bpmngraph!: ElementRef;
  @ViewChild('diagramRefContainer')
  diagramRefContainer!: ElementRef;
  @Output() dataFlowEmitter = new EventEmitter<any>();
  @Input() bpmnRefId?: string;
  @Input() onDiff?: boolean;
  @Input() specExpanded?: boolean;
  @Input() referenceId: any;
  @Input() dataToExpand: any;
  @Input() item: any;
  @Input() bpmnFrom: any;
  @Input() fromExpandSpec: any;
  bpmnJS: any;
  pallete_classes: any;
  selected_classes: any;
  xml: string = '';
  sidebarVisible: any;
  jsonWorkflow: any;
  elementList: any;
  flowInfo: any;
  userTask: any;
  serviceTask: any;
  sP: boolean = false;
  task: boolean = false;
  jsonWorkflowToShow: any;
  graphRedirection: boolean = false;
  taskHeader: any;
  generalInfo: any;
  currentUser: any;
  dashboard: any;
  layoutColumns: any;
  overview: any;
  sideBar: boolean = false;
  showUsecaseGraph: boolean = true;
  useCases: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  xflowData: any;
  entity: any;
  isOpen: boolean = true;
  testData: any;
  product: any;
  showBpmn: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private storageService: LocalStorageService,
    private router: Router,
    private naviApiService: NaviApiService,
    private workflowApiService: WorkflowApiService
  ) {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.router.url == '/specification'
      ? (this.showBpmn = false)
      : (this.showBpmn = true);
  }

  ngOnInit(): void {
    const list: any = this.storageService.getItem(StorageKeys.SPEC_DATA);
    this.useCases = list[2].content[0].content;
    setTimeout(() => {
      this.showUsecaseGraph = true;
      var bpmnWindow: HTMLElement;
      if (this.diagramRefContainer) {
          bpmnWindow = this.diagramRefContainer.nativeElement;
          if (bpmnWindow) bpmnWindow.style.display = 'none';
      }
      // var bpmnWindow = document.getElementById('diagramRef');
      // if (bpmnWindow) bpmnWindow.style.display = 'None';
      this.graphRedirection = false;
      var graphWindow;
      if (this.referenceId) {
        of([])
          .pipe(delay(1000))
          .subscribe((results) => {
            graphWindow = document.getElementById('sc' + this.referenceId);
          });
      } else {
        graphWindow = document.getElementById('sc');
      }
      if (graphWindow) graphWindow.style.display = '';
    }, 0);
    this.items = [
      { label: 'Computer' },
      { label: 'Notebook' },
      { label: 'Accessories' },
      { label: 'Backpacks' },
      { label: 'Item' },
    ];
    this.home = {
      icon: 'pi pi-home',
      routerLink: '/configuration/workflow/overview',
    };
    setTimeout(() => {
      this.initializeBpmn();
      this.graph();
    });
  }

  switchWindow() {
    var bpmnWindow: HTMLElement;
      if (this.diagramRefContainer) {
          bpmnWindow = this.diagramRefContainer.nativeElement;
          if (bpmnWindow) bpmnWindow.style.display = 'none';
      }
    // var bpmnWindow = document.getElementById('diagramRef');
    // if (bpmnWindow) bpmnWindow.style.display = 'None';
    this.graphRedirection = false;
    var graphWindow = document.getElementById('sc');
    if (graphWindow) graphWindow.style.display = '';

    if (this.bpmnJS) this.bpmnJS.destroy();
    this.initializeBpmn();
  }

  initializeBpmn() {
    let bpmnRefId = this.bpmnRefId ? this.bpmnRefId : 'diagramRef';
    this.bpmnJS = new Modeler({
      container: '#'+bpmnRefId,
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
        camundaCloudBehaviors,
      ],
      moddleExtensions: {
        custom: custom,
        camunda: camundaModdleDescriptors,
      },
      keyboard: {
        bindTo: window,
      },
      BpmnPalletteModule,
    });
    const propertiesPanel = new PropertiesPanel({
      parent: '#js-properties-panel',
    });
    this.bpmnJS.propertiesPanel = propertiesPanel;
    this.pallete_classes = palette_tools_class;
    this.selected_classes = [
      'entry bpmn-icon-subprocess-expanded',
      'entry bpmn-icon-data-object',
      'entry bpmn-icon-data-store',
      'entry bpmn-icon-participant',
      'entry bpmn-icon-group',
    ];
    this.bpmnJS.get('eventBus').on('element.click', 9, (event: any) => {
      this.getElement();
    });

    this.generalInfo = [
      { index: 0, label: 'Entity', value: this.product?.title },
      {
        index: 1,
        label: 'Name',
        value: 'Business Model Budgeting Process Collaborative X Flow',
      },
      {
        index: 2,
        label: 'Element Documentation',
        value: 'Business Model Budgeting Process Collaborative X Flow',
      },
    ];

    setTimeout(() => {
    let bpmnRefId = this.bpmnRefId ? this.bpmnRefId : 'diagramRef';
      this.bpmnJS.attachTo(
        document.getElementById(bpmnRefId) as HTMLElement
      );
      var element = this.bpmnJS.get('elementRegistry')._elements;
      const propertiesPanel = this.bpmnJS.get('propertiesPanel') as HTMLElement;
    }, 500);
  }

  getFlow(flow: String) {
    this.currentUser = UserUtil.getCurrentUser();
    this.naviApiService
      .getXflows(this.product?.email, this.product?.id)
      .then(async (response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_FLOW_RETRIEVE_XFLOWS_BPMN',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          let xflowJson = {
            Flows: response.data.Flows.filter((f: any) => {
              const selectedFlow = flow.toLowerCase();
              const flowFromJson = (
                f.Name ||
                f.workflow_name ||
                ''
              ).toLowerCase();
              return (
                selectedFlow.indexOf(flowFromJson) != -1 ||
                flowFromJson.indexOf(selectedFlow) != -1
              );
            }),
            Product: this.product?.title,
          };
          this.xflowData = response.data;
          this.loadXFlows(xflowJson);
          this.jsonWorkflow = JSON.stringify(xflowJson, null, 2);
          this.jsonWorkflowToShow = JSON.parse(this.jsonWorkflow);

          this.auditUtil.postAudit('BPMN_FLOWS', 1, 'SUCCESS', 'user-audit');
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_FLOW_RETRIEVE_XFLOWS_BPMN',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          this.loadXFlows(workflow);
          this.jsonWorkflow = JSON.stringify(workflow, null, 2);
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Network Error',
          });
          this.auditUtil.postAudit('BPMN_FLOWS', 1, 'FAILURE', 'user-audit');
        }
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_FLOW_RETRIEVE_XFLOWS_BPMN',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product?.id
        );
        this.loadXFlows(workflow);
        this.jsonWorkflow = JSON.stringify(workflow, null, 2);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.auditUtil.postAudit(
          'BPMN_FLOWS_' + error,
          1,
          'FAILURE',
          'user-audit'
        );
      });
    this.getOverview();
  }

  getOnboardingFlow() {
    this.currentUser = UserUtil.getCurrentUser();
    this.naviApiService
      .getXflows(this.product?.email, this.product?.id)
      .then(async (response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ONBOARDING_FLOW_RETRIEVE_XFLOWS_BPMN',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          let onboardingFlow = response.data.Flows.filter(
            (f: any) => f.Name.toLowerCase() === 'onboarding'
          );
          this.auditUtil.postAudit(
            'BPMN_ONBOARDING_FLOWS',
            1,
            'SUCCESS',
            'user-audit'
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ONBOARDING_FLOW_RETRIEVE_XFLOWS_BPMN',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Network Error',
          });
          this.auditUtil.postAudit(
            'BPMN_ONBOARDING_FLOWS',
            1,
            'FAILURE',
            'user-audit'
          );
        }
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_ONBOARDING_FLOW_RETRIEVE_XFLOWS_BPMN',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product?.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.auditUtil.postAudit(
          'BPMN_ONBOARDING_FLOWS_' + error,
          1,
          'FAILURE',
          'user-audit'
        );
      });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  getLayout(layout: any): void {
    if (layout) this.dashboard = this.layoutColumns[layout];
  }

  getOverview() {
    this.naviApiService
      .getOverview(this.product?.email, this.product?.id)
      .then((response) => {
        if (response?.status === 200) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_RETRIEVE_OVERVIEW_BPMN',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          this.overview = response.data;
          this.sideBar = true;
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_RETRIEVE_OVERVIEW_BPMN',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data?.detail,
          });
        }
      })
      .catch((error: any) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_RETRIEVE_OVERVIEW_BPMN',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product?.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
      });
  }

  getElement() {
    this.sidebarVisible = true;

    this.bpmnJS.get('eventBus').on('element.click', 9, (event: any) => {
      let type = event.element.type;
      if (type === 'bpmn:Process') {
        this.flowInfo = this.getDisplayProperty(
          type,
          this.xflowData,
          event.element
        );
        this.sP = false;
        this.task = false;
        this.taskHeader = {
          label: 'Pool',
          task: event.element.id,
          pHeader: 'Flow',
        };
      } else if (event.element.type === 'bpmn:SubProcess') {
        let subProcessFlow = JSON.parse(this.jsonWorkflow).Flows.filter(
          (sbf: any) =>
            sbf.Name.toLowerCase().trim() ===
            event.element.businessObject.name.toLowerCase().trim()
        );
        let res = this.getDisplayProperty(
          type,
          subProcessFlow[0],
          event.element
        );
        this.flowInfo = res.fI;
        this.userTask = res.uT;
        this.serviceTask = res.sT;
        this.sP = true;
        this.task = false;
        this.taskHeader = {
          label: 'Activity',
          task: event.element.businessObject.name,
          pHeader: 'Flow',
        };
      } else if (
        event.element.type === 'bpmn:UserTask' ||
        event.element.type === 'bpmn:ServiceTask'
      ) {
        let subProcessFlow = JSON.parse(this.jsonWorkflow).Flows.filter(
          (sbf: any) =>
            sbf.Name.toLowerCase().trim() ===
            event.element.businessObject.$parent.name.toLowerCase().trim()
        );
        let userTask, serviceTask;
        if (type === 'bpmn:UserTask') {
          userTask = subProcessFlow[0].UserFlow.filter(
            (uT: any) =>
              uT.TaskId.toLowerCase().trim() ===
              event.element.businessObject.name.toLowerCase().trim()
          );
          this.flowInfo = this.getDisplayProperty(type, userTask, '');
        } else if (type === 'bpmn:ServiceTask') {
          serviceTask = subProcessFlow[0].BackendFlow.filter(
            (uT: any) =>
              uT.TaskId.toLowerCase().trim() ===
              event.element.businessObject.name.toLowerCase().trim()
          );
          this.flowInfo = this.getDisplayProperty(type, serviceTask, '');
        } else {
        }
        let pHeader = '';
        this.task = true;
        this.sP = false;
        this.elementList = event.element;
        if (event.element.type === 'bpmn:UserTask') {
          pHeader = 'UserFlow';
        } else {
          pHeader = 'BackendFlow';
        }
        this.taskHeader = {
          label: 'Task',
          task: event.element.businessObject.name,
          pHeader: pHeader,
        };
      } else {
      }
      this.centerAndFitViewport(this.bpmnJS);
    });
  }

  getDisplayProperty(elementType: String, element: any, eventElement: any) {
    if (elementType === 'bpmn:Process') {
      let flow = element.Flows.map((f: any, index: number) => {
        return {
          index: index,
          label: 'Flow' + (index + 1),
          name: f.Name,
        };
      });
      return flow;
    } else if (elementType === 'bpmn:SubProcess') {
      let flowElements = eventElement?.businessObject?.flowElements;
      let userTasks, serviceTasks;
      let roles, prevFlow, nextFlow;
      if (element.Roles && element.Roles.length > 0)
        roles = element.Roles.reduce(
          (acc: string, cur: string) => acc + ' ' + cur
        );
      else roles = element.Roles;
      if (element.PreviousFlow && element.PreviousFlow.length > 0)
        prevFlow = element.PreviousFlow.reduce(
          (acc: string, cur: string) => acc + ' ' + cur
        );
      else prevFlow = element.SequenceFlow;
      if (element.NextFlow && element.NextFlow.length > 0)
        nextFlow = element.NextFlow.reduce(
          (acc: string, cur: string) => acc + ' ' + cur
        );
      else nextFlow = element.NextFlow;

      let flow_Info = [
        { index: 0, label: 'Name', name: element.Name },
        { index: 1, label: 'Type', name: elementType },
        { index: 2, label: 'Role', name: roles },
        { index: 3, label: 'StartEvent', name: element.StartEvent },
        { index: 4, label: 'EndEvent', name: element.EndEvent },
        { index: 5, label: 'NextEvent', name: nextFlow },
        { index: 6, label: 'PreviousEvent', name: prevFlow },
      ];
      this.entity = this.overview.title;
      userTasks = flowElements.filter(
        (fe: any) => fe.$type === 'bpmn:UserTask'
      );
      serviceTasks = flowElements.filter(
        (fe: any) => fe.$type === 'bpmn:ServiceTask'
      );
      for (let i = 0; i < userTasks.length; i++) {
        userTasks[i].index = i;
      }
      for (let i = 0; i < serviceTasks.length; i++) {
        serviceTasks[i].index = i;
      }
      return {
        fI: flow_Info,
        uT: userTasks,
        sT: serviceTasks,
      };
    } else if (
      elementType === 'bpmn:UserTask' ||
      elementType === 'bpmn:ServiceTask'
    ) {
      let roles,
        seqFlow,
        condition = '';
      if (element[0].Roles && element[0].Roles.length > 0)
        roles = element[0].Roles.reduce(
          (acc: string, cur: string) => acc + ' ' + cur
        );
      else roles = element[0].Roles;
      if (element[0].SequenceFlow && element[0].SequenceFlow.length > 0)
        seqFlow = element[0].SequenceFlow.reduce(
          (acc: string, cur: string) => acc + ' ' + cur
        );
      else seqFlow = element[0].SequenceFlow;
      for (let i = 0; i < element[0].Condition.length; i++) {
        condition = condition + ' ' + element[0].Condition[i].Name;
      }
      let flow_Info = [
        { index: 0, label: 'UserTask', name: element[0].TaskId },
        { index: 1, label: 'Role', name: roles },
        { index: 2, label: 'Entity', name: element[0].Entity },
        { index: 3, label: 'TaskStatus', name: element[0].TaskStatus },
        { index: 4, label: 'StartEvent', name: element[0].StartEvent },
        { index: 5, label: 'EndEvent', name: element[0].EndEvent },
        { index: 6, label: 'SequenceFlow', name: seqFlow },
        { index: 7, label: 'PreviousEvent', name: '' },
        { index: 8, label: 'Condition', name: condition },
        { index: 9, label: 'EntityState', name: element[0].EntityState },
      ];
      this.entity = element[0].Entity;
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
    if (this.bpmnJS) {
      this.bpmnJS.destroy();
    }
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return this.bpmnJS
      .importXML(xml)
      .then((result: any) => {
        if (result) this.centerAndFitViewport(this.bpmnJS);
        else
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Network Error',
          });
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
      });
  }

  centerAndFitViewport(modeler: any) {
    const canvas = modeler.get('canvas');
    const { inner } = canvas.viewbox();
    const center = {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2,
    };
    canvas.zoom('fit-viewport', center);
  }

  loadXFlows(xFlowJson: any): void {
    this.workflowApiService
      .workflow(xFlowJson)
      .then(async (response: any) => {
        let xFlowJsonCopy = xFlowJson;
        xFlowJsonCopy.Flows = 'xflows data';
        if (response) {
          this.xml = response?.data;
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: xFlowJsonCopy,
          };
          this.auditUtil.postAudit(
            'LOAD_XFLOWS_JSON_BPMN',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          const layoutedDiagramXML = await layoutProcess(this.xml);
          this.importDiagram(layoutedDiagramXML);
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: xFlowJsonCopy,
          };
          this.auditUtil.postAudit(
            'LOAD_XFLOWS_JSON_BPMN',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Network Error',
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        let xFlowJsonCopy = xFlowJson;
        // xFlowJsonCopy.Flows = 'xflows data'
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: xFlowJsonCopy,
        };
        this.auditUtil.postAudit(
          'LOAD_XFLOWS_JSON_BPMN',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product?.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.utilsService.loadSpinner(false);
      });
  }

  /**************************************************************************************************** */
  // graph functions and variables
  /*************************************************************************************************** */
  modifyGraphData(data: any) {
    data.forEach((d: any) => {
      let temp_title;
      d.children = [];
      for (let i = 0; i < d.xflows?.length; i++) {
        temp_title = d.xflows[i].name;
        // d.xflows[i] = {};
        // d.xflows[i] =
        d.children.push({
          id: i,
          title: temp_title,
        });
      }
    });
    return data;
  }

  graph() {
    let mod_data = this.modifyGraphData(this.useCases);
    this.showUsecaseGraph = true;

    //TBD
    //group by usecase role and create different spider web where centre of web is role
    let firstRole = mod_data ? mod_data[0].role : '';
    var treeData = {
      description: '',
      id: '',
      role: firstRole,
      title: this.product.title,
      children: mod_data,
    };
    // var ele;
    // if (this.referenceId) {
    //   ele = document.getElementById('graph' + this.referenceId) as HTMLElement;
    // } else {
    //   ele = document.getElementById('graph') as HTMLElement;
    // }
    // var svgNode = this._chart(d3, treeData);
    // ele?.appendChild(svgNode);
    var ele: HTMLElement;
    if (this.referenceId) {
      ele = this.bpmngraph.nativeElement;
    } else {
      let graphRefId = this.bpmnRefId ? this.bpmnRefId+'-graph' : 'diagramRef-graph'
      ele = document.getElementById(graphRefId) as HTMLElement;
    }
    var svgNode = this._chart(d3, treeData);
    ele?.appendChild(svgNode);
    ele.classList.add('overflow-y-auto');

    let nodes: NodeListOf<SVGGElement> | undefined;
    nodes = svgNode?.querySelectorAll('g');
    var svg_ele;
    if (this.referenceId) {
      of([])
        .pipe(delay(1000))
        .subscribe((results) => {
          svg_ele = document.getElementById('graph' + this.referenceId);
        });
    } else {
      let graphRefId = this.bpmnRefId ? this.bpmnRefId+'-graph' : 'diagramRef-graph'
      svg_ele = document.getElementById(graphRefId);
    }
    if (svg_ele) {
      svg_ele.addEventListener('click', (event: any) => {
        let e = event.target.__data__;
        let flow = e.data.title;
        if (e.depth == 2) {
          // this.utilsService.loadSpinner(true);
          this.showUsecaseGraph = false;
          let bpmnRefId = this.bpmnRefId ? this.bpmnRefId : 'diagramRef';
          var bpmnWindow = document.getElementById(bpmnRefId);
          if (bpmnWindow) bpmnWindow.style.display = '';
          this.graphRedirection = true;
          var graphWindow;
          if (this.referenceId) {
            of([])
              .pipe(delay(500))
              .subscribe((results) => {
                graphWindow = document.getElementById('sc' + this.referenceId);
              });
          } else {
            graphWindow = document.getElementById('sc');
          }
          if (graphWindow) graphWindow.style.display = 'None';
          this.getFlow(flow);
          this.centerAndFitViewport(this.bpmnJS);
        }
      });
    }
  }

  _chart(d3: any, data: any) {
    const width = 1028; //928;
    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const root = d3.hierarchy(data);
    const dx = 50;
    const dy = width / (root.height + 1);
    // Create a tree layout.
    const tree = d3.tree().nodeSize([dx, dy]);
    // Sort the tree and apply the layout.
    root.sort((a: any, b: any) => d3.ascending(a.data.title, b.data.title));
    tree(root);
    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity;
    let x1 = -x0;
    root.each((d: any) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });
    // Compute the adjusted height of the tree.
    const height = x1 - x0 + dx * 2;
    const maxEndTranslate = height;
    const maxStartTranslate = height / 2;
    const margin = { top: 100, right: 20, bottom: 20, left: 100 };

    const svg = d3
      .create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'overflow-y: scroll')
      .attr('viewBox', [-width / 2, x0 - dx, width, height])
      // .attr("viewBox", [0, 0, 1010, 666])
      .attr(
        'style',
        'max-width: 100%; height: max-content;  font: 10px sans-serif;'
      );

    const rightLink: any = [];
    for (let node of root.links()) {
      if (node.target.depth == 1 && node.target.data.id % 2 != 0) {
        rightLink.push(node);
      }
      if (
        node.target.depth == 2 &&
        node.source.data.id &&
        node.source.data.id % 2 != 0
      ) {
        rightLink.push(node);
      }
    }
    const leftLink: any = [];
    for (let node of root.links()) {
      if (node.target.depth == 1 && node.target.data.id % 2 == 0) {
        leftLink.push(node);
      }
      if (
        node.target.depth == 2 &&
        node.source.data.id &&
        node.source.data.id % 2 == 0
      ) {
        leftLink.push(node);
      }
    }

    const linkR = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 3)
      .attr('stroke-width', 2)
      .selectAll()
      .data(rightLink)
      .join('path')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d: any) => d.y / 2)
          .y((d: any) => d.x)
      );

    const linkL = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 3)
      .attr('stroke-width', 2)
      .selectAll()
      .data(leftLink)
      .join('path')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d: any) => -d.y / 2)
          .y((d: any) => d.x)
      );

    const rightNodes: any = [];
    for (let node of root.descendants()) {
      if (node.depth == 1 && node.data.id % 2 != 0) {
        rightNodes.push(node);
      }
      if (
        node.depth == 2 &&
        node.parent.data.id &&
        node.parent.data.id % 2 != 0
      ) {
        rightNodes.push(node);
      }
    }
    const leftNodes: any = [];
    // root.links().filter((node:any)=>node.target.data.id%2==0);
    for (let node of root.descendants()) {
      if (node.depth == 1 && node.data.id % 2 == 0) {
        leftNodes.push(node);
      }
      if (
        node.depth == 2 &&
        node.parent.data.id &&
        node.parent.data.id % 2 == 0
      ) {
        leftNodes.push(node);
      }
    }
    const centralNode = root.descendants().filter((node: any) => !node.parent);

    const nodeC = svg
      .append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll()
      .data(centralNode)
      .join('g')
      .attr('transform', (d: any) => `translate(${-d.y / 2},${d.x})`);

    nodeC
      .append('circle')
      .attr('fill', (d: any) => (d.children ? '#555' : '#999'))
      .attr('r', 3.5);

    nodeC
      .append('rect')
      .attr('width', (d: any) => {
        return d.data.title.length * 10;
      })
      .attr('height', '40')
      .attr('fill', '#FFFFFA')
      .attr('y', '-1.5em')
      .attr('x', (d: any) => {
        return -5.5 * d.data.title.length;
      })
      .attr('rx', 25)
      .style('stroke', '#959595')
      .style('stroke-width', 2);

    nodeC
      .append('text')
      .attr('x', (d: any) => {
        return d.data.title.length * 0.5;
      })
      .attr('y', '15')
      .attr('dy', '-0.8em')
      .attr('dx', (d: any) => {
        return -d.data.title.length * 1.5;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 600)
      .style('fill', '#000000')
      .text((d: any) => {
        return d.data.role;
      })
      .clone(true)
      .lower()
      .attr('stroke', 'white');

    const nodeL = svg
      .append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll()
      .data(leftNodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${-d.y / 2},${d.x})`)
      .attr('cursor', (d: any) => (d.depth === 2 ? 'pointer' : 'text'))
      .attr('pointer-events', 'all');

    nodeL
      .append('circle')
      .attr('fill', (d: any) => (d.children ? '#555' : '#999'))
      .attr('r', 3.5);

    nodeL
      .append('rect')
      .attr('width', (d: any) => (d.depth === 1 ? 150 : 120))
      .attr('height', (d: any) => (d.depth === 1 ? 50 : 40))
      .attr('fill', '#FFFFFA')
      .attr('x', (d: any) => (d.depth === 1 ? -60 : -50))
      .attr('y', (d: any) => (d.depth === 1 ? -25 : -20))
      .attr('rx', (d: any) => (d.depth === 1 ? 25 : 25))
      .attr('stroke-width', '2')
      .attr('stroke', '#959595')
      .attr('cursor', 'pointer')
      .text((d: any) => {
        let title = d.data.title.split('-').slice(1);
        if (title[0]) {
          title = title[0];
        }
        if (title.length > 9) {
          return title.substring(0, 9) + '...';
        } else {
          return title;
        }
      });

    const titleText = nodeL
      .append('text')
      .attr('x', 12)
      .attr('y', (d: any) => {
        if (d.depth == 1) {
          return -6;
        } else {
          return -1;
        }
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter')
      .style('font-weight', 600)
      .style('fill', '#7a7a7a')
      .attr('cursor', 'pointer')
      .style('font-size', '12px')
      .style('opacity', 0)
      .text((d: any) => {
        let title = d.data.title.split('-');
        if (title[0]) {
          title = title[0];
        }
        if (title.length > 9) {
          return title.substring(0, 9) + '...';
        } else {
          return title;
        }
      });
    const subTitleText = nodeL
      .append('text')
      .attr('x', (d: any) => {
        if (d.depth == 1) {
          return 16;
        } else {
          return 12;
        }
      })
      .attr('y', (d: any) => {
        if (d.depth == 1) {
          return 9;
        } else {
          return 11;
        }
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter')
      .style('font-weight', 600)
      .style('fill', '#000000')
      .style('font-size', '12px')
      .style('opacity', 0)
      .attr('cursor', 'pointer')
      .text((d: any) => {
        let title = d.data.title.split('-').slice(1);
        if (title[0]) {
          title = title[0];
        }
        if (title.length > 9) {
          return title.substring(0, 9) + '...';
        } else {
          return title;
        }
      });

    titleText.transition().delay(500).style('opacity', 1);

    subTitleText.transition().delay(1000).style('opacity', 1);

    nodeL.append('title').text((d: any) => d.data.title);

    const nodeR = svg
      .append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll()
      .data(rightNodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.y / 2},${d.x})`)
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    nodeR
      .append('circle')
      .attr('fill', (d: any) => (d.children ? '#555' : '#999'))
      .attr('r', 2.5);

    nodeR
      .append('rect')
      .attr('width', (d: any) => (d.depth === 1 ? 150 : 120))
      .attr('height', (d: any) => (d.depth === 1 ? 50 : 40))
      .attr('fill', '#FFFFFA')
      .attr('x', -60)
      .attr('y', -25)
      .attr('rx', (d: any) => (d.depth === 1 ? 25 : 25))
      .attr('stroke-width', '2')
      .attr('stroke', '#959595');

    const rightTitleText = nodeR
      .append('text')
      .attr('x', (d: any) => {
        if (d.depth == 1) {
          return 9;
        } else {
          return 7;
        }
      })
      .attr('y', (d: any) => {
        if (d.depth == 1) {
          return -6;
        } else {
          return -6;
        }
      }) //-7 -3
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter')
      .style('font-weight', 600)
      .style('fill', '#7a7a7a')
      .style('font-size', '12px')
      .style('opacity', 0)
      .text((d: any) => {
        let title = d.data.title.split('-');
        if (title[0]) {
          title = title[0];
        }
        if (title.length > 9) {
          return title.substring(0, 9) + '...';
        } else {
          return title;
        }
      });

    const rightSubTitleText = nodeR
      .append('text')
      .attr('x', (d: any) => {
        if (d.depth == 1) {
          return 16;
        } else {
          return 7;
        }
      })
      .attr('y', (d: any) => {
        if (d.depth == 1) {
          return 18;
        } else {
          return 8;
        }
      })
      .attr('dy', '-0.8em')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-weight', 600)
      .style('font-family', 'Inter')
      .style('fill', '#000000')
      .style('opacity', 0)
      .style('font-size', '12px')
      .text((d: any) => {
        let title = d.data.title.split('-').slice(1);
        if (title[0]) {
          title = title[0];
        }
        if (title.length > 9) {
          return title.substring(0, 9) + '...';
        } else {
          return title;
        }
      });

    rightTitleText.transition().delay(500).style('opacity', 1);

    rightSubTitleText.transition().delay(1000).style('opacity', 1);

    nodeR.append('title').text((d: any) => d.data.title);

    return svg.node();
  }

  expandDataFlows(): void {
    this.dataFlowEmitter.emit(this.dataToExpand);
  }
}
