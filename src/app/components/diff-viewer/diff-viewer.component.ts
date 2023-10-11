import { Component } from '@angular/core';
import * as DiffGen from '../../utils/diff-generator';
@Component({
  selector: 'xnode-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss'],
})
export class DiffViewerComponent {
  onDiff: boolean = true;
  content: any = {
    created_on: '2023-10-03 13:50:16',
    modified_on: '2023-10-03 13:50:16',
    version: 1,
    created_by: 'Kumar Velugula',
    modified_by: 'Kumar Velugula',
    spec: [
      {
        type: 'title',
        title: 'title',
        content: 'Introduction',
      },
      {
        type: 'section',
        content: [
          {
            type: 'section2',
            title: 'Purpose',
            content:
              'The purpose of this document is to provide a comprehensive specification for the app to manage the curriculum for school teachers. It outlines the intended functionality, key features, and technical considerations of the app. This document serves as a guide for the development, testing, and deployment of the app, ensuring alignment between stakeholders and clarity on product expectations.',
          },
          {
            type: 'section2',
            title: 'Scope',
            content:
              'This specification covers the app for school teachers to manage the curriculum. The app includes features such as setting up institutions, inviting teachers, teacher onboarding, setting up class profiles, scheduling class sessions, posting notifications, communication between teachers and students, student onboarding, and submitting and receiving grades. The scope does not include any features related to Xnode branding, bots, or AI.',
          },
          {
            type: 'section2',
            title: 'Audience',
            content: [
              {
                type: 'bullet',
                title: 'Product Development Teams',
                content:
                  'Software engineers, UI/UX designers, QA testers, and database administrators.',
              },
              {
                type: 'bullet',
                title: 'Project Managers and Product Owners',
                content: 'For direction, prioritization, and alignment.',
              },
              {
                type: 'bullet',
                title: 'Stakeholders and Investors',
                content:
                  "To understand the product's vision and functionality.",
              },
              {
                type: 'bullet',
                title: 'Technical Writers',
                content:
                  'For creating user manuals, help documents, and tutorials based on the specifications provided.',
              },
              {
                type: 'bullet',
                title: 'Beta Testers and Early Users',
                content:
                  'To understand the expected features and provide feedback.',
              },
            ],
          },
          {
            type: 'section2',
            title: 'References',
            content: [
              {
                type: 'bullet',
                title: 'Placeholder for Actual Document Name',
                content: 'User Research Findings and User Persona Document.',
              },
              {
                type: 'bullet',
                title: 'School Curriculum Management Guidelines',
                content:
                  'Specific guidelines or standards related to school curriculum management.',
              },
              {
                type: 'bullet',
                title: 'Outlook Calendar Integration Documentation',
                content:
                  'Documentation on integrating the app with Outlook calendar for calendar management.',
              },
              {
                type: 'bullet',
                title: 'Notification and Messaging Best Practices',
                content:
                  'Best practices for implementing notifications and messaging features in applications.',
              },
            ],
          },
        ],
      },
    ],
  };

  content2: any = {
    created_on: '2023-10-03 13:50:16',
    modified_on: '2023-10-03 13:50:16',
    version: 1,
    created_by: 'Kumar Velugula',
    modified_by: 'Kumar Velugula',
    spec: [
      {
        type: 'title',
        title: 'title',
        content: 'Introduction231',
      },
      {
        type: 'section',
        content: [
          {
            type: 'section2',
            title: 'Purpose',
            content:
              'The purpose12 of this document is to provide a comprehensive specification for the app to manage the curriculum for school teachers. It outlines the intended functionality, key features, and technical considerations of the app. This document serves as a guide for the development, testing, and deployment of the app, ensuring alignment between stakeholders and clarity on product expectations.',
          },
          {
            type: 'section2',
            title: 'Scope12',
            content:
              'This specification covers the app for school teachers to manage the curriculum. The app includes features such as setting up institutions, inviting teachers, teacher onboarding, setting up class profiles, scheduling class sessions, posting notifications, communication between teachers and students, student onboarding, and submitting and receiving grades. The scope does not include any features related to Xnode branding, bots, or AI.',
          },
          {
            type: 'section2',
            title: 'Audience',
            content: [
              {
                type: 'bullet',
                title: 'Product Development Teams12',
                content:
                  'Software engineers, UI/UX designers, QA testers, and database administrators.',
              },
              {
                type: 'bullet',
                title: 'Project Managers and Product Owners',
                content: 'For direction, prioritization, and alignment.23',
              },
              {
                type: 'bullet',
                title: 'Stakeholders and Investors',
                content:
                  "To understand the product's vision and functionality.",
              },
              {
                type: 'bullet',
                title: 'Technical Writers',
                content:
                  'For creating user manuals, help documents, and tutorials based on the specifications provided.',
              },
              {
                type: 'bullet',
                title: 'Beta Testers and Early Users',
                content:
                  'To understand the expected features and provide feedback.',
              },
            ],
          },
          {
            type: 'section2',
            title: 'References',
            content: [
              {
                type: 'bullet',
                title: 'Placeholder for Actual Document Name',
                content: 'User Research Findings and User Persona Document.',
              },
              {
                type: 'bullet',
                title: 'Placeholder for Actual Document Name123',
                content: 'User Research Findings and User Persona Document.324',
              },
              {
                type: 'bullet',
                title: 'School Curriculum Management Guidelines',
                content:
                  'Specific guidelines or standards related to school curriculum management.',
              },
              {
                type: 'bullet',
                title: 'Notification and Messaging Best Practices',
                content:
                  'Best practices for implementing notifications and messaging features in applications.',
              },
            ],
          },
        ],
      },
    ],
  };

  constructor() {
    console.log(DiffGen.diff(this.content, this.content2));
  }

  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    for (const item of fromArray) {
      if (srcObj.title === item.title) {
        return item;
      }
    }
  }

  getRemovedItems(fromArray: any[], toArray: any[], isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    const map: any = {};
    const removedItems: any[] = [];
    for (const item of toArray) {
      map[item.title] = item;
    }

    for (const item of fromArray) {
      if (!map[item.title]) {
        removedItems.push(item);
      }
    }
    return removedItems;
  }
}
