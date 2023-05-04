export const APP_MGR_CONFIG = {
    "service_path": "application",
    "columns": [{
        "label": "Application ID",
        "name": "applicationId",
        "inputType": "auto",
        "dataType": "string",
        "canDisplay": false,
        "canEdit": false,
        "isRequired": true,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": []
    },
    {
        "label": "Application Name",
        "name": "applicationName",
        "inputType": "text",
        "dataType": "string",
        "hyperlink": 'app-details',
        "hyperlinkParams": ['applicationId'],
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "Application Name field is required"
        },
        {
            "type": "min",
            "value": 5,
            "msg": "Application Name cannot be less than 5 characters"
        },
        {
            "type": "max",
            "value": 100,
            "msg": "Application Name cannot be more than 100 characters"
        }
        ]
    },
    {
        "label": "Description",
        "name": "applicationDesc",
        "inputType": "textarea",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": false,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "Description field is required"
        },
        {
            "type": "max",
            "value": 100,
            "msg": "Description cannot be more than 100 characters"
        }
        ]
    },
    {
        "label": "Application Type",
        "name": "applicationType",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "Web",
            "value": "web"
        }, {
            "label": "MicroServices",
            "value": "microservices"
        }]
    },
    {
        "label": "Category",
        "name": "applicationCategory",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "RECONCILIATION",
            "value": "reconciliation"
        }, {
            "label": "BACK-END",
            "value": "backend"
        }]
    },
    {
        "label": "Cloud Vendor",
        "name": "cloudVendor",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "AWS",
            "value": "aws"
        }, {
            "label": "GCP",
            "value": "gcp"
        }, {
            "label": "MS Azure",
            "value": "azure"
        }]
    },
    {
        "label": "Tech Stack",
        "name": "applicationTechStack",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "JAVA+ANGULAR",
            "value": "java+angular"
        }, {
            "label": "JAVA+REACT",
            "value": "java+react"
        }]
    },
    {
        "label": "Schema Type",
        "name": "applicationSchemaType",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "From Sample File",
            "value": "FROM_FILE"
        }, {
            "label": "From Database",
            "value": "FROM_DB"
        }, {
            "label": "Manual",
            "value": "manual"
        }]
    },
    {
        "label": "Application Version",
        "name": "applicationVersion",
        "dataType": "number",
        "inputType": "auto",
        "canDisplay": false,
        "canEdit": false,
        "isRequired": true,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": []
    },
    {
        "label": "Last Deployed",
        "name": "lastDeployed",
        "inputType": "date",
        "dataType": "date",
        "validationType": "date",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": false,
        "canExport": true,
        "canSort": true,
        "canFilter": true
    },
    {
        "label": "Application Metrics",
        "name": "metrics",
        "inputType": "text",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true
    },
    {
        "label": "Logs",
        "name": "logs",
        "inputType": "text",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true
    },
    {
        "label": "Scan Results",
        "name": "scanData",
        "inputType": "text",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true
    },
    {
        "label": "Created Time",
        "name": "createdOn",
        "inputType": "datetime",
        "dataType": "date",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": false,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": []
    },
    {
        "label": "Created User",
        "name": "createdBy",
        "inputType": "text",
        "dataType": "string",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": false,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": [],
        "options": []
    },
    {
        "label": "Modified Time",
        "name": "lastUpdated",
        "inputType": "datetime",
        "dataType": "date",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": false,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": []
    },
    {
        "label": "Modified User",
        "name": "modifiedUser",
        "inputType": "text",
        "dataType": "string",
        "canDisplay": true,
        "canEdit": false,
        "isRequired": false,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": [],
        "options": []
    }
    ],
    "display_order": [
        "applicationId",
        "applicationName",
        "applicationDesc",
        "applicationType",
        "applicationCategory",
        "cloudVendor",
        "applicationTechStack",
        "applicationSchemaType"
    ]
}

export const APP_CHART_CONFIG = {
    "service_path": "application-chart",
    "columns": [{
        "label": "Chart Id",
        "name": "chartId",
        "inputType": "auto",
        "dataType": "string",
        "canDisplay": false,
        "canEdit": false,
        "isRequired": true,
        "canExport": false,
        "canSort": true,
        "canFilter": true,
        "validations": []
    },
    {
        "label": "Chart Name",
        "name": "chartName",
        "inputType": "text",
        "dataType": "string",
        "hyperlink": 'app-details',
        "hyperlinkParams": ['applicationId'],
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "Chart Name field is required"
        },
        {
            "type": "min",
            "value": 5,
            "msg": "Chart Name cannot be less than 5 characters"
        },
        {
            "type": "max",
            "value": 100,
            "msg": "Chart Name cannot be more than 100 characters"
        }
        ]
    },
    {
        "label": "Chart Type",
        "name": "chartType",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "LINE CHART",
            "value": "line"
        }, {
            "label": "DOUGHNUT CHART",
            "value": "doughnut"
        }, {
            "label": "BAR CHART",
            "value": "bar"
        }
        ]
    },
    {
        "label": "Table Name",
        "name": "tableName",
        "inputType": "dropdown",
        "dataType": "string",
        "validationType": "string",
        "canDisplay": true,
        "canEdit": true,
        "isRequired": true,
        "canExport": true,
        "canSort": true,
        "canFilter": true,
        "validations": [{
            "type": "required",
            "msg": "this field is required"
        }],
        "options": [{
            "label": "TEST12",
            "value": "Test12"
        }, {
            "label": "BACK-END",
            "value": "backend"
        }]
    },
    ],
    "display_order": [
        "chartId",
        "chartName",
        "chartType",
        "tableName",
    ]
}