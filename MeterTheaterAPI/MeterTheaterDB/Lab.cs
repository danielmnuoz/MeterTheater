using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class Lab
    {
        public Lab()
        {
            Tables = new HashSet<Table>();
        }

        public int LabId { get; set; }
        public string? LabName { get; set; }

        public virtual ICollection<Table> Tables { get; set; }
    }
}
