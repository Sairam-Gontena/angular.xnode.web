
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
import * as d3 from 'd3';
import { UtilsService } from 'src/app/components/services/utils.service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
// import { UtilsService } from '../../components/services/utils.service';

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
  dashboard: any;
  layoutColumns: any;
  overview: any;
  sideBar: boolean = false;
  showUsecaseGraph: boolean = true;
  useCases: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  xflowData: any;

  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
  isOpen: boolean = true;
  templates: any;
  testData: any;

  constructor(private api: ApiService, private utilsService: UtilsService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.utilsService.loadSpinner(true);
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ];

    setTimeout(()=> {
      this.showUsecaseGraph = true;
      var bpmnWindow = document.getElementById("diagramRef");
      if (bpmnWindow) bpmnWindow.style.display = 'None';
      var graphWindow = document.getElementById("sc");
      if (graphWindow) graphWindow.style.display = '';
    }, 0);

    setTimeout(() => {
      if (this.showUsecaseGraph) this.get_Usecases();
    }, 500);

    this.initializeBpmn();
    this.items = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];
    this.home = { icon: 'pi pi-home', routerLink: '/configuration/workflow/overview' };

  }

  switchWindow(){
    var bpmnWindow = document.getElementById("diagramRef");
    if(bpmnWindow) bpmnWindow.style.display = 'None';
    var graphWindow = document.getElementById("sc");
    if(graphWindow) graphWindow.style.display = '';

    if(this.bpmnJS) this.bpmnJS.destroy();
    this.initializeBpmn();
  }


  initializeBpmn() {
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
    this.bpmnJS.get('eventBus').on('element.click', 9, (event: any) => {
      this.getElement();
    });

    let appName = localStorage.getItem('app_name')
    this.generalInfo = [
      { 'index': 0, 'label': 'Entity', 'value': appName },
      { 'index': 1, 'label': 'Name', 'value': 'Business Model Budgeting Process Collaborative X Flow' },
      { 'index': 2, 'label': 'Element Documentation', 'value': 'Business Model Budgeting Process Collaborative X Flow' },
    ];

    setTimeout(() => {
      this.bpmnJS.attachTo(document.getElementById('diagramRef') as HTMLElement);
      var element = this.bpmnJS.get('elementRegistry')._elements;
      const propertiesPanel = this.bpmnJS.get('propertiesPanel') as HTMLElement;
    }, 500);
  }


  getFlow(flow: String) {
    this.currentUser = UserUtil.getCurrentUser();
    this.api.get('/retrieve_xflows/' + this.currentUser?.email + '/' + localStorage.getItem('record_id')).then(async (response: any) => {
      if (response) {
        let appName = localStorage.getItem('app_name')
        let xflowJson = {
          'Flows': response.data.Flows.filter((f: any) => f.Name.toLowerCase() === flow.toLowerCase()),
          'Product': appName
        };
        this.xflowData = response.data;

        this.loadXFlows(xflowJson);
        this.jsonWorkflow = JSON.stringify(xflowJson, null, 2);
      } else {
        this.loadXFlows(workflow);
        this.jsonWorkflow = JSON.stringify(workflow, null, 2);
      }
    }).catch(error => {
      console.log('error', error);
      this.loadXFlows(workflow);
      this.jsonWorkflow = JSON.stringify(workflow, null, 2);
    });
    this.getOverview();
  }

  getOnboardingFlow() {
    this.currentUser = UserUtil.getCurrentUser();
    this.api.get('/retrieve_xflows/' +this.currentUser?.email +'/' +localStorage.getItem('record_id')).then(async (response: any) => {
        if (response) {
          let onboardingFlow = response.data.Flows.filter((f: any) => f.Name.toLowerCase() === 'onboarding');
          console.log(onboardingFlow);
        }
      }).catch((error) => {
        console.log('error', error);
      });
  }


  toggleMenu() {
    this.isOpen = !this.isOpen;
  }


  getLayout(layout: any): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }


  ngAfterContentInit(): void {

  }


  get_Usecases() {
    // this.graph('this is the data')
    let currentUserString = localStorage.getItem('currentUser');
    let currentUser = currentUserString != null ? JSON.parse(currentUserString) : null;
    this.api.get("/retrive_insights/" + currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
          this.graph(this.useCases);
        this.utilsService.loadSpinner(false);

        }
        // this.utilService.loadSpinner(false);
      })
      .catch(error => {
        console.log(error);
        this.utilsService.loadSpinner(false);
      });
  }


  getOverview() {
    this.api.get("/retrive_overview/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          this.overview = response.data;
          this.sideBar = true;
        }
      })
      .catch((error: any) => {
        console.log(error)
      });

  }


  getElement() {
    this.sidebarVisible = true;

    this.bpmnJS.get('eventBus').on('element.click', 9, (event: any) => {
      let type = event.element.type;
      if (type === 'bpmn:Process') {
        this.flowInfo = this.getDisplayProperty(type, this.xflowData, event.element);
        this.sP = false;
        this.task = false;
        this.taskHeader = {
          'label': 'Pool',
          'task': event.element.id,
          'pHeader': 'Flow'
        };
      } else if (event.element.type === 'bpmn:SubProcess') {
        let subProcessFlow = JSON.parse(this.jsonWorkflow).Flows.filter((sbf:any) => sbf.Name.toLowerCase().trim() === event.element.businessObject.name.toLowerCase().trim());
        let res = this.getDisplayProperty(type, subProcessFlow[0], event.element)
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
        let subProcessFlow = JSON.parse(this.jsonWorkflow).Flows.filter((sbf:any) => sbf.Name.toLowerCase().trim() === event.element.businessObject.$parent.name.toLowerCase().trim());
        let userTask, serviceTask;
        if (type === 'bpmn:UserTask' ){
          userTask = subProcessFlow[0].UserFlow.filter((uT:any) => uT.TaskId.toLowerCase().trim() === event.element.businessObject.name.toLowerCase().trim());
          this.flowInfo = this.getDisplayProperty(type, userTask, '');
        } else if (type === 'bpmn:ServiceTask'){
          serviceTask = subProcessFlow[0].BackendFlow.filter((uT:any) => uT.TaskId.toLowerCase().trim() === event.element.businessObject.name.toLowerCase().trim());
          this.flowInfo = this.getDisplayProperty(type, serviceTask, '');
        } else {}

        let pHeader = '';
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


  getDisplayProperty(elementType:String, element:any, eventElement:any) {

    if (elementType === 'bpmn:Process') {
      let flow = element.Flows.map((f:any, index:number) => {
        return {
          "index": index,
          "label": "Flow" + (index+1),
          "name": f.Name
        }
      })
      return flow;
    } else if (elementType === 'bpmn:SubProcess') {
      let flowElements = eventElement?.businessObject?.flowElements;
      let userTasks, serviceTasks;
      let roles, prevFlow, nextFlow ;
      if(element.Roles && element.Roles.length>0) roles = element.Roles.reduce((acc:string, cur:string) => acc + " " + cur);
      else roles = element.Roles;
      if(element.PreviousFlow && element.PreviousFlow.length>0) prevFlow = element.PreviousFlow.reduce((acc:string, cur:string) => acc + " " + cur);
      else prevFlow = element.SequenceFlow;
      if(element.NextFlow && element.NextFlow.length>0) nextFlow = element.NextFlow.reduce((acc:string, cur:string) => acc + " " + cur);
      else nextFlow = element.NextFlow;

      let flow_Info = [
        { 'index': 0, 'label': 'Name', 'name': element.Name },
        { 'index': 1, 'label': 'Type', 'name': elementType },
        { 'index': 2, 'label': 'Role', 'name': roles },
        { 'index': 3, 'label': 'StartEvent', 'name': element.StartEvent },
        { 'index': 4, 'label': 'EndEvent', 'name': element.EndEvent},
        { 'index': 5, 'label': 'NextEvent', 'name': nextFlow },
        { 'index': 6, 'label': 'PreviousEvent', 'name': prevFlow },
      ];

      userTasks = flowElements.filter((fe: any) => fe.$type === 'bpmn:UserTask');
      serviceTasks = flowElements.filter((fe: any) => fe.$type === 'bpmn:ServiceTask');
      for (let i = 0; i < userTasks.length; i++) {
        userTasks[i].index = i;
      }
      for (let i = 0; i < serviceTasks.length; i++) {
        serviceTasks[i].index = i;
      }

      return {
        'fI': flow_Info,
        'uT': userTasks,
        'sT': serviceTasks
      };

    } else if (elementType === 'bpmn:UserTask' || elementType === 'bpmn:ServiceTask') {
      let roles, seqFlow, condition = '';
      if(element[0].Roles && element[0].Roles.length>0) roles = element[0].Roles.reduce((acc:string, cur:string) => acc + " " + cur);
      else roles = element[0].Roles;
      if(element[0].SequenceFlow && element[0].SequenceFlow.length>0) seqFlow = element[0].SequenceFlow.reduce((acc:string, cur:string) => acc + " " + cur);
      else seqFlow = element[0].SequenceFlow;
      for (let i =0; i<element[0].Condition.length; i++){
        condition = condition + ' ' + element[0].Condition[i].Name;
      }
      let flow_Info = [
        { 'index': 0, 'label': 'UserTask', 'name': element[0].TaskId },
        { 'index': 1, 'label': 'Role', 'name': roles },
        { 'index': 2, 'label': 'Entity', 'name': element[0].Entity },
        { 'index': 3, 'label': 'TaskStatus', 'name': element[0].TaskStatus },
        { 'index': 4, 'label': 'StartEvent', 'name': element[0].StartEvent },
        { 'index': 5, 'label': 'EndEvent', 'name': element[0].EndEvent },
        { 'index': 6, 'label': 'SequenceFlow', 'name':  seqFlow},
        { 'index': 7, 'label': 'PreviousEvent', 'name': '' },
        { 'index': 8, 'label': 'Condition', 'name': condition },
        { 'index': 9, 'label': 'EntityState', 'name': element[0].EntityState },
      ];
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
      this.utilsService.loadSpinner(false);
    }).catch(error => {
      console.log('error', error);
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
      for (let i = 0; i < d.xflows.length; i++) {
        temp_title = d.xflows[i].name;
        // d.xflows[i] = {};
        // d.xflows[i] =
        d.children.push({
          "id": i,
          "title": temp_title
        });
      }
    });
    return data;
  }


  graph(data: any) {

    let mod_data = this.modifyGraphData(data);
    this.showUsecaseGraph = true;

    //TBD
    //group by usecase role and create different spider web where centre of web is role
    let firstRole = mod_data ? mod_data[0].role : '';
    var treeData = {
      'description': "",
      'id': '',
      'role': firstRole,
      'title': localStorage.getItem('app_name'),
      'children': mod_data
    };

    var ele = document.getElementById('graph') as HTMLElement;
    // var svgNode = this.chart2(d3,treeData);
    var svgNode = this._chart(d3, treeData);
    ele?.appendChild(svgNode);

    let nodes: NodeListOf<SVGGElement> | undefined;
    nodes = svgNode?.querySelectorAll('g')
    var svg_ele = document.getElementById('graph')

      if (svg_ele){
        svg_ele.addEventListener('click', (event:any) => {
          let e = event.target.__data__;
          let flow = e.data.title;
          if (e.depth ==2) {
            this.utilsService.loadSpinner(true);
            this.showUsecaseGraph = false;
            var bpmnWindow = document.getElementById("diagramRef");
            if(bpmnWindow) bpmnWindow.style.display = '';
            var graphWindow = document.getElementById("sc");
            if(graphWindow) graphWindow.style.display = 'None';
            this.getFlow(flow);

            }

        })
      }


    }

  _chart(d3:any,data:any)
    {
      const width = 928;
      // Compute the tree height; this approach will allow the height of the
      // SVG to scale according to the breadth (width) of the tree layout.
      const root = d3.hierarchy(data);
      const dx = 50;
      const dy = width / (root.height + 1);
      // Create a tree layout.
      const tree = d3.tree().nodeSize([dx, dy]);
      // Sort the tree and apply the layout.
      root.sort((a:any, b:any) => d3.ascending(a.data.title, b.data.title));
      tree(root);
      // Compute the extent of the tree. Note that x and y are swapped here
      // because in the tree layout, x is the breadth, but when displayed, the
      // tree extends right rather than down.
      let x0 = Infinity;
      let x1 = -x0;
      root.each((d:any) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });
      // Compute the adjusted height of the tree.
      const height = x1 - x0 + dx * 2;
      const maxEndTranslate = height;
      const maxStartTranslate = height/2;
      const margin = { top: 100, right: 20, bottom: 20, left: 100 };

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("style", "overflow-y: scroll")
      .attr("viewBox", [-width / 2, x0 - dx, width, height])
      // .attr("viewBox", [0, 0, 1010, 666])
      .attr("style", "max-width: 100%; height: max-content;  font: 10px sans-serif;")

    const rightLink: any = [];
    for (let node of root.links()) {
      if (node.target.depth == 1 && node.target.data.id % 2 != 0) {
        rightLink.push(node);
      }
      if (node.target.depth == 2 && node.source.data.id && node.source.data.id % 2 != 0) {
        rightLink.push(node)
      };
    }
    const leftLink: any = [];
    for (let node of root.links()) {
      if (node.target.depth == 1 && node.target.data.id % 2 == 0) {
        leftLink.push(node);
      }
      if (node.target.depth == 2 && node.source.data.id && node.source.data.id % 2 == 0) {
        leftLink.push(node)
      };
    }

    const linkR = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 3)
      .attr("stroke-width", 2)
      .selectAll()
      .data(rightLink)
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y / 2)
        .y((d: any) => d.x));

    const linkL = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 3)
      .attr("stroke-width", 2)
      .selectAll()
      .data(leftLink)
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x((d: any) => -d.y / 2)
        .y((d: any) => d.x));

    const rightNodes: any = [];
    for (let node of root.descendants()) {
      if (node.depth == 1 && node.data.id % 2 != 0) {
        rightNodes.push(node);
      }
      if (node.depth == 2 && node.parent.data.id && node.parent.data.id % 2 != 0) {
        rightNodes.push(node)
      };
    }
    const leftNodes: any = [];
    // root.links().filter((node:any)=>node.target.data.id%2==0);
    for (let node of root.descendants()) {
      if (node.depth == 1 && node.data.id % 2 == 0) {
        leftNodes.push(node);
      }
      if (node.depth == 2 && node.parent.data.id && node.parent.data.id % 2 == 0) {
        leftNodes.push(node)
      };
    }
      const centralNode = root.descendants().filter((node:any)=> !node.parent);

      const nodeC = svg.append("g")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .selectAll()
          .data(centralNode)
          .join("g")
          .attr("transform", (d:any) => `translate(${-d.y/2},${d.x})`);

      nodeC.append("circle")
          .attr("fill", (d:any) => d.children ? "#555" : "#999")
          .attr("r", 3.5);

      nodeC.append("rect")
          .attr("width", (d:any)=> {return d.data.title.length*15;})
          .attr("height", "40")
          .attr("fill", (d:any)=> { if(d.depth ==1) return "#B0B0B3";
                                      else return "#FFFFFA";} )
          .attr('y', '-1.5em')
          .attr('x', (d:any)=> {return -7.5*d.data.title.length;})
          .attr("rx", 15)
          .style("stroke", '#959595')
          .style("stroke-width", 2)

      nodeC.append("text")
          .attr('x', (d:any)=> {return d.data.title.length})
          .attr('y', '15')
          .attr('dy', '-0.8em')
          .attr("dx", (d:any)=> {return-d.data.title.length*1.5})
          // .attr("text-anchor", (d:any) => d.children ? "start" : "end")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "14px")
          .style("font-weight", 600)
          .style("fill", "#000000")
          .text((d:any) => {return d.data.role})
          .clone(true).lower()
          .attr("stroke", "white");

      const nodeL = svg.append("g")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .selectAll()
          .data(leftNodes)
          .join("g")
          .attr("transform", (d:any) => `translate(${-d.y/2},${d.x})`)
          .attr("cursor", (d:any)=> { if(d.depth ==2) return "pointer";
                                      else return "text"})
          .attr("pointer-events", "all");

      nodeL.append("circle")
          .attr("fill", (d:any) => d.children ? "#555" : "#999")
          .attr("r", 3.5);

      nodeL.append("rect")
          .attr("width", (d:any)=> { if(d.depth ==1) return d.data.title.length*4.2;
                                      else return d.data.title.length*8;})
          .attr("height", (d:any)=> { if(d.depth ==1) return 40;
                                      else return 30;})
          .attr("fill", (d:any)=> { if(d.depth ==1) return "#B0B0B3";
                                    else return "#FFFFFA";} )
          .attr("x", (d:any)=> { if(d.depth ==1) return -d.data.title.length*3;
                                  else return -d.data.title.length*7;})
          .attr('y', (d:any)=> { if(d.depth ==1) return '-1.9em';
                                  else return '-1.5em'})
          .attr("rx", (d:any)=> { if(d.depth ==1) return 15;
                                  else return 10})
          .style("stroke", '#959595')
          .style("stroke-width", 2)

      nodeL.append("text")
          .attr('x', (d:any)=> {return d.data.title.length*1.8})
          .attr('y', '15')
          .attr('dy', (d:any)=> { if(d.depth ==1) return '-2.2em';
                                  else return '-1.4em'})
          .attr("dx", (d:any)=> { if(d.depth ==1) return -d.data.title.length*3;
                                  else return -d.data.title.length*5})
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("fill", "#767474")
          .style("font-weight", 550)
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          .text((d:any) => {return d.data.title.split("-")[0]})
          .clone(true).lower()
          .attr("stroke", "white");

      nodeL.append("text")
          .attr('x', (d:any)=> {return d.data.title.length*1.5})
          .attr('y', '15')
          .attr('dy', '-0.8em')
        // .attr("dy", "0.3em")
          .attr("dx", (d:any)=> {return -d.data.title.length*2.4;})
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-weight", 550)
          .style("fill", "#000000")
          .text((d:any) => {return d.data.title.split("-").slice(1)})
          .clone(true).lower()
          .attr("stroke", "white");

      const nodeR = svg.append("g")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .selectAll()
          .data(rightNodes)
          .join("g")
          .attr("transform", (d:any) => `translate(${d.y/2},${d.x})`)
          .attr("cursor", "pointer")
          .attr("pointer-events", "all");

      nodeR.append("circle")
          .attr("fill", (d:any) => d.children ? "#555" : "#999")
          .attr("r", 2.5);

      nodeR.append("rect")
          .attr("width", (d:any)=> { if(d.depth ==1) return d.data.title.trim().length*4.1;
                                      else return d.data.title.trim().length*8;})
          .attr("height", (d:any)=> { if(d.depth ==1) return 40;
                                      else return 30;})
          .attr("fill", (d:any)=> { if(d.depth ==1) return "#B0B0B3";
                                    else return "#FFFFFA";} )
          .attr("x", (d:any)=> {return -d.data.title.length*1;})
          .attr('y', (d:any)=> { if(d.depth ==1) return '-1.9em';
                                  else return '-1.4em'})
          .attr("rx", (d:any)=> { if(d.depth ==1) return 15;
                                  else return 10})
          .attr("stroke-width", "8")
          .style("stroke", '#959595')
          .style("stroke-width", 2)

      nodeR.append("text")
          .attr('x', (d:any)=> {return d.data.title.length;})
          .attr('y', '15')
          .attr('dy', (d:any)=> { if(d.depth ==1) return '-2.2em';
                                    else return '-1.4em'})
          // .attr("dy", "0.3em")
          .attr("dx", (d:any)=> { if(d.depth ==1) return '0em';
                                  else return '1.5em'})
          // .attr("dx", "0.5em")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("fill", "#767474")
          .style("font-weight", 550)
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          .text((d:any) => {return d.data.title.split("-")[0]})
        .clone(true).lower()
          .attr("stroke", "white");

      nodeR.append("text")
          .attr('x', (d:any)=> {return d.data.title.length;})
          .attr('y', '15')
          .attr('dy', '-0.8em')

          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-weight", 550)
          .style("fill", "#000000")
          .text((d:any) => {return d.data.title.split("-").slice(1)})
          .clone(true).lower()
          .attr("stroke", "white")

      return svg.node();
  }
}
