define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var drugsGrid = {};

    var drugsGridOptions = ko.observable();

    var drugId = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(drugsGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'Agents');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(drugsGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'Agents');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(drugsGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'Agents');
    };

    var deleteDrug = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {

                dataservice.deleteDrugsById(selectedRowId()).success(function () {
                });

                $.smallBox({
                    title: "Operation completed successfuly",
                    content: "<i class='fa fa-clock-o'></i> <i>Record deleted successfuly...</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 2000
                });

                selectedRowId(undefined);
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
        drugId(0);
        $('#drugsAddEdit').modal('show');
    };

    var activate = function () {
        drugsGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.name[config.currentLanguage()], 'name', 's'),
            new config.ExportColumn(config.language.description[config.currentLanguage()], 'description', 's'),
            new config.ExportColumn(config.language.code[config.currentLanguage()], 'code', 's'),
            new config.ExportColumn(config.language.price[config.currentLanguage()], 'price', 's'),
            new config.ExportColumn(config.language.section[config.currentLanguage()], 'sectionName', 's'),
            new config.ExportColumn(config.language.notes[config.currentLanguage()], 'notes', 's'),
            new config.ExportColumn(config.language.company[config.currentLanguage()], 'companyName', 's'),
            new config.ExportColumn(config.language.deletedBy[config.currentLanguage()], 'deletedBy', 's')];


        drugsGrid.columnDefs([
            drugsGrid.createColumnDefinition('name', config.language.name[config.currentLanguage()], 150, '20%', 'string'),
            drugsGrid.createColumnDefinition('description', config.language.description[config.currentLanguage()], 150, '20%', 'string'),
            drugsGrid.createColumnDefinition('code', config.language.code[config.currentLanguage()], 150, '20%', 'string'),
            drugsGrid.createColumnDefinition('price', config.language.price[config.currentLanguage()], 150, '20%', 'int'),
            drugsGrid.createColumnDefinition('notes', config.language.notes[config.currentLanguage()], 150, '20%', 'string'),
            drugsGrid.createColumnDefinition('sectionName', config.language.section[config.currentLanguage()], 150, '20%', 'string'),
            drugsGrid.createColumnDefinition('companyName', config.language.company[config.currentLanguage()], 150, '20%', 'string'),
            drugsGrid.createColumnDefinition('deletedBy', config.language.deletedBy[config.currentLanguage()], 150, '20%', 'string')
        ]);

        drugsGrid.gridSelectionChange(function (rowItem, event) {
            if (event.target.type && (event.target.type.toLowerCase() === 'checkbox')) {
                if (rowItem.selected()) {
                    selectedRowId(rowItem.entity.id);
                    return true;
                } else {
                    selectedRowId(undefined);
                    return true;
                }
            } else {
                if (event.target.type) {
                    if (event.target.type !== 'button') {
                        router.navigate("drugsAddEdit/" + rowItem.entity.id);
                    }
                }
            }
        });


        drugsGridOptions(drugsGrid.getGridOptions()());


        dataservice.getDrugs().done(function (data) {
            drugsGrid.setInitialData(data);
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

    }

    var vm = {
        drugsGrid: drugsGrid,
        drugsGridOptions: drugsGridOptions,
        selectedRowId: selectedRowId,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        deleteDrug: deleteDrug,
        add: add,
        activate: activate,
        attached: attached,
        language: config.language,
        currentLanguage: config.currentLanguage,
        drugId: drugId
}

    return vm;
});