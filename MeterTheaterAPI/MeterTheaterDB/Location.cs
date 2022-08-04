using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class Location
    {
        public Location()
        {
            Sockets = new HashSet<Socket>();
        }

        public int LocationId { get; set; }
        public int LocationRow { get; set; }
        public int LocationCol { get; set; }
        public int LocationTableId { get; set; }

        public virtual Table LocationTable { get; set; } = null!;
        public virtual ICollection<Socket> Sockets { get; set; }
    }
}
