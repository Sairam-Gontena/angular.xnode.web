import { Component, OnInit, ViewChild } from '@angular/core';
import {
  KtdDragEnd, KtdDragStart, KtdGridComponent, KtdGridLayout, KtdGridLayoutItem, KtdResizeEnd, KtdResizeStart, ktdTrackById
} from '@katoid/angular-grid-layout';
import { fromEvent, merge, Subscription } from 'rxjs';

@Component({
  selector: 'xnode-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  trackById = ktdTrackById;

  cols = 12;
  rowHeight = 50;
  compactType: 'vertical' | 'horizontal' | null = 'vertical';
  layout: KtdGridLayout = [
    {
      "id": "0",
      "x": 0,
      "y": 0,
      "w": 3,
      "h": 2,
    },
    {
      "id": "1",
      "x": 3,
      "y": 0,
      "w": 3,
      "h": 2,
    },
    {
      "id": "2",
      "x": 6,
      "y": 0,
      "w": 3,
      "h": 2,

    },
    {
      "id": "3",
      "x": 9,
      "y": 0,
      "w": 3,
      "h": 4,
    },
    {
      "id": "4",
      "x": 0,
      "y": 4,
      "w": 6,
      "h": 3,
    },
    {
      "id": "5",
      "x": 6,
      "y": 4,
      "w": 3,
      "h": 3,
    },
    {
      "id": "6",
      "x": 0,
      "y": 8,
      "w": 9,
      "h": 3,
    },
    {
      "id": "7",
      "x": 9,
      "y": 8,
      "w": 3,
      "h": 4,
    },
  ];
  // currentTransition: string = this.transitions[0].value;

  dragStartThreshold = 0;
  autoScroll = true;
  disableDrag = false;
  disableResize = false;
  disableRemove = false;
  autoResize = true;
  preventCollision = false;
  isDragging = false;
  isResizing = false;
  resizeSubscription: any;
  constructor() {
    this.resizeSubscription = Subscription;
  }

  ngOnInit(): void {

  }
}
