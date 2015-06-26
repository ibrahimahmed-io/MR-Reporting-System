define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'distributers');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'distributers');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'distributers');
    };

    var add = function (obj, e) {
        router.navigate("distributerAdd/" + 0);
    };

    var deleteAccount = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {

                dataservice.deleteDistributers(selectedRowId()).success(function () {
                    //  $("#accounts").jqxGrid('deleterow', selectedRowId());
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record deleted successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                });


                selectedRowId(null);
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

    function compositionComplete() {
        $(".fixed-action-btn").tooltip({ container: 'body' });

    };

    var distributers = ko.observableArray();

    function activate() {

        knockoutGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.name[config.currentLanguage()], 'name', 's'), 
            new config.ExportColumn(config.language.Address[config.currentLanguage()], 'address', 'n'),
            new config.ExportColumn(config.language.area[config.currentLanguage()], 'areaName', 's'),
            new config.ExportColumn(config.language.Telephone[config.currentLanguage()], 'phone', 's'),
            new config.ExportColumn(config.language.code[config.currentLanguage()], 'code', 's'),
            new config.ExportColumn(config.language.noOfVisits[config.currentLanguage()], 'noOfVisits', 's')];


        knockoutGrid.columnDefs([
               knockoutGrid.createColumnDefinition('name', config.language.name[config.currentLanguage()], 65, '20%', 'string'), 
                  knockoutGrid.createColumnDefinition('address', config.language.Address[config.currentLanguage()], 150, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('areaName', config.language.area[config.currentLanguage()], 50, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('noOfVisits', 'No Of Visits', 150, '5%', 'int'),
                  knockoutGrid.createColumnDefinition('phone', config.language.Telephone[config.currentLanguage()], 150, '15%', 'string'), 
                  knockoutGrid.createColumnDefinition('code', config.language.code[config.currentLanguage()], 150, '5%', 'string')
        ]);

        knockoutGrid.gridSelectionChange(function (rowItem, event) {
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

                        router.navigate("distributerAdd/" + rowItem.entity.id);
                    }
                } else if (event.target.parentElement.type) {
                    if (event.target.parentElement.type !== 'button') {
                        router.navigate("distributerAdd/" + rowItem.entity.id);
                    }
                } else {
                    router.navigate("distributerAdd/" + rowItem.entity.id);
                }
            }
        });


        gridOptions(knockoutGrid.getGridOptions()());


        dataservice.getDistributers().done(function (data) {

            knockoutGrid.setInitialData(data);

            distributers(data);

            $(".loading-data").addClass("hidden");
        });
    };

    var vm = {
        title: 'Hospitals',
        activate: activate,
        gridOptions: gridOptions,
        compositionComplete: compositionComplete,
        language: config.language,
        currentLanguage: config.currentLanguage,
        add: add,
        deleteAccount: deleteAccount,
        distributers: distributers,
        selectedRowId: selectedRowId,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf
    };

    return vm;
});