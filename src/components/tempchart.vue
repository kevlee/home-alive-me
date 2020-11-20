<template>
    <div id="chartcontainer">
        <canvas id="myChart"></canvas>
    </div>
</template>

<script>
    import Chart from "chart.js"



    let ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js");
    document.head.appendChild(ckeditor);

    ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', "https://unpkg.com/vue-chartjs/dist/vue-chartjs.min.js");
    document.head.appendChild(ckeditor);


    window.onload = (() => { createchart() })

    async function createchart() {

        const url = "http://localhost/tempstat/?nodeuid=600-4237-3"
        const payload = 
            {
                method: "GET",
                cache: "default",
                headers: {
                    'Accept-Type': 'application/json'
                }
            }
        const response = await fetch(url, payload)
        const contentType = response.headers.get("content-type");
        let body
        if (contentType && contentType.indexOf("application/json") !== -1) {
            body = await response.json()
        } else {
            console.log("Oops, nous n'avons pas du JSON!");
        }


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
        name: 'tempchart'
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