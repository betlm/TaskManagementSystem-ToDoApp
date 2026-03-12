using WA1.Entities;
using WA1.Entities.dto;
using System.Threading.Tasks; // Bunu eklemezsen 'Task' havada kalır

namespace WA1.Business.Abstract

{
    public interface ITaskService
    {
        Task<TodoTask> Get(int taskId);

        Task Create(CreateTaskDto createtaskdto, int userId);

        Task Delete(int id);

        Task<List<TodoTask>> GetAll(int userId);

        Task Update(int id, UpdateTaskDto updatetaskdto);

        Task ClearAll(int userId);

        Task ClearCompleted(int userId);

        Task MarkAsDone(int id);
        
    }
}

