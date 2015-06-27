﻿define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var exportColumns = [];

    var agents = ko.observable([]);

    var agentId = ko.observable();

    var visitDto = ko.observable({

        agentId: ko.observable(),
        startDate: ko.observable(moment().format("MM/DD/YYYY")),
        finishDate: ko.observable(moment().format("MM/DD/YYYY"))
    });

    agentId.subscribe(function () {
        visitDto().agentId(agentId());
    });

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'visits Cost');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'visits Cost');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'visits Cost');
    };

    var showDetail = function (obj, event) {
        //var isValid = $('#netSalaryForm').valid();
        //if (isValid) {
        dataservice.visitsCost(visitDto()).done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });
            //showSalaryStatus(true);
        //}
        //else {
        //    $('#netSalaryForm').validate();
        //}


    };

    function compositionComplete() {
        $(".fixed-action-btn").tooltip({ container: 'body' });
     
    };

    function activate() {

        dataservice.getAccounts().done(function (data) {
            agents(data);
        });

        knockoutGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.UserName[config.currentLanguage()], 'agentName', 's'),
            new config.ExportColumn(config.language.ContactName[config.currentLanguage()], 'EstimateVisits', 's'),
            new config.ExportColumn(config.language.employeeCode[config.currentLanguage()], 'EstimateVisits', 'n'),
            new config.ExportColumn(config.language.Supervisor[config.currentLanguage()], 'actualCost', 's'),
            new config.ExportColumn(config.language.Position[config.currentLanguage()], 'estimateCost', 's')];


        knockoutGrid.columnDefs([
                  knockoutGrid.createColumnDefinition('agentName', config.language.ContactName[config.currentLanguage()], 155, '30%', 'string'),
                  knockoutGrid.createColumnDefinition('actualCost', config.language.Position[config.currentLanguage()], 200, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('EstimateVisits', config.language.employeeCode[config.currentLanguage()], 200, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('actualCost', config.language.Supervisor[config.currentLanguage()], 150, '25%', 'string'),
                  knockoutGrid.createColumnDefinition('estimateCost', config.language.salaryValue[config.currentLanguage()], 50, '25%', 'int')
        ]);

        knockoutGrid.displaySelectionCheckbox(false);

        
        gridOptions(knockoutGrid.getGridOptions()());

        if (visitDto().startDate) {
            dataservice.visitsCost(visitDto()).done(function (data) {

                knockoutGrid.setInitialData(data);

                $(".loading-data").addClass("hidden");
            });
        }
        
    };

    //function canActivate() {
    //    if (config.isCompany() === false) {
    //        if (config.isAllow(1167) === true) {
    //            return true;
    //        } else {
    //            $.smallBox({
    //                title: "Operation was canceled",
    //                content: config.language.missingPermissions[config.currentLanguage()],
    //                color: "#C46A69",
    //                iconSmall: "fa fa-times fa-2x fadeInRight animated",
    //                timeout: 2000
    //            });
    //        }
    //    } else {
    //        return true;
    //    }
    //};

    var vm = {
        title: 'Agents',
        activate: activate,
        gridOptions: gridOptions,
        compositionComplete: compositionComplete,
        language: config.language,
        currentLanguage: config.currentLanguage,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        visitDto: visitDto,
        agentId: agentId,
        agents: agents,
        showDetail: showDetail
    };

    return vm;
});