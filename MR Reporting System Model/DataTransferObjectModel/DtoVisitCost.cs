using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MR_Reporting_System_Model.DataTransferObjectModel
{
    public class DtoVisitCost
    {
        public int? actualVisits { get; set; }
        public int? estimateVisits { get; set; }
        public double actualCost { get; set; }
        public double estimateCost { get; set; }
        public string agentName { get; set; }
    }
}
