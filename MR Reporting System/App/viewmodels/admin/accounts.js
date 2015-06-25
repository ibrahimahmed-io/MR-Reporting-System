define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var accountId = ko.observable();

    var dataSetArea = ko.observable({
        AgentId: ko.observable(),
        agentAreas: ko.observableArray()
    });

    var dataSetDrugs = ko.observable({
        AgentId: ko.observable(),
        agentDrugs: ko.observableArray()
    });

    var drugs = ko.observableArray([]);

    var areas = ko.observableArray([]);

    var addArea = function (obj, e) {
        var id = ko.contextFor(e.target).$parent.entity.id;
        accountId(id);
        dataSetArea().AgentId(id);
        $('#addArea').modal('show');
    };

    var addDrugs = function (obj, e) {
        var id = ko.contextFor(e.target).$parent.entity.id;
        accountId(id);
        dataSetDrugs().AgentId(id);
        $('#addDrugs').modal('show');
    };

    function saveArea(obj, event) {
        if (agentArea().lenth > 0) {
            dataservice.AddAgentAreas(agentArea).success(function () {
                $("#addArea").modal('hide');
            });
        }
    };

    function saveDrugs(obj, event) {
        if (agentDrugs().lenth > 0) {
            dataservice.addAgantdrugs(agentDrugs).success(function () {
                $("#addDrugs").modal('hide');
            });
        }
    };

    var account = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'Agents');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'Agents');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'Agents');
    };

    var changeStatus = ko.observable();

    var add = function (obj, e) {
        router.navigate("accountsAdd/" + 0);
    };

    var deleteAccount = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {

                dataservice.accountDeleteById(selectedRowId()).success(function () {
                    $("#accounts").jqxGrid('deleterow', selectedRowId());
                });
                $.smallBox({
                    title: "Operation completed successfuly",
                    content: "<i class='fa fa-clock-o'></i> <i>Record deleted successfuly...</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 2000
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
            new config.ExportColumn(config.language.UserName[config.currentLanguage()], 'userName', 's'),
            new config.ExportColumn(config.language.ContactName[config.currentLanguage()], 'contactName', 's'),
            new config.ExportColumn(config.language.employeeCode[config.currentLanguage()], 'empCode', 'n'),
            new config.ExportColumn(config.language.Supervisor[config.currentLanguage()], 'supervisorName', 's'),
            new config.ExportColumn(config.language.CompanyName[config.currentLanguage()], 'companyName', 's'),
            new config.ExportColumn(config.language.GroupName[config.currentLanguage()], 'groupName', 's'),
            new config.ExportColumn(config.language.userType[config.currentLanguage()], 'userType', 's')];


        knockoutGrid.columnDefs([
            knockoutGrid.createColumnDefinition('Id', '', 85, '10%', undefined, undefined,
                      '<div class="btn-group" role="group" style="margin-top: 15px;"><button type="button" data-bind="click: $parent.$userViewModel.addArea" class="btn btn-xs btn-default taskadmin actiontooltip" rel="tooltip" data-placement="top" title="Add Area"><i class="fa fa-tasks"></i><button type="button" data-bind="click: $parent.$userViewModel.addDrugs" class="btn btn-xs btn-default Projects actiontooltip" rel="tooltip" data-placement="top" title="Add Drugs"><i class="fa fa-file-o"></i></button></div>'),
                  knockoutGrid.createColumnDefinition('userName', config.language.UserName[config.currentLanguage()], 65, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('contactName', config.language.ContactName[config.currentLanguage()], 155, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('positionName', config.language.employeeCode[config.currentLanguage()], 200, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('supervisorName', config.language.Supervisor[config.currentLanguage()], 150, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('salary', config.language.salaryValue[config.currentLanguage()], 50, '5%', 'int'),
                  knockoutGrid.createColumnDefinition('noOfVisits', 'No Of Visits', 150, '5%', 'int'),
                  knockoutGrid.createColumnDefinition('address', config.language.Address[config.currentLanguage()], 150, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('groupName', config.language.GroupName[config.currentLanguage()], 150, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('userType', config.language.userType[config.currentLanguage()], 150, '5%', 'string')
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
                        router.navigate("accountsAdd/" + rowItem.entity.id);
                    }
                }
                //else if (event.target.parentElement.type) {
                //    if (event.target.parentElement.type !== 'button') {
                //        router.navigate("accountsAdd/" + rowItem.entity.id);
                //    }
                //} else {
                //    router.navigate("accountsAdd/" + rowItem.entity.id);
                //}
            }
        });


        gridOptions(knockoutGrid.getGridOptions()());


        dataservice.getAccounts().done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });
    };

    var vm = {
        title: 'Agents',
        saveDrugs: saveDrugs,
        saveArea: saveArea,
        activate: activate,
        gridOptions: gridOptions,
        compositionComplete: compositionComplete,
        language: config.language,
        currentLanguage: config.currentLanguage,
        changeStatus: changeStatus,
        add: add,
        deleteAccount: deleteAccount,
        selectedRowId: selectedRowId,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        dataSetDrugs: dataSetDrugs,
        dataSetArea: dataSetArea,
        drugs: drugs,
        areas: areas
    };

    return vm;
});