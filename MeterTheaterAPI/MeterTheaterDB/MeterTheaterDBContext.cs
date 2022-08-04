using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MeterTheater.MeterTheaterDB
{
    public partial class MeterTheaterDBContext : DbContext
    {
        public MeterTheaterDBContext()
        {
        }

        public MeterTheaterDBContext(DbContextOptions<MeterTheaterDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Lab> Labs { get; set; } = null!;
        public virtual DbSet<Location> Locations { get; set; } = null!;
        public virtual DbSet<Log> Logs { get; set; } = null!;
        public virtual DbSet<Meter> Meters { get; set; } = null!;
        public virtual DbSet<Socket> Sockets { get; set; } = null!;
        public virtual DbSet<Table> Tables { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
                var connectionString = configuration.GetConnectionString("MeterTheaterDB");
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Lab>(entity =>
            {
                entity.ToTable("Lab");

                entity.Property(e => e.LabId).HasColumnName("labID");

                entity.Property(e => e.LabName)
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("labName");
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.ToTable("Location");

                entity.Property(e => e.LocationId).HasColumnName("locationID");

                entity.Property(e => e.LocationCol).HasColumnName("locationCol");

                entity.Property(e => e.LocationRow).HasColumnName("locationRow");

                entity.Property(e => e.LocationTableId).HasColumnName("locationTableID");

                entity.HasOne(d => d.LocationTable)
                    .WithMany(p => p.Locations)
                    .HasForeignKey(d => d.LocationTableId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("location_table");
            });

            modelBuilder.Entity<Log>(entity =>
            {
                entity.ToTable("Log");

                entity.Property(e => e.LogId).HasColumnName("logID");

                entity.Property(e => e.LogDescription)
                    .HasMaxLength(1024)
                    .IsUnicode(false)
                    .HasColumnName("logDescription");

                entity.Property(e => e.LogMeterId).HasColumnName("logMeterID");

                entity.Property(e => e.LogSocketId).HasColumnName("logSocketID");

                entity.Property(e => e.LogTime)
                    .HasColumnType("datetime")
                    .HasColumnName("logTime");

                entity.Property(e => e.LogUserId).HasColumnName("logUserID");

                entity.HasOne(d => d.LogMeter)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.LogMeterId)
                    .HasConstraintName("log_meter");

                entity.HasOne(d => d.LogSocket)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.LogSocketId)
                    .HasConstraintName("log_socket");

                entity.HasOne(d => d.LogUser)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.LogUserId)
                    .HasConstraintName("log_user");
            });

            modelBuilder.Entity<Meter>(entity =>
            {
                entity.ToTable("Meter");

                entity.HasIndex(e => e.MeterLanId, "idx_meterLanID_notnull")
                    .IsUnique()
                    .HasFilter("([meterLanID] IS NOT NULL)");

                entity.HasIndex(e => e.MeterSerialNumber, "idx_meterSerialNumber_notnull")
                    .IsUnique()
                    .HasFilter("([meterSerialNumber] IS NOT NULL)");

                entity.Property(e => e.MeterId).HasColumnName("meterID");

                entity.Property(e => e.MeterLanId)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("meterLanID");

                entity.Property(e => e.MeterSerialNumber).HasColumnName("meterSerialNumber");

                entity.Property(e => e.MeterUserId).HasColumnName("meterUserID");

                entity.HasOne(d => d.MeterUser)
                    .WithMany(p => p.Meters)
                    .HasForeignKey(d => d.MeterUserId)
                    .HasConstraintName("meter_user");
            });

            modelBuilder.Entity<Socket>(entity =>
            {
                entity.ToTable("Socket");

                entity.Property(e => e.SocketId).HasColumnName("socketID");

                entity.Property(e => e.SocketCheckInTime)
                    .HasColumnType("datetime")
                    .HasColumnName("socketCheckInTime");

                entity.Property(e => e.SocketCheckOutTime)
                    .HasColumnType("datetime")
                    .HasColumnName("socketCheckOutTime");

                entity.Property(e => e.SocketComment)
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("socketComment");

                entity.Property(e => e.SocketDuration).HasColumnName("socketDuration");

                entity.Property(e => e.SocketForm)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("socketForm");

                entity.Property(e => e.SocketLocationId).HasColumnName("socketLocationID");

                entity.Property(e => e.SocketMeterId).HasColumnName("socketMeterID");

                entity.Property(e => e.SocketUserId).HasColumnName("socketUserID");

                entity.Property(e => e.SocketVoltage).HasColumnName("socketVoltage");

                entity.HasOne(d => d.SocketLocation)
                    .WithMany(p => p.Sockets)
                    .HasForeignKey(d => d.SocketLocationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("socket_location");

                entity.HasOne(d => d.SocketMeter)
                    .WithMany(p => p.Sockets)
                    .HasForeignKey(d => d.SocketMeterId)
                    .HasConstraintName("socket_meter");

                entity.HasOne(d => d.SocketUser)
                    .WithMany(p => p.Sockets)
                    .HasForeignKey(d => d.SocketUserId)
                    .HasConstraintName("socket_user");
            });

            modelBuilder.Entity<Table>(entity =>
            {
                entity.ToTable("Table");

                entity.Property(e => e.TableId).HasColumnName("tableID");

                entity.Property(e => e.TableLabId).HasColumnName("tableLabID");

                entity.Property(e => e.TableName)
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("tableName");

                entity.HasOne(d => d.TableLab)
                    .WithMany(p => p.Tables)
                    .HasForeignKey(d => d.TableLabId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("table_lab");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasIndex(e => e.UserName, "unique_userName")
                    .IsUnique();

                entity.Property(e => e.UserId).HasColumnName("userID");

                entity.Property(e => e.UserEmail)
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("userEmail");

                entity.Property(e => e.UserFullName)
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("userFullName");

                entity.Property(e => e.UserIsAdmin).HasColumnName("userIsAdmin");

                entity.Property(e => e.UserName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("userName");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
