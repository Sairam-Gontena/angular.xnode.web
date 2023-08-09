import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as d3 from 'd3';
import * as flare from './flare.json'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService]
})
export class UseCasesComponent implements OnInit {
  useCases: any = [];
  id: String = '';
  currentUser?: User;
  templates: any;
  highlightedIndex: any;

  constructor(private apiService: ApiService, private messageService: MessageService, private utilService: UtilsService, private router: Router, private activateRoute: ActivatedRoute) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.utilService.loadSpinner(true);
    if (localStorage.getItem('record_id') === null) {
      this.get_ID();
    } else {
      this.get_Usecases();
    }
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    // this.graph();
    console.log(this.router.events,this.router)
  }

  //get calls 
  get_ID() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        this.id = response.data.data[0].id;
        localStorage.setItem('record_id', response.data.data[0].id);
        this.get_Usecases();
        this.utilService.loadSpinner(false);
      })
      .catch(error => {
        this.utilService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilService.loadSpinner(false);
      });
  }

  onIconClicked(e: any): void {

  }

  get_Usecases() {
    this.graph('this is the data')
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
          // this.graph(this.useCases);
        }
        this.utilService.loadSpinner(false);
      })
      .catch(error => {
        this.utilService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilService.loadSpinner(false);
      });
  }



  // data = {
  //   'name': 'flare',
  //   'children': [
  //      {'name': 'analytics'},
  //      {'name': 'animate'},
  //      {'name': 'data'},
  //      {'name': 'dispkay'},
  //      {'name': 'flex'},
  //      {'name': 'physics'},
  //      {'name': 'query'},
  //      {'name': 'scale'},
  //      {'name': 'util'},
  //      {'name': 'vis'},
  //   ]
  // }
   tree = {
    "name": "Eve",
    "value": 15,
    "type": "black",
    "level": "yellow",
    "children": [
       {
          "name": "Cain",
          "value": 10,
          "type": "grey",
          "level": "red"
       },
       {
          "name": "Seth",
          "value": 10,
          "type": "grey",
          "level": "red",
          
       },
       {
          "name": "Abel",
          "value": 10,
          "type": "grey",
          "level": "blue"
       },
       {
          "name": "Awan",
          "value": 10,
          "type": "grey",
          "level": "green",
          
       },
       {
          "name": "Azura",
          "value": 10,
          "type": "grey",
          "level": "green"
       }
    ]
 };

//  graph(){

//     var root = d3.hierarchy(this.tree)
//     console.log(root);

//     var treeLayout = d3.tree().size([600,500]);
//     root.sort((a,b) => b.height-a.height)
//     treeLayout(root)
    
//   }
newformat = [
  {
      "id": 1,
      "role": "User",
      "title": "Case 01 - Farmer Onboarding",
      "description": "As a farmer, I want to be able to sign up and create a profile on the farm-to-home application, providing details about my farm, location, and the type of produce I generate.",
      "children" : [
          { "name":"Onboarding", "id":1, "title":"xflow01"},
          { "name":"Onboarding", "id":2, "title":"xflow02"},
          { "name":"Onboarding", "id":3, "title":"xflow03"},
      ]

  },
  {
      "id": 2,
      "role": "User",
      "title": "Case 02 - Catalog Management",
      "description": "As a farmer, I want to be able to list my available produce on the farm-to-home application, including details such as quantity, pricing, and expected arrival time in the market.",
      "children" : [
        { "name":"Onboardingc2", "id":1, "title":"xflow01"},
        { "name":"Onboardingc2", "id":2, "title":"xflo02"},
    ]
      
  },
  {
      "id": 3,
      "role": "User",
      "title": "Case 03 - Consumer Subscription",
      "description": "As a consumer, I want to be able to browse the catalog on the farm-to-home application, subscribe to specific produce, and receive regular updates on availability and delivery.",
      "children" : [
          { "name":"Customer", "id":1, "title":"xflow02"}
      ]
  }
];
graph(data:any){
  console.log(data)
  var treeData = {
    'description': "Farm2Home",
    'role': "User",
    'title': "Users",
    'children': this.newformat};

  // var ele = document.getElementById('sc');
  // var svgNode = this.chart2(d3,treeData);
  var svgNode = this._chart(d3,treeData);
//   console.log(svgNode);
//   ele?.append(svgNode);
//   ele?.addEventListener('click', function(event){
//     console.log(event);
//   })
  let nodes: NodeListOf<SVGGElement> | undefined;
  nodes = svgNode?.querySelectorAll('g')
// //   console.log("node", node)
  var svg_ele = document.getElementById('graph')
  console.log(nodes, ';..........;',svg_ele)

//   if(nodes){
//     nodes.forEach((node:any)=> {
//       if(node.__data__){
//       node.addEventListener('click', (event:any)=>{
//         console.log("click on:", node, event);
//         const para = document.createElement("text");
//         para.append("Test is here");
//         const e = node.appendChild(para)
//       })
//     }
//     })
//   }
if (svg_ele){
  svg_ele.addEventListener('click', (event:any) => {
    console.log("node is clicked", event)
  })
}
  
//   if(node){
//     node[4].addEventListener('click', (event)=>{
//       console.log("clicked on node[0]", event);
//       this.router.navigate(['/configuration/workflow/overview'], { relativeTo: this.activateRoute });
//     })
//   }
}

 _chart(d3:any,data:any)
    {
      const width = 928;

      // Compute the tree height; this approach will allow the height of the
      // SVG to scale according to the breadth (width) of the tree layout.
      const root = d3.hierarchy(data);
      const dx = 30;
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


      const svg = d3.select("#graph")
          .attr("width", width)
          .attr("height", height)
          .attr("style", "overflow-y: scroll")
          .attr("viewBox", [-width/2, x0 - dx, width, height])
          // .attr("viewBox", [0, 0, 1010, 666])
          .attr("style", "max-width: 100%; height: max-content;  font: 10px sans-serif;")
          
          // .append('g')
          // .attr('transform', `translate(${width}, ${height})`);
      // console.log(svg)
      // console.log("links",root.links())
      
      const rightLink: any = [];
      for (let node of root.links()){
        if (node.target.depth ==1 && node.target.data.id%2!=0 ) {
          // console.log(node, node.target.data.id)
          rightLink.push(node);}
        if (node.target.depth ==2 && node.source.data.id && node.source.data.id %2!=0) {
          // console.log(node,node.target.depth,node.source.data.id)
          rightLink.push(node)};
      }

      const leftLink:any = [];
      // root.links().filter((node:any)=>node.target.data.id%2==0);
      for (let node of root.links()){
        if (node.target.depth ==1 && node.target.data.id%2==0 ) {
          // console.log(node, node.target.data.id)
          leftLink.push(node);}
        if (node.target.depth ==2 && node.source.data.id && node.source.data.id %2==0) {
          // console.log(node,node.target.depth,node.source.data.id)
          leftLink.push(node)};
      }
      
      // console.log( "rightLink",rightLink, "leftLink", leftLink)
      const linkR = svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 3)
          .attr("stroke-width", 2)
        .selectAll()
          .data(rightLink)
          .join("path")
            .attr("d", d3.linkHorizontal()
                .x((d:any) => d.y/2)
                .y((d:any) => d.x));
      
      const linkL = svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 3)
          .attr("stroke-width", 2)
        .selectAll()
          .data(leftLink)
          .join("path")
            .attr("d", d3.linkHorizontal()
                .x((d:any) => -d.y/2)
                .y((d:any) => d.x));

      const rightNodes: any = [];
      for (let node of root.descendants()){
        if (node.depth ==1 && node.data.id%2!=0 ) {
          // console.log(node, node.target.data.id)
          rightNodes.push(node);}
        if (node.depth ==2 && node.parent.data.id && node.parent.data.id %2!=0) {
          // console.log(node,node.target.depth,node.source.data.id)
          rightNodes.push(node)};
      }

      const leftNodes:any = [];
      // root.links().filter((node:any)=>node.target.data.id%2==0);
      for (let node of root.descendants()){
        if (node.depth ==1 && node.data.id%2==0 ) {
          // console.log(node, node.target.data.id)
          leftNodes.push(node);}
        if (node.depth ==2 && node.parent.data.id && node.parent.data.id %2==0) {
          // console.log(node,node.target.depth,node.source.data.id)
          leftNodes.push(node)};
      }

      const centralNode = root.descendants().filter((node:any)=> !node.parent);
      
      console.log("Nodes",centralNode, leftNodes, rightNodes)
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
          // .attr("class", "rect")
          .attr("width", (d:any)=> {return d.data.title.length*15;})
          .attr("height", "30")
          .attr("fill", "cyan")
          .attr('y', '-1.5em')
          .attr('x', (d:any)=> {return -7.5*d.data.title.length;})
          .attr("rx", 15)
      
      nodeC.append("text")
          .attr('x', (d:any)=> {return d.data.title.length-3})
          .attr('y', '15')
          .attr('dy', '-1.2em')
        // .attr("dy", "0.3em")
        .attr("dx", (d:any)=> {return-d.data.title.length*3})
        .attr("text-anchor", (d:any) => d.children ? "start" : "end")
        .text((d:any) => {return d.data.title})
      .clone(true).lower()
        .attr("stroke", "white");


      const nodeL = svg.append("g")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
        .selectAll()
        .data(leftNodes)
        .join("g")
          .attr("transform", (d:any) => `translate(${-d.y/2},${d.x})`)
          .attr("cursor", "pointer")
          .attr("pointer-events", "all");

      nodeL.append("circle")
          .attr("fill", (d:any) => d.children ? "#555" : "#999")
          .attr("r", 3.5);

      nodeL.append("rect")
            // .attr("class", "rect")
            .attr("width", (d:any)=> { if(d.depth ==1) return d.data.title.length*4;
                                        else return d.data.title.length*8;})
            // .attr("width", "120")
            .attr("height", (d:any)=> { if(d.depth ==1) return 30;
                                        else return 20;})
            .attr("fill", "cyan")
            .attr("x", (d:any)=> { if(d.depth ==1) return -d.data.title.length*3;
                                    else return -d.data.title.length*7;})
            .attr('y', (d:any)=> { if(d.depth ==1) return '-1.9em';
                                    else return '-1em'})
            .attr("rx", (d:any)=> { if(d.depth ==1) return 15;
                                    else return 10})
      
      nodeL.append("text")
            .attr('x', (d:any)=> {d.data.title.length-3})
            .attr('y', '15')
            .attr('dy', (d:any)=> { if(d.depth ==1) return '-2.4em';
                                    else return '-1.2em'})
          // .attr("dy", "0.3em")
          .attr("dx", (d:any)=> { if(d.depth ==1) return -d.data.title.length*2;
                                  else return -d.data.title.length*5})
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          .text((d:any) => {return d.data.title.split("-")[0]})
        .clone(true).lower()
          .attr("stroke", "white");

    nodeL.append("text")
          .attr('x', (d:any)=> {d.data.title.length-3})
          .attr('y', '15')
          .attr('dy', '-1.00em')
        // .attr("dy", "0.3em")
        .attr("dx", (d:any)=> {return -d.data.title.length*2.7;})
        .attr("text-anchor", (d:any) => d.children ? "start" : "end")
        .text((d:any) => {return d.data.title.split("-")[1]})
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
          // .append("rect")
          // .attr("class", "rect")
          // .attr('width', (d:any) =>{console.log(d); return d.data.title.length*10})
          // .attr('height', '25');

      nodeR.append("circle")
          .attr("fill", (d:any) => d.children ? "#555" : "#999")
          .attr("r", 2.5);
      
      nodeR.append("rect")
            // .attr("class", "rect")
            .attr("width", (d:any)=> { if(d.depth ==1) return d.data.title.length*4;
                                        else return d.data.title.length*8;})
            // .attr("width", "120")
            .attr("height", (d:any)=> { if(d.depth ==1) return 30;
                                        else return 20;})
            .attr("fill", "cyan")
            .attr("x", (d:any)=> {return -d.data.title.length*1;})
            .attr('y', (d:any)=> { if(d.depth ==1) return '-1.9em';
                                    else return '-1em'})
            .attr("rx", (d:any)=> { if(d.depth ==1) return 15;
                                    else return 10})
      
      nodeR.append("text")
            .attr('x', (d:any)=> {d.data.title.length-3})
            .attr('y', '15')
            .attr('dy', (d:any)=> { if(d.depth ==1) return '-2.4em';
                                    else return '-1.2em'})
          // .attr("dy", "0.3em")
          .attr("dx", (d:any)=> {return d.data.title.length*0.2;})
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          .text((d:any) => {return d.data.title.split("-")[0]})
        .clone(true).lower()
          .attr("stroke", "white");

      nodeR.append("text")
            .attr('x', (d:any)=> {d.data.title.length-3;})
            .attr('y', '15')
            .attr('dy', '-1.00em')
          // .attr("dy", "0.3em")
          .attr("dx", (d:any)=> {return -d.data.title.length*0.5;})
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          // .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          .text((d:any) => {return d.data.title.split("-")[1]})
        .clone(true).lower()
          .attr("stroke", "white")
          
      return svg.node();
    }
  
}
