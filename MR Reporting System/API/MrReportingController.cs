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
    public class ProcoorController : ApiController
    {

        private readonly IGroupsRepository _group;
        private readonly IAgentsRepository _agent;
        private readonly IGroupPermissionsRepository _permissionGroup;
        private readonly IAreaRepository _area;
        private readonly IDefaultListRepository _defaultList;

        private readonly string _language;
        private readonly int _accountId;
        private int _accountOwnerId;
        private readonly string _userType;
        private readonly int _groupId;

        public ProcoorController(
            IGroupsRepository groups,
            IGroupPermissionsRepository permissionGroup,
            IAreaRepository area,
            IAgentsRepository agent,
            IDefaultListRepository defaultList)
        {
            _group = groups;
            _agent = agent;
            _permissionGroup = permissionGroup;
            _area = area;
            _defaultList = defaultList;

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
    }
}

