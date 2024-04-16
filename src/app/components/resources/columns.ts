export class TableColumn {
  field?: any;      // Name of the field in your data
  header?: string;     // Header text to display in the table
  width?: string;
  type?: string;
  pipe?: string
  route?: boolean;      // Width of the column
  filter?: boolean;    // Indicates whether filtering is enabled for this column
  sortable?: boolean;
  default?: boolean;
  buttonType?: string;
  source?: boolean // Indicates whether sorting is enabled for this column
  visible?:boolean // Indicates that this is feald is required to show or not
}
