define(['services/dataservice', 'config'], function (dataservice, config) {
    var chartOptions = ko.observable();

    var myData = ko.observableArray();
    var myHeaders = ko.observableArray();

    var chartData = ko.observableArray([]);

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var options = {
        chart: {
            zoomType: 'x',
            type: 'column'
        },

        title: {
            text: 'Pereformance Of Agent'
        },

        subtitle: {
            text: 'Medical Reporting System'
        },

        xAxis: {
            categories: []
        },

        yAxis: [{
            min: 0,
            title: {
                text: 'total'
            }
        }],

        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">total : </td>' +
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

        series: []

    };

    var agents = ko.observableArray();

    var selectedAgentId = ko.observable();

    selectedAgentId.subscribe(function (value) {
        dataservice.getTotalByAgentId(value).done(function (data) {
            if (data) {
                var count = 0;
                var series = { data: [] };

                ko.utils.arrayForEach(ko.toJS(data), function (item) {

                    myData.push([item.total, item.monthName]);
                   
                    options.xAxis.categories.push(item.monthName);

                    series.data.push(item.total);
                });
                 

                options.series.push(series);

                chartOptions(options);

                chartData(data);

                dataservice.getTargetByAgentId(value).done(function (result) {
                    if (result) {

                        knockoutGrid.setInitialData(result);

                        $(".loading-data").addClass("hidden");
                    }
                });


            }
        });
    });

    var activate = function () {

        dataservice.getAccounts().success(function (data) {
            agents(data);
        });

        knockoutGrid = new config.KoGridInstanceCreator();


        knockoutGrid.columnDefs([
                  knockoutGrid.createColumnDefinition('monthName', 'Month', 200, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('agentName', config.language.ContactName[config.currentLanguage()], 155, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('equipment', config.language.drugName[config.currentLanguage()], 200, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('equipmentCode', config.language.code[config.currentLanguage()], 150, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('total', config.language.total[config.currentLanguage()], 50, '12%', 'int')
        ]);

        knockoutGrid.displaySelectionCheckbox(false);

        gridOptions(knockoutGrid.getGridOptions()());

    };

    var vm = {
        activate: activate,
        chartData: chartData,
        gridOptions: gridOptions,
        chartOptions: chartOptions,
        selectedAgentId: selectedAgentId,
        agents: agents,
        language: config.language,
        currentLanguage: config.currentLanguage
    };

    return vm;
});