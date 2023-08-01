import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  providers: [MessageService]

})
export class PublishComponent {
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
  }

  // showToast(severity: string, message: string, code: string) {
  //   this.messageService.clear();
  //   this.messageService.add({ severity: severity, summary: code, detail: message, sticky: true });
  // }


}
