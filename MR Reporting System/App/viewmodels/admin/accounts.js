define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var pageNumber = ko.observable(0);
     
    var account = ko.observable();

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = $('#accounts').jqxGrid('getrows');

        config.exportJson(ko.toJS(exportData), exportColumns, 'excel', 'Accounts');
    };

    var exportToWord = function () {
        var exportData = $('#accounts').jqxGrid('getrows');

        config.exportJson(ko.toJS(exportData), exportColumns, 'word', 'Accounts');
    };

    var exportToPdf = function () {
        var exportData = $('#accounts').jqxGrid('getrows');

        config.exportJson(ko.toJS(exportData), exportColumns, 'pdf', 'Accounts');
    };
 
    var changeStatus = ko.observable();

    var add = function (obj, e) {
        router.navigate("accountsAdd");
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
            knockoutGrid.createColumnDefinition('id', '', 85, '10%', undefined, undefined,
                      '<div class="btn-group" role="group" style="margin-top: 15px;"><button type="button" data-bind="click: $parent.$userViewModel.goTaskAdmin" class="btn btn-xs btn-default taskadmin actiontooltip" rel="tooltip" data-placement="top" title="Task Admin"><i class="fa fa-tasks"></i></button><button type="button" data-bind="click: $parent.$userViewModel.goEPS" class="btn btn-xs btn-default Eps actiontooltip" rel="tooltip" data-placement="top" title="EPS"><i class="ibrahimicon ibrahimicon-eps"></i></button><button type="button" data-bind="click: $parent.$userViewModel.goProjects" class="btn btn-xs btn-default Projects actiontooltip" rel="tooltip" data-placement="top" title="Projects"><i class="fa fa-file-o"></i></button><button type="button" data-bind="click: $parent.$userViewModel.goUserCompany" class="btn btn-xs btn-default userCompany actiontooltip" rel="tooltip" data-placement="top" title="Companies"><i class="fa fa-building"></i></button></div>'),
                  knockoutGrid.createColumnDefinition('userName', config.language.UserName[config.currentLanguage()], 65, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('ContactName', config.language.ContactName[config.currentLanguage()], 155, '15%', 'string'),
                  knockoutGrid.createColumnDefinition('postionName', config.language.employeeCode[config.currentLanguage()], 200, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('supervisorName', config.language.Supervisor[config.currentLanguage()], 150, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('address', config.language.CompanyName[config.currentLanguage()], 150, '20%', 'string'),
                  knockoutGrid.createColumnDefinition('groupName', config.language.GroupName[config.currentLanguage()], 150, '10%', 'string'),
                  knockoutGrid.createColumnDefinition('userType', config.language.userType[config.currentLanguage()], 150, '5%', 'string')
        ]);

        knockoutGrid.loadMoreData(function (obj, e) {
            obj.isLoadingMoreData(true);
             
            dataservice.getAccounts().success(function (data) {
                knockoutGrid.loadMoreRecords(data);
                obj.isLoadingMoreData(false);
            }).fail(function () {
                obj.isLoadingMoreData(false);
            });
        });

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
                        router.navigate("accountsEdit/" + rowItem.entity.id);
                    }
                } else if (event.target.parentElement.type) {
                    if (event.target.parentElement.type !== 'button') {
                        router.navigate("accountsEdit/" + rowItem.entity.id);
                    }
                } else {
                    router.navigate("accountsEdit/" + rowItem.entity.id);
                }
            }
        });

        gridOptions(knockoutGrid.getGridOptions()());

        dataservice.getAccounts().done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });
    };
     
    var vm = {
        title: 'Accounts',
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
        exportToPdf: exportToPdf 
    };

    return vm;
});