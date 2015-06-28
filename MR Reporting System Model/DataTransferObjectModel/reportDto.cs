using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MR_Reporting_System_Model.DataTransferObjectModel
{
  public  class reportDto
  {
      public int? agentId { get; set; }
      public int? areaId { get; set; }
        public DateTime? startDate { get; set; }
        public DateTime? finishDate { get; set; }
    }
}
