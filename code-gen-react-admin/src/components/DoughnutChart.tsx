
import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import './DoughnutChartStyles.css';

export const DoughnutChart = (props: any) => {

    const [chartData, setChartData] = useState({})
    const { stats } = props

    const bgColors: string[] = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
    ]
    const hoverColors: string[] = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
    ]

    useEffect(() => {
        let labels = Object.keys(stats || {})
        let data = []
        let i = 0
        let backgroundColor: string[] = []
        let hoverBackgroundColor: string[] = []
        for (const label of labels) {
            data.push(stats[label])
            backgroundColor.push(bgColors[i])
            hoverBackgroundColor.push(hoverColors[i++])
        }
        setChartData({ labels: labels, datasets: [{ data: data, backgroundColor: backgroundColor, hoverBackgroundColor: hoverBackgroundColor }] })
    }, [props])

    const [lightOptions] = useState({ plugins: { legend: { position: 'right' } } });


    return (
        <div>
            <Card className='doughnut-chart-card'>
                <Chart type="doughnut" data={chartData} options={lightOptions} style={{ position: 'relative', width: '19vw', height: '200px' }} />
            </Card>
        </div>
    )
}
