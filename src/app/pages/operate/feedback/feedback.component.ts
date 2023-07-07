import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'xnode-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

    data: any;
    doughnutData: any;
    doughnutOptions: any;
    options: any;
    getconfigureLayout: any;
    getOperateLayout: any;
    layout: any;
    dashboard: any = 'Overview';
    layoutColumns: any;
    templates: any;
    selectedTemplate = localStorage.getItem("app_name");
    highlightedIndex: string | null = null;
    operateLayout: any;
    ngOnInit(): void {

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--primary-color-text');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data = {
            labels: ['13-05-23', '14-05-23', '15-05-23', '16-05-23', '17-05-23', '18-05-23', '19-05-23', '20-05-23'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Very Satisfied',
                    backgroundColor: documentStyle.getPropertyValue('#44B347'),
                    data: [0, 0, 0, 0, 0, 0, 1.5]
                },
                {
                    type: 'bar',
                    label: 'Satisfied',
                    backgroundColor: documentStyle.getPropertyValue('#845AE6'),
                    data: [0, 0, 0, 0, 0, 0, 0.4]
                },
                {
                    type: 'bar',
                    label: 'Unsatisfied',
                    backgroundColor: documentStyle.getPropertyValue('#F99369'),
                    data: [0, 0, 0, 0, 0, 0, 0.4,]
                },
                {
                    type: 'bar',
                    label: 'Very Unsatisfied',
                    backgroundColor: documentStyle.getPropertyValue('#F3778B'),
                    data: [0, 0, 0, 0, 0, 0, 0.4,]
                },
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: textColorSecondary,
                        drawBorder: false
                    }
                }
            }
        };
        // doughnut chart
        const documentStyleColor = getComputedStyle(document.documentElement);
        const textColors = documentStyle.getPropertyValue('--text-color');

        this.doughnutData = {
            labels: ['A'],
            datasets: [
                {
                    data: [100, 67],
                    backgroundColor: ['#7652D4', '#24232C'],
                    hoverBackgroundColor: [documentStyleColor.getPropertyValue('#7652D4')]
                }
            ]
        };
        this.doughnutOptions = {
            cutout: '60%',
            circumference: 180,
            rotation: 270,
            plugins: {
                legend: false,
                centertext: "67%"

            },
        };
    }
    getLayout(layout: any): void {
        console.log(layout);
        this.dashboard = layout;
    }
    emitIconClicked(icon: string) {
        if (this.highlightedIndex === icon) {
            this.highlightedIndex = null;
        } else {
            this.highlightedIndex = icon;
        }
    }
    openNewTab(): void {
        window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
    }

}
