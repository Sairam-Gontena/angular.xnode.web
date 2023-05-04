export const SCHEMA_CONFIG = {
    "service_path": "schema",
    "columns": [{
        "label": "Table Name",
        "name": "tableName",
        "inputType": "text",
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
            "msg": "Table Name field is required"
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
        "name": "tableDescription",
        "inputType": "textarea",
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
            "msg": "Description field is required"
        },
        {
            "type": "max",
            "value": 100,
            "msg": "Description cannot be more than 100 characters"
        }
        ]
    }, {
        "label": "Menu Title",
        "name": "menuTitle",
        "inputType": "textarea",
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
            "msg": "Description field is required"
        },
        {
            "type": "max",
            "value": 100,
            "msg": "Description cannot be more than 100 characters"
        }
        ]
    }, {
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
    ]
}