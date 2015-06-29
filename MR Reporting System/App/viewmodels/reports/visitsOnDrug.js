define(['services/dataservice', 'config'], function (dataservice, config) {
    var chartOptions = ko.observable();
    var chartData = ko.observableArray([]);

    var options = {
        chart: {
            zoomType: 'x',
            type: 'column'
        },

        title: {
            text: 'Visits on Drug Report'
        },

        subtitle: {
            text: 'Medical Reporting System'
        },

        xAxis: {
            categories: [
                'Number Of Visits'
            ],
            crosshair: true
        },

        yAxis: [{
            min: 0,
            title: {
                text: 'Visits'
            }
        }],

        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },

        series: [{
            name: 'Doctors'

        }, {
            name: 'Hospitals'

        }, {
            name: 'Pharmacies'
        }, {
            type: 'pie',
            name: 'Visit Count',
            data: [],
            center: [75, 55],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    };

    var drugs = ko.observableArray();

    var selectedDrugId = ko.observable();

    selectedDrugId.subscribe(function(value) {
        dataservice.getVisitsForDrugReport(undefined, value).done(function (data) {
            if (data) {
                options.series[0].data = [data['doctors']];
                options.series[1].data = [data['hospitals']];
                options.series[2].data = [data['pharmacies']];

                chartOptions(options);
                chartData(data);

                dataservice.getVisitsMorningCountForDrugReport(undefined, value).done(function (data) {
                    if (data) {
                        options.series[3].data = [];

                        options.series[3].data.push(['Morning', data.morning]);
                        options.series[3].data.push(['Late', data.late]);

                        chartOptions(options);
                        chartData(data);
                    }
                });
            }
        });
    });

    var activate = function() {
        dataservice.getDrugs().success(function(data) {
            drugs(data);
        });
    };

    var vm = {
        activate: activate,
        chartData: chartData,
        chartOptions: chartOptions,
        selectedDrugId: selectedDrugId,
        drugs: drugs,
        language: config.language,
        currentLanguage: config.currentLanguage
    };

    return vm;
});