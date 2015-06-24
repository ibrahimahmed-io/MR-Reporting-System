define(['plugins/router', 'services/dataservice', 'config', 'services/tokenstore'], function (router, dataservice, config, tokenStore) {

    var accountDto = function () {
        var self = this;
        self.id = ko.observable();
        self.UserName = ko.observable();
        self.PassWord = ko.observable();
        self.ContactName = ko.observable();
        self.PositionId = ko.observable();
        self.areaId = ko.observable();
        self.Address = ko.observable();
        self.Phone = ko.observable();
        self.Email = ko.observable();
        self.GroupId = ko.observable();
        self.NoOfVisits = ko.observable();
        self.salary = ko.observable();
        self.Code = ko.observable();
        self.SupervisorId = ko.observable();
        self.UserType = ko.observable();
    };

    var account = ko.observable();

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
                empCode: {
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
                defaultHours: {
                    required: true,
                    digits: true
                },
                company: {
                    required: true,
                    digits: true
                },
                contactId: {
                    required: true,
                    digits: true
                }

            },

            // Messages for form validation
            messages: {
                empCode: {
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
                defaultHours: {
                    required: 'Please enter a Hour  Per Day',
                    digits: 'Only digits accepted'
                },
                company: {
                    required: 'Please choose a company',
                    digits: 'Only digits accepted'
                },
                contactId: {
                    required: 'Please choose a contact',
                    digits: 'Only digits accepted'
                },
                supervisorCompanyId: {
                    required: 'Please choose a supervisor Company',
                    digits: 'Only digits accepted'
                },
                contactSupervisorId: {
                    required: 'Please choose a contact Supervisor',
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
            changeStatus(true);
            dataservice.getAccountForedit(account, id);
        } else {
            changeStatus(false);
        }
    };

    function addAccount(obj, event) {
        var isValid = $('#AccountEditForm').valid();
        if (isValid) {
            dataservice.addAccount(account()).done(function (data) {
                router.navigate("accounts");
            });

            router.navigate("accounts");
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
        postions: postions

    };
    return vm;
});