using System;
namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoOrders
    {
        public int id
        {
            get;
            set;
        }

        public int? orderTo
        {
            get;
            set;
        }

        public int? orderTypeId
        {
            get;
            set;
        }

        public string orderTypeName
        {
            get;
            set;
        }

        public int? agentId
        {
            get;
            set;
        }

        public string agentName
        {
            get;
            set;
        }

        public string subject
        {
            get;
            set;
        }
        public string ready
        {
            get;
            set;
        }
        public string clientName
        {
            get;
            set;
        }

        public DateTime? orderDate
        {
            get;
            set;
        }

        public DateTime? estimateDate
        {
            get;
            set;
        }

        public DateTime? deliverdDate
        {
            get;
            set;
        }

        public bool? supervisorApprove
        {
            get;
            set;
        }


        public string supervisorStatus { get; set; }
        public bool? isDeliverd
        {
            get;
            set;
        }

        public string deliverdStatus { get; set; }
        public DateTime? supervisorDate
        {
            get;
            set;
        }

        public int? noOfItems
        {
            get;
            set;
        }

        public double? total
        {
            get;
            set;
        }

        public double? netTotal
        {
            get;
            set;
        }

        public int? lastEditBy
        {
            get;
            set;
        }

        public string lastEditName { get; set; }
        public DateTime? lastEditDate
        {
            get;
            set;
        }

        public int? deletedBy
        {
            get;
            set;
        }

        public string deletedByUserName
        {
            get;
            set;
        }
    }

}

