import React from "react";
import ApexCharts from "apexcharts";
import useUtils from "../../hooks/useUtils";

export default function CategoriesDoughnut({type = 'expense', categoriesData}) {
    const utils = useUtils();

    React.useEffect(() => {
        const options: ApexCharts.ApexOptions = {
            series: categoriesData.map(c => c.amount),
            labels: categoriesData.map(c => c.name),
            chart: {
                width: 385,
                type: 'donut',
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 270,
                    donut: {
                        labels: {
                            show: true,
                            value: {
                                formatter(val: string): string {
                                    return utils.formatShortCurrency(parseInt(val))
                                }
                            }
                        }
                    }
                }
            },
            dataLabels: {
                enabled: false,
            },
            colors: categoriesData.map(c => c.color),
            fill: {
                colors: categoriesData.map(c => c.color)
            },
            legend: {
                formatter: function(val, opts) {
                    return categoriesData[opts.seriesIndex].name /*+ ' - ' + utils.formatShortCurrency(categoriesData[opts.seriesIndex].amount)*/
                }
            },
            // title: {
            //     text: 'By Amoun'
            // },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        const chart = new ApexCharts(document.querySelector(`#${type}_categories_chart`), options);

        chart.render();
    }, []);
    return <div id={`${type}_categories_chart`}></div>;
}