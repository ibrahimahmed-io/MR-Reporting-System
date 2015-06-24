define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var accountsPermissionsGroups = new config.GridModel();

    accountsPermissionsGroups.data([]);

    var permissionGroup = ko.observable();

    var changeStatus = ko.observable(false);

    var selectedRowId = ko.observable();

    var dataSource = new config.JqxGridDataSource();

    var columns = new config.JqxGridColumns();

    var exportColumns = [];

    var exportToExcel = function () {
        var exportData = $('#accountsPermssionGrid').jqxGrid('getrows');

        config.exportJson(ko.toJS(exportData), exportColumns, 'excel', 'accountsPermssion');
    };

    var exportToWord = function () {
        var exportData = $('#accountsPermssionGrid').jqxGrid('getrows');

        config.exportJson(ko.toJS(exportData), exportColumns, 'word', 'accountsPermssion');
    };

    var exportToPdf = function () {
        var exportData = $('#accountsPermssionGrid').jqxGrid('getrows');

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
            dataservice.accountsPermissionsGroupsEdit(permissionGroup()).done(function (result) {
                $('#accountsPermssionGrid').jqxGrid('updaterow', result["id"], result);

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
            dataservice.accountsPermissionsGroupsAdd(permissionGroup()).done(function (data) {
                $('#accountsPermssionGrid').jqxGrid('addrow', data["id"], data);

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

        $('#accountsPermssionGrid').on('click', '.jqx-grid-content div div[role="row"]', function (e) {
            var element = $(e.target)[0];

            var isRadio = false;

            if (element.tagName === "I") {
                isRadio = true;
            } else if (element.tagName === "INPUT") {
                if (element.type === "radio") {
                    isRadio = true;
                }
            } else if (element.tagName === "A") {
                isRadio = true;
            } else if (element.tagName === "BUTTON") {
                isRadio = true;
            }

            var rowId = $(this).find('input[type="radio"]').attr("id");

            if (!isRadio) {
                changeStatus(true);

                dataservice.accountsPermissionsGroupsGetById(permissionGroup, rowId);

                $("#AccountsPermssionGroupModal").modal("show");
            } else {
                selectedRowId(rowId);
            }
        });

        $('#accountsPermssionGrid').on('mouseover', '.rowIndex', function (event) {
            $(this).children("span").css("display", "none");

            var style = $(this).children(".radio").attr("style");

            style = style.replace("display: none;", "");

            $(this).children(".radio").attr("style", style);
        });

        $('#accountsPermssionGrid').on('mouseleave', '.rowIndex', function (event) {
            var deleteRadioElement = $(this).children(".radio").children("input");

            var isChecked = deleteRadioElement[0].checked;

            if (!isChecked) {
                $(this).children("span").removeAttr("style");
                $(this).children(".radio").css("display", "none");
            } else {
                $('#accountsPermssionGrid').find(".radio").children("input:not(:checked)").parent().css("display", "none");
                $('#accountsPermssionGrid').find(".radio").children("input:not(:checked)").parent().parent().children("span").removeAttr("style");
            }
        });

        $(".fixed-action-btn").tooltip({ container: 'body' });

        /* END COLUMN FILTER */

        $('#accountsPermssionGrid').on('click', '.accounts', function (event) {
            var id = $(event.currentTarget).data("id");
            router.navigate("accountsGroup/" + id);
        });

        $('#accountsPermssionGrid').on('click', '.permissionsGroup', function (event) {
            var id = $(event.currentTarget).data("id");
            router.navigate("permissionsGroupsPermissions/" + id);
        });
    };

    function activate() {
        dataSource.datafields = [{
            name: 'id', type: 'int'
        }, {
            name: 'groupName', type: 'string'
        }];

        exportColumns = [
          new config.ExportColumn(config.language.GroupName[config.currentLanguage()], 'groupName', 's')

        ];

        columns.gridColumns([{
            text: "Reference",
            datafield: 'RowNumber',
            cellsrenderer: function (row) {
                var id = $('#accountsPermssionGrid').jqxGrid('getrowid', row);

                return '<div class="rowIndex smart-form">' +
                           '<span>' + row + '</span>' +
                           '<label class="radio grid-checkbox" style="display: none; margin-left: 28px !important; margin-top: 15px !important;">' +
                               '<input type="radio" name="deletegrid" id="' + id + '" />' +
                               '<i></i>&nbsp;' +
                           '</label>' +
                       '</div>';
            },
            filterable: false,
            width: '79px'
        }, {
            text: config.language.LogControls[config.currentLanguage()],
            datafield: 'LogControls',
            cellsrenderer: function (row) {
                var id = $('#accountsPermssionGrid').jqxGrid('getrowid', row);
                var content = '<div class="btn-group" role="group"><button class="accounts btn btn-xs btn-default" style="margin: 10px;" rel="tooltip" data-placement="top" title="Accounts Group" data-id="' + id + '"><i class="ibrahimicon ibrahimicon-permission"></i></button>' +
                  '<button class="permissionsGroup btn btn-xs btn-default" style="margin: 10px;" rel="tooltip" data-placement="top" title="Permissions Group" data-id="' + id + '"><i class="ibrahimicon ibrahimicon-view"></i></button></div>';
                return content;
            },
            filterable: false,
            groupable: false,
            sortable: false,
            columnsreorder: false,
            width: '15%',
            resizable: false,
            draggable: false,
            hidden: false
        }, {
            text: config.language.GroupName[config.currentLanguage()],
            datafield: 'groupName',
            columntype: 'textbox',
            filtertype: 'input',
            width: '80%',
            hidden: false
        }]);

        dataservice.accountsPermissionsGroupsGet(accountsPermissionsGroups);
    };

    var deletePermission = function () {

        $.SmartMessageBox({
            title: "Caution hazardous operation!",
            content: "Are you sure you want to delete this?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {
                dataservice.accountsPermissionsGroupsDelete(selectedRowId()).complete(function () {
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
        accountsPermissionsGroups: accountsPermissionsGroups,
        attached: attached,
        editPermissionGroup: editPermissionGroup,
        addPermissionGroup: addPermissionGroup,
        permissionGroup: permissionGroup,
        changeStatus: changeStatus,
        activate: activate,
        language: config.language,
        currentLanguage: config.currentLanguage,
        dataSource: dataSource,
        columns: columns,
        add: add,
        exportToExcel: exportToExcel,
        exportToWord: exportToWord,
        exportToPdf: exportToPdf,
        selectedRowId: selectedRowId,
        deletePermission: deletePermission
    };

    return vm;
});