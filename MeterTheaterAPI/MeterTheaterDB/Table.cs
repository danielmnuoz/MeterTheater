using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class Table
    {
        public Table()
        {
            Locations = new HashSet<Location>();
        }

        public int TableId { get; set; }
        public string? TableName { get; set; }
        public int TableLabId { get; set; }

        public virtual Lab TableLab { get; set; } = null!;
        public virtual ICollection<Location> Locations { get; set; }
    }
}
