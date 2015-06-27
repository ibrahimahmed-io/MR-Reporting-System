define(['services/dataservice', 'config'], function (dataservice, config) {
    var vm = {};

    //vm.taskTree = function () {
    //    var self = this;

    //    self.subject = ko.observable();
    //    self.docNo = ko.observable();
    //    self.oppenedDate = ko.observable();
    //    self.projectName = ko.observable();
    //    self.openedBy = ko.observable();
    //    self.docNo = ko.observable();
    //};

    var knockoutGrid = {};

    vm.gridOptions = ko.observable();

    vm.pageNumber = ko.observable(0);

    vm.docType = ko.observable();

    vm.language = config.language;

    vm.compositionComplete = function () {

        $('#dataTableOppenedDocuments').on('click', '.load-more', function (e) {
            vm.pageNumber(vm.pageNumber() + 1);
        });

    };

    vm.pageNumber.subscribe(function (value) {

        $(".loading-data").removeClass("hidden");

        dataservice.getDocTypeByProjectIdOpened(vm.docType(), undefined, value);
    });

    vm.currentLanguage = config.currentLanguage;

    vm.title = config.language.alertVisits[config.currentLanguage()];

    vm.summary = ko.observableArray([]);
 
    config.currentLanguage.subscribe(function () {
        $(".jarviswidget-toggle-btn").attr("data-original-title", config.language.collapse[config.currentLanguage()]);
        $(".jarviswidget-fullscreen-btn").attr("data-original-title", config.language.fullscreen[config.currentLanguage()]);
    });

    vm.activate = function () {

        dataservice.getAlertVisits(vm.summary);
 
        vm.knockoutGrid = new config.KoGridInstanceCreator();


       vm.knockoutGrid.columnDefs([
                vm.knockoutGrid.createColumnDefinition('agentName', config.language.ContactName[config.currentLanguage()], 155, '15%', 'string'),
               vm.knockoutGrid.createColumnDefinition('typeName', config.language.typeName[config.currentLanguage()], 200, '5%', 'string'),
               vm.knockoutGrid.createColumnDefinition('visitToName', config.language.visitTo[config.currentLanguage()], 200, '10%', 'string'),
               vm.knockoutGrid.createColumnDefinition('visitDate', config.language.VisitDate[config.currentLanguage()], 150, '10%', 'string'),
               vm.knockoutGrid.createColumnDefinition('description', config.language.description[config.currentLanguage()], 50, '10%', 'int'),
               vm.knockoutGrid.createColumnDefinition('drugsName', config.language.drugName[config.currentLanguage()], 200, '15%', 'string'),
               vm.knockoutGrid.createColumnDefinition('status', config.language.status[config.currentLanguage()], 150, '10%', 'string'),
               vm.knockoutGrid.createColumnDefinition('notes', config.language.notes[config.currentLanguage()], 50, '10%', 'int')
        ]);

        vm.knockoutGrid.displaySelectionCheckbox(false);

        vm.knockoutGrid.loadMoreData(function (obj, e) {
            obj.isLoadingMoreData(true);

            vm.pageNumber(vm.pageNumber() + 1);

            var currentPageNumber = vm.pageNumber();

            dataservice.getDocTypeByProjectIdOpened(vm.docType(), undefined, currentPageNumber).success(function (data) {

                vm.knockoutGrid.loadMoreRecords(data);
                obj.isLoadingMoreData(false);
            }).fail(function () {
                obj.isLoadingMoreData(false);
            });

        });

      

        vm.gridOptions(vm.knockoutGrid.getGridOptions()());

        //delete
        //if (config.isAllow(3163)) {
        //    vm.knockoutGrid.displaySelectionCheckbox(true);
        //} else {
        //    vm.knockoutGrid.displaySelectionCheckbox(false);
        //}


    };

    vm.showModal = function (obj, event) {
         
        dataservice.getAlertVisitsDetail(obj.item).success(function (data) {

            vm.knockoutGrid.setInitialData(data);

            $(".loading-data").addClass("hidden");
        });

        $("#openedModal").modal("show");
    };

    return vm;
});