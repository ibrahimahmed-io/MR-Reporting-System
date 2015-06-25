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
        return $.getJSON(config.remoteServerName + "/GetAgentsById", { id: id }).done(function (data) {
            editAccountObservable(ko.mapping.fromJS(data));

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

    var getDefaultlistById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetDefaultlistById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editDefaultlist = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditDefaultlist", documnetObservable);
    };

    var addDefaultlist = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddDefaultlist", documnetObservable);
    };

    var deleteDefaultlist = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteDefaultlistById", { id: id });
    };


    var getAgantarea = function (documnetObservable, agentId) {
        return $.getJSON(config.remoteServerName + "/GetAgantarea", { agentId: agentId }).done(function (data) {
            documnetObservable.data(data);
        });
    };

    var getAgantareaById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetAgantareaById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editAgantarea = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditAgantarea", documnetObservable);
    };

    var addAgantarea = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddAgentAreas", documnetObservable);
    };

    var deleteAgantarea = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteAgantareaById", { id: id });
    };


    var getAgantdrugs = function (documnetObservable, agentId) {
        $.getJSON(config.remoteServerName + "/GetAgantdrugs", { agentId: agentId }).done(function (data) {
            documnetObservable.data(data);
        });
    };

    var getAgantdrugsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetAgantdrugsById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editAgantdrugs = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditAgantdrugs", documnetObservable);
    };

    var addAgantdrugs = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddAgentDrugs", documnetObservable);
    };

    var deleteAgantdrugs = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteAgantdrugsById", { id: id });
    };


    var getDocotors = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetDocotors").done(function (data) {
            if (documnetObservable) {
                documnetObservable.data(data);
            }
        });
    };

    var getDocotorsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetDocotorsById", { id: id }).done(function (data) {
            documnetObservable(ko.mapping.fromJS(data));
        });
    };

    var editDocotors = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditDocotors", documnetObservable);
    };

    var addDocotors = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddDocotors", documnetObservable);
    };

    var deleteDocotors = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteDocotorsById", { id: id });
    };


    var getArea = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetArea").done(function (data) {
            if (documnetObservable) {
                documnetObservable.data(data);
            }
        });
    };

    var getAreaById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetAreaById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };
    var editArea = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditArea", documnetObservable);
    };
    var addArea = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddArea", documnetObservable);
    };
    var deleteArea = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteAreaById", { id: id });
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
        getArea: getArea,
        getAreaById: getAreaById,
        editArea: editArea,
        addArea: addArea,
        deleteArea: deleteArea,
        getAccounts: getAccounts,
        checkTokenValidity: checkTokenValidity,
        login: login,
        getAccounts: getAccounts,
        addAccount: addAccount,
        editAccount: editAccount,
        getAccountForedit: getAccountForedit,
        getGroup: getGroup,
        getAccountsDefaultListType: getAccountsDefaultListType,
        getAccountsDefaultList: getAccountsDefaultList,
        editDefaultlist: editDefaultlist,
        addDefaultlist: addDefaultlist,
        deleteDefaultlist: deleteDefaultlist,
        getAgantarea: getAgantarea,
        getAgantareaById: getAgantareaById,
        editAgantarea: editAgantarea,
        addAgantarea: addAgantarea,
        deleteAgantarea: deleteAgantarea,
        getAgantdrugs: getAgantdrugs,
        addAgantdrugs: addAgantdrugs,
        getDocotors: getDocotors,
        getDocotorsById: getDocotorsById,
        editDocotors: editDocotors,
        addDocotors: addDocotors,
        deleteDocotors: deleteDocotors
    };

    return dataservice;
});