define(['plugins/router', 'services/dataservice', 'config', 'services/tokenstore'], function (router, dataservice, config, tokenStore) {

    var accountDto = function () {
        var self = this;
        self.id = ko.observable();
        self.userName = ko.observable();
        self.passWord = ko.observable();
        self.contactName = ko.observable();
        self.positionId = ko.observable();
        self.areaId = ko.observable();
        self.address = ko.observable('');
        self.phone = ko.observable();
        self.email = ko.observable();
        self.groupId = ko.observable();
        self.noOfVisits = ko.observable();
        self.salary = ko.observable();
        self.code = ko.observable();
        self.supervisorId = ko.observable();
        self.userType = ko.observable();
    };

    var account = ko.observable(new accountDto());

    var resetWarning = ko.computed(function () {
        return "<i class='text-warning fa fa-warning'></i> " + config.language.resetWarning[config.currentLanguage()];
    });

    config.currentLanguage.subscribe(function () {
        $(".jarviswidget-toggle-btn").attr("data-original-title", config.language.collapse[config.currentLanguage()]);
        $(".jarviswidget-fullscreen-btn").attr("data-original-title", config.language.fullscreen[config.currentLanguage()]);
    });

    var supervisorContacts = ko.observable([]);

    var groups = ko.observable([]);

    var areas = ko.observable([]);

    var postions = ko.observable([]);

    var SupervisorId = ko.observable();

    var groupId = ko.observable();

    var positionId = ko.observable();

    SupervisorId.subscribe(function () {
        if (SupervisorId()) {
            account().supervisorId(SupervisorId());
        }
    });

    groupId.subscribe(function () {
        if (groupId()) {
            account().groupId(groupId());
        }
    });

    positionId.subscribe(function () {
        if (positionId()) {
            account().positionId(positionId());
        }
    });

    function attached() {
        $('#widget-grid').jarvisWidgets({
            grid: 'article',
            widgets: '.jarviswidget',
            buttonsHidden: false,

            // toggle button
            toggleButton: true,
            toggleClass: 'fa fa-minus | fa fa-plus',
            toggleSpeed: 200,

            // color button
            colorButton: true,

            // full screen
            fullscreenButton: true,
            fullscreenClass: 'fa fa-expand | fa fa-compress',
            fullscreenDiff: 3,

            // order
            buttonOrder: '%toggle% %fullscreen%',
            opacity: 1.0,
            dragHandle: '> header',
            placeholderClass: 'jarviswidget-placeholder',
            timestampPlaceholder: '.jarviswidget-timestamp',
            rtl: false, // best not to toggle this!
        });

        jQuery.validator.addMethod("notEqual", function (value, element, param) {
            return this.optional(element) || value != param;
        }, "Please specify a different value");

        $('#AccountEditForm').validate({

            // Rules for form validation
            rules: {
                code: {
                    required: true,
                    digits: true
                },
                userName: {
                    required: true,
                    minlength: 6
                },
                userPassword: {
                    required: true,
                    minlength: 6
                },
                salary: {
                    required: true,
                    digits: true
                }

            },

            // Messages for form validation
            messages: {
                code: {
                    required: 'Please enter a Employee Code',
                    digits: 'Only digits accepted'
                },
                userName: {
                    required: 'Please enter a User Name',
                    minlength: 'user name '
                },
                userPassword: {
                    required: 'Please Enter a valid User Name'
                },
                salary: {
                    required: 'Please enter a Hour  Per Day',
                    digits: 'Only digits accepted'
                }
            },

            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
    };

    var changeStatus = ko.observable(false);

    function activate(id) {

        account(new accountDto());

        dataservice.getAccounts().done(function (data) {
            supervisorContacts(data);
        });

        dataservice.getGroup(groups);

        dataservice.getAccountsDefaultListType(postions, 'position');

        if (id > 0) {
            positionId(undefined);

            groupId(undefined);

            SupervisorId(undefined);

            changeStatus(true);

            dataservice.getAccountForedit(account, id).done(function (data) {
                account().passWord("");
            });

        } else {

            positionId(-1);

            groupId(-1);

            SupervisorId(-1);

            changeStatus(false);
        }
    };

    function addAccount(obj, event) {
        var isValid = $('#AccountEditForm').valid();
        if (isValid) {
            if (changeStatus()) {
                dataservice.editAccount(account()).done(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    router.navigate("accounts");
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

            }
            else {

                dataservice.addAccount(account()).done(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    router.navigate("accounts");
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

                router.navigate("accounts");
            }
        } else {

            $('#AccountEditForm').validate();

        }
    };

    var vm = {
        title: config.language.titleAccounts[config.currentLanguage()],
        attached: attached,
        groups: groups,
        activate: activate,
        supervisorContacts: supervisorContacts,
        account: account,
        language: config.language,
        currentLanguage: config.currentLanguage,
        resetWarning: resetWarning,
        addAccount: addAccount,
        postions: postions,
        SupervisorId: SupervisorId,
        groupId: groupId,
        positionId: positionId

    };
    return vm;
});