define(['plugins/router', 'services/dataservice', 'config', 'services/tokenstore'], function (router, dataservice, config, tokenStore) {

    var pharmcyDto = function () {
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.ownerName = ko.observable();
        self.ownerPhone = ko.observable();
        self.address = ko.observable();
        self.phone = ko.observable();
        self.email = ko.observable();
        self.areaId = ko.observable();
        // self.noOfVisits = ko.observable();
        // self.code = ko.observable();
    };

    var pharmcy = ko.observable(new pharmcyDto());

    var areas = ko.observable([]);
     
    var areaId = ko.observable();

    areaId.subscribe(function () {
        if (areaId()) {
            pharmcy().areaId(areaId());
        }
    });
    var resetWarning = ko.computed(function () {
        return "<i class='text-warning fa fa-warning'></i> " + config.language.resetWarning[config.currentLanguage()];
    });

    config.currentLanguage.subscribe(function () {
        $(".jarviswidget-toggle-btn").attr("data-original-title", config.language.collapse[config.currentLanguage()]);
        $(".jarviswidget-fullscreen-btn").attr("data-original-title", config.language.fullscreen[config.currentLanguage()]);
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
                OwnerPhone: {
                    required: true
                },
                OwnerName: {
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
                OwnerPhone: {
                    required: 'Please Enter a valid Owner Phone '
                },
                OwnerName: {
                    required: 'Please enter OwnerName'
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

        pharmcy(new pharmcyDto());

        dataservice.getArea(undefined).done(function (data) {
            areas(data);
        });

        if (id > 0) {

            changeStatus(true);

            dataservice.getPharmaciesById(pharmcy, id).done(function (data) {
                if (pharmcy().areaId()) {
                    areaId(pharmcy().areaId());
                }
            });

        } else {

            changeStatus(false);
        }
    };

    function addpharmcy(obj, event) {
        var isValid = $('#AccountEditForm').valid();
        if (isValid) {
            if (changeStatus() === true) {
                dataservice.editPharmacies(pharmcy()).done(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                }).fail(function () { 
                    $.smallBox({
                        title: "Operation was canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Canceled delete...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                });
            } else {
                dataservice.addPharmacies(pharmcy()).done(function (data) {
                    $.smallBox({
                        title: "Operation completed successfuly",
                        content: "<i class='fa fa-clock-o'></i> <i>Record Updated successfuly...</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 2000
                    });

                }).fail(function () { 
                    $.smallBox({
                        title: "Operation was canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Canceled delete...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 2000
                    });
                });
            }

            router.navigate("pharmacies");
        } else {

            $('#AccountEditForm').validate();

        }
    };

    var vm = {
        title: config.language.pharmcy[config.currentLanguage()],
        attached: attached,
        activate: activate,
        pharmcy: pharmcy,
        language: config.language,
        currentLanguage: config.currentLanguage,
        resetWarning: resetWarning,
        addpharmcy: addpharmcy,
        areaId: areaId,
        areas: areas

    };
    return vm;
});