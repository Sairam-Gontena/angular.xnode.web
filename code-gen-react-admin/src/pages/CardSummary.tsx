import { Card } from 'primereact/card'
import { ProgressBar } from 'primereact/progressbar';
import './DashboardStyles.css';

const CardSummary = (props: any) => {
    const { stats } = props

    return (
        <div className="grid m-0">
            <div className='col-12 md:col-6 lg:col-3'>
                <Card className="stats-card">
                    <div className="flex align-items-center justify-content-between mr-3">
                        <div className="text-left ml-4">
                            <p className="stats-title">NO. OF PROJECTS</p>
                            <p className="m-0 stats-desc" style={{ lineHeight: '1.5' }}>{stats.numApplications}</p>
                        </div>
                        <i className={`pi pi-file pi-file text-xl ml-4`} />
                    </div>
                </Card>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <Card className="stats-card">
                    <div className="flex align-items-center justify-content-between mr-3">
                        <div className="text-left ml-4">
                            <p className="stats-title">EXPENDITURE</p>
                            <p className="m-0 stats-desc" style={{ lineHeight: '1.5' }}>${stats.expenditure || 0}</p>
                        </div>
                        <i className={`pi pi-money-bill pi-file text-xl ml-4`} />
                    </div>
                </Card>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <Card className="stats-card">
                    <div className="flex align-items-center justify-content-between mr-3">
                        <div className="text-left ml-4">
                            <p className="stats-title">PRODUCTION DEPLOYED</p>
                            <div className="m-0 stats-desc" style={{ lineHeight: '1.5' }}>
                                <div className='flex align-items-center'>
                                    <p className='stats-desc pr-2'>{stats.numDeployed}%</p>
                                    <ProgressBar value={50} className="override-progressbar"></ProgressBar>
                                </div>
                            </div>
                        </div>
                        <i className={`pi pi-cloud-upload pi-file text-xl ml-4`} />
                    </div>
                </Card>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <Card className="stats-card">
                    <div className="flex align-items-center justify-content-between mr-3">
                        <div className="text-left ml-4">
                            <p className="stats-title">TIME SPENT(HOURS)</p>
                            <p className="m-0 stats-desc" style={{ lineHeight: '1.5' }}>{stats.numMinSpent}</p>
                        </div>
                        <i className={`pi pi-calendar pi-file text-xl ml-4`} />
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CardSummary
