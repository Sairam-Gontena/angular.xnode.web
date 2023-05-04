import ApplicationManager from "./ApplicationManager"
import './DashboardStyles.css';
import { CommonLineChart } from "../components/CommonLineChart";
import { DoughnutChart } from "../components/DoughnutChart";
import CardSummary from "./CardSummary";
import { MenubarComponent } from "../components/MenubarComponent";
import { useEffect, useState } from "react";
import { CommonService } from "react-codegen-comp";

// import { CommonService } from '../components'

const Dashboard = (props: any) => {
    let service = new CommonService('clients/summary')
    let [stats, setStats] = useState<any>({})

    useEffect(() => {
        service.getList({ clientId: 1 }).then((resp: any) => {
            setStats(resp)
        })
    }, [props])

    return (
        <>
            <MenubarComponent></MenubarComponent>
            <div className="bg-lightgrey p-4 pt-0">
                <h1 className="title">Dashboard</h1>
                <div className="pb-4">
                    <CardSummary stats={stats}></CardSummary>
                    <div className="grid m-0">
                        <div className="col-12 md:col-8 lg:col-8">
                            <CommonLineChart></CommonLineChart>
                        </div>
                        <div className="col-12 md:col-4 lg:col-4">
                            <DoughnutChart stats={stats.statusCounts}></DoughnutChart>
                        </div>
                    </div>
                </div>
                <ApplicationManager></ApplicationManager>
            </div>
        </>
    )
}

export default Dashboard