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
    
    public partial class Group
    {
        public Group()
        {
            this.Agents = new HashSet<Agent>();
            this.GroupPermissions = new HashSet<GroupPermission>();
        }
    
        public int Id { get; set; }
        public string GroupName { get; set; }
    
        public virtual ICollection<Agent> Agents { get; set; }
        public virtual ICollection<GroupPermission> GroupPermissions { get; set; }
    }
}
