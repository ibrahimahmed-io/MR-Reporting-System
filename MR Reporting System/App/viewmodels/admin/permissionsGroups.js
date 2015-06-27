define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var knockoutGrid = {};

    var gridOptions = ko.observable();

    var permissionGroup = ko.observable();

    var changeStatus = ko.observable(false);

    var selectedRowId = ko.observable();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());
        config.exportJson(ko.toJS(exportData), exportColumns, 'excel', 'accountsPermssion');
    };

    var exportToWord = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());
        config.exportJson(ko.toJS(exportData), exportColumns, 'word', 'accountsPermssion');
    };

    var exportToPdf = function () {
        var exportData = ko.toJS(knockoutGrid.getFilteredData()());

        config.exportJson(ko.toJS(exportData), exportColumns, 'pdf', 'accountsPermssion');
    };

    var permissionGroupDto = function () {
        var self = this;
        self.groupName = "";
    };

    var add = function (obj, e) {
        changeStatus(false);

        permissionGroup(new permissionGroupDto());

        $("#AccountsPermssionGroupModal").modal("show");
    };

    function editPermissionGroup(obj, event) {
        var isValid = $('#accountsPermissionGroupForm').valid();

        if (isValid) {
            dataservice.permissionsGroupsEdit(permissionGroup()).done(function (result) {

                permissionGroup(null);

                $('#AccountsPermssionGroupModal').modal('hide');
            });
        } else {
            $('#accountsPermissionGroupForm').validate();
        }
    };

    function addPermissionGroup() {
        var isValid = $('#accountsPermissionGroupForm').valid();

        if (isValid) {
            dataservice.addGroups(permissionGroup()).done(function (data) {

                permissionGroup(null);

                $('#AccountsPermssionGroupModal').modal('hide');
            });
        } else {
            $('#accountsPermissionGroupForm').validate();
        }
    };

    function attached() {

        $(".fixed-action-btn").tooltip({ container: 'body' });

        $('#accountsPermissionGroupForm').validate({
            // Rules for form validation
            rules: {
                groupName: {
                    required: true
                }
            },

            // Messages for form validation
            messages: {
                groupName: {
                    required: config.language.GroupName[config.currentLanguage()]
                }
            },

            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });


    };
    var addPeremissionGroup = function (obj, e) {

        var id = ko.contextFor(e.target).$parent.entity.id;

        router.navigate("permissionsGroupsPermissions/" + id);


    };

    var editMe = function (obj, e) {

        var id = ko.contextFor(e.target).$parent.entity.id;

        dataservice.getGroupsById(permissionGroup, id);

        changeStatus(true);

        $('#AccountsPermssionGroupModal').modal("show");
    };

    function activate() {

        knockoutGrid = new config.KoGridInstanceCreator();

        exportColumns = [
            new config.ExportColumn(config.language.ContactName[config.currentLanguage()], 'groupName', 's')];


        knockoutGrid.columnDefs([
            knockoutGrid.createColumnDefinition('Id', '', 85, '10%', undefined, undefined,
                      '<div class="btn-group" role="group" style="margin-top: 15px;">' +
                      '<button type="button" data-bind="click: $parent.$userViewModel.editMe" class="btn btn-xs btn-default taskadmin actiontooltip" rel="tooltip" data-placement="top" title="Edit Group"><i class="fa fa-tasks"></i></button>' +
                      '<button type="button" data-bind="click: $parent.$userViewModel.addPeremissionGroup" class="btn btn-xs btn-default Projects actiontooltip" rel="tooltip" data-placement="top" title="Edit peremissions"><i class="fa fa-file-o"></i></button></div>'),

                  knockoutGrid.createColumnDefinition('groupName', config.language.GroupName[config.currentLanguage()], 155, '95%', 'string')
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

            }
        });


        gridOptions(knockoutGrid.getGridOptions()());


        dataservice.getGroups(undefined).done(function (data) {

            knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });
    };

    var deletePermission = function () {

        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {
                dataservice.deleteGroupsById(selectedRowId()).complete(function () {
                    $("#accountsPermssionGrid").jqxGrid('deleterow', selectedRowId());
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

    var vm = {
        title: config.language.groupsPermissions[config.currentLanguage()],
        attached: attached,
        editPermissionGroup: editPermissionGroup,
        addPermissionGroup: addPermissionGroup,
        permissionGroup: permissionGroup,
        changeStatus: changeStatus,
        activate: activate,
        language: config.language,
        currentLanguage: config.currentLanguage,
        add: add,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        selectedRowId: selectedRowId,
        deletePermission: deletePermission,
        addPeremissionGroup: addPeremissionGroup,
        editMe: editMe,
        gridOptions: gridOptions
    };

    return vm;
});