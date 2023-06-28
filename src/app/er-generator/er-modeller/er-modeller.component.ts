import { AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Data } from '../class/data';
import { DataService } from '../service/data.service';
import { JsPlumbService } from '../service/jsPlumb.service';
import { UtilService } from '../service/util.service';
import { InputDataJson } from '../service/input_data_sample';
import { UseCasesComponent } from 'src/app/pages/use-cases/use-cases.component';

@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss']
})
export class ErModellerComponent implements AfterViewInit, AfterViewChecked, OnInit {
  // for testing only
  id: String ='';
  insightData: String = '';
  ///................../////

  data: Data | any;
  dashboard: any;
  layoutColumns: any;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  isOpen = true;
  @Input() erModelInput: any = {
    "User": {
      "type": "object",
      "properties": {
        "user_id": {
          "type": "integer",
          "primaryKey": true
        },
        "first_name": {
          "type": "string"
        },
        "last_name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "password": {
          "type": "string"
        }
      }
    },
    "Accounts": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "integer",
          "primaryKey": true
        },
        "user_id": {
          "type": "integer",
          "foreignKey": "User.user_id"
        },
        "account_name": {
          "type": "string"
        },
        "account_type": {
          "type": "string"
        },
        "account_balance": {
          "type": "number"
        },
        "interest_rate": {
          "type": "number"
        },
        "minimum_payment": {
          "type": "number"
        }
      }
    }
  };

  constructor(private dataService: DataService, private jsPlumbService: JsPlumbService, private utilService: UtilService, private useCasesComponent: UseCasesComponent ) {
    this.data = this.dataService.data;
  }

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  ngAfterViewChecked(): void {
    if (this.dataService.flg_repaint) {
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }


  ngAfterViewInit(): void {
    this.jsPlumbService.init();
    this.dataService.loadData(this.utilService.ToModelerSchema(this.erModelInput));
  }

  getLayout(layout: any): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

}
