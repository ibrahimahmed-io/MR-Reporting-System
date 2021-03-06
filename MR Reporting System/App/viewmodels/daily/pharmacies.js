﻿define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var account = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'Pharmacies');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'Pharmacies');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'Pharmacies');
    };

    var add = function (obj, e) {
        router.navigate("pharmacyAdd/" + 0);
    };

    var deleteAccount = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {

                dataservice.deletePharmacies(selectedRowId()).success(function () {
                    //$("#accounts").jqxGrid('deleterow', selectedRowId());
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

    function activate() {

        knockoutGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.ContactName[config.currentLanguage()], 'name', 's'),
            new config.ExportColumn(config.language.ownerName[config.currentLanguage()], 'ownerName', 's'),
            new config.ExportColumn(config.language.Address[config.currentLanguage()], 'address', 'n'),
            new config.ExportColumn(config.language.ownerPhone[config.currentLanguage()], 'ownerPhone', 's'),
            new config.ExportColumn(config.language.Telephone[config.currentLanguage()], 'phone', 's'),
            new config.ExportColumn(config.language.email[config.currentLanguage()], 'email', 's')];


        knockoutGrid.columnDefs([
               knockoutGrid.createColumnDefinition('name', config.language.ContactName[config.currentLanguage()], 65, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('ownerName', config.language.ownerName[config.currentLanguage()], 155, '15%', 'string'),
                 // knockoutGrid.createColumnDefinition('isMorning', config.language.isMornning[config.currentLanguage()], 200, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('address', config.language.Address[config.currentLanguage()], 150, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('ownerPhone', config.language.ownerPhone[config.currentLanguage()], 50, '15%', 'string'),
                  //knockoutGrid.createColumnDefinition('noOfVisits', 'No Of Visits', 150, '5%', 'int'),
                  knockoutGrid.createColumnDefinition('phone', config.language.Telephone[config.currentLanguage()], 150, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('email', config.language.email[config.currentLanguage()], 150, '15%', 'string'),
                  //knockoutGrid.createColumnDefinition('code', config.language.code[config.currentLanguage()], 150, '5%', 'string')
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
                        router.navigate("pharmacyAdd/" + rowItem.entity.id);
                    }
                } else if (event.target.parentElement.type) {
                    if (event.target.parentElement.type !== 'button') {
                        router.navigate("pharmacyAdd/" + rowItem.entity.id);
                    }
                } else {
                    router.navigate("pharmacyAdd/" + rowItem.entity.id);
                }
            }
        });


        gridOptions(knockoutGrid.getGridOptions()());


        dataservice.getPharmacies().done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });
    };

    var vm = {
        title: 'Pharmacies',
        activate: activate,
        gridOptions: gridOptions,
        compositionComplete: compositionComplete,
        language: config.language,
        currentLanguage: config.currentLanguage,
        add: add,
        deleteAccount: deleteAccount,
        selectedRowId: selectedRowId,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf
    };

    return vm;
});