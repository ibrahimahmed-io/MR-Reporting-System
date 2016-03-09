define(['services/dataservice', 'config'], function (dataservice, config) {
    var visit = function () {
        var self = this;

        self.id = ko.observable();
        self.agentId = ko.observable();
        self.drugsId = ko.observable();
        self.typeId = ko.observable();
        self.visitTo = ko.observable();
        self.visitDate = ko.observable();
        self.description = ko.observable();
        self.duration = ko.observable();
        self.isMorning = ko.observable();
        self.notes = ko.observable();
    };

    visit.prototype = {
        initialize: function () {
            this.id(0);
            this.agentId(0);
            this.drugsId(0);
            this.typeId(0);
            this.visitTo(0);
            this.visitDate(moment().format('DD/MM/YYYY'));
            this.description('');
            this.duration('00:00');
            this.isMorning(false);
            this.notes('');
        },
        fill: function (data) {
            this.id(data.id);
            this.agentId(data.agentId);
            this.drugsId(data.drugsId);
            this.typeId(data.typeId);
            this.visitTo(data.visitTo);
            this.visitDate(moment(data.visitDate).format('DD/MM/YYYY'));
            this.description(data.description);
            this.duration(data.duration);
            this.isMorning(data.isMorning);
            this.notes(data.notes);
        },
        getServerObject: function () {
            return {
                id: this.id(),
                agentId: this.agentId(),
                drugsId: this.drugsId(),
                typeId: this.typeId(),
                visitTo: this.visitTo(),
                visitDate: moment(this.visitDate(), 'DD/MM/YYYY').format(),
                description: this.description(),
                duration: this.duration(),
                isMorning: this.isMorning(),
                notes: this.notes()
            }
        }
    }

    var visitObject = ko.observable();

    var agents = ko.observableArray([]);
    var drugs = ko.observableArray([]);
    var types = ko.observableArray([]);
    var visitees = ko.observableArray([]);

    var isEdit = ko.observable();

    var visitsAddEditLabel = ko.observable();

    var activate = function (visitId) {

        visitees([]);

        visitObject(new visit());

        visitObject().initialize();

        dataservice.getAccounts().success(function (data) {
            agents(data);
        });

        dataservice.getDrugs().success(function (data) {
            drugs(data);
        });

        dataservice.getTypesForVisits().success(function (data) {
            types(data);
        });

        visitObject().typeId.subscribe(function (value) {
            var type = ko.utils.arrayFirst(types(), function (item) {
                return item.id === value;
            });

            if (type) {
                if (type.action === 1) {
                    dataservice.getDocotors().success(function(data) {
                        visitees(data);
                    });
                } else if (type.action === 2) {
                    dataservice.getPharmacies().success(function(data) {
                        visitees(data);
                    });
                } else {
                    dataservice.getHospitals().success(function(data) {
                        visitees(data);
                    });
                }
            }
        });

        isEdit((visitId !== 0) ? true : false);

        visitsAddEditLabel(config.language.visits[config.currentLanguage()] + ' - ' + config.language.goAdd[config.currentLanguage()]);

        if (isEdit()) {
            
            dataservice.getVisitsById(undefined, parseInt(visitId)).success(function (data) {
                visitObject().fill(data);
            });
            visitsAddEditLabel(config.language.visits[config.currentLanguage()] + ' - ' + config.language.goEdit[config.currentLanguage()]);
        }

    };

    var addVisit = function (obj, e) {
        $(e.target).button('loading');
        dataservice.addVisits(visitObject().getServerObject()).success(function () {
            $(e.target).button('reset');
        });
    }

    var editVisit = function (obj, e) {
        $(e.target).button('loading');
        dataservice.editVisits(visitObject().getServerObject()).success(function () {
            $(e.target).button('reset');
        });
    }

    var vm = {
        isEdit: isEdit,
        visitObject: visitObject,
        activate: activate,
        addVisit: addVisit,
        editVisit: editVisit,
        language: config.language,
        currentLanguage: config.currentLanguage,
        visitsAddEditLabel: visitsAddEditLabel,
        agents: agents,
        drugs: drugs,
        types: types,
        visitees: visitees
    }

    return vm;
});