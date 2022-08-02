using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeterTheater.MeterTheaterDB;
using Microsoft.AspNetCore.Authorization;

namespace MeterTheater.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SocketsController : ControllerBase
    {
        private readonly MeterTheaterDBContext _context;

        public SocketsController(MeterTheaterDBContext context)
        {
            _context = context;
        }

        // GET: api/Sockets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Socket>>> GetSockets(int? socketUserID, bool? taken)
        {
            if (_context.Sockets == null)
            {
                return NotFound();
            }
            if(taken == true)
            {
                return await _context.Sockets.Where(e => e.SocketUserId != null).ToListAsync();
            }
            if (socketUserID == null)
            {
                return await _context.Sockets.ToListAsync();
            }
            else
            {
                return await _context.Sockets.Where(e => e.SocketUserId == socketUserID).ToListAsync();
            }
        }

        // GET: api/Sockets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Socket>> GetSocket(int id)
        {
            if (_context.Sockets == null)
            {
                return NotFound();
            }
            var socket = await _context.Sockets.FindAsync(id);

            if (socket == null)
            {
                return NotFound();
            }

            return socket;
        }

        // PUT: api/Sockets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSocket(int id, Socket socket, string? time)
        {
            if (id != socket.SocketId)
            {
                return BadRequest();
            }
            if (time != null)
            {
                if (time == "out")
                {
                    socket.SocketCheckOutTime = DateTime.Now;
                }
                else if (time == "in")
                {
                    socket.SocketCheckInTime = DateTime.Now;
                }
            }
            _context.Entry(socket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SocketExists(id))
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

        // POST: api/Sockets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Socket>> PostSocket(Socket socket)
        {
            if (_context.Sockets == null)
            {
                return Problem("Entity set 'MeterTheaterDBContext.Sockets'  is null.");
            }
            _context.Sockets.Add(socket);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSocket", new { id = socket.SocketId }, socket);
        }

        // DELETE: api/Sockets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSocket(int id)
        {
            if (_context.Sockets == null)
            {
                return NotFound();
            }
            var socket = await _context.Sockets.FindAsync(id);
            if (socket == null)
            {
                return NotFound();
            }

            _context.Sockets.Remove(socket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SocketExists(int id)
        {
            return (_context.Sockets?.Any(e => e.SocketId == id)).GetValueOrDefault();
        }
    }
}
