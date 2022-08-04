using System;
using System.Collections.Generic;

namespace MeterTheater.MeterTheaterDB
{
    public partial class User
    {
        public User()
        {
            Logs = new HashSet<Log>();
            Meters = new HashSet<Meter>();
            Sockets = new HashSet<Socket>();
        }

        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string? UserFullName { get; set; }
        public string? UserEmail { get; set; }
        public bool? UserIsAdmin { get; set; }

        public virtual ICollection<Log> Logs { get; set; }
        public virtual ICollection<Meter> Meters { get; set; }
        public virtual ICollection<Socket> Sockets { get; set; }
    }
}
