﻿define(['services/dataservice', 'config'], function (dataservice, config) {
    var vm = {};

    var knockoutGrid = {};

    vm.gridOptions = ko.observable();

    vm.language = config.language;

    vm.compositionComplete = function () {

    };

    vm.currentLanguage = config.currentLanguage;

    vm.title = 'Manager Audit';

    vm.summary = ko.observableArray([]);

    config.currentLanguage.subscribe(function () {
        $(".jarviswidget-toggle-btn").attr("data-original-title", config.language.collapse[config.currentLanguage()]);
        $(".jarviswidget-fullscreen-btn").attr("data-original-title", config.language.fullscreen[config.currentLanguage()]);
    });

    vm.requestsArray = ko.observableArray([]);

    vm.activate = function () {

        dataservice.getOrdersAccountantApproval().done(function (data) {

            vm.knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });

        vm.knockoutGrid = new config.KoGridInstanceCreator();


        vm.knockoutGrid.columnDefs([
             vm.knockoutGrid.createColumnDefinition('agentName', config.language.agent[config.currentLanguage()], 150, '10%', 'string'),
             vm.knockoutGrid.createColumnDefinition('subject', config.language.subject[config.currentLanguage()], 150, '10%', 'string'),
             vm.knockoutGrid.createColumnDefinition('orderTypeName', config.language.type[config.currentLanguage()], 150, '10%', 'string'),
             vm.knockoutGrid.createColumnDefinition('clientName', config.language.client[config.currentLanguage()], 150, '15%', 'string'),
             vm.knockoutGrid.createColumnDefinition('orderDate', config.language.orderDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
             vm.knockoutGrid.createColumnDefinition('estimateDate', config.language.estimateDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
             vm.knockoutGrid.createColumnDefinition('deliverdDate', config.language.visitDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
             vm.knockoutGrid.createColumnDefinition('netTotal', config.language.total[config.currentLanguage()], 150, '5%', 'string'),
             vm.knockoutGrid.createColumnDefinition('supervisorStatus', config.language.supervisorStatus[config.currentLanguage()], 150, '10%', 'string'),
             vm.knockoutGrid.createColumnDefinition('deliverdStatus', config.language.deliverdStatus[config.currentLanguage()], 150, '10%', 'string'),
             vm.knockoutGrid.createColumnDefinition('supervisorDate', config.language.supervisorDate[config.currentLanguage()], 150, '15%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') }),
             vm.knockoutGrid.createColumnDefinition('lastEditName', config.language.lastEditBy[config.currentLanguage()], 150, '10%', 'string'),
             vm.knockoutGrid.createColumnDefinition('lastEditDate', config.language.lastEditDate[config.currentLanguage()], 150, '10%', 'date', function (data) { return moment(data).format('DD/MM/YYYY') })
        ]);

        vm.knockoutGrid.gridSelectionChange(function (rowItem, event) {
            if (event.target.type && (event.target.type.toLowerCase() === 'checkbox')) {
                if (rowItem.selected()) {
                    vm.requestsArray.push(rowItem.entity.id);
                    return true;
                } else {
                    vm.requestsArray.pop(rowItem.entity.id);
                    return true;
                }
            }
        });

        vm.gridOptions(vm.knockoutGrid.getGridOptions()());

 
    };

    vm.approvalRequests = function (obj, e) {

        $(e.target).button('loading');

        ko.utils.arrayForEach(vm.requestsArray(), function (_obj) {
            dataservice.approvalRequestsOfOrdersAccountant(_obj, true);
        });


        dataservice.getOrdersAccountantApproval().done(function (data) {
            vm.requestsArray([]);

            vm.knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });

        $(e.target).button('reset');


    };
    vm.approvalRequestsRejected = function (obj, e) {

        $(e.target).button('loading');

        ko.utils.arrayForEach(vm.requestsArray(), function (_obj) {
            dataservice.approvalRequestsOfOrdersAccountant(_obj, false);
        });

        dataservice.getOrdersAccountantApproval().done(function (data) {
            vm.requestsArray([]);

            vm.knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });

        $(e.target).button('reset');
    };


    return vm;
});