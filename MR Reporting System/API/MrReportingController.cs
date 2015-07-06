using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;
using MR_Reporting_System_Model.SecurityModel;
using MR_Reporting_System_Security;

namespace MR_Reporting_System.API
{

    [RoutePrefix("api/MrReporting")]
    public class MrReportingController : ApiController
    {
        private readonly IGroupPermissionsRepository _permissionGroup;
        private readonly IAreaRepository _area;
        private readonly IDefaultListRepository _defaultList;
        private readonly IAgentAreaRepository _agentsArea;
        private readonly IAgentDistributerRepository _agentsDistributer;
        private readonly IAgentDrugsRepository _agentsDrugs;
        private readonly IAgentHospitalRepository _agentsHospital;
        private readonly IAgentPharmaciesRepository _agentsPharmacies;
        private readonly IAgentsRepository _agents;
        private readonly ICompaniesRepository _companies;
        private readonly IDistributersRepository _distributers;
        private readonly IDocotorsRepository _docotors;
        private readonly IDrugsRepository _drugs;
        private readonly IGroupsRepository _groups;
        private readonly IHospitalsRepository _hospitals;
        private readonly ILocationsRepository _locations;
        private readonly IPharmaciesRepository _pharmacies;
        private readonly IVisitsRepository _visits;
        private readonly IOrdersRepository _order;
        private readonly IOrderItemsRepository _orderItems;


        private readonly string _language;
        private readonly int _accountId;
        private readonly string _userType;
        private readonly int _groupId;

        public MrReportingController(
                    IOrdersRepository order,
                    IOrderItemsRepository orderItems,
                  IAreaRepository area, IDistributersRepository distributers, IDrugsRepository drugs,
                  IDocotorsRepository docotors,
                  IHospitalsRepository hospitals, ILocationsRepository locations,
                  IPharmaciesRepository pharmacies, IVisitsRepository visits,
                  IAgentDrugsRepository agentDrug, IAgentHospitalRepository agentHospital,
                  IAgentPharmaciesRepository agentPharmacies,
            IAgentsRepository agents,
                  ICompaniesRepository companies,
                  IDefaultListRepository defaultList,
                  IAgentAreaRepository agentArea, IAgentDistributerRepository agentDistributer,
                  IGroupPermissionsRepository groupPermissions, IGroupsRepository groups)
        {
            _order = order;
            _orderItems = orderItems;
            _groups = groups;
            _agents = agents;
            _permissionGroup = groupPermissions;
            _area = area;
            _agentsArea = agentArea;
            _agentsDistributer = agentDistributer;
            _agentsDrugs = agentDrug;
            _agentsHospital = agentHospital;
            _agentsPharmacies = agentPharmacies;
            _agents = agents;
            _companies = companies;
            _defaultList = defaultList;
            _distributers = distributers;
            _docotors = docotors;
            _drugs = drugs;
            _hospitals = hospitals;
            _locations = locations;
            _pharmacies = pharmacies;
            _visits = visits;

            var langHeader = HttpContext.Current.Request.Headers.GetValues("Lang");

            if (langHeader != null)
            {
                _language = langHeader[0];
            }

            var tokenHeader = HttpContext.Current.Request.Headers.GetValues("Authorization");

            if (tokenHeader != null)
            {
                var userToken = tokenHeader[0];

                if (userToken != null)
                {
                    _accountId = TokenManager.GetUserIdentity(userToken);
                    _userType = TokenManager.GetUserType(userToken);

                    if (_userType.Equals("User"))
                    {

                        _groupId = TokenManager.GetGroupId(userToken);

                    }
                    else if (_userType.Equals("Company"))
                    {

                    }
                }
            }
        }

        [HttpPost]
        [Route("Login")]
        public IHttpActionResult Login([FromBody] Login user)
        {
            const string errorMessage = "Invalid User Name / PassWord";

            var response = new HttpResponseMessage();

            Agent agent = _agents.FindBy(x => x.UserName.Equals(user.UserName)).SingleOrDefault();

            if (agent != null)
            {
                if (user != null && PasswordHash.ValidatePassword(user.UserPassword, agent.PassWord))
                {
                    if (agent.UserType.Equals("Company"))
                    {
                        string secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

                        var currentTime =
                            (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

                        var payload = new JwtPayload
                        {
                            iss = SecurityConstants.TokenIssuer,
                            sub = agent.id.ToString(),
                            iat = currentTime,
                            exp = currentTime + 604800,
                            uty = agent.UserType,
                            gri = agent.GroupId.ToString(),
                            acn = agent.UserName

                        };

                        DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/temp/" + agent.id));

                        if (!dir.Exists)
                        {
                            dir.Create();
                        }

                        string jwt = TokenManager.EncodeToken(payload, secret);
                        response.StatusCode = HttpStatusCode.OK;
                        response.Headers.Add("Authorization", jwt);

                        return ResponseMessage(response);

                    }
                    if (agent.UserType.Equals("User"))
                    {

                        string secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

                        var currentTime =
                            (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

                        var payload = new JwtPayload
                        {
                            iss = SecurityConstants.TokenIssuer,
                            sub = agent.id.ToString(),
                            iat = currentTime,
                            exp = currentTime + 604800,
                            uty = agent.UserType,
                            gri = agent.GroupId.ToString()

                        };

                        DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/temp/" + agent.id));
                        if (!dir.Exists)
                        {
                            dir.Create();
                        }

                        string jwt = TokenManager.EncodeToken(payload, secret);

                        response.StatusCode = HttpStatusCode.OK;
                        response.Headers.Add("Authorization", jwt);

                        return ResponseMessage(response);
                    }
                }
                else if (agent.UserType.Equals("admin"))
                {
                    string secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

                    var currentTime =
                        (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

                    var payload = new JwtPayload
                    {
                        iss = SecurityConstants.TokenIssuer,
                        sub = agent.id.ToString(),
                        iat = currentTime,
                        exp = currentTime + 604800,
                        uty = agent.UserType,
                        gri = agent.GroupId.ToString()

                    };

                    DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/temp/" + agent.id));
                    if (!dir.Exists)
                    {
                        dir.Create();
                    }

                    string jwt = TokenManager.EncodeToken(payload, secret);

                    response.StatusCode = HttpStatusCode.OK;
                    response.Headers.Add("Authorization", jwt);

                    return ResponseMessage(response);
                }


            }

            response.StatusCode = HttpStatusCode.Unauthorized;
            response.ReasonPhrase = errorMessage;

            return ResponseMessage(response);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("CheckTokenValidity")]
        public IHttpActionResult CheckTokenValidity()
        {
            var permissions = new List<int?>();

            var isCompany = false;

            if (_userType.Equals("User"))
            {
                permissions = _permissionGroup.PermissionWithNumbersByGroupIdArray(_groupId);

            }
            else if (_userType.Equals("Company"))
            {

                isCompany = true;

            }
            else
            {
                isCompany = true;
            }

            var primeData = new
            {
                Permissions = permissions,
                isCompany
            };

            return Ok(primeData);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroupsPermissions")]
        public IHttpActionResult GetGroupsPermissions(int groupId, [FromUri] List<int> documentPermissions)
        {
            List<DtoGroupPermissions> result = _permissionGroup.SelectAll(groupId, _language);//.Where(x => documentPermissions.Contains(x.PermissionCode.Value));

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroup")]
        public IHttpActionResult GetGroup()
        {
            List<DtoGroups> result = _groups.SelectAll(_language);//.Where(x => documentPermissions.Contains(x.PermissionCode.Value));

            return Ok(result);
        }


        [AuthorizeUser]
        [HttpPost]
        [Route("AddGroupsPermissions")]
        public IHttpActionResult AddGroupsPermissions([FromBody] List<DtoGroupPermissions> documentPermissions)
        {
            foreach (var permission in documentPermissions)
            {
                var permissionEntity = new GroupPermission()
                {
                    PermissionCode = permission.PermissionCode,
                    Value = permission.Value,
                    GroupId = permission.GroupId
                };

                _permissionGroup.Add(permissionEntity);
            }

            _permissionGroup.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditGroupsPermissions")]
        public IHttpActionResult EditGroupsPermissions([FromBody] List<DtoGroupPermissions> documentPermissions)
        {
            foreach (var permission in documentPermissions)
            {
                var permission1 = permission;

                var permissionEntity =
                    _permissionGroup.FindBy(x => x.GroupId == permission1.GroupId.Value && x.PermissionCode == permission1.PermissionCode.Value).SingleOrDefault();

                if (permissionEntity == null) continue;

                permissionEntity.Value = permission.Value;

                _permissionGroup.Edit(permissionEntity);
            }

            _permissionGroup.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("Addaccount")]
        public IHttpActionResult Addaccount(DtoAgents newaccount)
        {

            var accounts = new Agent
            {
                UserName = newaccount.UserName,
                PassWord = PasswordHash.CreateHash(newaccount.PassWord),
                SupervisorId = newaccount.SupervisorId,
                GroupId = newaccount.GroupId,
                Salary = newaccount.Salary,
                ContactName = newaccount.ContactName,
                NoOfVisits = newaccount.NoOfVisits,
                UserType = newaccount.UserType,
                Address = newaccount.Address,
                Phone = newaccount.Phone,
                Email = newaccount.Email,
                Code = newaccount.Code
            };

            _agents.Add(accounts);
            _agents.Save();
            _agents.Reload(accounts);

            return Ok(accounts);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("Editaccount")]
        public IHttpActionResult Editaccount(DtoAgents editaccount)
        {
            var accounts = _agents.FindBy(x => x.id == editaccount.Id).SingleOrDefault();

            if (accounts != null)
            {
                if (editaccount.PassWord != null)
                {
                    accounts.PassWord = PasswordHash.CreateHash(editaccount.PassWord);
                }
                accounts.UserName = editaccount.UserName;
                accounts.SupervisorId = editaccount.SupervisorId;
                accounts.GroupId = editaccount.GroupId;
                accounts.Salary = editaccount.Salary;
                accounts.NoOfVisits = editaccount.NoOfVisits;
                accounts.ContactName = editaccount.ContactName;
                accounts.Address = editaccount.Address;
                accounts.Phone = editaccount.Phone;
                accounts.Email = editaccount.Email;
                accounts.Code = editaccount.Code;
                accounts.UserType = editaccount.UserType;
                _agents.Edit(accounts);
            }

            _agents.Save();


            return Ok(editaccount);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccounts")]
        public IHttpActionResult GetAccounts()
        {
            List<DtoAgents> result = _agents.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountById")]
        public IHttpActionResult GetAccountById(int id)
        {
            DtoAgents result = _agents.SelectById(id, "en");

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountInfo")]
        public IHttpActionResult GetAccountInfo()
        {
            DtoAgents result = _agents.SelectById(_accountId, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountsDefaultListTypes")]
        public IHttpActionResult GetAccountsDefaultListTypes(int pageNumber, int pageSize)
        {
            IEnumerable<DtoDefaultList> result = _defaultList.SelectTypes(_language);

            return Ok(result);
        }


        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountsDefaultListTypesNotAction")]
        public IHttpActionResult GetAccountsDefaultListTypes(string listType, int action)
        {
            IEnumerable<DtoDefaultList> result = _defaultList.SelectTypesNotEqualAction(listType, action, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddaccountsDefaultList")]
        public IHttpActionResult AddaccountsDefaultList(DtoDefaultList accountsDefaultList)
        {
            var accountsDefaultListEntity = new DefaultList
            {
                Title = accountsDefaultList.Title,
                Type = accountsDefaultList.Type,
                Action = 0
            };
            _defaultList.Add(accountsDefaultListEntity);
            _defaultList.Save();

            _defaultList.Reload(accountsDefaultListEntity);

            accountsDefaultList.Id = accountsDefaultListEntity.Id;

            IEnumerable<DtoDefaultList> result = _defaultList.SelectTypes(_language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountsDefaultList")]
        public IHttpActionResult GetAccountsDefaultList(string listType, int pageNumber, int pageSize)
        {
            List<DtoDefaultList> result = _defaultList.SelectByListType(listType, 2, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountsDefaultListWithAction")]
        public IHttpActionResult GetAccountsDefaultListWithAction(string listType)
        {
            List<DtoDefaultList> result = _defaultList.SelectByListTypeWithAction(listType, _language).ToList();

            return Ok(result);
        }


        [AuthorizeUser]
        [HttpGet]
        [Route("AccountsDefaultListDelete")]
        public IHttpActionResult AccountsDefaultListDelete(int id)
        {
            DefaultList accountsDefaultList = _defaultList.SelectById(id);

            _defaultList.Delete(accountsDefaultList);
            _defaultList.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditAccountsDefaultList")]
        public IHttpActionResult EditAccountsDefaultList(DtoDefaultList accountDefaultList)
        {
            var accountDefaultListEntity = new DefaultList
            {
                Id = accountDefaultList.Id,
                Title = accountDefaultList.Title,
                Type = accountDefaultList.Type
            };

            _defaultList.Edit(accountDefaultListEntity);
            _defaultList.Save();

            return Ok(accountDefaultListEntity);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountsDefaultListForEdit")]
        public IHttpActionResult GetAccountsDefaultListForEdit(int id)
        {
            DtoDefaultList result = _defaultList.SelectForEdit(id);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentArea")]
        public IHttpActionResult GetAgentArea(int agentId)
        {
            var result = _agentsArea.SelectAll(_language, agentId).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentAreaById")]
        public IHttpActionResult GetAgentAreaById(int id)
        {
            var result = _agentsArea.SelectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentAreaById")]
        public IHttpActionResult DeleteAgentAreaById(int id)
        {
            var result = _agentsArea.FindBy(x => x.Id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.DeletedBy = _accountId;
            _agentsArea.Edit(result);
            _agentsArea.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentAreas")]
        public IHttpActionResult AddAgentAreas(DtoAgentArea dtoDocument)
        {
            if (dtoDocument != null)
            {
                foreach (int item in dtoDocument.agentAreas)
                {
                    var obj = new AgentArea
                    {
                        AgentId = dtoDocument.AgentId,
                        AreaId = item
                    };
                    var counter = _agentsArea.FindBy(x => x.AgentId == dtoDocument.AgentId && x.AreaId == item).ToList();
                    if (counter.Count() < 1)
                    {
                        _agentsArea.Add(obj);
                    }
                }
            }


            _agentsArea.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentDistributer")]
        public IHttpActionResult GetAgentDistributer()
        {
            var result = _agentsDistributer.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentDistributerById")]
        public IHttpActionResult GetAgentDistributerById(int id)
        {
            var result = _agentsDistributer.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentDistributerById")]
        public IHttpActionResult DeleteAgentDistributerById(int id)
        {
            var result = _agentsDistributer.FindBy(x => x.Id == id).SingleOrDefault();

            _agentsDistributer.Edit(result);
            _agentsDistributer.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentDistributers")]
        public IHttpActionResult AddAgentDistributer(DtoAgentDistributer dtoDocument)
        {
            var documentNew = new AgentDistributer
            {
                AgentId = dtoDocument.AgentId,
                DistributerId = dtoDocument.DistributerId,

            };

            _agentsDistributer.Add(documentNew);
            _agentsDistributer.Save(); _agentsDistributer.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentDrug")]
        public IHttpActionResult GetAgentDrug(int agentId)
        {
            var result = _agentsDrugs.SelectAll(_language, agentId).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentDrugById")]
        public IHttpActionResult GetAgentDrugById(int id)
        {
            var result = _agentsDrugs.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentDrugById")]
        public IHttpActionResult DeleteAgentDrugById(int id)
        {
            var result = _agentsDrugs.FindBy(x => x.Id == id).SingleOrDefault();

            _agentsDrugs.Edit(result);
            _agentsDrugs.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentDrugs")]
        public IHttpActionResult AddAgentDrugs(DtoAgentDrugs dtoDocument)
        {
            foreach (int item in dtoDocument.agentDrugs)
            {
                var obj = new AgentDrug
                {
                    AgentId = dtoDocument.AgentId,
                    DrugsId = item
                };
                var counter = _agentsDrugs.FindBy(x => x.AgentId == dtoDocument.AgentId && x.DrugsId == item).ToList();
                if (counter.Count() < 1)
                {
                    _agentsDrugs.Add(obj);
                }
            }

            _agentsDrugs.Save();


            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentHospital")]
        public IHttpActionResult GetAgentHospital()
        {
            var result = _agentsHospital.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentHospitalById")]
        public IHttpActionResult GetAgentHospitalById(int id)
        {
            var result = _agentsHospital.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentHospitalById")]
        public IHttpActionResult DeleteAgentHospitalById(int id)
        {
            var result = _agentsHospital.FindBy(x => x.Id == id).SingleOrDefault();

            _agentsHospital.Edit(result);
            _agentsHospital.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentHospitals")]
        public IHttpActionResult AddAgentHospital(DtoAgentHospital dtoDocument)
        {
            var documentNew = new AgentHospital
            {
                AgentId = dtoDocument.AgentId,
                HospitalId = dtoDocument.HospitalId
            };

            _agentsHospital.Add(documentNew);
            _agentsHospital.Save();
            _agentsHospital.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentPharmacies")]
        public IHttpActionResult GetAgentPharmacies()
        {
            var result = _agentsPharmacies.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentPharmaciesById")]
        public IHttpActionResult GetAgentPharmaciesById(int id)
        {
            var result = _agentsPharmacies.SelectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentPharmaciesById")]
        public IHttpActionResult DeleteAgentPharmaciesById(int id)
        {
            var result = _agentsPharmacies.FindBy(x => x.Id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.DeletedBy = _accountId;
            _agentsPharmacies.Edit(result);
            _agentsPharmacies.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentPharmaciess")]
        public IHttpActionResult AddAgentPharmacies(DtoAgentPharmacies dtoDocument)
        {
            var documentNew = new AgentPharmacie
            {
                AgentId = dtoDocument.AgentId,
                PharmacyId = dtoDocument.PharmacyId
            };

            _agentsPharmacies.Add(documentNew);
            _agentsPharmacies.Save();
            _agentsPharmacies.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgents")]
        public IHttpActionResult GetAgents()
        {
            var result = _agents.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentsById")]
        public IHttpActionResult GetAgentsById(int id)
        {
            var result = _agents.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentsById")]
        public IHttpActionResult DeleteAgentsById(int id)
        {
            var result = _agents.FindBy(x => x.id == id).SingleOrDefault();

            _agents.Edit(result);
            _agents.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgents")]
        public IHttpActionResult AddAgents(DtoAgents dtoDocument)
        {
            var documentNew = new Agent
            {
                UserName = dtoDocument.UserName,
                PassWord = PasswordHash.CreateHash(dtoDocument.PassWord),
                ContactName = dtoDocument.ContactName,
                PostionId = dtoDocument.PositionId,
                AreaId = dtoDocument.AreaId,
                Address = dtoDocument.Address,
                Phone = dtoDocument.Phone,
                Email = dtoDocument.Email,
                GroupId = dtoDocument.GroupId,
                Salary = dtoDocument.Salary,
                NoOfVisits = dtoDocument.NoOfVisits,
                SupervisorId = dtoDocument.SupervisorId,
                Code = dtoDocument.Code,
                UserType = dtoDocument.UserType

            };

            _agents.Add(documentNew);
            _agents.Save();

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetArea")]
        public IHttpActionResult GetArea()
        {
            var result = _area.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAreaById")]
        public IHttpActionResult GetAreaById(int id)
        {
            var result = _area.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAreaById")]
        public IHttpActionResult DeleteAreaById(int id)
        {
            var result = _area.FindBy(x => x.Id == id).SingleOrDefault();

            _area.Edit(result);
            _area.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAreas")]
        public IHttpActionResult AddArea(DtoArea dtoDocument)
        {
            var documentNew = new Area
            {
                LocationId = dtoDocument.LocationId,
                Title = dtoDocument.Title

            };

            _area.Add(documentNew);
            _area.Save();
            _area.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetCompanies")]
        public IHttpActionResult GetCompanies()
        {
            var result = _companies.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetCompaniesById")]
        public IHttpActionResult GetCompaniesById(int id)
        {
            var result = _companies.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteCompaniesById")]
        public IHttpActionResult DeleteCompaniesById(int id)
        {
            var result = _companies.FindBy(x => x.Id == id).SingleOrDefault();

            _companies.Edit(result);
            _companies.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddCompaniess")]
        public IHttpActionResult AddCompanies(DtoCompanies dtoDocument)
        {
            var documentNew = new Company
            {
                Name = dtoDocument.Name,
                Description = dtoDocument.Description,
                Phone = dtoDocument.Phone,
                Email = dtoDocument.Email,
                Notes = dtoDocument.Notes
            };

            _companies.Add(documentNew);
            _companies.Save();
            _companies.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDefaultList")]
        public IHttpActionResult GetDefaultList()
        {
            var result = _defaultList.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDefaultListByListType")]
        public IHttpActionResult GetDefaultListByListType(string listType)
        {
            var result = _defaultList.SelectByListType(listType, 2, _language).ToList();

            return Ok(result);
        }


        [AuthorizeUser]
        [HttpGet]
        [Route("GetDefaultListById")]
        public IHttpActionResult GetDefaultListById(int id)
        {
            var result = _defaultList.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDefaultListById")]
        public IHttpActionResult DeleteDefaultListById(int id)
        {
            var result = _defaultList.FindBy(x => x.Id == id).SingleOrDefault();

            _defaultList.Edit(result);
            _defaultList.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDefaultList")]
        public IHttpActionResult AddDefaultList(DtoDefaultList dtoDocument)
        {
            var documentNew = new DefaultList
            {
                Title = dtoDocument.Title,
                Type = dtoDocument.Type
            };

            _defaultList.Add(documentNew);
            _defaultList.Save();

            var result = _defaultList.SelectByListType(dtoDocument.Type, 2, _language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditDefaultlist")]
        public IHttpActionResult EditDefaultlist(DtoDefaultList dtoDocument)
        {
            var documentNew = _defaultList.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();

            documentNew.Title = dtoDocument.Title;

            _defaultList.Edit(documentNew);
            _defaultList.Save();

            var result = _defaultList.SelectByListType(dtoDocument.Type, 2, _language).ToList();

            return Ok(result);
        }



        [AuthorizeUser]
        [HttpGet]
        [Route("GetDistributers")]
        public IHttpActionResult GetDistributers()
        {
            var result = _distributers.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDistributersById")]
        public IHttpActionResult GetDistributersById(int id)
        {
            var result = _distributers.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDistributersById")]
        public IHttpActionResult DeleteDistributersById(int id)
        {
            var result = _distributers.FindBy(x => x.Id == id).SingleOrDefault();

            _distributers.Edit(result);
            _distributers.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDistributers")]
        public IHttpActionResult AddDistributers(DtoDistributers dtoDocument)
        {
            var documentNew = new Distributer
            {
                Name = dtoDocument.Name,
                AreaId = dtoDocument.AreaId,
                Address = dtoDocument.Address,
                Phone = dtoDocument.Phone,
                Code = dtoDocument.Code,
                NoOfVisits = dtoDocument.NoOfVisits

            };

            _distributers.Add(documentNew);
            _distributers.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("editDistributers")]
        public IHttpActionResult editDistributers(DtoDistributers dtoDocument)
        {
            var obj = _distributers.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();

            obj.Name = dtoDocument.Name;
            obj.AreaId = dtoDocument.AreaId;
            obj.Address = dtoDocument.Address;
            obj.Phone = dtoDocument.Phone;
            obj.Code = dtoDocument.Code;
            obj.NoOfVisits = dtoDocument.NoOfVisits;

            _distributers.Edit(obj);
            _distributers.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAlertVisits")]
        public IHttpActionResult GetAlertVisits()
        {
            var result = new List<DtoSummaryWords>();
            result = _visits.alertsCount();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAlertVisitsDetail")]
        public IHttpActionResult GetAlertVisitsDetail(string listType)
        {
            var result = new List<DtoVisits>();
            result = _visits.alertsCountDetail(listType);

            return Ok(result);
        }


        [AuthorizeUser]
        [HttpGet]
        [Route("GetDocotors")]
        public IHttpActionResult GetDocotors()
        {
            var result = new List<DtoDocotors>();

            if (_userType.Equals("User"))
            {
                var areas = _agentsArea.FindBy(x => x.AgentId == _accountId).Select(x => x.AreaId).ToList();

                result = _docotors.SelectAll(_language).ToList().Where(x => areas.Contains(x.AreaId)).ToList();

            }
            else if (_userType.Equals("Company") || _userType.Equals("admin"))
            {
                result = _docotors.SelectAll(_language).ToList();

            }

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("VisitsCost")]
        public IHttpActionResult VisitsCost(reportDto obj)
        {
            var result = new List<DtoVisitCost>();

            result = _visits.visitsCostByAgent(obj.agentId, obj.startDate, obj.finishDate);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("VisitsByAgent")]
        public IHttpActionResult VisitsByAgent(reportDto obj)
        {
            var result = new List<DtoVisits>();

            result = _visits.visitsByAgent(obj.agentId, obj.startDate, obj.finishDate);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("VisitsByArea")]
        public IHttpActionResult VisitsByArea(reportDto obj)
        {
            var result = new List<DtoVisits>();
            result = _visits.visitsByArea(obj.areaId, obj.startDate, obj.finishDate);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDocotorsById")]
        public IHttpActionResult GetDocotorsById(int id)
        {
            var result = _docotors.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDocotorsById")]
        public IHttpActionResult DeleteDocotorsById(int id)
        {
            var result = _docotors.FindBy(x => x.Id == id).SingleOrDefault();
            result.DeletedBy = _accountId;
            _docotors.Edit(result);
            _docotors.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDocotors")]
        public IHttpActionResult AddDocotors(DtoDocotors dtoDocument)
        {
            var documentNew = new Docotor
            {
                Name = dtoDocument.Name,
                SpecializeId = dtoDocument.SpecializeId,
                IsMorning = dtoDocument.IsMorning,
                Address = dtoDocument.Address,
                AreaId = dtoDocument.AreaId,
                ClassTypeId = dtoDocument.ClassTypeId,
                NoOfVisits = dtoDocument.NoOfVisits,
                Phone = dtoDocument.Phone,
                Telephone = dtoDocument.Telephone,
                Email = dtoDocument.Email,
                Code = dtoDocument.Code
            };

            _docotors.Add(documentNew);
            _docotors.Save();

            return Ok(documentNew);
        }
        [AuthorizeUser]
        [HttpPost]
        [Route("EditDocotors")]
        public IHttpActionResult EditDocotors(DtoDocotors dtoDocument)
        {
            var obj = _docotors.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();
            if (obj != null)
            {
                obj.Name = dtoDocument.Name;
                obj.SpecializeId = dtoDocument.SpecializeId;
                obj.IsMorning = dtoDocument.IsMorning;
                obj.Address = dtoDocument.Address;
                obj.AreaId = dtoDocument.AreaId;
                obj.ClassTypeId = dtoDocument.ClassTypeId;
                obj.NoOfVisits = dtoDocument.NoOfVisits;
                obj.Phone = dtoDocument.Phone;
                obj.Telephone = dtoDocument.Telephone;
                obj.Email = dtoDocument.Email;
                obj.Code = dtoDocument.Code;


                _docotors.Edit(obj);
            }
            _docotors.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDrugs")]
        public IHttpActionResult GetDrugs()
        {
            var result = _drugs.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDrugsById")]
        public IHttpActionResult GetDrugsById(int id)
        {
            var result = _drugs.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDrugsById")]
        public IHttpActionResult DeleteDrugsById(int id)
        {
            var result = _drugs.FindBy(x => x.Id == id).SingleOrDefault();

            _drugs.Delete(result);
            _drugs.Save();

            return Ok(id);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditDrugs")]
        public IHttpActionResult EditDrugs(DtoDrugs dtoDocument)
        {
            var obj = _drugs.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();

            if (obj != null)
            {
                obj.Name = dtoDocument.Name;
                obj.Description = dtoDocument.Description;
                obj.Code = dtoDocument.Code;
                obj.Price = dtoDocument.Price;
                obj.SectionId = dtoDocument.SectionId;
                obj.Notes = dtoDocument.Notes;
                obj.CompanyId = dtoDocument.CompanyId;
            }

            _drugs.Edit(obj);
            _drugs.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDrugs")]
        public IHttpActionResult AddDrugs(DtoDrugs dtoDocument)
        {
            var documentNew = new Drug
            {
                Name = dtoDocument.Name,
                Description = dtoDocument.Description,
                Code = dtoDocument.Code,
                Price = dtoDocument.Price,
                SectionId = dtoDocument.SectionId,
                Notes = dtoDocument.Notes,
                CompanyId = dtoDocument.CompanyId

            };

            _drugs.Add(documentNew);
            _drugs.Save();
            _drugs.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroupPermissions")]
        public IHttpActionResult GetGroupPermissions(int groupId)
        {
            var result = _permissionGroup.SelectAll(groupId, _language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroupPermissionsById")]
        public IHttpActionResult GetGroupPermissionsById(int id)
        {
            var result = _permissionGroup.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteGroupPermissionsById")]
        public IHttpActionResult DeleteGroupPermissionsById(int id)
        {
            var result = _permissionGroup.FindBy(x => x.Id == id).SingleOrDefault();

            _permissionGroup.Edit(result);
            _permissionGroup.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddGroupPermissions")]
        public IHttpActionResult AddGroupPermissions(DtoGroupPermissions dtoDocument)
        {
            var documentNew = new GroupPermission
            {
                GroupId = dtoDocument.GroupId,
                PermissionCode = dtoDocument.PermissionCode,
                Value = dtoDocument.Value

            };

            _permissionGroup.Add(documentNew);
            _permissionGroup.Save();
            _permissionGroup.Reload(documentNew);

            return Ok(documentNew);
        }


        [AuthorizeUser]
        [HttpPost]
        [Route("EditGroupPermissions")]
        public IHttpActionResult EditGroupPermissions(DtoGroupPermissions dtoDocument)
        {
            var obj = _permissionGroup.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();
            if (obj != null)
            {
                obj.PermissionCode = dtoDocument.PermissionCode;
                obj.Value = dtoDocument.Value;

            }

            _permissionGroup.Add(obj);
            _permissionGroup.Save();

            return Ok();
        }


        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroups")]
        public IHttpActionResult GetGroups()
        {
            var result = _groups.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroupsById")]
        public IHttpActionResult GetGroupsById(int id)
        {
            var result = _groups.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteGroupsById")]
        public IHttpActionResult DeleteGroupsById(int id)
        {
            var result = _groups.FindBy(x => x.Id == id).SingleOrDefault();

            _groups.Edit(result);
            _groups.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddGroups")]
        public IHttpActionResult AddGroups(DtoGroups dtoDocument)
        {
            var documentNew = new Group
            {
                GroupName = dtoDocument.GroupName,

            };

            _groups.Add(documentNew);
            _groups.Save();
            _groups.Reload(documentNew);

            return Ok(documentNew);
        }
        [AuthorizeUser]
        [HttpPost]
        [Route("EditGroups")]
        public IHttpActionResult EditGroups(DtoGroups dtoDocument)
        {
            var obj = _groups.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();
            if (obj != null)
            {
                obj.GroupName = dtoDocument.GroupName;
                _groups.Edit(obj);
            }
            _groups.Save();

            return Ok();
        }
        [AuthorizeUser]
        [HttpGet]
        [Route("GetHospitals")]
        public IHttpActionResult GetHospitals()
        {
            var result = new List<DtoHospitals>();

            if (_userType.Equals("User"))
            {
                var areas = _agentsArea.FindBy(x => x.AgentId == _accountId).Select(x => x.AreaId).ToList();

                result = _hospitals.SelectAll(_language).ToList().Where(x => areas.Contains(x.AreaId)).ToList();

            }
            else if (_userType.Equals("Company") || _userType.Equals("admin"))
            {
                result = _hospitals.SelectAll(_language).ToList();

            }
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetHospitalsById")]
        public IHttpActionResult GetHospitalsById(int id)
        {
            var result = _hospitals.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteHospitalsById")]
        public IHttpActionResult DeleteHospitalsById(int id)
        {
            var result = _hospitals.FindBy(x => x.Id == id).SingleOrDefault();
            result.DeletedBy = _accountId;
            _hospitals.Edit(result);
            _hospitals.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddHospitals")]
        public IHttpActionResult AddHospitals(DtoHospitals dtoDocument)
        {
            var documentNew = new Hospital
            {
                Name = dtoDocument.Name,
                AreaId = dtoDocument.AreaId,
                Address = dtoDocument.Address,
                Phone = dtoDocument.Phone,
                Email = dtoDocument.Email,
                Type = dtoDocument.Type,
                Code = dtoDocument.Code
            };

            _hospitals.Add(documentNew);
            _hospitals.Save();

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("editHospitals")]
        public IHttpActionResult editHospitals(DtoHospitals dtoDocument)
        {
            var obj = _hospitals.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();
            if (obj != null)
            {
                obj.Name = dtoDocument.Name;
                obj.AreaId = dtoDocument.AreaId;
                obj.Address = dtoDocument.Address;
                obj.Phone = dtoDocument.Phone;
                obj.Email = dtoDocument.Email;
                obj.Type = dtoDocument.Type;
                obj.Code = dtoDocument.Code;

                _hospitals.Edit(obj);
                _hospitals.Save();
            }
            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetLocations")]
        public IHttpActionResult GetLocations()
        {
            var result = _locations.SelectAll(_language).ToList();

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetLocationsById")]
        public IHttpActionResult GetLocationsById(int id)
        {
            var result = _locations.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteLocationsById")]
        public IHttpActionResult DeleteLocationsById(int id)
        {
            var result = _locations.FindBy(x => x.Id == id).SingleOrDefault();

            if (result != null)
            {
                result.DeletedBy = _accountId;
                _locations.Edit(result);
            }

            _locations.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddLocationss")]
        public IHttpActionResult AddLocations(DtoLocations dtoDocument)
        {
            var documentNew = new Location
            {
                Title = dtoDocument.Title

            };

            _locations.Add(documentNew);
            _locations.Save();
            _locations.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetPharmacies")]
        public IHttpActionResult GetPharmacies()
        {

            var result = new List<DtoPharmacies>();

            if (_userType.Equals("User"))
            {
                var areas = _agentsArea.FindBy(x => x.AgentId == _accountId).Select(x => x.AreaId).ToList();

                result = _pharmacies.SelectAll(_language).ToList().Where(x => areas.Contains(x.AreaId)).ToList();

            }
            else if (_userType.Equals("Company") || _userType.Equals("admin"))
            {
                result = _pharmacies.SelectAll(_language).ToList();

            }

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetPharmaciesById")]
        public IHttpActionResult GetPharmaciesById(int id)
        {
            var result = _pharmacies.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeletePharmaciesById")]
        public IHttpActionResult DeletePharmaciesById(int id)
        {
            var result = _pharmacies.FindBy(x => x.Id == id).SingleOrDefault();

            _pharmacies.Edit(result);
            _pharmacies.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddPharmacies")]
        public IHttpActionResult AddPharmacies(DtoPharmacies dtoDocument)
        {
            var documentNew = new Pharmacy
            {
                Name = dtoDocument.Name,
                AreaId = dtoDocument.AreaId,
                Address = dtoDocument.Address,
                Phone = dtoDocument.Phone,
                Email = dtoDocument.Email,
                OwnerName = dtoDocument.OwnerName,
                OwnerPhone = dtoDocument.OwnerPhone

            };

            _pharmacies.Add(documentNew);
            _pharmacies.Save();
            _pharmacies.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditPharmacies")]
        public IHttpActionResult EditPharmacies(DtoPharmacies dtoDocument)
        {
            var obj = _pharmacies.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();
            if (obj != null)
            {
                obj.Name = dtoDocument.Name;
                obj.AreaId = dtoDocument.AreaId;
                obj.Address = dtoDocument.Address;
                obj.Phone = dtoDocument.Phone;
                obj.Email = dtoDocument.Email;
                obj.OwnerName = dtoDocument.OwnerName;
                obj.OwnerPhone = dtoDocument.OwnerPhone;
            }


            _pharmacies.Edit(obj);
            _pharmacies.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetVisits")]
        public IHttpActionResult GetVisits()
        {
            var result = new List<DtoVisits>();

            if (_userType.Equals("Company"))
            {
                result = _visits.SelectAll(_language).ToList();
            }
            else
            {
                result = _visits.SelectAll(_language).ToList().Where(x => x.AgentId == _accountId).ToList();
            }


            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetVisitsById")]
        public IHttpActionResult GetVisitsById(int id)
        {
            var result = _visits.SelectById(id, _language);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteVisitsById")]
        public IHttpActionResult DeleteVisitsById(int id)
        {
            var result = _visits.FindBy(x => x.Id == id).SingleOrDefault();

            _visits.Edit(result);
            _visits.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddVisits")]
        public IHttpActionResult AddVisits(DtoVisits dtoDocument)
        {
            var documentNew = new Visit
            {
                AgentId = dtoDocument.AgentId,
                DrugsId = dtoDocument.DrugsId,
                TypeId = dtoDocument.TypeId,
                VisitTo = dtoDocument.VisitTo,
                VisitDate = dtoDocument.VisitDate,
                Duration = dtoDocument.Duration,
                Description = dtoDocument.Description,
                IsMorning = dtoDocument.IsMorning,
                Notes = dtoDocument.Notes,
                CreationDate = DateTime.Now
            };

            _visits.Add(documentNew);

            _visits.Save();
            _visits.Reload(documentNew);

            return Ok(documentNew);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditVisits")]
        public IHttpActionResult EditVisits(DtoVisits dtoDocument)
        {
            var obj = _visits.FindBy(x => x.Id == dtoDocument.Id).FirstOrDefault();

            if (obj != null)
            {
                obj.AgentId = dtoDocument.AgentId;
                obj.DrugsId = dtoDocument.DrugsId;
                obj.TypeId = dtoDocument.TypeId;
                obj.VisitTo = dtoDocument.VisitTo;
                obj.VisitDate = dtoDocument.VisitDate;
                obj.Duration = dtoDocument.Duration;
                obj.Description = dtoDocument.Description;
                obj.IsMorning = dtoDocument.IsMorning;
                obj.Notes = dtoDocument.Notes;
                obj.LastEditBy = _accountId;
                obj.LastEditDate = DateTime.Now;
            }

            _visits.Edit(obj);
            _visits.Save();

            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetVisitsForDrugReport")]
        public IHttpActionResult GetVisitsForDrugReport(int drugId)
        {
            var result = _visits.SelectVisitsForDrugReport(drugId);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetVisitsMorningCountForDrugReport")]
        public IHttpActionResult GetVisitsMorningCountForDrugReport(int drugId)
        {
            var result = _visits.SelectVisitsMorningCountForDrugReport(drugId);

            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrdersByClient")]
        public IHttpActionResult GetOrdersByClient(int clientId)
        {
            var result = new List<DtoOrders>();
            result = _order.getOrdersByClient(clientId, _language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrdersByAgentId")]
        public IHttpActionResult GetOrdersByAgentId()
        {
            var result = new List<DtoOrders>();
            result = _order.getOrdersByAgentId(_accountId, _language).ToList();
            return Ok(result);
        }

        #region Orders and all operations

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrders")]
        public IHttpActionResult GetOrders()
        {
            var result = new List<DtoOrders>();
            if (_userType.Equals("Company"))
            {
                result = _order.selectAll(_language).ToList();

            }
            else
            {
                result = _order.getOrdersByAgentId(_accountId, _language).ToList();
            }
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrdersById")]
        public IHttpActionResult GetOrdersById(int id)
        {
            var result = _order.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrdersSupervisorApproval")]
        public IHttpActionResult GetOrdersSupervisorApproval()
        {
            var result = _order.selectBySupervisor(_accountId);
            return Ok();
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAlertsOnOrders")]
        public IHttpActionResult GetAlertsOnOrders()
        {
            var result = _order.AlertsByOrders();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAlertsOnOrdersApproved")]
        public IHttpActionResult GetAlertsOnOrdersApproved()
        {
            var result = _order.AlertsApproved();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAlertsOnOrdersApprovedToOrders")]
        public IHttpActionResult GetAlertsOnOrdersApprovedToOrders()
        {
            var result = _order.AlertsOrdersandApprvoved();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("AlertsOrdersandApprvovedDetail")]
        public IHttpActionResult AlertsOrdersandApprvovedDetail(string type)
        {
            var result = _order.AlertsOrdersandApprvovedDetail(type);
            return Ok(result);
        }
   [AuthorizeUser]
        [HttpGet]
        [Route("AlertsByOrdersCompleteDetail")]
        public IHttpActionResult AlertsByOrdersCompleteDetail(string type)
        {
            var result = _order.AlertsByOrdersCompleteDetail(type);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteOrdersById")]
        public IHttpActionResult DeleteOrdersById(int id)
        {
            var result = _order.FindBy(x => x.id == id).SingleOrDefault();
            result.deletedBy = _accountId;
            _order.Edit(result);
            _order.Save();
            var list = new List<DtoOrders>();

            if (_userType.Equals("Company"))
            {

                list = _order.selectAll(_language);
            }
            else
            {
                list = _order.getOrdersByAgentId(_accountId, _language);
            }

            return Ok(list);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("updateOrdersBySupervisor")]
        public IHttpActionResult updateOrdersBySupervisor(List<int> ids, bool status)
        {
            foreach (int item in ids)
            {
                var order = _order.FindBy(x => x.id == item).FirstOrDefault();
                order.supervisorDate = DateTime.Now.Date;
                order.supervisorApprove = status;
                _order.Edit(order);
                _order.Save();
            }

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("updateOrdersByAgent")]
        public IHttpActionResult updateOrdersByAgent(List<int> ids, bool status)
        {
            foreach (int item in ids)
            {
                var order = _order.FindBy(x => x.id == item).FirstOrDefault();
                order.isDeliverd = status;
                order.lastEditBy = _accountId;
                order.lastEditDate = DateTime.Now.Date;
                _order.Edit(order);
                _order.Save();
            }

            return Ok();
        }


        [AuthorizeUser]
        [HttpPost]
        [Route("AddOrders")]
        public IHttpActionResult AddOrders(DtoOrders dtoDocument)
        {
            var DocumentNew = new Order
            {
                orderTo = dtoDocument.orderTo,
                orderTypeId = dtoDocument.orderTypeId,
                agentId = dtoDocument.agentId,
                subject = dtoDocument.subject,
                orderDate = dtoDocument.orderDate,
                estimateDate = dtoDocument.estimateDate,
                deliverdDate = dtoDocument.deliverdDate,
                supervisorApprove = dtoDocument.supervisorApprove,
                isDeliverd = dtoDocument.isDeliverd,
                supervisorDate = dtoDocument.supervisorDate,
                noOfItems = dtoDocument.noOfItems,
                total = dtoDocument.total,
                netTotal = dtoDocument.netTotal
            };
            _order.Add(DocumentNew);
            _order.Save();
            _order.Reload(DocumentNew);
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("EditOrders")]
        public IHttpActionResult EditOrders(DtoOrders dtoDocument)
        {

            var order = _order.FindBy(x => x.id == dtoDocument.id).FirstOrDefault();
            if (order != null)
            {
                order.orderTo = dtoDocument.orderTo;
                order.orderTypeId = dtoDocument.orderTypeId;
                order.agentId = dtoDocument.agentId;
                order.subject = dtoDocument.subject;
                order.orderDate = dtoDocument.orderDate;
                order.estimateDate = dtoDocument.estimateDate;
                order.deliverdDate = dtoDocument.deliverdDate;
                order.supervisorApprove = dtoDocument.supervisorApprove;
                order.isDeliverd = dtoDocument.isDeliverd;
                order.supervisorDate = dtoDocument.supervisorDate;
                order.noOfItems = dtoDocument.noOfItems;
                order.total = dtoDocument.total;
                order.netTotal = dtoDocument.netTotal;
                order.lastEditDate = DateTime.Now.Date;
                order.lastEditBy = _accountId;

                _order.Edit(order);
            };
            _order.Save();

            return Ok(order);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrdersItems")]
        public IHttpActionResult GetOrdersItems(int orderId)
        {
            var result = new List<DtoOrdersItems>();
            result = _orderItems.selectAll(orderId, _language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetOrdersItemsById")]
        public IHttpActionResult GetOrdersItemsById(int id)
        {
            var result = _orderItems.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteOrdersItemsById")]
        public IHttpActionResult DeleteOrdersItemsById(int id)
        {
            var result = _orderItems.FindBy(x => x.id == id).SingleOrDefault();
            if (result != null)
            {

                _orderItems.Delete(result);
                _orderItems.Save();

                var order = _order.FindBy(x => x.id == result.orderId).FirstOrDefault();
                order.noOfItems = order.noOfItems - 1;
                order.total = order.total ?? 0 - result.total ?? 0;
                order.netTotal = order.netTotal ?? 0 - result.total ?? 0;
                order.lastEditBy = _accountId;
                order.lastEditDate = DateTime.Now.Date;
                _order.Edit(order);
                _order.Save();

            }

            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddOrdersItems")]
        public IHttpActionResult AddOrdersItems(DtoOrdersItems dtoDocument)
        {
            var DocumentNew = new ordersItem
            {
                description = dtoDocument.description,
                itemCode = dtoDocument.itemCode,
                unitPrice = dtoDocument.unitPrice,
                quantity = dtoDocument.quantity,
                total = dtoDocument.total,
                drugsId = dtoDocument.drugsId

            };
            _orderItems.Add(DocumentNew);
            _orderItems.Save();

            #region edit on orders
            var sumItem = _orderItems.FindBy(x => x.orderId == dtoDocument.orderId).ToList().Select(x => x.total).Sum();
            var order = _order.FindBy(x => x.id == dtoDocument.orderId).FirstOrDefault();
            order.total = sumItem;
            order.noOfItems = order.noOfItems ?? 0 + 1;
            _order.Edit(order);
            _order.Save();

            #endregion
            var list = _orderItems.selectAll((int)dtoDocument.orderId, _language).ToList();

            return Ok(list);
        }

        #endregion
    }
}

