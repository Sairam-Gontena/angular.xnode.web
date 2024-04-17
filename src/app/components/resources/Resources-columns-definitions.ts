import { TableColumn } from './columns';

export class ResourcesTableColumn {

  private columns: TableColumn[];
  constructor() {
    this.columns = [
      {
        field: "",
        header: "",
        type: "checkbox",
        width: "40",
        visible: false
      },
      {
        field: "fileName",
        header: "Type",
        filter: false,
        sortable: true,
        width: '35',
        visible: true
      },
      {
        field: "resId",
        header: "Id",
        filter: false,
        sortable: true,
        route: true,
        width: "60",
        visible: true
      },
      {
        field: "title",
        header: "Name",
        filter: false,
        sortable: true,
        default: true,
        type: "File",
        width: '150',
        visible: true
      },
      {
        field: "importSource",
        header: "Import Source",
        type: "path",
        width: '130',
        default: false,
        visible: false
      },
      {
        field: "contributors",
        header: "Shared With",
        type: "avatar",
        width: '100',
        visible: true
      },
      {
        field: "modifiedOn",
        header: "Modified On",
        type: "d/m/y",
        filter: false,
        sortable: true,
        width: '100',
        visible: true
      },
      {
        field: "owners",
        header: "Modified By",
        type: "avatar",
        width: '100',
        visible: true
      },
      {
        field: "fileSize",
        header: "File Size",
        filter: false,
        sortable: true,
        default: false,
        type:"fileSize",
        width: '100',
        visible: true
      },
      // {
      //   field: "linkedTo.entityName",
      //   header: "Linked To",
      //   filter: false,
      //   sortable: true,
      //   default: true
      // },
      // {
      //   field: "",
      //   header: "",
      //   type: "menu"
      // }
    ]
  }

  getColumns(): TableColumn[] {
    return this.columns;
  }
}
