namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoOrdersItems
    {
        public int id
        {
            get;
            set;
        }

        public string description
        {
            get;
            set;
        }

        public string itemCode
        {
            get;
            set;
        }

        public double? unitPrice
        {
            get;
            set;
        }

        public int? quantity
        {
            get;
            set;
        }

        public double? total
        {
            get;
            set;
        }

        public int? drugsId
        {
            get;
            set;
        }

        public string drugsName
        {
            get;
            set;
        }
    }

}

