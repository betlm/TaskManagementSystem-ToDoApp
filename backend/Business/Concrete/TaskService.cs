using System;
using System.Collections.Generic;
using WA1.Business.Abstract;
using Microsoft.EntityFrameworkCore;
using WA1.DataAccess;
using WA1.Entities;
using System.Data.Common;
using WA1.Entities.dto;
using System.Linq; // 'Where' ve filtreleme işlemleri için şart
using System.Threading.Tasks; // 'Task' ve 'async' işlemleri için şart

namespace WA1.Business.Concrete
{
    public class TaskService : ITaskService
    {
        private readonly TodoContext _context; 

        public TaskService(TodoContext context)
        { _context = context; } 
        public async Task Create(CreateTaskDto dto, int userId)
        {
            var newTask = new Entities.TodoTask()
            {
                Title = dto.Title,
                Description = dto.Description,
                IsDone = false,
                CreatedDate = DateTime.Now,
                Deadline = dto.Deadline,
                UserId = userId
            };

            await _context.Tasks.AddAsync(newTask); 
            await _context.SaveChangesAsync(); 
        }
        
        public async Task Delete(int id)
        {
            var deletedTask = await _context.Tasks.FindAsync(id); 
            if (deletedTask != null)
            {
                _context.Tasks.Remove(deletedTask);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Görev Mevcut Değil.");
            }
        }

        public async Task<TodoTask> Get(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
           if (task != null)
            {
                return task;
            }
            return null;

        }

        public async Task<List<TodoTask>> GetAll(int userId)
        {
            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }


        public async Task Update (int id, UpdateTaskDto dto)
        {
            var updatedTask = await _context.Tasks.FindAsync(id);
            if (updatedTask != null)
            {
                updatedTask.Title = dto.Title;
                updatedTask.Description = dto.Description;
                updatedTask.Deadline = dto.Deadline;
                await  _context.SaveChangesAsync();
            }
        }


        public async Task ClearAll(int userId)
        {
            var tasks = _context.Tasks.Where(t => t.UserId == userId);
            _context.Tasks.RemoveRange(tasks);
            await _context.SaveChangesAsync();
            
        }

        public async Task ClearCompleted(int userId)
        {
            var tasks = _context.Tasks.Where(t => t.UserId == userId && t.IsDone);
            _context.Tasks.RemoveRange(tasks);
            await _context.SaveChangesAsync();
        }


        public async Task MarkAsDone(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                task.IsDone = true;
                await _context.SaveChangesAsync();
            }
        }
    }

}
