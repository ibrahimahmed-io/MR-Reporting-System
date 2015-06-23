define(['services/tokenstore', 'durandal/app', 'config'], function (tokenStore, app, config) {
    return {
        setupHttpCalls: function () {
            $.ajaxSetup({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Lang", config.currentLanguage());

                    var token = tokenStore.getToken();
                    if (token) {
                        xhr.setRequestHeader("withCredentials", true);
                        xhr.setRequestHeader("Authorization", token);
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 401) {
                        app.setRoot('viewmodels/login');
                    }
                }
            });
        }
    };
});