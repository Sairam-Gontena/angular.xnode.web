import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.scss'],
  providers: [MessageService]

})

export class OperateComponent implements OnInit {
  getconfigureLayout: any;
  getOperateLayout: any;
  layout: any;
  dashboard: any = 'Overview';
  layoutColumns: any;
  templates: any;
  isOpen = true;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  operateLayout: any;
  data: any;
  doughnutData: any;
  doughnutOptions: any;
  options: any;

  constructor(private messageService: MessageService, private utilService: UtilsService) {
  }

  ngOnInit(): void {
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
  }

  getLayout(layout: any): void {
    this.dashboard = layout;
  }

  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

}