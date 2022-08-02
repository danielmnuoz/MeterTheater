using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeterTheater.MeterTheaterDB;
using Microsoft.AspNetCore.Authorization;

namespace MeterTheater.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LabsController : ControllerBase
    {
        private readonly MeterTheaterDBContext _context;

        public LabsController(MeterTheaterDBContext context)
        {
            _context = context;
        }

        // GET: api/Labs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lab>>> GetLabs(bool? extend)
        {
            if (_context.Labs == null)
            {
                return NotFound();
            }
            if (extend == null || extend == false)
            {
                return await _context.Labs.ToListAsync();
            }
            else
            {
                return await _context.Labs.Include(e => e.Tables).ThenInclude(e => e.Locations).ThenInclude(e => e.Sockets).ToListAsync();
            }

        }

        // GET: api/Labs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lab>> GetLab(int id)
        {
            if (_context.Labs == null)
            {
                return NotFound();
            }
            var lab = await _context.Labs.FindAsync(id);

            if (lab == null)
            {
                return NotFound();
            }

            return lab;
        }

        // PUT: api/Labs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLab(int id, Lab lab)
        {
            if (id != lab.LabId)
            {
                return BadRequest();
            }

            _context.Entry(lab).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LabExists(id))
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

        // POST: api/Labs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Lab>> PostLab(Lab lab)
        {
            if (_context.Labs == null)
            {
                return Problem("Entity set 'MeterTheaterDBContext.Labs'  is null.");
            }
            _context.Labs.Add(lab);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLab", new { id = lab.LabId }, lab);
        }

        // DELETE: api/Labs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLab(int id)
        {
            if (_context.Labs == null)
            {
                return NotFound();
            }
            var lab = await _context.Labs.FindAsync(id);
            if (lab == null)
            {
                return NotFound();
            }

            _context.Labs.Remove(lab);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LabExists(int id)
        {
            return (_context.Labs?.Any(e => e.LabId == id)).GetValueOrDefault();
        }
    }
}
