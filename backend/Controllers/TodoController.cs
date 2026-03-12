using Microsoft.AspNetCore.Mvc;
using WA1.Entities;
using WA1.Business.Abstract;
using WA1.Entities.dto;
using WA1.Controllers;
using System.Threading.Tasks;

namespace WA1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ITaskService _taskservice;

        public TodoController(ITaskService taskService)
        {
            _taskservice = taskService;
        }

        // 1. Sadece belirli bir kullanıcının görevlerini getirir
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAll(int userId) 
        {
            // Business katmanındaki GetAll'u userId parametresi alacak şekilde güncelleyeceğiz
            var result = await _taskservice.GetAll(userId);
            return Ok(result);
        }

        // 2. Yeni görev eklerken hangi kullanıcıya ekleneceğini belirtiyoruz
        [HttpPost("{userId}")] 
        public async Task<IActionResult> Create([FromBody] CreateTaskDto task,int userId)
        {
            // DTO'nun içinde artık UserId olduğu için doğrudan servise gönderiyoruz
            await _taskservice.Create(task,userId);
            return Ok("Görev Oluşturuldu!");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _taskservice.Get(id);
            if (result == null) return NotFound("Görev Bulunamadı!");
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
        {
            await _taskservice.Update(id, dto);
            return Ok("Görev Güncellendi!");
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> MarkAsDone (int id)
        {
            var task = await _taskservice.Get(id);
            if (task == null) return NotFound("Görev Bulunamadı!");
            
            await _taskservice.MarkAsDone(id);
            return Ok("Yapıldı olarak işaretlendi!");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete (int id)
        {
            try
            {
                await _taskservice.Delete(id);
                return Ok("Görev Silindi.");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // 3. Sadece belirli kullanıcının tamamlananlarını sil
        [HttpDelete("ClearCompleted/{userId}")] 
        public async Task<IActionResult> ClearCompleted(int userId)
        {
            await _taskservice.ClearCompleted(userId);
            return Ok("Tamamlanan Görevler Silindi.");
        }

        // 4. Sadece belirli kullanıcının tüm görevlerini sil
        [HttpDelete("ClearAll/{userId}")]
        public async Task <IActionResult> ClearAll(int userId)
        {
            await _taskservice.ClearAll(userId);
            return Ok("Tüm Görevler Silindi.");
        }
    }
}