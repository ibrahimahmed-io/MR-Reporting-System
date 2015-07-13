define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var orderGrid = {};

    var orderGridOptions = ko.observable();

    var orderId = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(orderGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'Agents');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(orderGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'Agents');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(orderGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'Agents');
    };

    var deleteVisit = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {
                dataservice.deleteOrders(selectedRowId()).success(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record deleted successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });

                    orderGrid.deleteRow(data);

                    selectedRowId(undefined);
                });
            }
            if (buttonPressed === "No") {
                $.smallBox({
                    title: "Operation was canceled",
                    content: "<i class='fa fa-clock-o'></i> <i>Canceled delete...</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 2000
                });
            }
        });

    };

    var add = function (obj, e) {
        orderId(0);
        $('#ordersAddEdit').modal('show');
    };

    var activate = function () {
        orderGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.agent[config.currentLanguage()], 'agentName', 's'), 
            new config.ExportColumn(config.language.type[config.currentLanguage()], 'orderTypeName', 's'),
            new config.ExportColumn(config.language.client[config.currentLanguage()], 'clientName', 's'),
            new config.ExportColumn(config.language.orderDate[config.currentLanguage()], 'orderDate', 'd'),
            new config.ExportColumn(config.language.estimateDate[config.currentLanguage()], 'estimateDate', 's'),
            new config.ExportColumn(config.language.subject[config.currentLanguage()], 'subject', 's'),
            new config.ExportColumn(config.language.total[config.currentLanguage()], 'netTotal', 's'),
            new config.ExportColumn(config.language.supervisorStatus[config.currentLanguage()], 'supervisorStatus', 's'),
            new config.ExportColumn(config.language.lastEditBy[config.currentLanguage()], 'lastEditByName', 's'),
            new config.ExportColumn(config.language.lastEditDate[config.currentLanguage()], 'lastEditDate', 'd'),
            new config.ExportColumn(config.language.creationDate[config.currentLanguage()], 'creationDate', 'd')];


        orderGrid.columnDefs([
            orderGrid.createColumnDefinition('agentName', config.language.agent[config.currentLanguage()], 150, '10%', 'string'),
            orderGrid.createColumnDefinition('clientName', config.language.client[config.currentLanguage()], 150, '15%', 'string'),
            orderGrid.createColumnDefinition('subject', config.language.subject[config.currentLanguage()], 150, '20%', 'string'),
            orderGrid.createColumnDefinition('orderDate', config.language.orderDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
            orderGrid.createColumnDefinition('supervisorStatus', config.language.supervisorStatus[config.currentLanguage()], 150, '10%', 'status'),
            orderGrid.createColumnDefinition('ready', config.language.ready[config.currentLanguage()], 150, '10%', 'ready'),
            orderGrid.createColumnDefinition('deliverdStatus', config.language.deliverdStatus[config.currentLanguage()], 150, '10%', 'deliverd'),
            orderGrid.createColumnDefinition('estimateDate', config.language.estimateDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
            orderGrid.createColumnDefinition('deliverdDate', config.language.visitDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
            orderGrid.createColumnDefinition('netTotal', config.language.total[config.currentLanguage()], 150, '5%', 'string'),
            orderGrid.createColumnDefinition('orderTypeName', config.language.type[config.currentLanguage()], 150, '10%', 'string'),
            orderGrid.createColumnDefinition('supervisorDate', config.language.supervisorDate[config.currentLanguage()], 150, '15%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
            orderGrid.createColumnDefinition('lastEditName', config.language.lastEditBy[config.currentLanguage()], 150, '15%', 'string'),
            orderGrid.createColumnDefinition('lastEditDate', config.language.lastEditDate[config.currentLanguage()], 150, '15%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') })
        ]);

        orderGrid.gridSelectionChange(function (rowItem, event) {
            if (event.target.type && (event.target.type.toLowerCase() === 'checkbox')) {
                if (rowItem.selected()) {
                    selectedRowId(rowItem.entity.id);
                    return true;
                } else {
                    selectedRowId(undefined);
                    return true;
                }
            } else {
                orderId(rowItem.entity.id);
                $('#ordersAddEdit').modal('show');
            }
        });


        orderGridOptions(orderGrid.getGridOptions()());


        dataservice.getOrders().done(function (data) {
            orderGrid.setInitialData(data);
        });
    }

    var attached = function() {
        $('#widget-grid').jarvisWidgets({
            grid: 'article',
            widgets: '.jarviswidget',
            buttonsHidden: false,
            // toggle button
            toggleButton: true,
            toggleClass: 'fa fa-minus | fa fa-plus',
            toggleSpeed: 200,
            // color button
            colorButton: true,
            // full screen
            fullscreenButton: true,
            fullscreenClass: 'fa fa-expand | fa fa-compress',
            fullscreenDiff: 3,
            buttonOrder: '%toggle% %fullscreen%',
            opacity: 1.0,
            dragHandle: '> header',
            placeholderClass: 'jarviswidget-placeholder'
        });

        $('#visitsAddEdit').on('hide.bs.modal', function (e) {
            dataservice.getVisits().done(function (data) {
                orderGrid.setInitialData(data);
            });
        });
    }

    var vm = {
        orderGrid: orderGrid,
        orderGridOptions: orderGridOptions,
        selectedRowId: selectedRowId,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        deleteVisit: deleteVisit,
        add: add,
        activate: activate,
        attached: attached,
        language: config.language,
        currentLanguage: config.currentLanguage,
        orderId: orderId
}

    return vm;
});