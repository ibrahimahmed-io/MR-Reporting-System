define(['text!resources.json', 'text!permissions.json', 'services/tokenstore', 'services/export'], function (resources, permissions, tokenStore, exportService) {
    var routes = [{
        route: '',
        moduleId: 'dashboard',
        title: 'Dashboard',
        nav: true,
        settings: { Dashboard: true }
    }, {
        route: 'accounts',
        moduleId: 'admin/accounts',
        title: 'Agents',
        nav: true,
        settings: { admin: true }
    }, {
        route: 'accountsAdd/:param1*detail',
        moduleId: 'admin/accountsAdd',
        title: 'Agents Add',
        nav: true,
        settings: { admin: false }
    }, {
        route: 'accountsDefaultList',
        moduleId: 'admin/accountsDefaultList',
        title: 'Default List',
        nav: true,
        settings: { admin: true }
    }, {
        route: 'doctors',
        moduleId: 'daily/doctors',
        title: 'Doctors',
        nav: true,
        settings: { daily: true }
    }, {
        route: 'doctorsAdd/:param1*detail',
        moduleId: 'daily/doctorsAdd',
        title: 'Doctors Add',
        nav: true,
        settings: { daily: false }
    }, {
        route: 'hospitals',
        moduleId: 'daily/hospitals',
        title: 'Hospitals',
        nav: true,
        settings: { daily: true }
    }, {
        route: 'hospitalAdd/:param1*detail',
        moduleId: 'daily/hospitalAdd',
        title: 'Hospitals Add',
        nav: true,
        settings: { daily: false }
    }, {
        route: 'pharmacies',
        moduleId: 'daily/pharmacies',
        title: 'Pharmacies',
        nav: true,
        settings: { daily: true }
    }, {
        route: 'pharmacyAdd/:param1*detail',
        moduleId: 'daily/pharmacyAdd',
        title: 'Pharmacy Add',
        nav: true,
        settings: { daily: false }
    }, {
        route: 'distributer',
        moduleId: 'admin/distributer',
        title: 'Distributers',
        nav: true,
        settings: { admin: true }
    }, {
        route: 'distributerAdd/:param1*detail',
        moduleId: 'admin/distributerAdd',
        title: 'Distributer Add',
        nav: true,
        settings: { admin: false }
    }, {
        route: 'permissionsGroups',
        moduleId: 'admin/permissionsGroups',
        title: 'Permissions Groups ',
        nav: true,
        settings: { admin: true }
    }, {
        route: 'permissionsGroupsPermissions/:param1*detail',
        moduleId: 'admin/permissionsGroupsPermissions',
        title: 'Permissions Groups Permissions',
        nav: true,
        settings: { admin: false }
    }, {
        route: 'visitCost',
        moduleId: 'reports/visitCost',
        title: 'Visits Cost',
        nav: true,
        settings: { reports: true }
    }, {
        route: 'visitsByAgent',
        moduleId: 'reports/visitsByAgent',
        title: 'Visits by Agent',
        nav: true,
        settings: { reports: true }
    }, {
        route: 'visitsByArea',
        moduleId: 'reports/visitsByArea',
        title: 'Visits by Area',
        nav: true,
        settings: { reports: true }
    }, {
        route: 'Drugs',
        moduleId: 'daily/drugs',
        title: 'Drugs & Tools',
        nav: true,
        settings: { daily: true }
    }, {
        route: 'DrugsAddEdit/(:id)',
        moduleId: 'daily/drugsAddEdit',
        title: 'Drugs',
        nav: false,
        settings: { daily: true }
    }, {
        route: 'Visits',
        moduleId: 'daily/visits',
        title: 'Visits',
        nav: true,
        settings: { daily: true }
    }, {
        route: 'VisitsAddEdit/(:id)',
        moduleId: 'daily/visitsAddEdit',
        title: 'Visits',
        nav: false,
        settings: { daily: true }
    }, {
        route: 'orders',
        moduleId: 'daily/orders',
        title: 'orders',
        nav: true,
        settings: { daily: true }
    }, {
        route: 'ordersAddEdit/(:id)',
        moduleId: 'daily/ordersAddEdit',
        title: 'orders Add Edit',
        nav: false,
        settings: { daily: true }
    }, {
        route: 'VisitsOnDrug',
        moduleId: 'reports/visitsOnDrug',
        title: 'Visits On Drug',
        nav: true,
        settings: { reports: true }
    }, {
        route: 'totalOfSales',
        moduleId: 'ERPReports/totalOfSales',
        title: 'Agent Of Totals',
        nav: true,
        settings: { ERPReports: true }
    }];

    var isPageSetup = ko.observable(false);

    var pageSize = ko.observable(200);

    function getAuthenticationHeader() {
        var token = tokenStore.getToken();

        return !!token ? token : "";
    }

    function postJson(url, data) {
        return new window.Promise(function (resolve, reject) {

            var req = new XMLHttpRequest();
            req.open('POST', url, true);

            req.setRequestHeader("Content-type", "application/json");

            var token = tokenStore.getToken();
            if (token)
                req.setRequestHeader("Authorization", token);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(this);
                }
                else {
                    reject(Error(req.statusText));
                }
            };

            req.onerror = function () {
                reject(Error("Network Error"));
            };

            req.send(JSON.stringify(data));
        });
    };

    //Jquery Validation Custom Validators
    (function ($) {
        //validates if value > 0
        $.validator.addMethod("greaterThanZero", function (value, element, param) {
            return this.optional(element) || parseFloat(value) > 0;
        }, "Please insert a value greater than Zero");

        $.validator.addMethod("dateFormat", function (value, element) {
            return value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/);
        }, "Please enter a date in the format dd/mm/yyyy.");

        $.validator.addMethod('minOrEqual', function (value, el, param) {
            return parseFloat(value) >= param;
        }, "P");
    })(jQuery);

    var language = JSON.parse(resources);

    var userPermissions = ko.observableArray([]);

    //var permission = ko.mapping.fromJS(JSON.parse(permissions)).authorization;


    var currentLanguage = ko.observable();

    if (localStorage.getItem('language')) {
        currentLanguage(localStorage.getItem('language'));
    } else {
        currentLanguage('en');
    }

    var isAllow = function (code) {
        if (isCompany() === false) {
            var isAllowed = true;
            if (isAllowed != -1) {
                return true;
            } else {
                return false;

            }
        } else {
            return true;
        }


    };

    var exportColumn = function (friendlyName, fieldName, type) {
        var self = this;

        self.title = friendlyName;
        self.key = fieldName;
        self.type = type;
    };

    var exportJson = function (jsonData, exportColumns, fileType, fileName) {
        if (fileType === 'excel') {
            exportService.excelExportingService(jsonData, exportColumns, 'Procoor Exporting Service - ' + fileName);
        } else if (fileType === 'pdf') {
            exportService.pdfExportingService(jsonData, exportColumns, 'Procoor Exporting Service - ' + fileName);
        } else if (fileType === 'word') {
            exportService.wordExportingService(jsonData, exportColumns, 'Procoor Exporting Service - ' + fileName);
        }
    };

    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().datepickerOptions || {};
            $(element).datepicker(options);

            ko.utils.registerEventHandler(element, "changeDate", function (event) {
                var value = valueAccessor();
                if (ko.isObservable(value)) {
                    value(!!event.target.value ? moment(event.date).format("DD/MM/YYYY") : '');
                }
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());

            var val = !!value ? moment(value, "DD/MM/YYYY").format("DD-MM-YYYY") : '';

            if (val) {
                $(element).datepicker('update', val);
            }
        }
    };

    ko.bindingHandlers.select2 = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var obj = valueAccessor(),
                allBindings = allBindingsAccessor(),
                lookupKey = allBindings.lookupKey;

            $(element).select2(obj);

            if (lookupKey) {
                var value = ko.utils.unwrapObservable(allBindings.value);

                $(element).select2('data', ko.utils.arrayFirst(obj.data.results, function (item) {
                    return item[lookupKey] === value;
                }));
            }

            allBindings.options.subscribe(function (v) {
                if (v.length > 0) {
                    $(element).trigger('change');
                }
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var allBindings = allBindingsAccessor(),
            value = ko.utils.unwrapObservable(allBindings.value || allBindings.selectedOptions);

            if (value) {
                if (allBindings.options().length > 0) {
                    $(element).select2('val', value);
                }
            }
        }
    };

    ko.bindingHandlers.iCalendar = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var obj = valueAccessor();

            if (obj().length > 0) {
                var iCalendar = $(element).calendar({
                    tmpl_path: "/app/views/templates/calendar/",
                    events_source: obj()
                });

                $('.btn-group button[data-calendar-nav]').each(function () {
                    var $this = $(this);
                    $this.click(function () {
                        iCalendar.navigate($this.data('calendar-nav'));
                    });
                });

                $('.btn-group button[data-calendar-view]').each(function () {
                    var $this = $(this);
                    $this.click(function () {
                        iCalendar.view($this.data('calendar-view'));
                    });
                });
            }
        },
        update: function (element, valueAccessor) {
            var obj = valueAccessor();

            if (obj().length > 0) {
                var iCalendar = $(element).calendar({
                    tmpl_path: "/app/views/templates/calendar/",
                    events_source: obj()
                });

                $('.btn-group button[data-calendar-nav]').each(function () {
                    var $this = $(this);
                    $this.click(function () {
                        iCalendar.navigate($this.data('calendar-nav'));
                    });
                });

                $('.btn-group button[data-calendar-view]').each(function () {
                    var $this = $(this);
                    $this.click(function () {
                        iCalendar.view($this.data('calendar-view'));
                    });
                });
            }
        }
    };

    ko.bindingHandlers.daterangepicker = {
        update: function (element, valueAccessor) {
            var value = valueAccessor();

            var valueUnwrapped = ko.unwrap(value);

            $(element).daterangepicker({
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                startDate: moment(),
                endDate: moment()
            }, function (start, end) {
                $(element).children("span").text(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            });

            $(element).on('apply.daterangepicker', function (ev, picker) {
                valueUnwrapped.startDate(picker.startDate);
                valueUnwrapped.endDate(picker.endDate);

                value.valueHasMutated();
            });
        }
    };

    ko.bindingHandlers.chart = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().chartOptions() || {};

            var value = valueAccessor();

            var valueUnwrapped = ko.unwrap(value);

            if ((valueUnwrapped instanceof Array) ? (valueUnwrapped.length > 0) : !!valueUnwrapped) {
                if ($(element).data('highcharts-chart')) {
                    $(element).highcharts().destroy();
                }

                $(element).highcharts(options);
            }
        }
    };

    ko.bindingHandlers.setWidget = {
        init: function (element, valueAccessor) {
            var observable = valueAccessor();

            if (!observable()) {
                observable(true);
            }
        }
    };

    ko.bindingHandlers.unsetWidget = {
        init: function (element, valueAccessor) {
            var observable = valueAccessor();

            if (observable()) {
                observable(false);
            }
        }
    };

    ko.bindingHandlers.booleanValue = {
        init: function (element, valueAccessor) {
            var observable = valueAccessor(),
                interceptor = ko.computed({
                    read: function () {
                        if (observable()) {
                            return observable().toString();
                        } else {
                            return "";
                        }
                    },
                    write: function (newValue) {
                        if ((newValue === "true") || (newValue === "false")) {
                            observable(newValue === "true");
                        } else {
                            observable("");
                        }
                    }
                });

            ko.applyBindingsToNode(element, { value: interceptor });
        }
    };

    var koGridInstanceCreator = function () {
        var gridOptions = ko.observable({});

        var currentFilteredData = ko.observableArray([]);

        var appliedFilters = ko.observableArray([]);

        var filterString = function (value, field, filteredData) {
            filteredData(ko.utils.arrayFilter(filteredData(), function (item) {
                return item[field] && item[field].toLowerCase().indexOf(value) !== -1;
            }));

            var pagedData = filteredData();

            if (filteredData() > 20) {
                pagedData = filteredData().slice(((1 + 1) - 1) * 20, (1 + 1) * 20);
            }

            currentFilteredData(pagedData);
        };

        var filterInteger = function (value, field, filteredData) {
            filteredData(ko.utils.arrayFilter(filteredData(), function (item) {
                var number = parseInt(value);

                if (!number) {
                    return true;
                }

                return item[field] && (item[field] === number);
            }));

            var pagedData = filteredData();

            if (filteredData() > 20) {
                pagedData = filteredData().slice(((1 + 1) - 1) * 20, (1 + 1) * 20);
            }

            currentFilteredData(pagedData);
        };

        var filterDate = function (value, field, filteredData) {
            if (value.endDate() && value.startDate()) {
                var startDate = moment(value.startDate(), "DD/MM/YYYY");
                var endDate = moment(value.endDate(), "DD/MM/YYYY");

                filteredData(ko.utils.arrayFilter(filteredData(), function (item) {
                    var date = moment(item[field]).format("DD/MM/YYYY");

                    return moment(date, "DD/MM/YYYY").isBetween(startDate, endDate) || (moment(date, "DD/MM/YYYY").diff(startDate, 'days') === 0) || (moment(date, "DD/MM/YYYY").diff(endDate, 'days') === 0);
                }));

                var pagedData = filteredData();

                if (filteredData() > 20) {
                    pagedData = filteredData().slice(((1 + 1) - 1) * 20, (1 + 1) * 20);
                }

                currentFilteredData(pagedData);
            } else if (!(value.endDate() && value.startDate())) {
                var filterExist = ko.utils.arrayFirst(appliedFilters(), function (item) {
                    return item.fieldValue === field;
                });

                appliedFilters.remove(filterExist);
            }
        };

        var filterBoolean = function (value, field, filteredData) {

            if (field === 'supervisorStatus') {
                if (value || (typeof value === 'boolean')) {
                    value = value ? language.approved[currentLanguage()] : 'Not Approved';
                } else {
                    value = null;
                }
            }

            if (field === 'ready') {
                if (value || (typeof value === 'boolean')) {
                    value = value ? language.ready[currentLanguage()] : language.notReady[currentLanguage()];
                } else {
                    value = null;
                }
            }
            if (field === 'deliverdStatus') {
                if (value || (typeof value === 'boolean')) {
                    value = value ? language.ready[currentLanguage()] : language.notReady[currentLanguage()];
                } else {
                    value = null;
                }
            }

            filteredData(ko.utils.arrayFilter(filteredData(), function (item) {
                return item[field] && (value === item[field]);
            }));

            var pagedData = filteredData();

            if (filteredData() > 20) {
                pagedData = filteredData().slice(((1 + 1) - 1) * 20, (1 + 1) * 20);
            }

            currentFilteredData(pagedData);
        };

        var originalData = ko.observableArray([]);

        var filteredData = ko.observableArray();

        var applyFilters = function () {
            currentFilteredData(originalData());

            filteredData(originalData());

            if (appliedFilters().length < 1) {
                gridOptions().pagingOptions.totalServerItems(currentFilteredData().length);
                gridOptions().pagingOptions.currentPage(0);
                gridOptions().pagingOptions.currentPage(1);
            }

            var totalAppliedFilters = 0;

            ko.utils.arrayForEach(appliedFilters(), function (item, index) {
                if (item.value || (typeof item.value === 'boolean')) {
                    if (item.filterType === 'string') {
                        filterString(item.value.toLowerCase(), item.fieldValue, currentFilteredData);
                    } else if (item.filterType === 'int') {
                        filterInteger(item.value, item.fieldValue, currentFilteredData);
                    } else if (item.filterType === 'date') {
                        filterDate(item.value, item.fieldValue, currentFilteredData);
                    } else if (item.filterType === 'status') {
                        filterBoolean(item.value, item.fieldValue, currentFilteredData);
                    }

                    totalAppliedFilters++;
                } else {
                    if (index === (appliedFilters().length - 1)) {
                        if (totalAppliedFilters === 0) {
                            totalAppliedFilters = false;
                        }
                    }
                }
            });

            if (totalAppliedFilters) {
                gridOptions().pagingOptions.totalServerItems(currentFilteredData().length);
                filteredData(currentFilteredData());
                gridOptions().pagingOptions.currentPage(0);
                gridOptions().pagingOptions.currentPage(1);
            }
        };

        appliedFilters.subscribe(function (value) {
            applyFilters();
        });

        var headerCellTemplate = function (filterType, fieldValue, filterValue) {
            filterValue.subscribe(function (value) {
                var filterObject = { filterType: filterType, value: value, fieldValue: fieldValue };

                var filterExist = ko.utils.arrayFirst(appliedFilters(), function (item) {
                    return item.fieldValue === fieldValue;
                });

                if (!filterExist) {
                    appliedFilters.push(filterObject);
                } else {
                    var filterObjectIndex = appliedFilters.indexOf(filterExist);

                    if (value || (typeof value === 'boolean')) {
                        appliedFilters()[filterObjectIndex].value = value;
                        appliedFilters.valueHasMutated();
                    } else {
                        appliedFilters.remove(filterExist);
                    }
                }
            });

            var filterTemplate = '';

            if (filterType === 'string') {
                filterTemplate = '<input class="form-control" data-filter="' + filterType + '" style="margin: 5px; width: 75%;" data-bind="attr: { \'placeholder\': displayName() + \'...\' }, textInput: filterValue" type="text" />';
            } else if (filterType === 'int') {
                filterTemplate = '<input class="form-control" data-filter="' + filterType + '" style="margin: 5px; width: 60%;" data-bind="attr: { \'placeholder\': displayName() + \'...\' }, textInput: filterValue" type="number" />';
            } else if (filterType === 'date') {
                filterValue().startDate.subscribe(function (value) {
                    filterValue.valueHasMutated();
                });

                filterValue().endDate.subscribe(function (value) {
                    filterValue.valueHasMutated();
                });
                filterTemplate = '<div style="margin: 5px"><div class="input-daterange input-group"><input data-bind="datepicker: filterValue().startDate, datepickerOptions: { format: \'dd/mm/yyyy\', todayBtn: \'linked\', autoclose: true, clearBtn: true }" type="text" class="input-sm form-control" /><span class="input-group-addon">to</span><input data-bind="datepicker: filterValue().endDate, datepickerOptions: { format: \'dd/mm/yyyy\', todayBtn: \'linked\', autoclose: true, clearBtn: true }" type="text" class="input-sm form-control" /></div></div>';
            } else if (filterType === 'status') {
                filterTemplate = '<div style="margin: 5px; width: 75%;"><select class="form-control" data-bind="booleanValue: filterValue" required><option>' + language.selectStatus[currentLanguage()] + '</option> <option value="true">Approved</option><option value="false">Not Approved</option></select></div>';
            } else if (filterType === 'deliverd') {
                filterTemplate = '<div style="margin: 5px; width: 75%;"><select class="form-control" data-bind="booleanValue: filterValue" required><option>' + language.selectStatus[currentLanguage()] + '</option> <option value="true">Deliverd</option><option value="false">Not Deliverd</option></select></div>';
            } else if (filterType === 'ready') {
                filterTemplate = '<div style="margin: 5px; width: 75%;"><select class="form-control" data-bind="booleanValue: filterValue" required><option>' + language.selectStatus[currentLanguage()] + '</option> <option value="true">Ready</option><option value="false">Not Ready</option></select></div>';
            }

            return '<div><div style="border-bottom: 1px solid rgb(212,212,212);" data-bind="click: sort, css: {\'kgSorted\': !noSortVisible }, attr: {\'class\': \'kgHeaderSortColumn \' + headerClass()}" draggable="true"><div data-bind="attr: { \'class\': \'colt\' + $index() + \' kgHeaderText\' }, html: displayName"></div><div class="kgSortButtonDown" data-bind="visible: showSortButtonDown" style="display: none;"></div><div class="kgSortButtonUp" data-bind="visible: showSortButtonUp" style="display: none;"></div><div data-bind="visible: resizable, click: gripClick, mouseEvents: { mouseDown: gripOnMouseDown }" class="kgHeaderGrip"></div></div>' + filterTemplate + '</div>';
        };

        var createColumnDefinition = function (field, displayName, minWidth, width, filterType, cellFormat, cellTemplate) {
            var columnDef = {
                field: field,
                displayName: displayName,
                minWidth: minWidth,
                width: width,
                filterValue: ko.observable(),
                headerCellTemplate: ''
            };

            if (filterType === 'date') {
                columnDef.filterValue({
                    startDate: ko.observable(),
                    endDate: ko.observable()
                });
            }

            if (cellFormat) {
                columnDef.cellFormatter = cellFormat;
            }

            if (cellTemplate) {
                columnDef.cellTemplate = '<div data-bind="attr: { \'class\': \'kgCellText colt\' + $index()}">' + cellTemplate + '</div>';
            }

            if (filterType) {
                var headerTemplate = headerCellTemplate(filterType, field, columnDef.filterValue);

                columnDef.headerCellTemplate = headerTemplate;
            }

            return columnDef;
        };

        var loadMoreData = ko.observable();

        loadMoreData.subscribe(function (value) {
            gridOptions().loadMoreData = value;
        });

        gridOptions({
            data: currentFilteredData,
            pagingOptions: {
                pageSizes: ko.observableArray([20, 100, 200]),
                pageSize: ko.observable(20),
                totalServerItems: ko.observable(0),
                currentPage: ko.observable(0)
            },
            enableColumnResize: true,
            enablePaging: true,
            enableRowReordering: true,
            enableSorting: true,
            showGroupPanel: true,
            multiSelect: false,
            showFilter: false,
            displaySelectionCheckbox: true,
            afterSelectionChange: function () { },
            headerRowHeight: 75,
            columnDefs: [],
            groups: [],
            loadMoreData: function (obj, e) {

            }
        });

        var displaySelectionCheckbox = ko.observable();

        displaySelectionCheckbox.subscribe(function (value) {
            gridOptions().displaySelectionCheckbox = value;
        });

        var groups = ko.observableArray([]);

        groups.subscribe(function (value) {
            gridOptions().groups = value;
        });

        var selectWithCheckboxOnly = ko.observableArray([]);

        selectWithCheckboxOnly.subscribe(function (value) {
            gridOptions().selectWithCheckboxOnly = value;
        });

        var columnDefs = ko.observableArray([]);

        columnDefs.subscribe(function (value) {
            gridOptions().columnDefs = value;
        });

        var gridSelectionChange = ko.observable();

        gridSelectionChange.subscribe(function (value) {
            gridOptions().afterSelectionChange = value;
        });

        gridOptions().pagingOptions.currentPage.subscribe(function (value) {
            var pages = filteredData().length / gridOptions().pagingOptions.pageSize();
            var ceiledPages = Math.ceil(filteredData().length / gridOptions().pagingOptions.pageSize());
            var pageSize = gridOptions().pagingOptions.pageSize();
            var currentGridPage = value;

            var pagedData = [];

            if (ceiledPages === value) {
                if (pages < ceiledPages) {
                    pagedData = filteredData().slice((currentGridPage - 1) * ((pages % 1) * pageSize), currentGridPage * ((pages % 1) * pageSize));
                } else {
                    pagedData = filteredData().slice((currentGridPage - 1) * pageSize, currentGridPage * pageSize);
                }
            } else {
                pagedData = filteredData().slice((currentGridPage - 1) * pageSize, currentGridPage * pageSize);
            }

            currentFilteredData(pagedData);
        });

        gridOptions().pagingOptions.pageSize.subscribe(function (value) {
            if (gridOptions().pagingOptions.currentPage() === 1) {
                var pages = filteredData().length / value;
                var ceiledPages = Math.ceil(filteredData().length / value);
                var pageSize = value;
                var currentGridPage = gridOptions().pagingOptions.currentPage();

                var pagedData = [];

                if (ceiledPages === currentGridPage) {
                    if (pages < ceiledPages) {
                        pagedData = filteredData().slice((currentGridPage - 1) * ((pages % 1) * pageSize), currentGridPage * ((pages % 1) * pageSize));
                    } else {
                        pagedData = filteredData().slice((currentGridPage - 1) * pageSize, currentGridPage * pageSize);
                    }
                } else {
                    pagedData = filteredData().slice((currentGridPage - 1) * pageSize, currentGridPage * pageSize);
                }

                currentFilteredData(pagedData);
            } else {
                gridOptions().pagingOptions.currentPage(1);
            }
        });

        var setInitialData = function (data) {
            originalData(data);

            currentFilteredData(data);

            applyFilters();

            gridOptions().pagingOptions.totalServerItems(originalData().length);
            gridOptions().pagingOptions.currentPage(0);
            gridOptions().pagingOptions.currentPage(1);
        };

        var loadMoreRecords = function (data) {
            var arr = originalData();

            ko.utils.arrayPushAll(arr, data);

            originalData(arr);

            currentFilteredData(arr);

            applyFilters();

            gridOptions().pagingOptions.totalServerItems(originalData().length);
            gridOptions().pagingOptions.currentPage(0);
            gridOptions().pagingOptions.currentPage(1);
        };

        var getOriginalData = function () {
            return originalData;
        }

        var getFilteredData = function () {
            return currentFilteredData;
        }

        var getGridOptions = function () {
            return gridOptions;
        };

        var deleteRow = function (id) {
            var item = ko.utils.arrayFirst(originalData(), function (item) {
                return item.id === id;
            });

            originalData.remove(item);
            currentFilteredData.remove(item);
            gridOptions().data.remove(item);
            gridOptions().pagingOptions.totalServerItems(currentFilteredData().length);
        };

        var vm = {
            createColumnDefinition: createColumnDefinition,
            gridSelectionChange: gridSelectionChange,
            columnDefs: columnDefs,
            setInitialData: setInitialData,
            getOriginalData: getOriginalData,
            getFilteredData: getFilteredData,
            getGridOptions: getGridOptions,
            deleteRow: deleteRow,
            loadMoreData: loadMoreData,
            loadMoreRecords: loadMoreRecords,
            displaySelectionCheckbox: displaySelectionCheckbox,
            groups: groups,
            selectWithCheckboxOnly: selectWithCheckboxOnly
        };

        return vm;
    };

    ko.bindingHandlers.summernote = new function () {
        var isblur = false;

        this.init = function (element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var options = $.extend(value, {
                height: 300,
                toolbar: [
                    ["style", ["bold", "italic", "underline", "clear"]],
                    ["fontstyle", ["style"]],
                    ["color", ["color"]],
                    ["fontsize", ["fontsize"]],
                    ["lists", ["ul", "ol", "paragraph"]],
                    ["insert", ["link"]],
                    ["table", ["table"]],
                    ["misc", ["fullscreen", "codeview"]]
                ],
                onblur: function () {
                    isblur = true;
                    value($(element).code());
                    isblur = false;
                }
            });
            $.extend(options, allBindings.get("summerOptions"));
            return $(element).summernote(options);
        };
        this.update = function (element, valueAccessor) {
            if (!isblur) {
                var value = valueAccessor();
                $(element).code(value());
            }
        };
    };

    ko.bindingHandlers.dropdown = new function () {
        this.init = function (element, valueAccessor, allBindingsAccessor) {
            if ($(element).is('select')) {
                if (ko.isObservable(valueAccessor())) {
                    ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                }
                $(element).selectpicker();
            }
        };

        this.update = function (element, valueAccessor, allBindingsAccessor) {
            if ($(element).is('select')) {
                var dropdownOptions = allBindingsAccessor().selectPickerOptions;
                if (typeof dropdownOptions !== 'undefined' && dropdownOptions !== null) {
                    var options = dropdownOptions.options,
                        optionsText = dropdownOptions.optionsText,
                        optionsValue = dropdownOptions.optionsValue,
                        optionsCaption = dropdownOptions.optionsCaption,
                        isDisabled = dropdownOptions.disabledCondition || false,
                        resetOnDisabled = dropdownOptions.resetOnDisabled || false;
                    if (ko.utils.unwrapObservable(options).length > 0) {
                        // call the default Knockout options binding
                        ko.bindingHandlers.options.update(element, options, ko.observable({ optionsText: optionsText, optionsValue: optionsValue, optionsCaption: optionsCaption }));
                    }
                    if (isDisabled && resetOnDisabled) {
                        // the dropdown is disabled and we need to reset it to its first option
                        $(element).selectpicker('val', $(element).children('option:first').val());
                    }
                    $(element).prop('disabled', isDisabled);
                }
                if (ko.isObservable(valueAccessor())) {
                    if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                        // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                        ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                    } else {
                        // call the default Knockout value binding
                        ko.bindingHandlers.value.update(element, valueAccessor);
                    }
                }

                $(element).selectpicker('refresh');
            }
        };
    };

    ko.bindingHandlers.bootstrapSwitch = new function () {
        this.init = function (element, valueAccessor, allBindingsAccessor) {
            //initialize bootstrapSwitch
            $(element).bootstrapSwitch();

            // setting initial value
            $(element).bootstrapSwitch('state', valueAccessor()());

            //handle the field changing
            $(element).on('switchChange.bootstrapSwitch', function (event, state) {
                var observable = valueAccessor();
                observable(state);
            });

            // Adding component options
            var options = allBindingsAccessor().bootstrapSwitchOptions || {};

            for (var property in options) {
                if (options.hasOwnProperty(property)) {
                    $(element).bootstrapSwitch(property, ko.utils.unwrapObservable(options[property]));
                }
            }

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).bootstrapSwitch("destroy");
            });

        }
        //update the control when the view model changes
        this.update = function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());

            // Adding component options
            var options = allBindingsAccessor().bootstrapSwitchOptions || {};
            for (var property in options) {
                if (options.hasOwnProperty(property)) {
                    $(element).bootstrapSwitch(property, ko.utils.unwrapObservable(options[property]));
                }
            }

            $(element).bootstrapSwitch("state", value);
        }
    };

    ko.bindingHandlers.timePicker = new function () {
        this.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = allBindingsAccessor().timePickerOptions || {};

            var tpicker = $(element).timepicker(options);

            tpicker.on('changeTime.timepicker', function (e) {

                var value = valueAccessor();

                if (!value) {
                    throw new Error('timeValue binding observable not found');
                }

                var date = ko.unwrap(value);

                var mdate = moment(date || new Date());

                var hours24;

                if (e.time.meridian === "AM") {
                    if (e.time.hours === 12)
                        hours24 = 0;
                    else
                        hours24 = e.time.hours;
                } else {
                    if (e.time.hours === 12) {
                        hours24 = 12;
                    } else {
                        hours24 = e.time.hours + 12;
                    }
                }

                mdate.hours(hours24);

                mdate.minutes(e.time.minutes);

                $(element).data('updating', true);

                value(hours24 + ':' + e.time.minutes);

                $(element).data('updating', false);
            });
        }

        this.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            if ($(element).data('updating')) {
                return;
            }

            var date = ko.unwrap(valueAccessor());

            if (date) {
                var time = date;
                $(element).timepicker('setTime', time);
            }
        }
    }

    var remoteServerName = 'api/MrReporting';

    return {
        routes: routes,
        remoteServerName: remoteServerName,
        language: language,
        postJson: postJson,
        // permission: permission,
        isPageSetup: isPageSetup,
        getAuthenticationHeader: getAuthenticationHeader,
        isAllow: isAllow,
        ExportColumn: exportColumn,
        userPermissions: userPermissions,
        exportJson: exportJson,
        pageSize: pageSize,
        KoGridInstanceCreator: koGridInstanceCreator,
        currentLanguage: currentLanguage
    };
});