
import { useState } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import './CommonLineChartStyles.css';

export const CommonLineChart = () => {
    const [basicData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Expenditure Overview',
                data: [5, 10, 8, 16, 12, 25, 30],
                fill: false,
                borderColor: '#42A5F5',
                tension: .4
            },
        ]
    });

    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .6,
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
        };

        return {
            basicOptions,
        }
    }

    const { basicOptions } = getLightTheme();

    return (
        <div>
            <Card className='line-chart-card'>
                <Chart type="line" data={basicData} options={basicOptions} />
            </Card>
        </div>
    )
}
