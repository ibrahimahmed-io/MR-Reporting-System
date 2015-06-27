define(['services/dataservice', 'config'], function (dataservice, config) {
    var vm = {};

    vm.title = config.language.notCodedExpensesSummary[config.currentLanguage()];

    vm.summary = ko.observableArray([]);

    vm.dataTable = new config.GridModel();

    vm.dataTable.data([]);

    vm.expensesDto = ko.observable({
        contactId: ko.observable(),
        fromDate: ko.observable(),
        toDate: ko.observable(),
        projectId: ko.observable()
    });

    vm.dataSource = new config.JqxGridDataSource();

    vm.columns = new config.JqxGridColumns();

    vm.activate = function () {
        dataservice.getNotCodedExpensesSummary(vm.summary);

        vm.dataSource.datafields = [{
            name: 'id', type: 'int'
        }, {
            name: 'description', type: 'string'
        }, {
            name: 'expenseTypeName', type: 'string'
        }, {
            name: 'total', type: 'int'
        }, {
            name: 'projectName', type: 'string'
        }, {
            name: 'unitRate', type: 'int'
        }, {
            name: 'expenseValue', type: 'int'
        }, {
            name: 'docDate', type: 'string'
        }];

        vm.columns.gridColumns([{
            text: config.language.View[config.currentLanguage()],
            datafield: 'id',
            cellsrenderer: function (row) {
                var id = $('#dataTable').jqxGrid('getrowid', row);
                return '<button class="view" data-id="' + id + '"  ><i class="ibrahimicon ibrahimicon-edit"></i></button>';
            },
            filterable: false,
            groupable: false,
            sortable: false,
            columnsreorder: false,
            width: '10%',
            resizable: false,
            draggable: false,
            hidden: false
        },{
            text: config.language.projectName[config.currentLanguage()],
            datafield: 'projectName',
            columntype: 'textbox',
            filtertype: 'input',
            width: '10%',
            hidden: false
        }, {
            text: config.language.description[config.currentLanguage()],
            datafield: 'description',
            columntype: 'textbox',
            filtertype: 'input',
            width: '10%',
            hidden: false
        }, {
            text: config.language.expenseType[config.currentLanguage()],
            datafield: 'expenseTypeName',
            filtertype: 'textbox',
            width: '10%',
            hidden: false
        }, {
            text: config.language.expenses[config.currentLanguage()],
            datafield: 'expenseValue',
            columntype: 'textbox',
            filtertype: 'input',
            width: '10%',
            hidden: false
        }, {
            text: config.language.unitRate[config.currentLanguage()],
            datafield: 'unitRate',
            columntype: 'textbox',
            filtertype: 'input',
            width: '15%',
            hidden: false
        }, {
            text: config.language.total[config.currentLanguage()],
            datafield: 'total',
            columntype: 'textbox',
            filtertype: 'input',
            width: '15%',
            hidden: false
        }, {
            text: config.language.docDate[config.currentLanguage()],
            datafield: 'docDate',
            columntype: 'textbox',
            filtertype: 'input',
            width: '15%',
            hidden: false
        }]);
    };

    vm.showModal = function (obj, e) {
        $("#ExpensesModal").modal("show");
        dataservice.getNotCodedExpensesSummaryDetail(obj.item, vm.dataTable);
    };

    vm.language = config.language;

    vm.currentLanguage = config.currentLanguage;

    return vm;
});