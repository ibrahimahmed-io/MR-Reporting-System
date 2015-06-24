define(['plugins/router', 'services/dataservice', 'config'], function (router, dataservice, config) {

    var selectedDocumentPermissions = ko.observableArray();
    var documentCurrentPermissions = ko.observableArray();
    var groupId = ko.observable();
    var permissionModulesSelectChanged = function (obj, event) {
        selectedDocumentPermissions([]);
        ko.utils.arrayForEach(obj.permissions(), function (model) {
            ko.utils.arrayForEach(model.modules(), function (document) {
                var selectedValue = $("#userPermissionsDocumentsDropDown").select2("val");
                var selectedDoc = (document.id() == selectedValue) ? document : null;
                if (selectedDoc) {
                    var permissionArray = [];
                    var permissionCodes = [];
                    ko.utils.arrayForEach(selectedDoc.permissions(), function (documentPermissions) {
                        permissionArray.push(documentPermissions);
                        permissionCodes.push(documentPermissions.code());
                    });
                    dataservice.getGroupsPermissions(documentCurrentPermissions, permissionCodes, groupId()).done(function () {
                        selectedDocumentPermissions(permissionArray);
                        var selectedValues = [];
                        ko.utils.arrayForEach(documentCurrentPermissions(), function (permission) {
                            if (permission.permissionValue) {
                                selectedValues.push(permission.permissionId.toString());
                            }
                        });

                        $("#userPermissionsPermissionsDropDown").select2("val", selectedValues);
                    });
                }
            });
        });
    };

    var saveUserPermissions = function (obj, event) {

        var selectedPermissions = $("#userPermissionsPermissionsDropDown").select2("val");
        var removedPermissions = [];

        ko.utils.arrayForEach(selectedDocumentPermissions(), function (permission) {
            var code = permission.code().toString();
            var removed = selectedPermissions.indexOf(code) == -1;

            if (removed)
                removedPermissions.push(permission.code());
        });


        var editList = [];
        var addList = [];

        ko.utils.arrayForEach(documentCurrentPermissions(), function (permission) {
            var existAlready = (selectedPermissions.indexOf(permission.permissionId.toString()) >= 0) || (removedPermissions.indexOf(permission.permissionId) >= 0);

            if (existAlready) {
                if (selectedPermissions.indexOf(permission.permissionId.toString()) >= 0) {
                    selectedPermissions.splice(selectedPermissions.indexOf(permission.permissionId.toString()), 1);
                    permission.permissionValue = true;
                    editList.push(permission);
                } else {
                    permission.permissionValue = false;
                    editList.push(permission);
                }
            }
        });

        if (selectedPermissions.length > 0) {
            selectedPermissions.forEach(function (permission) {
                addList.push(new permissionModel(permission, true, groupId()));
            });
        }

        if (addList.length > 0) {
            dataservice.addGroupsPermissions(addList);
        }

        if (editList.length > 0) {
            dataservice.editGroupsPermissions(editList);
        }

        selectedDocumentPermissions([]);
        $(".select2-container").select2("val", "");

        router.navigate("permissionsGroups");
    };

    var permissionModel = function (code, value, groupId) {
        var self = this;
        self.permissionId = code;
        self.permissionValue = value;
        self.groupId = groupId;
    };

    function attached() {
        $("#userPermissionsDocumentsDropDown").select2();
        $("#userPermissionsPermissionsDropDown").select2({ closeOnSelect: false });
    };

    function activate(id) {
        groupId(ko.toJS(id));
    };

    var vm = {
        title: 'Permissions Groups Permissions',
        attached: attached,
        activate: activate,
        permissions: config.permission,
        language: config.language,
        currentLanguage: config.currentLanguage,
        permissionModulesSelectChanged: permissionModulesSelectChanged,
        selectedDocumentPermissions: selectedDocumentPermissions,
        saveUserPermissions: saveUserPermissions
    };

    return vm;

});