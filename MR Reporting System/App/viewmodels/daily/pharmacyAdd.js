define(['plugins/router', 'services/dataservice', 'config', 'services/tokenstore'], function (router, dataservice, config, tokenStore) {

    var doctorDto = function () {
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.specializeId = ko.observable();
        self.isMorning = ko.observable();
        self.address = ko.observable();
        self.areaId = ko.observable();
        self.classTypeId = ko.observable();
        self.phone = ko.observable();
        self.email = ko.observable();
        self.noOfVisits = ko.observable();
        self.code = ko.observable();
    };

    var doctor = ko.observable(new doctorDto());

    var specializeId = ko.observable();

    var classTypeId = ko.observable();

    var areaId = ko.observable();

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


    specializeId.subscribe(function () {
        if (specializeId()) {
            doctor().specializeId(specializeId());
        }
    });

    classTypeId.subscribe(function () {
        if (classTypeId()) {
            doctor().classTypeId(classTypeId());
        }
    });

    areaId.subscribe(function () {
        if (areaId()) {
            doctor().areaId(areaId());
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
                phone: {
                    required: true,
                    digits: true
                },
                Name: {
                    required: true
                },
                AreaId: {
                    required: true
                },
                code: {
                    required: true
                },
                NoOfVisits: {
                    required: true,
                    digits: true
                }

            },

            // Messages for form validation
            messages: {
                phone: {
                    required: 'Please enter a phone',
                    digits: 'Only digits accepted'
                },
                Name: {
                    required: 'Please enter a User Name',
                    minlength: 'user name '
                },
                AreaId: {
                    required: 'Please Enter a valid Area Id '
                },
                code: {
                    required: 'Please enter Phone'
                },
                NoOfVisits: {
                    required: 'Please  a No Of Visits',
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

            specializeId(undefined);

            classTypeId(undefined);

            areaId(undefined);

            changeStatus(true);

            dataservice.getDocotorsById(doctor, id).done(function (data) {
                if (doctor().areaId()) {
                    areaId(doctor().areaId());
                }

                if (doctor().classTypeId()) {
                    classTypeId(doctor().classTypeId());
                }

                if (doctor().specializeId()) {
                    specializeId(doctor().specializeId());
                }
            });

        } else {
            specializeId(-1);

            classTypeId(-1);

            areaId(-1);

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
        areas: areas,
        specializeId: specializeId,
        classTypeId: classTypeId,
        areaId: areaId

    };
    return vm;
});