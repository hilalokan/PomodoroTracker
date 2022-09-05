using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PomodoroTracker.Data;
using PomodoroTracker.Models;

namespace PomodoroTracker.Controllers
{
    public class TaskTargetsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TaskTargetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: TaskTargets
        public async Task<IActionResult> Index()
        {
              return _context.TaskTarget != null ? 
                          View(await _context.TaskTarget.ToListAsync()) :
                          Problem("Entity set 'ApplicationDbContext.TaskTarget'  is null.");
        }

        // GET: TaskTargets/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: TaskTargets/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TaskTargetId,TaskTargetName")] TaskTarget taskTarget)
        {
            if (ModelState.IsValid)
            {
                _context.Add(taskTarget);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(taskTarget);
        }


        // GET: TaskTargets/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.TaskTarget == null)
            {
                return NotFound();
            }

            var taskTarget = await _context.TaskTarget
                .FirstOrDefaultAsync(m => m.TaskTargetId == id);
            if (taskTarget == null)
            {
                return NotFound();
            }

            return View(taskTarget);
        }

        // POST: TaskTargets/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.TaskTarget == null)
            {
                return Problem("Entity set 'ApplicationDbContext.TaskTarget'  is null.");
            }
            var taskTarget = await _context.TaskTarget.FindAsync(id);
            if (taskTarget != null)
            {
                _context.TaskTarget.Remove(taskTarget);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TaskTargetExists(int id)
        {
          return (_context.TaskTarget?.Any(e => e.TaskTargetId == id)).GetValueOrDefault();
        }
    }
}
