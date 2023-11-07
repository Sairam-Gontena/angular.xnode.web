export interface TableColumn {
    field: string;      // Name of the field in your data
    header: string;     // Header text to display in the table
    width: number;      // Width of the column
    filter: boolean;    // Indicates whether filtering is enabled for this column
    sortable: boolean;  // Indicates whether sorting is enabled for this column
}