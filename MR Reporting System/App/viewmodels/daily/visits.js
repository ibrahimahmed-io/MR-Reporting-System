define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var visitsGrid = {};

    var visitsGridOptions = ko.observable();

    var visitId = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(visitsGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'Agents');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(visitsGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'Agents');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(visitsGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'Agents');
    };

    var deleteVisit = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {
                dataservice.deleteVisits(selectedRowId()).success(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record deleted successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });

                    visitsGrid.deleteRow(data);

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
        visitId(0);
        $('#visitsAddEdit').modal('show');
    };

    var activate = function () {
        visitsGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.agent[config.currentLanguage()], 'agentName', 's'),
            new config.ExportColumn(config.language.drug[config.currentLanguage()], 'drugsName', 's'),
            new config.ExportColumn(config.language.type[config.currentLanguage()], 'typeName', 's'),
            new config.ExportColumn(config.language.visitee[config.currentLanguage()], 'visitToName', 's'),
            new config.ExportColumn(config.language.visitDate[config.currentLanguage()], 'visitDate', 'd'),
            new config.ExportColumn(config.language.duration[config.currentLanguage()], 'duration', 's'),
            new config.ExportColumn(config.language.description[config.currentLanguage()], 'description', 's'),
            new config.ExportColumn(config.language.isMorning[config.currentLanguage()], 'isMorning', 's'),
            new config.ExportColumn(config.language.notes[config.currentLanguage()], 'notes', 's'),
            new config.ExportColumn(config.language.lastEditBy[config.currentLanguage()], 'lastEditByName', 's'),
            new config.ExportColumn(config.language.lastEditDate[config.currentLanguage()], 'lastEditDate', 'd'),
            new config.ExportColumn(config.language.creationDate[config.currentLanguage()], 'creationDate', 'd')];


        visitsGrid.columnDefs([
            visitsGrid.createColumnDefinition('agentName', config.language.agent[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('drugsName', config.language.drug[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('typeName', config.language.type[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('visitToName', config.language.visitee[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('visitDate', config.language.visitDate[config.currentLanguage()], 150, '20%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
            visitsGrid.createColumnDefinition('duration', config.language.duration[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('description', config.language.description[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('isMorning', config.language.isMorning[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('notes', config.language.notes[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('lastEditByName', config.language.lastEditBy[config.currentLanguage()], 150, '20%', 'string'),
            visitsGrid.createColumnDefinition('lastEditDate', config.language.lastEditDate[config.currentLanguage()], 150, '20%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
            visitsGrid.createColumnDefinition('creationDate', config.language.creationDate[config.currentLanguage()], 150, '20%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') })
        ]);

        visitsGrid.gridSelectionChange(function (rowItem, event) {
            if (event.target.type && (event.target.type.toLowerCase() === 'checkbox')) {
                if (rowItem.selected()) {
                    selectedRowId(rowItem.entity.id);
                    return true;
                } else {
                    selectedRowId(undefined);
                    return true;
                }
            } else {
                visitId(rowItem.entity.id);
                $('#visitsAddEdit').modal('show');
            }
        });


        visitsGridOptions(visitsGrid.getGridOptions()());


        dataservice.getVisits().done(function (data) {
            visitsGrid.setInitialData(data);
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
                visitsGrid.setInitialData(data);
            });
        });
    }

    var vm = {
        visitsGrid: visitsGrid,
        visitsGridOptions: visitsGridOptions,
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
        visitId: visitId
}

    return vm;
});