define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var exportColumns = [];

    //var startDate = ko.observable(moment().format("MM/DD/YYYY"));

    //var finishDate = ko.observable(moment().format("MM/DD/YYYY"));


    //var visitDto = ko.observable({

    //    agentId: ko.observable(),
    //    startDate: ko.observable(moment().format("MM/DD/YYYY")),
    //    finishDate: ko.observable(moment().format("MM/DD/YYYY"))
    //});

    //startDate.subscribe(function () {
    //    visitDto().startDate(moment(startDate(), 'DD/MM/YYYY').format());
    //});

    //finishDate.subscribe(function () {
    //    visitDto().finishDate(moment(finishDate(), 'DD/MM/YYYY').format());
    //});

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'Totals Of Sales');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'Totals Of Sales');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'Totals Of Sales');
    };

    //var showDetail = function (obj, e) {

    //    $(e.target).button('loading');
    //    dataservice.visitsByAgent(visitDto()).done(function (data) {

    //        knockoutGrid.setInitialData(data);

    //        $(e.target).button('reset');
    //        $(".loading-data").addClass("hidden");
    //    });

    //};

    function compositionComplete() {
        $(".fixed-action-btn").tooltip({ container: 'body' });

    };

    function activate() {

        knockoutGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.ContactName[config.currentLanguage()], 'agentName', 's'),
            new config.ExportColumn('Month', 'monthName', 's'),
            new config.ExportColumn(config.language.drugName[config.currentLanguage()], 'equipment', 'n'),
            new config.ExportColumn(config.language.code[config.currentLanguage()], 'equipmentCode', 's'),
            new config.ExportColumn(config.language.drugName[config.currentLanguage()], 'total', 's') ];

        knockoutGrid.columnDefs([
                  knockoutGrid.createColumnDefinition('monthName', 'Month', 200, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('agentName', config.language.ContactName[config.currentLanguage()], 155, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('equipment', config.language.drugName[config.currentLanguage()], 200, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('equipmentCode', config.language.code[config.currentLanguage()], 150, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('total', config.language.total[config.currentLanguage()], 50, '12%', 'int')
        ]);

        knockoutGrid.displaySelectionCheckbox(false);

        gridOptions(knockoutGrid.getGridOptions()());


        dataservice.getTargetBySales().done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });

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
        title: 'Agents of Totals',
        activate: activate,
        gridOptions: gridOptions,
        compositionComplete: compositionComplete,
        language: config.language,
        currentLanguage: config.currentLanguage,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf
        //visitDto: visitDto,
        //startDate: startDate,
        //finishDate: finishDate,
        //showDetail: showDetail
    };

    return vm;
});