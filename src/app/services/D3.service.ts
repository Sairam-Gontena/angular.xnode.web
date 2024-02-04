import { ElementRef, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { GraphData } from 'src/models/graph-data';


@Injectable({
  providedIn: 'root'
})
export class D3Service {
  svg: any;
  objectColorMapping:any = {
    "user":{
      bgcolor:"#7375C6",
      icon: ""
    }
  }
  constructor() {

  }
  createGraph(elementRef: ElementRef<HTMLDivElement> | undefined) {
    debugger;
    if (elementRef) {
      this.svg = d3.select(elementRef.nativeElement)
        .append('svg')
        .attr('width', elementRef.nativeElement.clientWidth)
        .attr('height', elementRef.nativeElement.clientHeight);
    }
  }
  renderGraph(data: GraphData) {
    // Implement D3 logic to render nodes and links based on your data
    const simulation = d3
      .forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.svg.attr('width') / 2, this.svg.attr('height') / 2))
      .force('collision', d3.forceCollide().radius(60));

      const link = this.svg
      .selectAll('.link')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'link') // CSS class for links
      .style('stroke', '#999') // Link color
      .style('stroke-width', '2px'); // Link width

    const node = this.svg
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

      node
      .append('circle')
      .attr('r', 50)
      .style('fill', (d: any) => "#000");
      node
      .append('image')
      //.attr('xlink:href', (d: any) => getIconForNodeType(d.type)) // Specify the icon path
      .attr('x', -8) // Adjust the x position of the image
      .attr('y', -8) // Adjust the y position of the image
      .attr('width', 16) // Adjust the width of the image
      .attr('height', 16); // Adjust the height of the image
    node
      .append('text')
      .attr('dx', -12) // Adjust the text position
      .attr('dy', '.35em')    
      .style('stroke', '#999') // Link color
      .style('stroke-width', '2px') // Link width
      .text((d: any) => d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
}
