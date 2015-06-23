define(['durandal/app', 'services/dataservice', 'services/tokenstore', 'plugins/router'], function (app, dataservice, tokenStore, router) {

    var userName = ko.observable();
    var userPassword = ko.observable();

    var attemptLoginUser = function (obj, event) {
        var isValid = $('#login-form').valid();
        if (isValid) {
            dataservice.login(userName(), userPassword()).then(function (response) {
                $("body").removeClass("animated fadeInDown");
                $("body").addClass("smart-style-1 fixed-header fixed-ribbon");

                $("html").removeAttr("id");

                var token = response.getResponseHeader("Authorization");

                if (token)
                    tokenStore.setToken(token);

                if (tokenStore.isAuthenticated()) {
                    app.setRoot('viewmodels/shell');
                    window.location.reload();
                }
            }).catch(function(error) {
                $.smallBox({
                    title: "Can't Login ",
                    content: error.message,
                    color: "#C46A69",
                    iconSmall: "fa fa-thumbs-down bounce animated",
                    timeout: 4000
                });
            });
        } else {
            $('#login-form').validate();
        }
    };

    var login = {
        userName: userName,
        userPassword: userPassword,
        attemptLoginUser: attemptLoginUser,
        attached: attached
    };

    function attached() {
        $("body").removeClass("smart-style-1 fixed-header fixed-ribbon");
        $("body").addClass("animated fadeInDown");

        $("html").attr("id", "extr-page");
    }

    return login;
});