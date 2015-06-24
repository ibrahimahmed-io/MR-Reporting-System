define(['durandal/system', 'plugins/router', 'config', 'services/dataservice', 'durandal/app', 'services/tokenstore'], function (system, router, config, dataservice, app, tokenStore) {

    var languageSelected = ko.observable(false);

    var languageChecked = ko.computed(function () {
        var grids = $(".jqx-grid");

        if (languageSelected() === true) {
            grids.each(function (index, elem) {
                var id = $(this).attr("id");
                if (window.localStorage.getItem("jqxGrid" + id)) {
                    window.localStorage.removeItem("jqxGrid" + id);
                }
            });

            return 'ar';
        } else {
            grids.each(function (index, elem) {
                var id = $(this).attr("id");

                if (window.localStorage.getItem("jqxGrid" + id)) {
                    window.localStorage.removeItem("jqxGrid" + id);
                }
            });

            return 'en';
        }
    });

    var lastUpdatedNotification = ko.observable();

    var notificationModel = ko.observable();

    var getNotifications = function (obj, e) {
        $('.notified').removeClass('notified');
        $(e.currentTarget).addClass('notified');
        //notificationModel('viewmodels/notifications/taskNotifications');
    };

    var getPostitNotifications = function (obj, e) {
        $('.notified').removeClass('notified');
        $(e.currentTarget).addClass('notified');
        //notificationModel('viewmodels/notifications/postitNotifications');
    }

    var loadMoreOfCurrentNotifications = function (obj, e) {
        var currentNotificationModel = notificationModel();

        notificationModel(undefined);
        notificationModel(currentNotificationModel);

        lastUpdatedNotification(moment().format("DD/MM/YYYY hh:mm:ss a"));
    }

    function userLogout() {
        $.SmartMessageBox({
            title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
            content: "You will be missed, Are you sure you want to leave us?",
            buttons: '[No][Yes]'
        }, function (buttonPressed) {
            if (buttonPressed === "Yes") {
                tokenStore.removeToken();
                window.location.reload();
            }
        });
    }

    var transitionEnd;

    function toggleShortcut() {

        function hideShortCut() {
            $("#shortcut").animate({ height: "hide" }, 300, "easeOutCirc");

            $("body").removeClass("shortcut-on");
        }

        function showShortCut() {
            $("#shortcut").animate({ height: "show" }, 200, "easeOutCirc");

            $("body").addClass("shortcut-on");
        }

        $("#shortcut").is(":visible") ? hideShortCut() : showShortCut();

        $("#shortcut").find("a").click(function (e) {
            setTimeout(hideShortCut, 300);
        });

        $(document).mouseup(function (e) {
            $("#shortcut").is(e.target) || 0 !== $("#shortcut").has(e.target).length || hideShortCut();
        });
    }

    function determineTransitionEvent() {
        var t;
        var el = document.createElement('fakeelement');

        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions) {
            if (transitions.hasOwnProperty(t)) {
                if (el.style[t] !== undefined) {
                    transitionEnd = transitions[t];
                }
            }
        }
    }

    var boot = function () {
        $.fn.extend({
            treed: function (o) {

                var openedClass = 'glyphicon-minus-sign';
                var closedClass = 'glyphicon-plus-sign';

                if (typeof o != 'undefined') {
                    if (typeof o.openedClass != 'undefined') {
                        openedClass = o.openedClass;
                    }
                    if (typeof o.closedClass != 'undefined') {
                        closedClass = o.closedClass;
                    }
                };

                //initialize each of the top levels
                var tree = $(this);
                tree.addClass("classy-tree");
                tree.find('li').has("ul").each(function () {
                    var branch = $(this); //li with children ul
                    branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
                    branch.addClass('branch');
                    branch.on('click', function (e) {
                        if (this == e.target) {
                            var icon = $(this).children('i:first');
                            icon.toggleClass(openedClass + " " + closedClass);
                            $(this).children().children().toggle();
                        }
                    })
                    branch.children().children().toggle();
                });
                //fire event from the dynamically added icon
                tree.find('.branch .indicator').each(function () {
                    $(this).on('click', function () {
                        $(this).closest('li').click();
                    });
                });
                //fire event to open branch if the li contains an anchor instead of text
                tree.find('.branch>a').each(function () {
                    $(this).on('click', function (e) {
                        $(this).closest('li').click();
                        e.preventDefault();
                    });
                });
                //fire event to open branch if the li contains a button instead of text
                tree.find('.branch>button').each(function () {
                    $(this).on('click', function (e) {
                        $(this).closest('li').click();
                        e.preventDefault();
                    });
                });
            }
        });

        lastUpdatedNotification(moment().format("DD/MM/YYYY hh:mm:ss a"));

        var currentLang = config.currentLanguage();

        if (currentLang === 'ar') {
            languageSelected(true);
        }

        languageSelected.subscribe(function () {
            localStorage.setItem('language', languageChecked());
            window.location.reload();
        });

        if (router.routes.length < 1) {
            router.map(config.routes).buildNavigationModel();
            return router.activate();
        }

        return 1;
    };

    function activate() {
        notificationModel(undefined);

        return boot();
    }

    function attached() {

        initApp.addDeviceType();
        initApp.menuPos();
        initApp.SmartActions();
        initApp.domReadyMisc();

        determineTransitionEvent();

        var currentLang = config.currentLanguage();

        if (currentLang === 'ar') {
            $('body').addClass('smart-rtl');
        }

        $('.user-menu .dropdown-menu').click(function(e) {
            e.stopPropagation();
        });

        $("[rel='tooltip']").tooltip({ 'container': 'body' });

        $("body").on("click", '[data-action="toggleShortcut"]', function(e) {
            toggleShortcut();
            e.preventDefault();
        });
    }

    var constructNavigation = function (dom, obj) {
        //var objIndex = projectsMenue.indexOf(obj);
        //if (objIndex === projectsMenue().length - 1) {
        //    $("nav ul").jarvismenu({}, true);
            initApp.leftNav();
        //}
    };

    var shell = {
        activate: activate,
        router: router,
        language: config.language,
        currentLanguage: config.currentLanguage,
        attached: attached,
        userLogout: userLogout,
        constructNavigation: constructNavigation,
        languageSelected: languageSelected,
        getNotifications: getNotifications,
        notificationModel: notificationModel,
        getPostitNotifications: getPostitNotifications,
        lastUpdatedNotification: lastUpdatedNotification,
        loadMoreOfCurrentNotifications: loadMoreOfCurrentNotifications,
        currentModuleMenu: config.currentModuleMenu
    };

    return shell;
});