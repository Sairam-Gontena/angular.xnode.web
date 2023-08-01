import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private showLayoutSubmenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public openSubmenu: Observable<boolean> = this.showLayoutSubmenu.asObservable();

  private spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public startSpinner: Observable<boolean> = this.spinner.asObservable();

  toasterObject :any= {
    severity:'',
    message:'',
    code:''
  }
  constructor() { }

  disablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(false);
  }

  EnablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(true);
  }

  startSpinnerInApp(){
    this.spinner.next(true)
  }

  endSpinnerInApp(severity: string, message: string, code: string){
    this.spinner.next(false);
    this.toasterObject.severity = severity;
    this.toasterObject.message = message;
    this.toasterObject.code = code;
  }

}
