require.config({
    paths: {
        'config': 'config',
        'services': 'services',
        'resources': 'resources',
        'durandal': '../JavaScript/durandal',
        'plugins': '../JavaScript/durandal/plugins',
        'transitions': '../JavaScript/durandal/transitions',
        'text': '../JavaScript/require/text',
        'gapi': '../JavaScript/googleApi/client'
    }, shim: {
        'gapi': {
            exports: 'gapi'
        }
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

//define('gapi', ['async!https://apis.google.com/js/client.js!onload'], function() {
//    console.log('gapi loaded: ' + gapi);

//    return gapi;
//});


define('main', ['durandal/system', 'durandal/app', 'durandal/viewLocator', 'plugins/router', 'services/dataservice', 'services/authInterceptor', 'services/tokenstore', 'config'], function (system, app, viewLocator, router, dataservice, authInterceptor, tokenStore, config) {
    system.debug(true);

    app.title = 'Medical';

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
    });

    authInterceptor.setupHttpCalls();

    app.start().then(function () {

        router.makeRelative({ moduleId: 'viewmodels' });

        viewLocator.useConvention();

        dataservice.checkTokenValidity().done(function (data) {
            if (!tokenStore.isAuthenticated()) {
                app.setRoot('viewmodels/login');
            } else {
                app.setRoot('viewmodels/shell');
            }
        });

        system.log('Main Module started');
    });
});