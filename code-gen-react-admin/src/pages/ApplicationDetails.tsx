import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { CommonTable, Control, CommonService } from 'react-codegen-comp';
import { SCHEMA_CONFIG } from './ApplicationDetails.conf';
import SchemaDetails from './SchemaDetails';
import { Button } from 'primereact/button';
import { MenubarComponent } from '../components/MenubarComponent';
import './ApplicationDetailsStyles.css';
import { Toast } from 'primereact/toast';
import ManageCharts from './ManageCharts';

const ApplicationDetails = () => {
    let [headers, setHeaders] = useState<Control[]>([])
    const [searchParams] = useSearchParams();
    const [appDetails, setAppDetails] = useState<any>({})
    const [schemaList, setSchemaList] = useState<any[]>([])
    const toast = useRef<any>(null);
    let [display, setDisplay] = useState(false);
    let [selectedRow, setSelectedRow] = useState<any>({})
    let service = new CommonService("applications");
    let [applicationId, setApplicationId] = useState<any>()

    useEffect(() => {
        setApplicationId(searchParams.get('applicationId'))
        let entity = SCHEMA_CONFIG
        let headers = []
        if (entity && entity.columns) {
            for (const column of entity.columns) {
                if (column.canDisplay) {
                    headers.push(column)
                }
            }
            setHeaders(headers)
        }
        service.getList({}, 'applications/' + searchParams.get('applicationId')).then(resp => {
            setAppDetails(resp)
        })
        service.getList({}, 'schema/list/' + searchParams.get('applicationId')).then(resp => {
            setSchemaList(resp)
        })
    }, [])

    const onGridAction = (action: string, row: any) => {
        let sRow = { ...row }
        if (row.columnInfo) {
            sRow.columnInfo = JSON.parse(row.columnInfo)
        }
        setSelectedRow(sRow)
        switch (action) {
            case "EDIT":
            case "NEW":
                setDisplay(true)
                break;
            case "DELETE": {
                let _items = schemaList.filter((val: any) => row.schemaId !== val.schemaId);
                service.delete(row.schemaId, 'schema').then((resp) => {
                    setSchemaList(_items);
                })
            }
                break;
            default:
                break;
        }
    }

    const onFormAction = (action: string, row: any) => {
        switch (action) {
            case 'SAVE': {
                console.log(row, 'row');
                if (row.schemaId) {
                    row['columnInfo'] = JSON.stringify(row['columnInfo'])
                    let schema = { ...row }
                    delete schema.application_id
                    service.put({ schema: schema, applicationId: applicationId }, row.schemaId, 'schema').then((resp) => {
                        schemaList.forEach((schema, i) => {
                            if (row.schemaId === schema.schemaId) {
                                schemaList[i] = resp;
                            }
                        })
                        setSchemaList([...schemaList])
                    })
                } else {
                    row['application_id'] = applicationId;
                    row['columnInfo'] = JSON.stringify(row['columnInfo'])
                    let schema = { ...row }
                    delete schema.application_id

                    service.post({ schema: schema, applicationId: applicationId }, 'schema').then((resp) => {
                        setSchemaList([...schemaList, resp])
                    })
                }

                setDisplay(false)
                break;
            }
            default:
                break;
        }
    }

    const header = <div className="table-header app-table">MANAGE TABLES</div>

    const generateApplication = () => {
        service.post({}, 'project/create/' + applicationId).then((resp) => {
            if (toast && toast.current) {
                toast.current.show({ severity: 'success', summary: 'Application Created Successfully', detail: 'Application Created Successfully', life: 3000 });
            }
            console.log('Project creation:', resp);
        })
    }

    return (
        <div>
            <Toast ref={toast} />
            <MenubarComponent></MenubarComponent>
            <Accordion className='override-accordion'>
                <AccordionTab header={appDetails.applicationName}>
                    <div className='grid'>
                        <p className='col-3'><label className='font-bold'> Application Type: </label> {appDetails.applicationType}</p>
                        <p className='col-3'><label className='font-bold'> Schema Type: </label> {appDetails.applicationSchemaType}</p>
                        <p className='col-3'><label className='font-bold'> Application Category: </label> {appDetails.applicationCategory}</p>
                        <p className='col-3'><label className='font-bold'> Application Status: </label> {appDetails.applicationStatus}</p>
                    </div>
                </AccordionTab>
            </Accordion>
            <div className="flex align-items-center justify-content-between m-3 mt-0 mb-0">
                <h1 className="title">Table Details</h1>
                <Button label="Generate Project" icon="pi pi-play" className="p-button-text primary-btn" onClick={generateApplication} />
            </div>
            <div className="m-3">
                <CommonTable headers={headers} items={schemaList} hasExport={true} onAction={onGridAction} isReadOnly={false} headerTemplate={header} />
                <SchemaDetails display={display} onAction={onFormAction} selectedRow={selectedRow} setDisplay={setDisplay}></SchemaDetails>
            </div>
            <div className="m-3">
                <ManageCharts></ManageCharts>
            </div>
        </div>
    )
}

export default ApplicationDetails