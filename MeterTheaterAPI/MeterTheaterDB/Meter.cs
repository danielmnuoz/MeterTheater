using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class Meter
    {
        public Meter()
        {
            Logs = new HashSet<Log>();
            Sockets = new HashSet<Socket>();
        }

        public int MeterId { get; set; }
        public int? MeterUserId { get; set; }
        public string? MeterLanId { get; set; }
        public int? MeterSerialNumber { get; set; }

        public virtual User? MeterUser { get; set; }
        public virtual ICollection<Log> Logs { get; set; }
        public virtual ICollection<Socket> Sockets { get; set; }
    }
}
