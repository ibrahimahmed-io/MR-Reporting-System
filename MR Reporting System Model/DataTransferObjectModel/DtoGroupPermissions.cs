namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoGroupPermissions
    {
        public int Id
        {
            get;
            set;
        }

        public int? GroupId
        {
            get;
            set;
        }

        public string GroupName
        {
            get;
            set;
        }

        public int? PermissionCode
        {
            get;
            set;
        }

        public bool? Value
        {
            get;
            set;
        }
    }

}

