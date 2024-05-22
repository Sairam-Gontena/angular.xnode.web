import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class NaviService {
  private iframeDetail: Subject<any> = new Subject();
  private isNaviExpand: Subject<any> = new Subject();
  public naviDetailObj: any = {
    product: "",
    currentUser: "",
    mainComponent: "",
    componentToShow: "",
    resource_id: "",
    conversationID: "",
    importFilePopupToShow: false,
    newWithNavi: false,
    isNaviExpanded: false
  }

  constructor(private domSanitizer: DomSanitizer,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private router: Router) { }

  //set main component
  setMainComponent(componentName: string) {
    this.naviDetailObj.mainComponent = componentName;
  }

  //get main component
  getMainComponent() {
    return this.naviDetailObj.mainComponent;
  }

  //set component to show
  setComponentToShow(componentName: string) {
    this.naviDetailObj.componentToShow = componentName;
  }

  //get component to show
  getComponentToShow() {
    return this.naviDetailObj.componentToShow;
  }

  //set resource ID
  setResourceID(resouceID: string) {
    this.naviDetailObj.resource_id = resouceID;
  }

  //get resource ID
  getResourceID() {
    return this.naviDetailObj.resource_id;
  }

  //set conversation ID
  setConversationID(conversationID: string) {
    this.naviDetailObj.conversationID = conversationID;
  }

  //get conversation ID
  getConversationID() {
    return this.naviDetailObj.conversationID;
  }

  //set import popup to show
  setImportPopupToShow(importFilePopupToShow: boolean) {
    this.naviDetailObj.importFilePopupToShow = importFilePopupToShow;
  }

  //get import popup to show
  getImportPopupToShow() {
    return this.naviDetailObj.importFilePopupToShow;
  }

  //set new with navi
  setNewWithNavi(newWithNavi: boolean) {
    this.naviDetailObj.newWithNavi = newWithNavi;
  }

  //get new with navi
  getNewWithNavi() {
    return this.naviDetailObj.newWithNavi;
  }

  //set navi expand
  setNaviExpand(isNaviExpanded: boolean) {
    this.naviDetailObj.isNaviExpanded = isNaviExpanded;
    this.isNaviExpand.next(isNaviExpanded);
  }

  //change navi expand
  changeNaviExpand(): Observable<any> {
    return this.isNaviExpand.asObservable();
  }

  //get navi expand
  getNaviExpand() {
    return this.naviDetailObj.isNaviExpanded;
  }

  //set iframe details
  saveIframeDetail(iframeDetailObj: any) {
    this.iframeDetail.next(iframeDetailObj);
  }

  //change iframe details
  changeIframeDetail(): Observable<any> {
    return this.iframeDetail.asObservable();
  }

  //get me component
  getMeComponent() {
    let comp = '';
    switch (this.router.url) {
      case '/my-products':
      case '/':
        comp = 'my-products';
        break;
      case '/dashboard':
        comp = 'dashboard';
        break;
      case '/overview':
        comp = 'overview';
        break;
      case '/usecases':
        comp = 'usecase';
        break;
      case '/configuration/workflow/overview':
        comp = 'xflows';
        break;
      case '/configuration/data-model/overview':
        comp = 'data_model';
        break;
      case '/operate':
        comp = 'operate';
        break;
      case '/publish':
        comp = 'publish';
        break;
      case '/specification':
        comp = 'specification';
        break;
      case '/operate/change/history-log':
        comp = 'history-log';
        break;
      default:
        break;
    }
    return comp;
  }

  //get the iframe url
  iframeUrlLoad(rawUrl: any) {
    const showDockedNavi: any = this.localStorageService.getItem(StorageKeys.IS_NAVI_EXPANDED);
    let iframeDetail = {
      iframeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl),
      showDockedNavi: showDockedNavi ? JSON.parse(showDockedNavi) : false,
      isNaviExpanded: this.naviDetailObj.isNaviExpanded
    }
    this.saveIframeDetail(iframeDetail);
  }

  //making the trusted url for NAVI
  makeTrustedUrl(productEmail?: string): void {
    this.naviDetailObj.product = this.localStorageService.getItem(StorageKeys.Product);
    const conversation: any = this.localStorageService.getItem(StorageKeys.CONVERSATION);
    this.naviDetailObj.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    const deep_link_info: any = this.localStorageService.getItem(StorageKeys.DEEP_LINK_INFO);
    const restriction_max_value = localStorage.getItem('restriction_max_value');
    let rawUrl: string =
      environment.naviAppUrl +
      '?email=' +
      this.naviDetailObj.currentUser?.email +
      '&targetUrl=' +
      environment.xnodeAppUrl +
      '&component=' +
      (this.naviDetailObj.mainComponent !== '' ? this.naviDetailObj.mainComponent : this.getMeComponent()) +
      '&device_width=' +
      window.innerWidth +
      '&accountId=' +
      this.naviDetailObj.currentUser?.account_id +
      '&currentUser=' +
      JSON.stringify(this.naviDetailObj.currentUser) +
      '&token=' +
      this.localStorageService.getItem(StorageKeys.ACCESS_TOKEN) +
      '&user_id=' +
      this.naviDetailObj.currentUser?.user_id +
      '&account_id=' +
      this.naviDetailObj.currentUser?.account_id;
    if (restriction_max_value) {
      rawUrl = rawUrl + '&restriction_max_value=' + JSON.parse(restriction_max_value);
    }
    if (this.naviDetailObj.newWithNavi) {
      this.setComponentToShow('Chat');
      rawUrl = rawUrl + '&new_with_navi=' + true;
    }
    if (this.naviDetailObj.conversatonDetails) {
      rawUrl = rawUrl + '&conversatonDetails=' + JSON.stringify(this.naviDetailObj.conversatonDetails);
    }
    if (this.naviDetailObj.product) {
      this.utilsService.disablePageToolsLayoutSubMenu();
      rawUrl = rawUrl +
        '&product_user_email=' +
        productEmail +
        '&conversationId=' +
        conversation?.id +
        '&type=' +
        conversation?.conversationType
        + '&product_context=' +
        true +
        '&accountId=' +
        this.naviDetailObj.currentUser?.account_id +
        '&product_id=' +
        this.naviDetailObj.product.id +
        '&product=' +
        JSON.stringify(this.naviDetailObj.product) +
        '&new_with_navi=' +
        false + '&componentToShow=Chat';
    }
    if (this.getResourceID()) {
      rawUrl = rawUrl + '&resource_id=' + this.getResourceID();
      if (rawUrl.includes("componentToShow")) {
        rawUrl = rawUrl.replace(/componentToShow=[^&]*/, "componentToShow=Resources");
      } else {
        rawUrl += "&componentToShow=Resources";
      }
      this.naviDetailObj.resource_id = undefined
    }
    if (this.getConversationID()) {
      if (rawUrl.includes("conversationId")) {
        rawUrl = rawUrl.replace(/conversationId=[^&]*/, "conversationId=" + this.getConversationID());
      } else {
        rawUrl += "&conversationId=" + this.getConversationID();
      }
      this.naviDetailObj.conversationId = undefined
    }
    if (this.getImportPopupToShow()) {
      if (rawUrl.includes("importFilePopupToShow")) {
        rawUrl = rawUrl.replace(/importFilePopupToShow=[^&]*/, "importFilePopupToShow=" + this.getImportPopupToShow());
      } else {
        rawUrl += "&importFilePopupToShow=" + this.getImportPopupToShow();
      }
    }
    const meta_data: any = this.localStorageService.getItem(StorageKeys.MetaData);
    if (this.getComponentToShow() || (meta_data && meta_data.length && !this.naviDetailObj.product) || this.getImportPopupToShow()) {
      if (rawUrl.includes("componentToShow")) {
        rawUrl = rawUrl.replace(/componentToShow=[^&]*/, "componentToShow=" + (deep_link_info?.componentToShow ? deep_link_info?.componentToShow :
          (this.getComponentToShow() ? this.getComponentToShow() : (this.getImportPopupToShow() ? "Resources" : "Tasks"))));
        this.naviDetailObj.componentToShow = undefined;
      } else {
        rawUrl += "&componentToShow=" + (deep_link_info?.componentToShow ? deep_link_info?.componentToShow : (this.getComponentToShow() ? this.getComponentToShow() : ((meta_data && !meta_data.length) ? "Chat" : "Tasks")));
        this.naviDetailObj.componentToShow = undefined;
      }
    }
    if (deep_link_info?.componentID) {
      rawUrl += "&componentID=" + deep_link_info?.componentID;
    }
    rawUrl = rawUrl + '&isNaviExpanded=' + (deep_link_info?.isNaviExpanded ? deep_link_info?.isNaviExpanded : this.naviDetailObj.isNaviExpanded);
    this.naviDetailObj.mainComponent = '';
    this.iframeUrlLoad(rawUrl);
  }

}
