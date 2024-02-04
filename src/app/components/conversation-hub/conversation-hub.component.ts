import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { D3Service } from 'src/app/services/D3.service';
import { GraphData } from 'src/models/graph-data';

@Component({
  selector: 'app-conversation-hub',
  templateUrl: './conversation-hub.component.html',
  styleUrls: ['./conversation-hub.component.css']
})
export class ConversationHubComponent implements OnInit {
  @ViewChild("graphcontainer",{ static: true })
  private graphContainerRef: ElementRef | undefined;
  graphData : GraphData = {
    nodes: [
      { id: 'product1', label: 'Product 1', type: 'product' },
      { id: 'product2', label: 'Product 2', type: 'product' },
      { id: 'user1', label: 'User 1', type: 'user' },
      { id: 'user2', label: 'User 2', type: 'user' },
      { id: 'spec1', label: 'Specification 1', type: 'specification' },
      { id: 'spec2', label: 'Specification 2', type: 'specification' },
      { id: 'comment1', label: 'Comment 1', type: 'comment' },
      { id: 'comment2', label: 'Comment 2', type: 'comment' },
      { id: 'comment3', label: 'Comment 3', type: 'comment' },
    ],
    links: [
      { source: 'user1', target: 'product1' },
      { source: 'user2', target: 'product2' },
      { source: 'user1', target: 'spec1'  },
      { source: 'user2', target: 'spec2', },
      { source: 'product1', target: 'spec1', },
      { source: 'product2', target: 'spec2', },
      { source: 'user1', target: 'comment1', },
      { source: 'user2', target: 'comment2', },
      { source: 'comment1', target: 'spec1', },
      { source: 'comment2', target: 'spec2', },
      { source: 'user1', target: 'comment3', },
      { source: 'user2', target: 'comment3', },
    ],
  };
  constructor(private d3Service:D3Service) { }

  ngOnInit() {
    this.d3Service.createGraph(this.graphContainerRef);
    this.d3Service.renderGraph(this.graphData);
  }

}
