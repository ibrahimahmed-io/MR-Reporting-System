define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {
     
    var changeStatus = ko.observable(false);

    var showNew = ko.observable(false);

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var pageNumber = ko.observable(0);

    var selectedRowId = ko.observable();

    var listType = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'excel', 'accounts Default List');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'word', 'accounts Default List');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(exportData, exportColumns, 'pdf', 'accounts Default List');
    };

    pageNumber.subscribe(function (value) {
        $(".loading-data").removeClass("hidden");

        dataservice.getAccountsDefaultListTypesLog(undefined, value, config.pageSize());
    });

    var accountsDefaultListDto = function () {
        var self = this;
        self.title = ko.observable();
        self.listType = ko.observable();//$("#selectAccountsDefaultListTypes").val();
    };

    listType.subscribe(function () {
        if (listType()) {
            dataservice.getAccountsDefaultListType(undefined, listType()).done(function (data) {

                knockoutGrid.setInitialData(data);

                $(".loading-data").addClass("hidden");
            });

            showNew(true);
        }
    });

    var accountsDefalutListPopUp = ko.observable();

    function add(obj, e) {

        changeStatus(false);

        accountsDefalutListPopUp(new accountsDefaultListDto());

        $('#accountsDefaultListModal').modal('show');
    }

    function editAccountsDefaultList() {
        var isValid = $('#accountsDefaultListForm').valid();
        if (isValid) {
            dataservice.editAccountsDefaultList(accountsDefalutListPopUp())
                .done(function (result) {
                    $('#accountsDefaultListModal').modal('hide');
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    $('#accountsDefaultListModal').modal('hide');

                }).fail(function () {
                    $('#accountsDefaultListModal').modal('hide');
                    $.smallBox({
                        title: "Operation was canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Canceled delete...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                });
        } else {
            $('#accountsDefaultListForm').validate();
        }
    };

    function addAccountsDefaultList() {
        var isValid = $('#accountsDefaultListForm').valid();
        if (isValid) {
            dataservice.addAccountsDefaultList(accountsDefalutListPopUp()).done(function (data) {
                $('#accountsDefaultListModal').modal('hide');
                $.smallBox({
                    title: config.language.smartAddMessage[config.currentLanguage()].successTitle,
                    content: config.language.smartAddMessage[config.currentLanguage()].successContent,
                    color: "#659265",
                    iconSmall: "fa fa-thumbs-up bounce animated",
                    timeout: 4000
                });

            });
        } else {
            $('#accountsDefaultListForm').validate();
        }
    };

    function compositionComplete() {

        $(".fixed-action-btn").tooltip('destroy');
        $(".fixed-action-btn").tooltip({ container: 'body' });
    };

    function activate() {

        knockoutGrid = new config.KoGridInstanceCreator();

        knockoutGrid.columnDefs([
              knockoutGrid.createColumnDefinition('id', config.language.refNo[config.currentLanguage()], 500, '5%', 'int'),
              knockoutGrid.createColumnDefinition('title', config.language.title[config.currentLanguage()], 500, '95%', 'string')
        ]);

        knockoutGrid.loadMoreData(function (obj, e) {
            obj.isLoadingMoreData(true);

            pageNumber(pageNumber() + 1);

            var currentPageNumber = pageNumber();


            dataservice.GetaccountsDefaultList(undefined, listType()).done(function (data) {

                knockoutGrid.loadMoreRecords(data);
                obj.isLoadingMoreData(false);
            }).fail(function () {
                obj.isLoadingMoreData(false);
            });
        });

        if (listType()) {
            dataservice.getAccountsDefaultList(undefined, listType()).done(function (data) {
 
                knockoutGrid.setInitialData(data);
 
                $(".loading-data").addClass("hidden");
            });
        }
         
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
                //edit
                if (config.isAllow(1180)) {
                    changeStatus(true);

                    dataservice.getAccountsDefaultListForEdit(accountsDefalutListPopUp, rowItem.entity.id);
                    $("#accountsDefaultListModal").modal("show");
                }
                else {
                    $.smallBox({
                        title: "Operation was canceled",
                        content: config.language.missingPermissions[config.currentLanguage()],
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                }

            }
        });

        gridOptions(knockoutGrid.getGridOptions()());
         
    };

    var deleteDefault = function () {
        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {
                dataservice.accountsDefaultListDelete(selectedRowId()).complete(function () {
                    knockoutGrid.deleteRow(selectedRowId());
                    selectedRowId(undefined);
                });
                $.smallBox({
                    title: "Operation completed successfuly",
                    content: "<i class='fa fa-clock-o'></i> <i>Record deleted successfuly...</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 2000
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

    function canActivate() {
        //if (config.isCompany() === false) {
        //    var isAllowed = config.userPermissions.indexOf(1179);
        //    if (isAllowed != -1) {
        //        return true;
        //    } else {
        //        $.smallBox({
        //            title: "Operation was canceled",
        //            content: config.language.missingPermissions[config.currentLanguage()],
        //            color: "#C46A69",
        //            iconSmall: "fa fa-times fa-2x fadeInRight animated",
        //            timeout: 2000
        //        });
        //        return false;
        //    }
        //} else {
        //    return true;
        //}
        return true;
    };

    var vm = {
        title: config.language.AccountsDefaultList[config.currentLanguage()], 
        compositionComplete: compositionComplete,
        editAccountsDefaultList: editAccountsDefaultList,
        accountsDefalutListPopUp: accountsDefalutListPopUp,
        changeStatus: changeStatus,
        addAccountsDefaultList: addAccountsDefaultList,
        showNew: showNew,
        activate: activate,
        language: config.language,
        currentLanguage: config.currentLanguage,
        add: add,
        listType: listType,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        selectedRowId: selectedRowId,
        deleteDefault: deleteDefault,
        gridOptions: gridOptions,
        pageNumber: pageNumber,
        knockoutGrid: knockoutGrid,
        canActivate: canActivate
    };

    return vm;

});