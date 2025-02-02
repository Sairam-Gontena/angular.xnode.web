import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'xnode-ui-flow-graph',
  templateUrl: './ui-flow-graph.component.html',
  styleUrls: ['./ui-flow-graph.component.scss'],
})
export class UiFlowGraphComponent implements AfterViewInit {
  title = 'ng-d3-graph-editor';
  @ViewChild('graphContainer') graphContainer: ElementRef | any;

  width = 960;
  height = 600;
  colors = d3.scaleOrdinal(d3.schemeCategory10);

  svg: any;
  force: any;
  path: any;
  circle: any;
  drag: any;
  dragLine: any;

  // mouse event vars
  selectedNode: any = null;
  selectedLink: any = null;
  mousedownLink: any = null;
  mousedownNode: any = null;
  mouseupNode: any = null;

  lastNodeId = 2;
  // only respond once per keydown
  lastKeyDown = -1;

  nodes = [
    { id: 'Dashboard', reflexive: false },
    { id: 'Accounts', reflexive: false },
    { id: 'Transactions', reflexive: false },
    { id: 'Budgets', reflexive: false },
    { id: 'Reports', reflexive: false },
  ];
  links = [
    { source: this.nodes[0], target: this.nodes[1], left: false, right: true },
    { source: this.nodes[1], target: this.nodes[2], left: false, right: true },
  ];

  ngAfterViewInit() {
    const rect = this.graphContainer.nativeElement.getBoundingClientRect();

    this.width = rect.width;

    this.svg = d3
      .select('#graphContainer')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height);

    this.force = d3
      .forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(300))
      .force('collision', d3.forceCollide().radius(function (d) { return 150 }))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(this.width / 2))
      .force('y', d3.forceY(this.height / 2))
      .on('tick', () => this.tick());

    // init D3 drag support
    this.drag = d3
      .drag()
      .on('start', (event: any, d: any) => {
        if (!event.active) this.force.alphaTarget(0.3).restart();

        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: any, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: any, d: any) => {
        if (!event.active) this.force.alphaTarget(0.3);

        d.fx = null;
        d.fy = null;
      });

    // define arrow markers for graph links
    this.svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

    this.svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000');

    // line displayed when dragging new nodes
    this.dragLine = this.svg
      .append('svg:path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0');

    // handles to link and node element groups
    this.path = this.svg.append('svg:g').selectAll('path');
    this.circle = this.svg.append('svg:g').selectAll('g');

    // app starts here
    this.svg
      // .on('mousedown', (dataItem: any) => this.mousedown(dataItem))
      .on('mousemove', (dataItem: any) => this.mousemove(dataItem))
      .on('mouseup', (dataItem: any) => this.mouseup(dataItem));
    d3.select(window).on('keydown', this.keydown).on('keyup', this.keyup);
    this.restart();
  }

  // update force layout (called automatically each iteration)
  tick() {
    // draw directed edges with proper padding from node centers
    this.path.attr('d', (d: any) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 47 : 40;
      const targetPadding = d.right ? 47 : 40;
      const sourceX = d.source.x + sourcePadding * normX;
      const sourceY = d.source.y + sourcePadding * normY;
      const targetX = d.target.x - targetPadding * normX;
      const targetY = d.target.y - targetPadding * normY;

      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });

    this.circle.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  }

  resetMouseVars() {
    this.mousedownNode = null;
    this.mouseupNode = null;
    this.mousedownLink = null;
  }

  // update graph (called when needed)
  restart() {
    // path (link) group
    this.path = this.path.data(this.links);

    // update existing links
    this.path
      .classed('selected', (d: any) => d === this.selectedLink)
      .style('marker-start', (d: any) => (d.left ? 'url(#start-arrow)' : ''))
      .style('marker-end', (d: any) => (d.right ? 'url(#end-arrow)' : ''));
    let outerThis = this;
    // remove old links
    this.path.exit().remove();
    var menu = [
      {
        title: 'Remove link',
        action: function (d: any) {
          outerThis.links = outerThis.links.filter((link) => {
            if (
              link.source.id == d.source.id &&
              link.target.id == d.target.id
            ) {
              return false;
            }
            return true;
          });
          outerThis.selectedNode = null;
          outerThis.restart();
        },
        disabled: false, // optional, defaults to false
      },
    ];
    // add new links
    this.path = this.path
      .enter()
      .append('svg:path')
      .attr('class', 'link')
      .on('contextmenu', (event: any, selectedLink: any) => {
        // create the div element that will hold the context menu
        contextMenu(menu, selectedLink, event);
      })
      .classed('selected', (d: any) => d === this.selectedLink)
      .style('marker-start', (d: any) => (d.left ? 'url(#start-arrow)' : ''))
      .style('marker-end', (d: any) => (d.right ? 'url(#end-arrow)' : ''))
      .on('mousedown', (event: any, d: any) => {
        if (event.ctrlKey) return;

        // select link
        this.mousedownLink = d;
        this.selectedLink =
          this.mousedownLink === this.selectedLink ? null : this.mousedownLink;
        this.selectedNode = null;
        this.restart();
      })
      .merge(this.path);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    this.circle = this.circle.data(this.nodes, (d: any) => d.id);

    // update existing nodes (reflexive & selected visual states)
    this.circle
      .selectAll('circle')
      .style('fill', 'white')
      .classed('reflexive', (d: any) => d.reflexive);

    // remove old nodes
    this.circle.exit().remove();

    // add new nodes
    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', 40)
      .style('fill', 'white')
      .style('stroke', (d: any) =>
        d3.rgb(this.colors(d.id)).darker().toString()
      )
      .classed('reflexive', (d: any) => d.reflexive)
      .on('mouseover', function (mouseEvent: any, d: any) {
        if (!mouseEvent.mousedownNode || d === mouseEvent.mousedownNode) return;
        // enlarge target node
        d3.select(mouseEvent.currentTarget).attr('transform', 'scale(1.1)');
      })
      .on('mouseout', function (mouseEvent: any, d: any) {
        if (!mouseEvent.mousedownNode || d === mouseEvent.mousedownNode) return;
        // unenlarge target node
        d3.select(mouseEvent.currentTarget).attr('transform', '');
      })
      .on('mousedown', (event: any, d: any) => {
        if (event.ctrlKey) return;

        // select node
        this.mousedownNode = d;
        this.selectedNode =
          this.mousedownNode === this.selectedNode ? null : this.mousedownNode;
        this.selectedLink = null;

        // reposition drag line
        this.dragLine
          .style('marker-end', 'url(#end-arrow)')
          .classed('hidden', false)
          .attr(
            'stroke',
            `M${this.mousedownNode.x},${this.mousedownNode.y}L${this.mousedownNode.x},${this.mousedownNode.y}`
          );

        this.restart();
      })
      .on('mouseup', (mouseEvent: any, dataItem: any) => {
        if (!this.mousedownNode) return;

        // needed by FF
        this.dragLine.classed('hidden', true).style('marker-end', '');

        // check for drag-to-self
        this.mouseupNode = dataItem;
        if (this.mouseupNode === this.mousedownNode) {
          this.resetMouseVars();
          return;
        }

        // unenlarge target node
        d3.select(mouseEvent.currentTarget).attr('transform', '');

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        const isRight = this.mousedownNode.id < this.mouseupNode.id;
        const source = isRight ? this.mousedownNode : this.mouseupNode;
        const target = isRight ? this.mouseupNode : this.mousedownNode;

        const link = this.links.filter(
          (l) => l.source === source && l.target === target
        )[0];
        if (link) {
          link[isRight ? 'right' : 'left'] = true;
        } else {
          this.links.push({ source, target, left: !isRight, right: isRight });
        }

        // select new link
        this.selectedLink = link;
        this.selectedNode = null;
        this.restart();
      });

    // show node IDs
    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d: any) => d.id);

    this.circle = g.merge(this.circle);

    // set the graph in motion
    this.force.nodes(this.nodes).force('link').links(this.links);

    this.force.alphaTarget(0.3).restart();
  }

  mousedown(mouseEvent: any) {
    // because :active only works in WebKit?
    this.svg.classed('active', true);

    if (mouseEvent.ctrlKey || this.mousedownNode || this.mousedownLink) return;

    // insert new node at point
    // const point = d3.pointer(mouseEvent.currentTarget);
    // // const point = d3.mouse(this);
    // const node = {
    //   id: ++this.lastNodeId,
    //   reflexive: false,
    //   x: point[0],
    //   y: point[1],
    // };
    // this.nodes.push(node);

    this.restart();
  }

  mousemove(event: any) {
    if (!this.mousedownNode) return;

    // update drag line
    this.dragLine.attr(
      'stroke',
      `M${this.mousedownNode.x},${this.mousedownNode.y}L${d3.pointer(event.currentTarget)[0]
      },${d3.pointer(event.currentTarget)[1]}`
    );

    this.restart();
  }

  mouseup(source: any) {
    if (this.mousedownNode) {
      // hide drag line
      this.dragLine.classed('hidden', true).style('marker-end', '');
    }

    // because :active only works in WebKit?
    this.svg.classed('active', false);

    // clear mouse event vars
    this.resetMouseVars();
  }

  spliceLinksForNode(node: any) {
    const toSplice = this.links.filter(
      (l) => l.source === node || l.target === node
    );
    for (const l of toSplice) {
      this.links.splice(this.links.indexOf(l), 1);
    }
  }

  keydown(event: any) {
    event.preventDefault();

    if (this.lastKeyDown !== -1) return;
    this.lastKeyDown = event.keyCode;

    // ctrl
    if (event.keyCode === 17) {
      this.circle.call(this.drag);
      this.svg.classed('ctrl', true);
    }

    if (!this.selectedNode && !this.selectedLink) return;

    switch (event.keyCode) {
      case 8: // backspace
      case 46: // delete
        if (this.selectedNode) {
          this.nodes.splice(this.nodes.indexOf(this.selectedNode), 1);
          this.spliceLinksForNode(this.selectedNode);
        } else if (this.selectedLink) {
          this.links.splice(this.links.indexOf(this.selectedLink), 1);
        }
        this.selectedLink = null;
        this.selectedNode = null;
        this.restart();
        break;
      case 66: // B
        if (this.selectedLink) {
          // set link direction to both left and right
          this.selectedLink.left = true;
          this.selectedLink.right = true;
        }
        this.restart();
        break;
      case 76: // L
        if (this.selectedLink) {
          // set link direction to left only
          this.selectedLink.left = true;
          this.selectedLink.right = false;
        }
        this.restart();
        break;
      case 82: // R
        if (this.selectedNode) {
          // toggle node reflexivity
          this.selectedNode.reflexive = !this.selectedNode.reflexive;
        } else if (this.selectedLink) {
          // set link direction to right only
          this.selectedLink.left = false;
          this.selectedLink.right = true;
        }
        this.restart();
        break;
    }
  }

  keyup(event: any) {
    this.lastKeyDown = -1;

    // ctrl
    if (event.keyCode === 17) {
      this.circle.on('.drag', null);
      this.svg.classed('ctrl', false);
    }
  }
}
const contextMenu = (menu: { title: string; action: (d: any) => void; disabled: boolean; }[], selectedLink: any, event: any) => {
  d3.selectAll('.d3-context-menu')
    .data([1])
    .enter()
    .append('div')
    .attr('class', 'd3-context-menu');

  // close menu
  d3.select('body').on('click.d3-context-menu', function () {
    d3.select('.d3-context-menu').style('display', 'none');
  });

  // this gets executed when a contextmenu event occurs
  d3.selectAll('.d3-context-menu').html('');
  var list = d3.selectAll('.d3-context-menu').append('ul');
  list
    .selectAll('li')
    .data(menu)
    .enter()
    .append('li')
    .html(function (d) {
      return d.title;
    })
    .on('click', function (event, i) {
      i.action(selectedLink);
      d3.select('.d3-context-menu').style('display', 'none');
    });

  // the openCallback allows an action to fire before the menu is displayed
  // an example usage would be closing a tooltip
  // if (openCallback) openCallback(data, index);
  // display context menu
  d3.select('.d3-context-menu')
    .style('left', event.pageX - 2 + 'px')
    .style('top', event.pageY - 2 + 'px')
    .style('display', 'block')
    .style('position', 'absolute');

  event.preventDefault();
}

