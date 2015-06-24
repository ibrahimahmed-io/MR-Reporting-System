define(['plugins/router', 'services/dataservice', 'config', 'services/tokenstore'], function (router, dataservice, config, tokenStore) {

    var doctorDto = function () {
        var self = this;
        self.Id = ko.observable();
        self.Name = ko.observable();
        self.SpecializeId = ko.observable();
        self.IsMorning = ko.observable();
        self.Address = ko.observable();
        self.AreaId = ko.observable();
        self.ClassTypeId = ko.observable();
        self.Phone = ko.observable();
        self.Email = ko.observable();
        self.NoOfVisits = ko.observable();
        self.Code = ko.observable();
    };

    var doctor = ko.observable();

    var resetWarning = ko.computed(function () {
        return "<i class='text-warning fa fa-warning'></i> " + config.language.resetWarning[config.currentLanguage()];
    });

    config.currentLanguage.subscribe(function () {
        $(".jarviswidget-toggle-btn").attr("data-original-title", config.language.collapse[config.currentLanguage()]);
        $(".jarviswidget-fullscreen-btn").attr("data-original-title", config.language.fullscreen[config.currentLanguage()]);
    });

    var departments = ko.observable([]);

    var areas = ko.observable([]);

    var classTypes = ko.observable([]);

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
                Name: {
                    required: true
                },
                AreaId: {
                    required: true
                },
                Phone: {
                    required: true,
                    digits: true
                },
                NoOfVisits: {
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
                Name: {
                    required: 'Please enter a User Name',
                    minlength: 'user name '
                },
                AreaId: {
                    required: 'Please Enter a valid Area Id '
                },
                Phone: {
                    required: 'Please enter Phone',
                    digits: 'Only digits accepted'
                },
                NoOfVisits: {
                    required: 'Please  a No Of Visits',
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
        doctor(new doctorDto());

        dataservice.getAccountsDefaultListType(classTypes, 'classType');

        dataservice.getAccountsDefaultListType(departments, 'specailiz');

        dataservice.getArea(undefined).done(function (data) {
            areas(data);
        });

        if (id > 0) {
            changeStatus(true);
            dataservice.getDocotorsById(doctor, id);
        } else {
            changeStatus(false);
        }
    };

    function adddoctor(obj, event) {
        var isValid = $('#AccountEditForm').valid();
        if (isValid) {
            if (changeStatus() === true) {
                dataservice.editDocotors(doctor()).done(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    router.navigate("doctors");
                }).fail(function () {
                    $('#accountsDefaultListModal').modal('hide');
                    $.smallBox({
                        title: "Operation was canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Canceled delete...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    knockoutGrid.setInitialData(data);

                    $(".loading-data").addClass("hidden");
                });
            } else {
                dataservice.addDocotors(doctor()).done(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    router.navigate("doctors");
                }).fail(function () {
                    $('#accountsDefaultListModal').modal('hide');
                    $.smallBox({
                        title: "Operation was canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Canceled delete...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                    knockoutGrid.setInitialData(data);

                    $(".loading-data").addClass("hidden");
                });
            }

            router.navigate("doctors");
        } else {

            $('#AccountEditForm').validate();

        }
    };

    var vm = {
        title: config.language.doctors[config.currentLanguage()],
        attached: attached,
        activate: activate,
        doctor: doctor,
        language: config.language,
        currentLanguage: config.currentLanguage,
        resetWarning: resetWarning,
        adddoctor: adddoctor,
        classTypes: classTypes,
        departments: departments,
        areas: areas

    };
    return vm;
});