using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class Socket
    {
        public Socket()
        {
            Logs = new HashSet<Log>();
        }

        public int SocketId { get; set; }
        public int? SocketMeterId { get; set; }
        public int? SocketUserId { get; set; }
        public string? SocketForm { get; set; }
        public int? SocketVoltage { get; set; }
        public int SocketLocationId { get; set; }
        public DateTime? SocketCheckOutTime { get; set; }
        public DateTime? SocketCheckInTime { get; set; }
        public int? SocketDuration { get; set; }
        public string? SocketComment { get; set; }

        public virtual Location? SocketLocation { get; set; }
        public virtual Meter? SocketMeter { get; set; }
        public virtual User? SocketUser { get; set; }
        public virtual ICollection<Log> Logs { get; set; }
    }
}
