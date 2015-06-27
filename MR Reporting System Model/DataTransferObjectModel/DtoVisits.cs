using System;

namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoVisits
    {
        public int Id
        {
            get;
            set;
        }

        public int? AgentId
        {
            get;
            set;
        }

        public string AgentName
        {
            get;
            set;
        }
        public string status
        {
            get;
            set;
        }

        public int? DrugsId
        {
            get;
            set;
        }

        public string DrugsName
        {
            get;
            set;
        }

        public int? TypeId
        {
            get;
            set;
        }

        public string TypeName
        {
            get;
            set;
        }

        public int? VisitTo
        {
            get;
            set;
        }

        public string VisitToName
        {
            get;
            set;
        }

        public DateTime? VisitDate
        {
            get;
            set;
        }

        public TimeSpan? Duration
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }

        public bool? IsMorning
        {
            get;
            set;
        }

        public string Notes
        {
            get;
            set;
        }

        public int? LastEditBy
        {
            get;
            set;
        }

        public DateTime? LastEditDate
        {
            get;
            set;
        }

        public DateTime? CreationDate
        {
            get;
            set;
        }
    }

}

