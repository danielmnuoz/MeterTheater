using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeterTheater.MeterTheaterDB;
using Microsoft.AspNetCore.Authorization;

namespace MeterTheater.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LogsController : ControllerBase
    {
        private readonly MeterTheaterDBContext _context;

        public LogsController(MeterTheaterDBContext context)
        {
            _context = context;
        }

        // GET: api/Logs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Log>>> GetLogs(int? logUserID, int? logSocketID, int? logMeterID)
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            if (logUserID == null && logSocketID == null && logMeterID == null)
            {
                return await _context.Logs.ToListAsync();
            }
            else if (logUserID != null && logSocketID == null && logMeterID == null)
            {
                return await _context.Logs.Where(e => e.LogUserId == logUserID).ToListAsync();
            }
            else if (logUserID == null && logSocketID != null && logMeterID == null)
            {
                return await _context.Logs.Where(e => e.LogSocketId == logSocketID).ToListAsync();
            }
            else if (logUserID == null && logSocketID == null && logMeterID != null)
            {
                return await _context.Logs.Where(e => e.LogMeterId == logMeterID).ToListAsync();
            }
            else if (logUserID == null && logSocketID != null && logMeterID != null)
            {
                return await _context.Logs.Where(e => e.LogSocketId == logSocketID && e.LogMeterId == logMeterID).ToListAsync();
            }
            else if (logUserID != null && logSocketID != null && logMeterID == null)
            {
                return await _context.Logs.Where(e => e.LogUserId == logUserID && e.LogSocketId == logSocketID).ToListAsync();
            }
            else if (logUserID != null && logSocketID == null && logMeterID != null)
            {
                return await _context.Logs.Where(e => e.LogUserId == logUserID && e.LogMeterId == logMeterID).ToListAsync();
            }
            else
            {
                return await _context.Logs.Where(e => e.LogUserId == logUserID && e.LogSocketId == logSocketID && e.LogMeterId == logMeterID).ToListAsync();
            }

        }

        // GET: api/Logs/last
        [HttpGet("last")]
        public async Task<ActionResult<Log>> GetLastLog(int? logUserID, int? logSocketID, int? logMeterID)
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            if (logUserID == null && logSocketID == null && logMeterID == null)
            {
                var log = await _context.Logs.OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else if (logUserID != null && logSocketID == null && logMeterID == null)
            {
                var log = await _context.Logs.Where(e => e.LogUserId == logUserID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else if (logUserID == null && logSocketID != null && logMeterID == null)
            {
                var log = await _context.Logs.Where(e => e.LogSocketId == logSocketID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else if (logUserID == null && logSocketID == null && logMeterID != null)
            {
                var log = await _context.Logs.Where(e => e.LogMeterId == logMeterID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else if (logUserID == null && logSocketID != null && logMeterID != null)
            {
                var log = await _context.Logs.Where(e => e.LogSocketId == logSocketID && e.LogMeterId == logMeterID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else if (logUserID != null && logSocketID != null && logMeterID == null)
            {
                var log = await _context.Logs.Where(e => e.LogUserId == logUserID && e.LogSocketId == logSocketID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else if (logUserID != null && logSocketID == null && logMeterID != null)
            {
                var log = await _context.Logs.Where(e => e.LogUserId == logUserID && e.LogMeterId == logMeterID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
            else
            {
                var log = await _context.Logs.Where(e => e.LogUserId == logUserID && e.LogSocketId == logSocketID && e.LogMeterId == logMeterID).OrderByDescending(e => e.LogId).FirstOrDefaultAsync();
                if (log == null)
                {
                    return NotFound();
                }
                return log;
            }
        }

        // GET: api/Logs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Log>> GetLog(int id)
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            var log = await _context.Logs.FindAsync(id);

            if (log == null)
            {
                return NotFound();
            }

            return log;
        }

        // PUT: api/Logs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLog(int id, Log log)
        {
            if (id != log.LogId)
            {
                return BadRequest();
            }

            _context.Entry(log).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Logs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Log>> PostLog(Log log)
        {
            if (_context.Logs == null)
            {
                return Problem("Entity set 'MeterTheaterDBContext.Logs'  is null.");
            }
            log.LogTime = DateTime.Now;
            _context.Logs.Add(log);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLog", new { id = log.LogId }, log);
        }

        // DELETE: api/Logs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog(int id)
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            var log = await _context.Logs.FindAsync(id);
            if (log == null)
            {
                return NotFound();
            }

            _context.Logs.Remove(log);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LogExists(int id)
        {
            return (_context.Logs?.Any(e => e.LogId == id)).GetValueOrDefault();
        }
    }
}
