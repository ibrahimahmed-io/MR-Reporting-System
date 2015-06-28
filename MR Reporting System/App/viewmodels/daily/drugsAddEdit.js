define(['services/dataservice', 'config'], function (dataservice, config) {
    var drug = function () {
        var self = this;

        self.id = ko.observable();
        self.name = ko.observable();
        self.description = ko.observable();
        self.code = ko.observable();
        self.price = ko.observable();
        self.sectionId = ko.observable();
        self.notes = ko.observable();
        self.companyId = ko.observable();
    };

    drug.prototype = {
        initialize: function () {
            this.id(0);
            this.name("");
            this.description("");
            this.code("");
            this.price(0);
            this.sectionId(0);
            this.notes("");
            this.companyId(0);
        },
        fill: function (data) {
            this.id(data.id);
            this.name(data.name);
            this.description(data.description);
            this.code(data.code);
            this.price(data.price);
            this.sectionId(data.sectionId);
            this.notes(data.notes);
            this.companyId(data.companyId);
        },
        getServerObject: function () {
            return {
                id: this.id,
                name: this.name,
                description: this.description,
                code: this.code,
                price: this.price,
                sectionId: this.sectionId,
                notes: this.notes,
                companyId: this.companyId
            }
        }
    }

    var drugObject = ko.observable();

    var sections = ko.observableArray([]);

    var companies = ko.observableArray([]);

    var isEdit = ko.observable();

    var drugsAddEditLabel = ko.observable();

    var activate = function (drugId) {
        drugObject(new drug());

        drugObject().initialize();

        isEdit((drugId !== 0) ? true : false);

        drugsAddEditLabel(config.language.drugs[config.currentLanguage()] + ' - ' + config.language.goAdd[config.currentLanguage()]);

        if (isEdit()) {
            dataservice.getDrugsById(undefined, parseInt(drugId)).success(function (data) {
                drugObject().fill(data);
            });
            drugsAddEditLabel(config.language.drugs[config.currentLanguage()] + ' - ' + config.language.goEdit[config.currentLanguage()]);
        }

        dataservice.getCompanies().success(function (data) {
            companies(data);
        });

        dataservice.getSections().success(function (data) {
            sections(data);
        });
    };

    var addDrug = function (obj, e) {
        $(e.target).button('loading');
        dataservice.addDrugs(drugObject().getServerObject()).success(function() {
            $(e.target).button('reset');
        });
    }

    var editDrug = function (obj, e) {
        $(e.target).button('loading');
        dataservice.editDrugs(drugObject().getServerObject()).success(function () {
            $(e.target).button('reset');
        });
    }

    var vm = {
        isEdit: isEdit,
        drugObject: drugObject,
        activate: activate,
        addDrug: addDrug,
        editDrug: editDrug,
        language: config.language,
        currentLanguage: config.currentLanguage,
        sections: sections,
        companies: companies,
        drugsAddEditLabel: drugsAddEditLabel
    }

    return vm;
});