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
    this.graph();
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
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
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
          "children": [
             {
                "name": "Enos",
                "value": 7.5,
                "type": "grey",
                "level": "purple"
             },
             {
                "name": "Noam",
                "value": 7.5,
                "type": "grey",
                "level": "purple"
             }
          ]
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
          "children": [
             {
                "name": "Enoch",
                "value": 7.5,
                "type": "grey",
                "level": "orange"
             }
          ]
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
graph(){
  var ele = document.getElementById('graph');
  var svgNode = this._chart(d3,this.tree);
  console.log(svgNode);
  ele?.append(svgNode);
  ele?.addEventListener('click', function(event){
    console.log(event);
  })
  let node: NodeListOf<SVGGElement> | undefined;
  node = ele?.querySelectorAll('g')
  console.log("node", node)
//   var svg_ele = document.getElementById('graph')?.ownerDocument
//   console.log(ele, ';..........;',svg_ele)
  
  if(node){
    node[4].addEventListener('click', (event)=>{
      console.log("clicked on node[0]", event);
      this.router.navigate(['/configuration/data-model/x-bpmn'], { relativeTo: this.activateRoute });
    })
  }
}

 _chart(d3:any,data:any)
    {
      const width = 928;

      // Compute the tree height; this approach will allow the height of the
      // SVG to scale according to the breadth (width) of the tree layout.
      const root = d3.hierarchy(data);
      const dx = 80;
      const dy = width / (root.height + 1);

      // Create a tree layout.
      const tree = d3.tree().nodeSize([dx, dy]);

      // Sort the tree and apply the layout.
      root.sort((a:any, b:any) => d3.ascending(a.data.name, b.data.name));
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

      const svg = d3.create("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-dy / 3, x0 - dx, width, height])
          // .attr("viewBox", [0, 0, 1010, 666])
          .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

      const link = svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5)
        .selectAll()
          .data(root.links())
          .join("path")
            .attr("d", d3.linkHorizontal()
                .x((d:any) => d.y)
                .y((d:any) => d.x));
      
      const node = svg.append("g")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
        .selectAll()
        .data(root.descendants())
        .join("g")
          .attr("transform", (d:any) => `translate(${d.y},${d.x})`);

      node.append("circle")
          .attr("fill", (d:any) => d.children ? "#555" : "#999")
          .attr("r", 2.5);

      node.append("text")
          .attr("dy", "0.31em")
          .attr("dx", (d:any) => d.children ? -6 : 6)
          .attr("text-anchor", (d:any) => d.children ? "end" : "start")
          .text((d:any) => d.data.name)
        .clone(true).lower()
          .attr("stroke", "white");
      
      return svg.node();
    }
}
