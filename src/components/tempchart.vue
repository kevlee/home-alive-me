<template>
    <div id="chartcontainer" >
        <canvas id="myChart">{{chartdata}}</canvas>
    </div>
</template>

<script>
    import Chart from "chart.js"
    import * as tools from '../../lib/tools.js'


    let ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js");
    document.head.appendChild(ckeditor);

    ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', "https://unpkg.com/vue-chartjs/dist/vue-chartjs.min.js");
    document.head.appendChild(ckeditor);


    /*document.addEventListener('DOMContentLoaded', (() => {
        console.log(document.getElementById('myChart'))
        if (document.readyState == "complete") { 
            createchart()
            console.log('loading data')
        }
    }))*/

    async function createchart() {


        const body = await tools.gettempdata()

        var datachar = []
        for (var keys in body) {
            for (var value in body[keys]) {
                datachar.push({
                    x: body[keys][value].date,
                    y: body[keys][value].value
                })
            }
        }

        console.log(datachar)

        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: Object.keys(body)[0],
                    data: datachar,
                    backgroundColor: 
                        'rgba(255, 99, 132, 0.2)',
                    borderColor:
                        'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            suggestedMax: 30,
                            beginAtZero: true
                        }
                    }
                    ]
                }
            }
        });

        myChart.resize()
    }

    export default {
        name: 'tempchart',
        computed: {
            chartdata: function () { createchart() }
        }

    }

</script>

<style scoped>
    #chartcontainer {
        display: block;
        height: 50%;
        width: 50%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 2;

    }
</style>