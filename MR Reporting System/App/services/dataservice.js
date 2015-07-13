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

    var getTypesForVisits = function () {
        return $.getJSON(config.remoteServerName + "/GetDefaultListByListType", { listType: 'locationType' });
    }

    var editAccount = function (editAccountObservable) {
        return $.post(config.remoteServerName + "/EditAccount", editAccountObservable);
    };

    var getAccountForedit = function (editAccountObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetAgentsById", { id: id }).done(function (data) {
            editAccountObservable(ko.mapping.fromJS(data));

        });
    };

    var approvalRequestsOfOrdersSupervisor = function (id, type) {
        return $.post(config.remoteServerName + "/ApprovalRequestsOfOrdersSupervisor?id=" + id + "&type=" + type);
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

    //#region Drugs API
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

    var editDrugs = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditDrugs", documnetObservable);
    };
    //#endregion Drugs API

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
                documnetObservable(data);
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

    //#region Visits API
    var getVisits = function (documnetObservable) {
        return $.getJSON(config.remoteServerName + "/GetVisits").done(function (data) {
            if (documnetObservable) {
                documnetObservable.data(data);
            }
        });
    };

    var getVisitsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetVisitsById", { id: id }).done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var editVisits = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditVisits", documnetObservable);
    };

    var addVisits = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddVisits", documnetObservable);
    };

    var deleteVisits = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteVisitsById", { id: id });
    };

    var getVisitsForDrugReport = function (documnetObservable, drugId) {
        return $.getJSON(config.remoteServerName + "/GetVisitsForDrugReport", { drugId: drugId }).done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };

    var getVisitsMorningCountForDrugReport = function (documnetObservable, drugId) {
        return $.getJSON(config.remoteServerName + "/GetVisitsMorningCountForDrugReport", { drugId: drugId }).done(function (data) {
            if (documnetObservable) {
                documnetObservable(data);
            }
        });
    };
    //#endregion Visits API

    var visitsCost = function (observableObj) {
        return $.post(config.remoteServerName + "/VisitsCost", observableObj);
    };

    var visitsByAgent = function (observableObj) {
        return $.post(config.remoteServerName + "/VisitsByAgent", observableObj);
    };

    var visitsByArea = function (observableObj) {
        return $.post(config.remoteServerName + "/VisitsByArea", observableObj);
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

    var getAlertVisitsDetail = function (listType) {
        return $.getJSON(config.remoteServerName + "/GetAlertVisitsDetail", { listType: listType });
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




    var getAlertsOnOrdersApprovedToOrders = function () {
        return $.getJSON(config.remoteServerName + "/GetAlertsOnOrdersApprovedToOrders");

    };

    var getOrdersSupervisorApproval = function () {
        return $.getJSON(config.remoteServerName + "/GetOrdersSupervisorApproval");

    };
    var getAlertsOnOrders = function () {
        return $.getJSON(config.remoteServerName + "/GetAlertsOnOrders");

    };
    var getAlertsOnOrdersApproved = function () {
        return $.getJSON(config.remoteServerName + "/GetAlertsOnOrdersApproved");

    };

    var alertsOrdersandApprvovedDetail = function (type) {
        return $.getJSON(config.remoteServerName + "/AlertsOrdersandApprvovedDetail", { type: type });

    };
    var alertsByOrdersCompleteDetail = function (type) {
        return $.getJSON(config.remoteServerName + "/AlertsByOrdersCompleteDetail", { type: type });

    };
    var getOrders = function () {
        return $.getJSON(config.remoteServerName + "/GetOrders");

    };

    var getOrdersById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetOrdersById", { id: id }).done(function (data) {
            if (documnetObservable) {

                documnetObservable(data);
            }
        });
    };

    var editOrders = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditOrders", documnetObservable);
    };

    var addOrders = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddOrders", documnetObservable);
    };

    var deleteOrders = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteOrdersById", { id: id });
    };

    var getOrdersItems = function (orderId) {
        return $.getJSON(config.remoteServerName + "/GetOrdersItems", { orderId: orderId });
    };

    var getOrdersItemsById = function (documnetObservable, id) {
        return $.getJSON(config.remoteServerName + "/GetOrdersItemsById", { id: id }).done(function (data) {
            documnetObservable(data);
        });
    };

    var editOrdersItems = function (documnetObservable) {
        return $.post(config.remoteServerName + "/EditOrdersItems", documnetObservable);
    };

    var addOrdersItems = function (documnetObservable) {
        return $.post(config.remoteServerName + "/AddOrdersItems", documnetObservable);
    };

    var deleteOrdersItems = function (id) {
        return $.getJSON(config.remoteServerName + "/DeleteOrdersItemsById", { id: id });
    };



    var dataservice = {

        approvalRequestsOfOrdersSupervisor: approvalRequestsOfOrdersSupervisor,
        getOrdersSupervisorApproval: getOrdersSupervisorApproval,
        getAlertsOnOrders: getAlertsOnOrders,
        getAlertsOnOrdersApproved: getAlertsOnOrdersApproved,
        getAlertsOnOrdersApprovedToOrders: getAlertsOnOrdersApprovedToOrders,
        alertsOrdersandApprvovedDetail: alertsOrdersandApprvovedDetail,
        alertsByOrdersCompleteDetail: alertsByOrdersCompleteDetail,

        getOrders: getOrders,
        getOrdersById: getOrdersById,
        editOrders: editOrders,
        addOrders: addOrders,
        deleteOrders: deleteOrders,
        getOrdersItems: getOrdersItems,
        getOrdersItemsById: getOrdersItemsById,
        editOrdersItems: editOrdersItems,
        addOrdersItems: addOrdersItems,
        deleteOrdersItems: deleteOrdersItems,


        visitsCost: visitsCost,
        visitsByAgent: visitsByAgent,
        visitsByArea: visitsByArea,

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

        //#region Drugs API
        getDrugs: getDrugs,
        getDrugsById: getDrugsById,
        addDrugs: addDrugs,
        editDrugs: editDrugs,
        deleteDrugsById: deleteDrugsById,
        //#endregion

        getCompanies: getCompanies,
        getSections: getSections,

        //#region Visits API
        getVisits: getVisits,
        getVisitsById: getVisitsById,
        editVisits: editVisits,
        addVisits: addVisits,
        deleteVisits: deleteVisits,
        getTypesForVisits: getTypesForVisits,
        getVisitsForDrugReport: getVisitsForDrugReport,
        getVisitsMorningCountForDrugReport: getVisitsMorningCountForDrugReport
        //#endregion


    };

    return dataservice;
});