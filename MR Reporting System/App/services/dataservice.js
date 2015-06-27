define(['durandal/system', 'config'], function (system, config) {
    var getAccounts = function () {
        return $.getJSON(config.remoteServerName + "/GetAgents");
    };

    var addAccount = function (newAccount) {
        return $.post(config.remoteServerName + "/AddAgents", newAccount).success(function (data) { });
    };

    var getCompanies = function () {
        return $.getJSON(config.remoteServerName + "/GetCompanies");
    }

    var getSections = function () {
        return $.getJSON(config.remoteServerName + "/GetDefaultListByListType", { listType: 'medicenType' });
    }

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
        return $.getJSON(config.remoteServerName + "/GetAgentarea", { agentId: agentId }).done(function (data) {
            if (documnetObservable) {

                documnetObservable.data(data);
            }
        });
    };

    var getAgantareaById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetAgentareaById", { id: id }).done(function (data) {
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

    var getAgentDrugs = function (documnetObservable, agentId) {
        return $.getJSON(config.remoteServerName + "/GetAgentDrug", { agentId: agentId }).done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var getAgentDrugById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetAgentDrugById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editAgentdDrug = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditAgentDrug", documnetObservable);
    };

    var addAgentDrug = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddAgentDrug", documnetObservable);
    };

    var deleteAgentDrug = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteAgentDrugById", { id: id });
    };

    var getDrugs = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetDrugs").done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var getDrugsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetDrugsById", { id: id }).done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var addDrugs = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddDrugs", documnetObservable);
    };

    var deleteDrugsById = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteDrugsById", { id: id });
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

    var getPharmacies = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetPharmacies").done(function (data) {
            if (documnetObservable) {
                documnetObservable.data(data);
            }
        });
    };

    var getPharmaciesById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetPharmaciesById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editPharmacies = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditPharmacies", documnetObservable);
    };

    var addPharmacies = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddPharmacies", documnetObservable);
    };

    var deletePharmacies = function (id) {
        return $.getJSON(config.remoteServerName + "/DeletePharmaciesById", { id: id });
    };

    var getHospitals = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetHospitals").done(function (data) {
            if (documnetObservable) {
                documnetObservable.data(data);
            }
        });
    };

    var getHospitalsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetHospitalsById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editHospitals = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditHospitals", documnetObservable);
    };

    var addHospitals = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddHospitals", documnetObservable);
    };

    var deleteHospitals = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteHospitalsById", { id: id });
    };

    var visitsCost = function (observableObj) {
        return $.post(config.remoteServerName + "/VisitsCost", observableObj);
    };

    var visitsByAgent = function (observableObj) {
        return $.post(config.remoteServerName + "/VisitsByAgent", observableObj);
    };

    var getDistributers = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetDistributers").done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var getDistributersById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetDistributersById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editDistributers = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditDistributers", documnetObservable);
    };

    var addDistributers = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddDistributers", documnetObservable);
    };

    var deleteDistributers = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteDistributersById", { id: id });
    };

    var getAlertVisits = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetAlertVisits").done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var getAlertVisitsDetail = function ( listType) {
        return $.getJSON(config.remoteServerName + "/GetAlertVisitsDetail", { listType: listType }) ;
    };

    var getGroups = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetGroups").done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var getGroupsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetGroupsById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var permissionsGroupsEdit = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditGroups", documnetObservable);
    };

    var addGroups = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddGroups", documnetObservable);
    };

    var deleteGroupsById = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteGroupsById", { id: id });
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
        visitsCost: visitsCost,
        visitsByAgent: visitsByAgent,
        getAlertVisits: getAlertVisits,
        getAlertVisitsDetail: getAlertVisitsDetail,

        getGroups: getGroups,
        getGroupsById: getGroupsById,
        permissionsGroupsEdit: permissionsGroupsEdit,
        addGroups: addGroups,
        deleteGroupsById: deleteGroupsById,

        getDistributers: getDistributers,
        getDistributersById: getDistributersById,
        editDistributers: editDistributers,
        addDistributers: addDistributers,
        deleteDistributers: deleteDistributers,

        getHospitals: getHospitals,
        getHospitalsById: getHospitalsById,
        editHospitals: editHospitals,
        addHospitals: addHospitals,
        deleteHospitals: deleteHospitals,

        getPharmacies: getPharmacies,
        getPharmaciesById: getPharmaciesById,
        editPharmacies: editPharmacies,
        addPharmacies: addPharmacies,
        deletePharmacies: deletePharmacies,

        getArea: getArea,
        getAreaById: getAreaById,
        editArea: editArea,
        addArea: addArea,
        deleteArea: deleteArea,
        getAccounts: getAccounts,
        checkTokenValidity: checkTokenValidity,
        login: login,
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
        getAgentDrugs: getAgentDrugs,
        getAgentDrugById: getAgentDrugById,
        editAgentdDrug: editAgentdDrug,
        addAgentDrug: addAgentDrug,
        deleteAgentDrug: deleteAgentDrug,
        getDocotors: getDocotors,
        getDocotorsById: getDocotorsById,
        editDocotors: editDocotors,
        addDocotors: addDocotors,
        deleteDocotors: deleteDocotors,
        getDrugs: getDrugs,
        getDrugsById: getDrugsById,
        addDrugs: addDrugs,
        deleteDrugsById: deleteDrugsById,

        getCompanies: getCompanies,
        getSections: getSections
    };

    return dataservice;
});