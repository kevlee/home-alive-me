<template>
    <div id="chartcontainer">
        <canvas id="myChart"></canvas>
    </div>
</template>

<script>
    import Chart from "chart.js";
    import Request from "request"



    let ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js");
    document.head.appendChild(ckeditor);

    ckeditor = document.createElement('script');
    ckeditor.setAttribute('src', "https://unpkg.com/vue-chartjs/dist/vue-chartjs.min.js");
    document.head.appendChild(ckeditor);


    window.onload = (() => { createchart() })

    async function createchart() {

        const request = new Request(
            "http://localhost/tempstat/?nodeuid=600-4237-3",
            {
                method: "GET",
                cache: "default"
            }
        )
        console.log(request)
        const res = await fetch(request)
        console.log(res)
        const data = await res.json()
        alert(data)

        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
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
        display: flex;
        top: 40%;
        left: 10%;
        height: 400px;
        width: 400px;
        z-index: 2;
        position: relative;
    }
</style>