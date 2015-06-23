define(['durandal/system', 'config'], function (system, config) {
    var getAccounts = function () {
        return $.getJSON(config.remoteServerName + "/GetAccounts");
    };

    var login = function (userName, userPassword) {
        var user = {
            userName: userName,
            userPassword: userPassword
        };
        return config.postJson(config.remoteServerName + "/Login", user);
    };

    var checkTokenValidity = function () {
        return $.getJSON(config.remoteServerName + "/CheckTokenValidity").done(function (data) {
            alert('here');
        });
    };

    var dataservice = {
        getAccounts: getAccounts,
        checkTokenValidity: checkTokenValidity,
        login: login
    };

    return dataservice;
});