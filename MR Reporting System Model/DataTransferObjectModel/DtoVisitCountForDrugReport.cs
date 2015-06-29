using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MR_Reporting_System_Model.DataTransferObjectModel
{
    public class DtoVisitCountForDrugReport
    {
        public int Doctors { get; set; }
        public int Hospitals { get; set; }
        public int Pharmacies { get; set; }
    }
}
