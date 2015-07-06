define(['config'], function (config) {
    var vm = {};

    vm.title = "Dashboard";

    vm.language = config.language;

    var setWidgetsAfterExpandOrShrink = false;

    var changeCount = 0;

    vm.currentLanguage = config.currentLanguage;

    vm.availableWidgets = ko.observableArray([]);

    vm.selectedWidgets = ko.observableArray([]);

    vm.leftSelectedWidgets = ko.observableArray([]);

    vm.rightSelectedWidgets = ko.observableArray([]);

    vm.centerSelectedWidgets = ko.observableArray([]);

    var setWidgets = function () {
        if ($.fn.jarvisWidgets && enableJarvisWidgets) {
            var $this = $('#widget-grid');

            $this.data("jarvisWidgets", null);

            $('#widget-grid').jarvisWidgets({
                grid: 'article',
                widgets: '.jarviswidget',
                buttonsHidden: false,

                toggleButton: true,
                toggleClass: 'fa fa-minus | fa fa-plus',
                toggleSpeed: 200,

                deleteButton: true,
                deleteClass: 'fa fa-times',
                onDelete: function (e) {
                    var widgetId = e.attr("id").replace(/-/g, "/");

                    var widgetToDelete = ko.utils.arrayFirst(vm.selectedWidgets(), function (module) {
                        return module.moduleId === widgetId;
                    });

                    vm.selectedWidgets.remove(widgetToDelete);

                    window.localStorage.setItem("SelectedWidgets", JSON.stringify(vm.selectedWidgets()));
                },

                editClass: 'fa fa-cog | fa fa-save',

                colorButton: false,

                onChange: function (e) {
                    if (changeCount < 1) {
                        var widgetId = e.attr("id").replace(/-/g, "/");

                        var widgetToChangeLocation = ko.utils.arrayFirst(vm.selectedWidgets(), function (module) {
                            return module.moduleId === widgetId;
                        });

                        if (widgetToChangeLocation.column === 'left') {
                            widgetToChangeLocation.column = 'right';
                        } else {
                            widgetToChangeLocation.column = 'left';
                        }

                        window.localStorage.setItem("SelectedWidgets", JSON.stringify(vm.selectedWidgets()));

                        changeCount++;
                    } else {
                        changeCount = 0;
                    }
                },

                buttonOrder: '%toggle% %edit% %delete%',
                opacity: 1.0,
                dragHandle: '> header',
                placeholderClass: 'jarviswidget-placeholder',
                timestampPlaceholder: '.jarviswidget-timestamp'
            });
        }
    };

    vm.saveWidgets = function () {
        window.localStorage.setItem("SelectedWidgets", JSON.stringify(vm.selectedWidgets()));

        $('#WidgetsModal').modal('hide');
    };

    vm.addToWidgets = function (obj, e) {
        if (vm.selectedWidgets().length !== 15) {
            var direction = vm.selectedWidgets().length > 0
                ? (vm.selectedWidgets()[(vm.selectedWidgets().length - 1)].column === 'left' ? 'right'
                    : (vm.selectedWidgets()[(vm.selectedWidgets().length - 1)].column === 'right' ? 'left' : (vm.selectedWidgets()[(vm.selectedWidgets().length - 1)].previousColumn === 'left') ? 'right' : 'left')) : 'left';

            var addedModule = {
                moduleId: obj.moduleId,
                column: direction
            };

            if (direction === 'left') {
                vm.leftSelectedWidgets.push(addedModule);
            } else if (direction === 'right') {
                vm.rightSelectedWidgets.push(addedModule);
            } else {
                vm.centerSelectedWidgets.push(addedModule);
            }

            vm.selectedWidgets.push(addedModule);
        } else {
            $.smallBox({
                title: config.language.maximumAllowedWidgets[config.currentLanguage()],
                content: "<i class='fa fa-clock-o'></i> <i>" + config.language.maximumAllowedWidgetsMessage[config.currentLanguage()] + "...</i>",
                color: "#3276b1",
                iconSmall: "fa fa-bell fa-2x fadeInRight animated",
                timeout: 2000
            });
        }
    };

    vm.checkAdded = function (obj) {
        var isAddedLeft = ko.utils.arrayFirst(vm.leftSelectedWidgets(), function (module) {
            return module.moduleId === obj.moduleId;
        }) || -1;

        var isAddedRight = ko.utils.arrayFirst(vm.rightSelectedWidgets(), function (module) {
            return module.moduleId === obj.moduleId;
        }) || -1;

        var isAddedCenter = ko.utils.arrayFirst(vm.centerSelectedWidgets(), function (module) {
            return module.moduleId === obj.moduleId;
        }) || -1;

        return (isAddedLeft === -1) && (isAddedRight === -1) && (isAddedCenter === -1);
    };

    vm.widgets = ko.observableArray([
        {
            widgetsCategory: "summary",
            widgets: [{
                moduleTitle: "Alerting Summary on Visits ",
                moduleId: "viewmodels/summaries/alerts"
                // ,canView: config.isAllow(1362)

            }, {

                moduleTitle: "Alerting Summary on All Orders ",
                moduleId: "viewmodels/summaries/alertOrders"
            }, {

                moduleTitle: "Alerting Summary on Orders Completed",
                moduleId: "viewmodels/summaries/alertOrdersCompleted"
            }, {

                moduleTitle: "Requests Approval",
                moduleId: "viewmodels/summaries/supervisorRequests"
            }]
        }, {
            widgetsCategory: "widgetsCharts",
            widgets: [{
                moduleTitle: "Project Status",
                moduleId: "viewmodels/widgetsCharts/projectStatusChart"
                //,canView: config.isAllow(1377)
            }]


        }]);

    vm.activate = function () {

        if (window.localStorage.getItem("Plugin_position__widget-grid")) {
            window.localStorage.removeItem("Plugin_position__widget-grid");
        }

        if (!(!!window.localStorage.getItem("SelectedWidgets"))) {
            window.localStorage.setItem("SelectedWidgets", JSON.stringify([
                { "moduleId": "viewmodels/summaries/alerts", "column": "left" },
                { "moduleId": "viewmodels/summaries/alertOrders", "column": "right" },
                { "moduleId": "viewmodels/summaries/alertOrdersCompleted", "column": "left" },
                { "moduleId": "viewmodels/summaries/supervisorRequests", "column": "left" }]));
        }

        var selectedWidgets = JSON.parse(window.localStorage.getItem("SelectedWidgets")) || [];

        var leftSelectedWidgets = ko.utils.arrayFilter(selectedWidgets, function (widget) {
            return widget.column === 'left';
        });

        var rightSelectedWidgets = ko.utils.arrayFilter(selectedWidgets, function (widget) {
            return widget.column === 'right';
        });

        var centerSelectedWidgets = ko.utils.arrayFilter(selectedWidgets, function (widget) {
            return widget.column === 'center';
        });

        vm.leftSelectedWidgets(leftSelectedWidgets);

        vm.rightSelectedWidgets(rightSelectedWidgets);

        vm.centerSelectedWidgets(centerSelectedWidgets);

        vm.selectedWidgets(selectedWidgets);

    };

    vm.compositionComplete = function () {
        setWidgets();

        $(".fixed-action-btn").tooltip({ container: 'body' });

        $("body").on('click', '[data-action="expandWidget"]', function (e) {
            var widgetId = $(this).parents().eq(2).attr("id").replace(/-/g, "/");

            var isExpanded = !!(ko.utils.arrayFirst(vm.centerSelectedWidgets(), function (item) {
                return item.moduleId === widgetId;
            }));

            var widget = ko.utils.arrayFirst(vm.selectedWidgets(), function (item) {
                return item.moduleId === widgetId;
            });

            if (!isExpanded) {
                if (widget.column === 'left') {
                    vm.leftSelectedWidgets.remove(widget);
                } else {
                    vm.rightSelectedWidgets.remove(widget);
                }

                widget.previousColumn = widget.column;

                widget.column = 'center';

                vm.centerSelectedWidgets.push(widget);

                $(this).addClass("active");
            } else {
                vm.centerSelectedWidgets.remove(widget);

                widget.column = widget.previousColumn;

                delete widget.previousColumn;

                if (widget.column === 'left') {
                    vm.leftSelectedWidgets.push(widget);
                } else {
                    vm.rightSelectedWidgets.push(widget);
                }

                $(this).removeClass("active");
            }

            window.localStorage.setItem("SelectedWidgets", JSON.stringify(vm.selectedWidgets()));

            setWidgetsAfterExpandOrShrink = true;

            if (window.localStorage.getItem("Plugin_position__widget-grid")) {
                window.localStorage.removeItem("Plugin_position__widget-grid");
            }

            setTimeout(function () {
                vm.afterRenderExpandOrShrink();
            }, 500);
        });

        $('#WidgetsModal').on('hidden.bs.modal', function (e) {
            setWidgets();
        });

        $(".vertical-bootstrap-tab-container").on("click", ".vertical-bootstrap-tab-menu>div.list-group>a", function (e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("div.vertical-bootstrap-tab>div.vertical-bootstrap-tab-content").removeClass("active");
            $("div.vertical-bootstrap-tab>div.vertical-bootstrap-tab-content").eq(index).addClass("active");
        });
    };

    vm.afterRenderExpandOrShrink = function () {
        if (setWidgetsAfterExpandOrShrink) {
            setWidgets();
            setWidgetsAfterExpandOrShrink = false;
        }
    };

    return vm;
});