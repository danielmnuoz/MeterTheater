using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class Log
    {
        public int LogId { get; set; }
        public int? LogUserId { get; set; }
        public DateTime? LogTime { get; set; }
        public string? LogDescription { get; set; }
        public int? LogMeterId { get; set; }
        public int? LogSocketId { get; set; }

        public virtual Meter? LogMeter { get; set; }
        public virtual Socket? LogSocket { get; set; }
        public virtual User? LogUser { get; set; }
    }
}
