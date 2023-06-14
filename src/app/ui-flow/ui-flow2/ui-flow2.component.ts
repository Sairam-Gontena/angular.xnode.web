import { Component, OnInit } from '@angular/core';
import { scaleOrdinal, schemeCategory10, select, drag, forceSimulation, forceLink, forceManyBody, forceCenter, SimulationNodeDatum } from 'd3';
import * as d3 from 'd3';

@Component({
  selector: 'xnode-ui-flow2',
  templateUrl: './ui-flow2.component.html',
  styleUrls: ['./ui-flow2.component.scss']
})
export class UiFlow2Component implements OnInit {



  private nodes = [
    { index: 0, name: 'center', group: 0 },
    { index: 1, name: 'Fruit', group: 0 },
    { index: 2, name: 'Vegetable', group: 0 },
    { index: 3, name: 'Orange', group: 0 },
    { index: 4, name: 'Apple', group: 0 },
    { index: 5, name: 'Banana', group: 0 },
    { index: 6, name: 'Peach', group: 0 },
    { index: 7, name: 'Bean', group: 0 },
    { index: 8, name: 'Pea', group: 0 },
    { index: 9, name: 'Carrot', group: 0 },
  ];
  private links = [
    { source: this.nodes[0], target: this.nodes[1] },
    { source: this.nodes[0], target: this.nodes[2] },
    { source: this.nodes[1], target: this.nodes[3] },
    { source: this.nodes[1], target: this.nodes[4] },
    { source: this.nodes[1], target: this.nodes[5] },
    { source: this.nodes[1], target: this.nodes[6] },
    { source: this.nodes[2], target: this.nodes[7] },
    { source: this.nodes[2], target: this.nodes[8] },
    { source: this.nodes[2], target: this.nodes[9] },
  ];
  private color = scaleOrdinal(schemeCategory10);

  ngOnInit(): void {
    const div: any = document.getElementById('#container');
    const svg = d3.select('#body');

    console.log(svg);

    const simulation = forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links)
        .id((d: any) => d.id).distance(50))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(div.clientWidth / 2, 200))
      .tick()
      .on('tick', () => {
        node.attr('transform', (n: any) => 'translate(' + n.x + ',' + n.y + ')');
        node.style('left', function (d: any) {
          return d.x + "px";
        }).style('top', function (d: any) {
          return d.y + "px";
        });
      });


    // const node = svg
    //   .append('g')
    //   .attr('class', 'nodes')
    //   .selectAll('g')
    //   .data(this.nodes)
    //   .enter()
    //   .append('g');
    const node = d3.selectAll('div')
      .data(this.nodes)
      .each(function (d) {
        var self = d3.select('#' + d.name);
        self.style("position", "absolute");
      });

    this.links.forEach(link => {
      let src: any = this.nodes.find(n => n == link.source)
      let target: any = this.nodes.find(n => n == link.target)
      console.log('src:', src, 'target:', target)
      svg.append('svg').append('line')
        .style("stroke", "lightgreen")
        .style("stroke-width", 10)
        .attr("x1", src.x)
        .attr("y1", src.y)
        .attr("x2", target.x)
        .attr("y2", target.y);
    })
    let drag: any = d3.drag()
      .on('start', (e: any, d: any) => dragstarted(e, d))
      .on('drag', (e: any, d: any) => dragged(e, d))
      .on('end', (e: any, d: any) => dragended(e, d));
    node.call(drag)
    // const circles = node
    //   .append('circle')
    //   .attr('r', 20)
    //   .style('fill', (n: any) => this.color(n.group))
    //   .style('cursor', 'pointer')
    //   .on('dblclick', (e) => alert(e.srcElement.__data__.name))
    //   .call(drag);

    // const labels = node
    //   .append('text')
    //   .text((n) => n.name)
    //   .attr('x', 22)
    //   .attr('y', 5)
    //   .style('font-size', '12px')
    //   .style('color', (n) => this.color('' + n.group));

    // node.append('title').text((n) => n.name);



    const dragstarted = (e: any, d: SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (e: any, d: SimulationNodeDatum) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragended = (e: any, d: SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };
  }
}
