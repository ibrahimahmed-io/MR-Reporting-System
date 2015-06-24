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

        private readonly IGrouppermissionsRepository _permissionGroup;
        private readonly IAreaRepository _area;
        private readonly IDefaultlistRepository _Defaultlist;
        private readonly IAgantareaRepository _Agantsarea;
        private readonly IAgantdistributerRepository _Agantsdistributer;
        private readonly IAgantdrugsRepository _Agantsdrugs;
        private readonly IAganthospitalRepository _Agantshospital;
        private readonly IAgantpharmaciesRepository _Agantspharmacies;
        private readonly IAgantsRepository _Agants;
        private readonly ICompaniesRepository _Companies;
        private readonly IDistributersRepository _Distributers;
        private readonly IDocotorsRepository _Docotors;
        private readonly IDrugsRepository _Drugs;
        private readonly IGroupsRepository _Groups;
        private readonly IHospitalsRepository _Hospitals;
        private readonly ILocationsRepository _Locations;
        private readonly IPharmaciesRepository _Pharmacies;
        private readonly IVisitsRepository _Visits;


        private string _language;
        private int _accountId;
        private int _accountOwnerId;
        private string _userType;
        private int _groupId;



        public MrReportingController(
                  IAreaRepository Area, IDistributersRepository Distributers, IDrugsRepository Drugs,
                  IDocotorsRepository Docotors,
                  IHospitalsRepository Hospitals, ILocationsRepository Locations,
                  IPharmaciesRepository Pharmacies, IVisitsRepository Visits,
                  IAgantdrugsRepository agantDrug, IAganthospitalRepository Aganthospital,
                  IAgantpharmaciesRepository Agantpharmacies, IAgantsRepository Agants,
                  ICompaniesRepository Companies,
                  IDefaultlistRepository Defaultlist,
                  IAgantareaRepository Agantarea, IAgantdistributerRepository Agantdistributer,
                  IGrouppermissionsRepository Grouppermissions, IGroupsRepository groups)
        {
            _Groups = groups;
            _Agants = Agants;
            _permissionGroup = Grouppermissions;
            _area = Area;
            _Agantsarea = Agantarea;
            _Agantsdistributer = Agantdistributer;
            _Agantsdrugs = agantDrug;
            _Agantshospital = Aganthospital;
            _Agantspharmacies = Agantpharmacies;
            _Agants = Agants; _Companies = Companies;
            _Defaultlist = Defaultlist;
            _Distributers = Distributers;
            _Docotors = Docotors;
            _Drugs = Drugs;
            _Hospitals = Hospitals;
            _Locations = Locations;
            _Pharmacies = Pharmacies;
            _Visits = Visits;

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

                    if (_userType.Equals("user"))
                    {

                        _groupId = TokenManager.GetGroupId(userToken);
                        _accountOwnerId = TokenManager.GetOwnerIdentity(userToken);

                    }
                    else if (_userType.Equals("company"))
                    {
                        _accountOwnerId = TokenManager.GetOwnerIdentity(userToken);

                    }
                }
            }
        }

        [HttpPost]
        [Route("Login")]
        public IHttpActionResult Login([FromBody] Login _user)
        {
            if (_user == null);

            const string errorMessage = "Invalid User Name / PassWord";

            var response = new HttpResponseMessage();

            Agent user = _agent.FindBy(x => x.UserName.Equals(_user.UserName)).SingleOrDefault();

            if (user != null)
            {
                if (PasswordHash.ValidatePassword(_user.UserPassword, user.PassWord))
                {
                    if (user.UserType.Equals("company"))
                    {

                        //get info for logged user

                        string secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

                        var currentTime =
                            (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

                        var payload = new JwtPayload
                        {
                            iss = SecurityConstants.TokenIssuer,
                            sub = user.id.ToString(),

                            iat = currentTime,
                            exp = currentTime + 604800,
                            uty = user.UserType,
                            gri = user.GroupId.ToString(),
                            acn = user.UserName

                        };

                        DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/temp/" + user.id));
                        if (!dir.Exists)
                        {
                            dir.Create();
                        }

                        string jwt = TokenManager.EncodeToken(payload, secret);
                        response.StatusCode = HttpStatusCode.OK;
                        response.Headers.Add("Authorization", jwt);

                        return ResponseMessage(response);

                    }
                    if (user.UserType.Equals("user"))
                    {

                        string secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

                        var currentTime =
                            (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

                        var payload = new JwtPayload
                        {
                            iss = SecurityConstants.TokenIssuer,
                            sub = user.id.ToString(),
                            iat = currentTime,
                            exp = currentTime + 604800,
                            uty = user.UserType,
                            gri = user.GroupId.ToString()

                        };

                        DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/temp/" + user.id));
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
                else if (user.UserType.Equals("admin"))
                {


                    string secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

                    var currentTime =
                        (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

                    var payload = new JwtPayload
                    {
                        iss = SecurityConstants.TokenIssuer,
                        sub = user.id.ToString(),
                        iat = currentTime,
                        exp = currentTime + 604800,
                        uty = user.UserType,
                        gri = user.GroupId.ToString()

                    };

                    DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/temp/" + user.id));
                    if (!dir.Exists)
                    {
                        dir.Create();
                    }

                    //send requests from time sheet to pproval requests if logged user is Supervisor
                    // _projectExpenses.AutoSendRequestsBySupervisorId(_accountId, _accountOwnerId);

                    string jwt = TokenManager.EncodeToken(payload, secret);

                    response.StatusCode = HttpStatusCode.OK;
                    response.Headers.Add("Authorization", jwt);
                    //create folder auto for user if not have folder

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

            if (_userType.Equals("user"))
            {
                permissions = _permissionGroup.PermissionWithNumbersByGroupIdArray(_groupId);

            }
            else if (_userType.Equals("company"))
            {

                isCompany = true;

            }
            else
            {
                isCompany = true;
            }

            var primeData = new
            {
                Permissions = permissions, isCompany

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
            List<DtoGroups> result = _group.SelectAll(_language);//.Where(x => documentPermissions.Contains(x.PermissionCode.Value));
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
                NoOfVisits = newaccount.NoOfVisits,
                UserType = "user"
            };

            _agent.Add(accounts);
            _agent.Save();

            _agent.Reload(accounts);



            return Ok(accounts);
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("Editaccount")]
        public IHttpActionResult Editaccount(DtoAgents editaccount)
        {
            var accounts = _agent.FindBy(x => x.id == editaccount.Id).SingleOrDefault();

            if (accounts != null)
            {
                accounts.UserName = editaccount.UserName;
                accounts.SupervisorId = editaccount.SupervisorId;
                accounts.GroupId = editaccount.GroupId;
                accounts.Salary = editaccount.Salary;
                accounts.NoOfVisits = editaccount.NoOfVisits;

                _agent.Edit(accounts);
            }

            _agent.Save();


            return Ok(editaccount);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccounts")]
        public IHttpActionResult GetAccounts()
        {
            List<DtoAgents> result = _agent.SelectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountById")]
        public IHttpActionResult GetAccountById(int id)
        {
            DtoAgents result = _agent.SelectById(id, "en");
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAccountInfo")]
        public IHttpActionResult GetAccountInfo()
        {
            DtoAgents result = _agent.SelectById(_accountId, _language);

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
        public IHttpActionResult GetAgentArea()
        {
            var result = new List<DtoAgentArea>();
            result = _AgentsArea.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentAreaById")]
        public IHttpActionResult GetAgentAreaById(int id)
        {
            var result = _AgentsArea.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentAreaById")]
        public IHttpActionResult DeleteAgentAreaById(int id)
        {
            var result = _AgentsArea.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _AgentsArea.Edit(result);
            _AgentsArea.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentAreas")]
        public IHttpActionResult AddAgentArea(DtoAgentArea dtoDocument)
        {
            var DocumentNew = new AgentArea
            {
                AgentId = dtoDocument.AgentId,
                AreaId = dtoDocument.AreaId

            };
            _AgentsArea.Add(DocumentNew);
            _AgentsArea.Save(); _AgentsArea.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentdistributer")]
        public IHttpActionResult GetAgentdistributer()
        {
            var result = new List<DtoAgentdistributer>();
            result = _Agentsdistributer.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentdistributerById")]
        public IHttpActionResult GetAgentdistributerById(int id)
        {
            var result = _Agentsdistributer.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentdistributerById")]
        public IHttpActionResult DeleteAgentdistributerById(int id)
        {
            var result = _Agentsdistributer.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Agentsdistributer.Edit(result);
            _Agentsdistributer.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentdistributers")]
        public IHttpActionResult AddAgentdistributer(DtoAgentdistributer dtoDocument)
        {
            var DocumentNew = new Agentdistributer
            {
                AgentId = dtoDocument.AgentId,
                distributerId = dtoDocument.distributerId,

            };
            _Agentsdistributer.Add(DocumentNew);
            _Agentsdistributer.Save(); _Agentsdistributer.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentDrug")]
        public IHttpActionResult GetAgentDrug()
        {
            var result = new List<DtoAgentdrugs>();
            result = _Agentsdrugs.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentDrugById")]
        public IHttpActionResult GetAgentDrugById(int id)
        {
            var result = _Agentsdrugs.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentDrugById")]
        public IHttpActionResult DeleteAgentDrugById(int id)
        {
            var result = _Agentsdrugs.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Agentsdrugs.Edit(result);
            _Agentsdrugs.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentDrugs")]
        public IHttpActionResult AddAgentDrug(DtoAgentdrugs dtoDocument)
        {
            var DocumentNew = new AgentDrug
            {
                AgentId = dtoDocument.AgentId,
                drugsId = dtoDocument.drugsId,

            };
            _Agentsdrugs.Add(DocumentNew);
            _Agentsdrugs.Save(); _Agentsdrugs.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgenthospital")]
        public IHttpActionResult GetAgenthospital()
        {
            var result = new List<DtoAgenthospital>();
            result = _Agentshospital.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgenthospitalById")]
        public IHttpActionResult GetAgenthospitalById(int id)
        {
            var result = _Agentshospital.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgenthospitalById")]
        public IHttpActionResult DeleteAgenthospitalById(int id)
        {
            var result = _Agentshospital.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            //result.deletedBy = _accountId;
            _Agentshospital.Edit(result);
            _Agentshospital.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgenthospitals")]
        public IHttpActionResult AddAgenthospital(DtoAgenthospital dtoDocument)
        {
            var DocumentNew = new AgentHospital
            {
                AgentId = dtoDocument.AgentId,
                hospitalId = dtoDocument.hospitalId

            };
            _Agentshospital.Add(DocumentNew);
            _Agentshospital.Save(); _Agentshospital.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentpharmacies")]
        public IHttpActionResult GetAgentpharmacies()
        {
            var result = new List<DtoAgentpharmacies>();
            result = _Agentspharmacies.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentpharmaciesById")]
        public IHttpActionResult GetAgentpharmaciesById(int id)
        {
            var result = _Agentspharmacies.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentpharmaciesById")]
        public IHttpActionResult DeleteAgentpharmaciesById(int id)
        {
            var result = _Agentspharmacies.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Agentspharmacies.Edit(result);
            _Agentspharmacies.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentpharmaciess")]
        public IHttpActionResult AddAgentpharmacies(DtoAgentpharmacies dtoDocument)
        {
            var DocumentNew = new AgentPharmacy
            {
                AgentId = dtoDocument.AgentId,
                pharmacyId = dtoDocument.pharmacyId

            };
            _Agentspharmacies.Add(DocumentNew);
            _Agentspharmacies.Save();
            _Agentspharmacies.Reload(DocumentNew);
            int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgents")]
        public IHttpActionResult GetAgents()
        {
            var result = new List<DtoAgents>();
            result = _Agents.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAgentsById")]
        public IHttpActionResult GetAgentsById(int id)
        {
            var result = _Agents.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAgentsById")]
        public IHttpActionResult DeleteAgentsById(int id)
        {
            var result = _Agents.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            //result.deletedBy = _accountId;
            _Agents.Edit(result);
            _Agents.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAgentss")]
        public IHttpActionResult AddAgents(DtoAgents dtoDocument)
        {
            var DocumentNew = new Agent
            {
                userName = dtoDocument.userName,
                passWord = PasswordHash.CreateHash(dtoDocument.passWord),
                ContactName = dtoDocument.ContactName,
                postionId = dtoDocument.postionId,
                AreaId = dtoDocument.AreaId,
                address = dtoDocument.address,
                phone = dtoDocument.phone,
                email = dtoDocument.email,
                groupId = dtoDocument.groupId,
                salary = dtoDocument.salary,
                noOfVisits = dtoDocument.noOfVisits,
                supervisorId = dtoDocument.supervisorId,
                Code = dtoDocument.Code,
                userType = dtoDocument.userType

            };
            _Agents.Add(DocumentNew);
            _Agents.Save(); _Agents.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetArea")]
        public IHttpActionResult GetArea()
        {
            var result = new List<DtoArea>();
            result = _Area.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetAreaById")]
        public IHttpActionResult GetAreaById(int id)
        {
            var result = _Area.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteAreaById")]
        public IHttpActionResult DeleteAreaById(int id)
        {
            var result = _Area.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Area.Edit(result);
            _Area.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddAreas")]
        public IHttpActionResult AddArea(DtoArea dtoDocument)
        {
            var DocumentNew = new Area
            {
                locationId = dtoDocument.locationId,
                title = dtoDocument.title

            };
            _Area.Add(DocumentNew);
            _Area.Save(); _Area.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetCompanies")]
        public IHttpActionResult GetCompanies()
        {
            var result = new List<DtoCompanies>();
            result = _Companies.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetCompaniesById")]
        public IHttpActionResult GetCompaniesById(int id)
        {
            var result = _Companies.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteCompaniesById")]
        public IHttpActionResult DeleteCompaniesById(int id)
        {
            var result = _Companies.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Companies.Edit(result);
            _Companies.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddCompaniess")]
        public IHttpActionResult AddCompanies(DtoCompanies dtoDocument)
        {
            var DocumentNew = new company
            {
                name = dtoDocument.name,
                description = dtoDocument.description,
                phone = dtoDocument.phone,
                email = dtoDocument.email,
                notes = dtoDocument.notes

            };
            _Companies.Add(DocumentNew);
            _Companies.Save(); _Companies.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDefaultlist")]
        public IHttpActionResult GetDefaultlist()
        {
            var result = new List<DtoDefaultlist>();
            result = _Defaultlist.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDefaultlistById")]
        public IHttpActionResult GetDefaultlistById(int id)
        {
            var result = _Defaultlist.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDefaultlistById")]
        public IHttpActionResult DeleteDefaultlistById(int id)
        {
            var result = _Defaultlist.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Defaultlist.Edit(result);
            _Defaultlist.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDefaultlists")]
        public IHttpActionResult AddDefaultlist(DtoDefaultlist dtoDocument)
        {
            var DocumentNew = new defaultList
            {
                title = dtoDocument.title,
                type = dtoDocument.type,
                action = dtoDocument.action,

            };
            _Defaultlist.Add(DocumentNew);
            _Defaultlist.Save(); _Defaultlist.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDistributers")]
        public IHttpActionResult GetDistributers()
        {
            var result = new List<DtoDistributers>();
            result = _Distributers.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDistributersById")]
        public IHttpActionResult GetDistributersById(int id)
        {
            var result = _Distributers.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDistributersById")]
        public IHttpActionResult DeleteDistributersById(int id)
        {
            var result = _Distributers.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Distributers.Edit(result);
            _Distributers.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDistributerss")]
        public IHttpActionResult AddDistributers(DtoDistributers dtoDocument)
        {
            var DocumentNew = new distributer
            {
                name = dtoDocument.name,
                AreaId = dtoDocument.AreaId,
                address = dtoDocument.address,
                phone = dtoDocument.phone,
                code = dtoDocument.code,
                noOfVisits = dtoDocument.noOfVisits

            };
            _Distributers.Add(DocumentNew);
            _Distributers.Save(); _Distributers.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDocotors")]
        public IHttpActionResult GetDocotors()
        {
            var result = new List<DtoDocotors>();
            result = _Docotors.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDocotorsById")]
        public IHttpActionResult GetDocotorsById(int id)
        {
            var result = _Docotors.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDocotorsById")]
        public IHttpActionResult DeleteDocotorsById(int id)
        {
            var result = _Docotors.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Docotors.Edit(result);
            _Docotors.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDocotorss")]
        public IHttpActionResult AddDocotors(DtoDocotors dtoDocument)
        {
            var DocumentNew = new docotor
            {
                name = dtoDocument.name,
                specializeId = dtoDocument.specializeId,
                isMorning = dtoDocument.isMorning,
                address = dtoDocument.address,
                AreaId = dtoDocument.AreaId,
                classTypeId = dtoDocument.classTypeId,
                noOfVisits = dtoDocument.noOfVisits,
                phone = dtoDocument.phone,
                telephone = dtoDocument.telephone,
                email = dtoDocument.email,
                code = dtoDocument.code

            };
            _Docotors.Add(DocumentNew);
            _Docotors.Save(); _Docotors.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDrugs")]
        public IHttpActionResult GetDrugs()
        {
            var result = new List<DtoDrugs>();
            result = _Drugs.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetDrugsById")]
        public IHttpActionResult GetDrugsById(int id)
        {
            var result = _Drugs.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteDrugsById")]
        public IHttpActionResult DeleteDrugsById(int id)
        {
            var result = _Drugs.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Drugs.Edit(result);
            _Drugs.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddDrugss")]
        public IHttpActionResult AddDrugs(DtoDrugs dtoDocument)
        {
            var DocumentNew = new drug
            {
                name = dtoDocument.name,
                description = dtoDocument.description,
                code = dtoDocument.code,
                price = dtoDocument.price,
                sectionId = dtoDocument.sectionId,
                notes = dtoDocument.notes,
                companyId = dtoDocument.companyId

            };
            _Drugs.Add(DocumentNew);
            _Drugs.Save(); _Drugs.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGrouppermissions")]
        public IHttpActionResult GetGrouppermissions(int groupId)
        {
            var result = new List<DtoGrouppermissions>();
            result = _permissionGroup.selectAll(groupId, _language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGrouppermissionsById")]
        public IHttpActionResult GetGrouppermissionsById(int id)
        {
            var result = _permissionGroup.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteGrouppermissionsById")]
        public IHttpActionResult DeleteGrouppermissionsById(int id)
        {
            var result = _permissionGroup.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _permissionGroup.Edit(result);
            _permissionGroup.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddGrouppermissionss")]
        public IHttpActionResult AddGrouppermissions(DtoGrouppermissions dtoDocument)
        {
            var DocumentNew = new groupPermission
            {
                groupId = dtoDocument.groupId,
                permissionCode = dtoDocument.permissionCode,
                value = dtoDocument.value

            };
            _permissionGroup.Add(DocumentNew);
            _permissionGroup.Save(); _permissionGroup.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroups")]
        public IHttpActionResult GetGroups()
        {
            var result = new List<DtoGroups>();
            result = _Groups.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetGroupsById")]
        public IHttpActionResult GetGroupsById(int id)
        {
            var result = _Groups.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteGroupsById")]
        public IHttpActionResult DeleteGroupsById(int id)
        {
            var result = _Groups.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Groups.Edit(result);
            _Groups.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddGroupss")]
        public IHttpActionResult AddGroups(DtoGroups dtoDocument)
        {
            var DocumentNew = new Group
            {
                groupName = dtoDocument.groupName,

            };
            _Groups.Add(DocumentNew);
            _Groups.Save(); _Groups.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetHospitals")]
        public IHttpActionResult GetHospitals()
        {
            var result = new List<DtoHospitals>();
            result = _Hospitals.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetHospitalsById")]
        public IHttpActionResult GetHospitalsById(int id)
        {
            var result = _Hospitals.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteHospitalsById")]
        public IHttpActionResult DeleteHospitalsById(int id)
        {
            var result = _Hospitals.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Hospitals.Edit(result);
            _Hospitals.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddHospitalss")]
        public IHttpActionResult AddHospitals(DtoHospitals dtoDocument)
        {
            var DocumentNew = new hospital
            {
                name = dtoDocument.name,
                AreaId = dtoDocument.AreaId,
                address = dtoDocument.address,
                phone = dtoDocument.phone,
                email = dtoDocument.email,
                type = dtoDocument.type,
                code = dtoDocument.code
            };
            _Hospitals.Add(DocumentNew);
            _Hospitals.Save(); _Hospitals.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetLocations")]
        public IHttpActionResult GetLocations()
        {
            var result = new List<DtoLocations>();
            result = _Locations.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetLocationsById")]
        public IHttpActionResult GetLocationsById(int id)
        {
            var result = _Locations.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteLocationsById")]
        public IHttpActionResult DeleteLocationsById(int id)
        {
            var result = _Locations.FindBy(x => x.id == id).SingleOrDefault();

            result.deletedBy = _accountId;
            _Locations.Edit(result);
            _Locations.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddLocationss")]
        public IHttpActionResult AddLocations(DtoLocations dtoDocument)
        {
            var DocumentNew = new Location
            {
                title = dtoDocument.title

            };
            _Locations.Add(DocumentNew);
            _Locations.Save(); _Locations.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetPharmacies")]
        public IHttpActionResult GetPharmacies()
        {
            var result = new List<DtoPharmacies>();
            result = _Pharmacies.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetPharmaciesById")]
        public IHttpActionResult GetPharmaciesById(int id)
        {
            var result = _Pharmacies.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeletePharmaciesById")]
        public IHttpActionResult DeletePharmaciesById(int id)
        {
            var result = _Pharmacies.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Pharmacies.Edit(result);
            _Pharmacies.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddPharmaciess")]
        public IHttpActionResult AddPharmacies(DtoPharmacies dtoDocument)
        {
            var DocumentNew = new pharmacy
            {
                name = dtoDocument.name,
                AreaId = dtoDocument.AreaId,
                address = dtoDocument.address,
                phone = dtoDocument.phone,
                email = dtoDocument.email,
                ownerName = dtoDocument.ownerName,
                ownerPhone = dtoDocument.ownerPhone

            };
            _Pharmacies.Add(DocumentNew);
            _Pharmacies.Save(); _Pharmacies.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetVisits")]
        public IHttpActionResult GetVisits()
        {
            var result = new List<DtoVisits>();
            result = _Visits.selectAll(_language).ToList();
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("GetVisitsById")]
        public IHttpActionResult GetVisitsById(int id)
        {
            var result = _Visits.selectById(id, _language);
            return Ok(result);
        }

        [AuthorizeUser]
        [HttpGet]
        [Route("DeleteVisitsById")]
        public IHttpActionResult DeleteVisitsById(int id)
        {
            var result = _Visits.FindBy(x => x.id == id).SingleOrDefault();
            // result.isDeleted = True;
            // result.deletedBy = _accountId;
            _Visits.Edit(result);
            _Visits.Save();
            return Ok();
        }

        [AuthorizeUser]
        [HttpPost]
        [Route("AddVisitss")]
        public IHttpActionResult AddVisits(DtoVisits dtoDocument)
        {
            var DocumentNew = new visit
            {
                AgentId = dtoDocument.AgentId,
                drugsId = dtoDocument.drugsId,
                typeId = dtoDocument.typeId,
                visitTo = dtoDocument.visitTo,
                visitDate = dtoDocument.visitDate,
                duration = dtoDocument.duration,
                description = dtoDocument.description,
                isMorning = dtoDocument.isMorning,
                notes = dtoDocument.notes,
                creationDate = dtoDocument.creationDate,

            };
            _Visits.Add(DocumentNew);
            _Visits.Save(); _Visits.Reload(DocumentNew); int ObjId = DocumentNew.id;
            return Ok(DocumentNew);
        }

    }
}

