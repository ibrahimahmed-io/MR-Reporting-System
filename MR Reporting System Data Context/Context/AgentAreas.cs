//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MR_Reporting_System_Data_Context.Context
{
    using System;
    using System.Collections.Generic;
    
    public partial class AgentAreas
    {
        public int Id { get; set; }
        public Nullable<int> AgentId { get; set; }
        public Nullable<int> AreaId { get; set; }
    
        public virtual Areas Areas { get; set; }
        public virtual Agents Agents { get; set; }
    }
}