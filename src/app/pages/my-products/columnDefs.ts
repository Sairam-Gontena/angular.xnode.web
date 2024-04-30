export const ColumnDefs = [
    {
        field: "objectType",
        header: "Entity",
        width: 150,
        filter: true,
        sortable: true,
        visible: true,
        default: true
    },
    {
        field: "shortId",
        header: "Id",
        width: 100,
        filter: true,
        route: true,
        sortable: true,
        visible: true,
        default: false
    },
    {
        field: "title",
        header: "Title",
        width: 250,
        filter: true,
        sortable: true,
        visible: true,
        default: true
    },
    {
        field: "userAction",
        header: "Action",
        width: 100,
        visible: true,
        default: true
    },
    {
        field: "modifiedBy",
        header: "Modified By",
        sortable: true,
        type: 'avatar',
        width: 120,
        visible: true,
        default: false
    },
    {
        field: "modifiedOn",
        header: "Modified On",
        width: 200,
        filter: true,
        sortable: true,
        visible: true,
        default: true
    },
]