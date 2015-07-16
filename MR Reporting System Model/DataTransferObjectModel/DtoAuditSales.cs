using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MR_Reporting_System_Model.DataTransferObjectModel
{
   public class DtoAuditSales
    {
        public string supervisorName { get; set; }

        public string monthName { get; set; }

        public string equipment { get; set; }
        public double total { get; set; }

        public double? target { get; set; }
        public string equipmentCode { get; set; }
        public string agentName { get; set; }
    }
}
