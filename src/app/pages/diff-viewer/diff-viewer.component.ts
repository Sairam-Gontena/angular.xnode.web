import { Component, OnInit } from '@angular/core';
import * as DiffGen from '../../../app/utils/diff-generator';
import { NEWLIST, OLDLIST } from './mock'
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecService } from 'src/app/api/spec.service';
import { environment } from 'src/environments/environment';
declare const SwaggerUIBundle: any;


@Component({
  selector: 'xnode-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss'],
})

export class DiffViewerComponent implements OnInit {
  onDiff: boolean = false;
  content: any = NEWLIST;
  content2: any = OLDLIST;
  loading: boolean = true;

  constructor(
    private utils: UtilsService,
    private specService: SpecService
  ) {
    this.utils.startSpinner.subscribe((event: boolean) => {
      this.loading = true
    });
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    // this.getMeSpecInfo();
    this.fetchOpenAPISpec();
  }

  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    for (const item of fromArray) {
      if (srcObj.id === item.id) {
        return item;
      }
    }
  }

  getRemovedItems(fromArray: any[], toArray: any[], isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    const map: any = {};
    const removedItems: any[] = [];
    for (const item of toArray) {
      map[item.id] = item;
    }

    for (const item of fromArray) {
      if (!map[item.id]) {
        removedItems.push(item);
      }
    }
    return removedItems;
  }


  getMeSpecInfo() {
    this.specService
      .getSpec({ productId: '688a7969-2910-40b0-99e3-ef303493ee47', versionId: 'd97969ea-b68a-46bb-a62b-4839b3e73c59' })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          this.content2 = response.data;
        }
        this.utils.loadSpinner(false);
      })
      .catch((error) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      });
  }

  async fetchOpenAPISpec() {
    const record_id = localStorage.getItem('record_id');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec'),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      url:
        environment.uigenApiUrl +
        'openapi-spec/' +
        localStorage.getItem('app_name') +
        '/' +
        email +
        '/' +
        record_id,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
    this.utils.loadSpinner(false)
  }
}
