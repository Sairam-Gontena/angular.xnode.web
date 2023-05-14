import { Component } from '@angular/core';

// service
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';

// class
import { Data }  from './class/data';

@Component({
  selector: 'er-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent {
  data:Data;

  constructor( private dataService: DataService, private jsPlumbService: JsPlumbService ) {
    console.log('AppComponent.constructor() is called!');
    // @ts-ignore
    this.data = this.dataService.data;
  }

  ngAfterViewInit(){
    console.log('AppComponent.ngAfterViewInit() is called!');
    this.jsPlumbService.init();
  }

  ngAfterViewChecked(){
    //console.log('AppComponent.ngAfterViewChecked() is called!');
    if(this.dataService.flg_repaint){
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }
}
