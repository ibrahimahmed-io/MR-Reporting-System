define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var exportColumns = [];

    var areas = ko.observable([]);

    var areaId = ko.observable();

    var visitDto = ko.observable({

        areaId: ko.observable(),
        startDate: ko.observable(moment().format("MM/DD/YYYY")),
        finishDate: ko.observable(moment().format("MM/DD/YYYY"))
    });

    areaId.subscribe(function () {
        visitDto().areaId(areaId());
    });

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'visits By Area');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'visits By Area');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'visits By Area');
    };

    var showDetail = function (obj, event) {
 
        dataservice.visitsByAgent(visitDto()).done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });
        
    };

    function compositionComplete() {
        $(".fixed-action-btn").tooltip({ container: 'body' });
      
    };

    function activate() {

        dataservice.getAccounts().done(function (data) {
            areas(data);
        });

        knockoutGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.ContactName[config.currentLanguage()], 'agentName', 's'),
            new config.ExportColumn(config.language.visitTo[config.currentLanguage()], 'VisitToName', 's'),
            new config.ExportColumn(config.language.VisitDate[config.currentLanguage()], 'VisitDate', 'n'),
            new config.ExportColumn(config.language.description[config.currentLanguage()], 'Description', 's'),
            new config.ExportColumn(config.language.drugName[config.currentLanguage()], 'DrugsName', 's'),
            new config.ExportColumn(config.language.status[config.currentLanguage()], 'status', 's')];
         
        knockoutGrid.columnDefs([
                  knockoutGrid.createColumnDefinition('agentName', config.language.ContactName[config.currentLanguage()], 155, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('typeName', config.language.typeName[config.currentLanguage()], 200, '5%', 'string'),
                  knockoutGrid.createColumnDefinition('visitToName', config.language.visitTo[config.currentLanguage()], 200, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('visitDate', config.language.VisitDate[config.currentLanguage()], 150, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('description', config.language.description[config.currentLanguage()], 50, '10%', 'int'),
                  knockoutGrid.createColumnDefinition('drugsName', config.language.drugName[config.currentLanguage()], 200, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('status', config.language.status[config.currentLanguage()], 150, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('notes', config.language.notes[config.currentLanguage()], 50, '10%', 'int')
        ]);

        knockoutGrid.displaySelectionCheckbox(false);

        gridOptions(knockoutGrid.getGridOptions()());

        if (visitDto().startDate) {
            dataservice.visitsByAgent(visitDto()).done(function (data) {

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
        title: 'Visits By Agent',
        activate: activate,
        gridOptions: gridOptions,
        compositionComplete: compositionComplete,
        language: config.language,
        currentLanguage: config.currentLanguage,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        visitDto: visitDto,
        areaId: areaId,
        areas: areas,
        showDetail: showDetail
    };

    return vm;
});