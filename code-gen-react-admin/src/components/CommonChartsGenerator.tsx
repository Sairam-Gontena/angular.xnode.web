import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import './CommonLineChartStyles.css';
import './DoughnutChartStyles.css';
import { chartControl } from './Control.types';

const CommonChartsGenerator = (props: any) => {

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1.3,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    }

    const constructCharts = (chartControl: chartControl) => {
        switch (chartControl.chartType) {
            case 'line': return (
                <div className="col-12 md:col-8 lg:col-8">
                    <Card className='line-chart-card'>
                        <Chart type={chartControl.chartType} data={chartControl.chartData} options={chartOptions} />
                    </Card>
                </div>
            )
            case 'doughnut': return (
                <div className="col-12 md:col-4 lg:col-4">
                    <Card className='doughnut-chart-card'>
                        <Chart type={chartControl.chartType} data={chartControl.chartData} options={chartOptions} />
                    </Card>
                </div>
            )
            case 'bar': return (
                <div className="col-12 md:col-4 lg:col-4">
                    <Card className='doughnut-chart-card'>
                        <Chart type={chartControl.chartType} data={chartControl.chartData} options={chartOptions} />
                    </Card>
                </div>
            )
            default: return null;
        }
    }

    return (
        <div className="grid m-0">
            {props.charts.map((chart: any) => { return constructCharts(chart) })}
        </div>
    )
}

export default CommonChartsGenerator