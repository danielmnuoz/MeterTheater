using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeterTheater.MeterTheaterDB;
using Microsoft.AspNetCore.Authorization;

namespace MeterTheater.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MetersController : ControllerBase
    {
        private readonly MeterTheaterDBContext _context;

        public MetersController(MeterTheaterDBContext context)
        {
            _context = context;
        }

        // GET: api/Meters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Meter>>> GetMeters(int? meterUserID, string? meterLanID)
        {
            if (_context.Meters == null)
            {
                return NotFound();
            }
            if (meterUserID == null && meterLanID == null)
            {
                return await _context.Meters.ToListAsync();
            }
            else if(meterUserID != null && meterLanID == null)
            {
                return await _context.Meters.Where(e => e.MeterUserId == meterUserID).ToListAsync();
            }
            else if(meterUserID == null && meterLanID != null)
            {
                return await _context.Meters.Where(e => e.MeterLanId == meterLanID).ToListAsync();
            }
            else
            {
                return await _context.Meters.Where(e => e.MeterLanId == meterLanID).Where(e => e.MeterUserId == meterUserID).ToListAsync();
            }

        }

        // GET: api/Meters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Meter>> GetMeter(int id)
        {
            if (_context.Meters == null)
            {
                return NotFound();
            }
            var meter = await _context.Meters.FindAsync(id);

            if (meter == null)
            {
                return NotFound();
            }

            return meter;
        }

        // PUT: api/Meters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMeter(int id, Meter meter)
        {
            if (id != meter.MeterId)
            {
                return BadRequest();
            }

            _context.Entry(meter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeterExists(id))
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

        // POST: api/Meters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Meter>> PostMeter(Meter meter)
        {
            if (_context.Meters == null)
            {
                return Problem("Entity set 'MeterTheaterDBContext.Meters'  is null.");
            }
            _context.Meters.Add(meter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMeter", new { id = meter.MeterId }, meter);
        }

        // DELETE: api/Meters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeter(int id)
        {
            if (_context.Meters == null)
            {
                return NotFound();
            }
            var meter = await _context.Meters.FindAsync(id);
            if (meter == null)
            {
                return NotFound();
            }

            _context.Meters.Remove(meter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MeterExists(int id)
        {
            return (_context.Meters?.Any(e => e.MeterId == id)).GetValueOrDefault();
        }
    }
}
