namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoArea
    {
        public int Id
        {
            get;
            set;
        }

        public int? LocationId
        {
            get;
            set;
        }

        public string LocationName
        {
            get;
            set;
        }

        public string Title
        {
            get;
            set;
        }

        public int? DeletedBy
        {
            get;
            set;
        }

        public string DeletedByUserName
        {
            get;
            set;
        }
    }

}

