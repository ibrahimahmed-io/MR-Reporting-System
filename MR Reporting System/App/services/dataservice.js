define(['durandal/system', 'config'], function (system, config) {
    var getAccounts = function () {
        return $.getJSON(config.remoteServerName + "/GetAgents");
    };

    var addAccount = function (newAccount) {
        return $.post(config.remoteServerName + "/AddAgents", newAccount).success(function (data) { });
    };

    var editAccount = function (editAccountObservable) {
        return $.post(config.remoteServerName + "/EditAccount", editAccountObservable);
    };

    var getAccountForedit = function (editAccountObservable, id) {
        return $.post(config.remoteServerName + "/GetAgentsById", { id: id }).done(function (data) {
            editAccountObservable(data);
        });
    };

    var getGroup = function (groupsObservable) {
        return $.getJSON(config.remoteServerName + "/GetGroup").done(function (data) {
            if (groupsObservable) {

                groupsObservable(data);
            }
        });
    };

    var getAccountsDefaultList = function (accountsDefaultListObservable, listType) {
        return $.getJSON(config.remoteServerName + "/GetDefaultList", { listType: listType }).done(function (data) {
            if (accountsDefaultListObservable) {
                accountsDefaultListObservable(data);
            }
        });
    };

    var getAccountsDefaultListType = function (accountsDefaultListObservable, listType) {
        return $.getJSON(config.remoteServerName + "/GetDefaultListByListType", { listType: listType }).done(function (data) {
            if (accountsDefaultListObservable) {

                accountsDefaultListObservable(data);
            }
        });
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
            //  alert('here');
        });
    };

    var dataservice = {
        getAccounts: getAccounts,
        checkTokenValidity: checkTokenValidity,
        login: login,
        getAccounts: getAccounts,
        addAccount: addAccount,
        editAccount: editAccount,
        getAccountForedit: getAccountForedit,
        getGroup: getGroup,
        getAccountsDefaultListType: getAccountsDefaultListType,
        getAccountsDefaultList: getAccountsDefaultList

    };

    return dataservice;
});