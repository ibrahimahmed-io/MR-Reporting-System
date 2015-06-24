define(['plugins/router', 'services/dataservice', 'config', 'services/tokenstore'], function (router, dataservice, config, tokenStore) {

    var accountDto = function () {
        var self = this;
        self.id = ko.observable();
        self.userName = ko.observable();
        self.userPassword = ko.observable();
        self.companyId = ko.observable();
        self.contactSupervisorId = ko.observable();
        self.contactId = ko.observable();
        self.defaultHours = ko.observable();
        self.companySupervisorId = ko.observable();
        self.supervisorAccountId = ko.observable();
        self.groupId = ko.observable();
        self.empCode = ko.observable();
        self.accountOwnerId = ko.observable();
        self.designTeam = ko.observable();
        self.isTaskAdmin = ko.observable();
        self.active = ko.observable();
        self.passwordEdit = ko.observable();
        self.isHrManager = ko.observable();
    };

    var fillAccountWithData = function(accountObject, data) {
        if (data) {
            accountObject().id(data.id);
            accountObject().userName(data.userName);
            accountObject().userPassword(data.userPassword);
            accountObject().companyId(data.companyId);
            accountObject().contactSupervisorId(data.contactSupervisorId);
            accountObject().contactId(data.contactId);
            accountObject().defaultHours(data.defaultHours);
            accountObject().companySupervisorId(data.companySupervisorId);
            accountObject().supervisorAccountId(data.supervisorAccountId);
            accountObject().groupId(data.groupId);
            accountObject().empCode(data.empCode);
            accountObject().accountOwnerId(data.accountOwnerId);
            accountObject().designTeam(data.designTeam);
            accountObject().isTaskAdmin(data.isTaskAdmin);
            accountObject().active(data.active);
            accountObject().passwordEdit(data.passwordEdit);
            accountObject().isHrManager(data.isHrManager);
        }
    }

    var supervisorContacts = ko.observable([]);

    var groups = ko.observable([]);

    var companies = ko.observable([]);

    var account = ko.observable(new accountDto());

    account().companySupervisorId.subscribe(function (value) {
        if (value) {
            dataservice.getContactsByCompanyIdForOnlyUsers(supervisorContacts, value);
        }
    });

    var accountId = ko.observable();

    function person(id, name, age) {
        this.id = id;
        this.name = name;
    }

    var listOfDays = [
        new person(1, 'saturday'),
        new person(2, 'sunday'),
        new person(3, 'monday'),
        new person(4, 'theusday'),
        new person(5, 'wedsday'),
        new person(6, 'thursday'),
        new person(7, 'friday')
    ];

    var people = ko.observableArray(listOfDays);

    var selectedPeople = ko.observableArray();

    function attached() {

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
                    minlength: 2
                },
                userPassword: {
                    required: true,
                    minlength: 5
                },
                defaultHours: {
                    required: true,
                    digits: true
                },
                companies: {
                    required: true,
                    notEqual: '-1',
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
                companies: {
                    required: 'Please choose a company',
                    digits: 'Only digits accepted'
                }
            },

            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
    };

    function activate(id) {
        // companySupervisorId(undefined);
        accountId(id);

        var collection = tokenStore.getPayload();

        var accountOwnerId = collection.aoi;

        dataservice.getAccountsById(undefined, id).done(function (data) {
            if (data) {
                fillAccountWithData(account, data);
            }

            if (data["companySupervisorId"]) {
                dataservice.getContactsByCompanyId(supervisorContacts, data["companySupervisorId"]);
            }
        });

        dataservice.getCompanies(companies, accountOwnerId);

        dataservice.getGroup(groups, accountOwnerId);
    };

    function editAccount(obj, event) {
        var isValid = $('#AccountEditForm').valid();
        if (isValid) {

            dataservice.editAccount(account()).complete(function () {
                //ko.utils.arrayForEach(selectedPeople(), function (obj) {
                //    dataservice.updateVacations(accountId(), obj);
                //});
                router.navigate("accounts");
            });

        }
        else {
            $('#AccountEditForm').validate();
        }
    };

    var vm = {
        people: people,
        selectedPeople: selectedPeople,
        title: 'Accounts',
        activate: activate,
        groups: groups,
        attached: attached,
        supervisorContacts: supervisorContacts,
        companies: companies,
        account: account,
        editAccount: editAccount,
        language: config.language,
        currentLanguage: config.currentLanguage
    };

    return vm;
});