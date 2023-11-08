import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import TableData from '../../../assets/json/table_columns.json';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'xnode-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  providers: [MessageService]

})
export class PublishComponent {
  cols: any[] = [];
  publish_overview: any;
  tableInfo: any;

  dashboard: any;
  layoutColumns: any;
  templates: any;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  isOpen = false;

  constructor(private messageService: MessageService, private utilService: UtilsService) {
  }

  ngOnInit(): void {
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    this.tableInfo = TableData.publish_overview.Table_Info;
  }
}
