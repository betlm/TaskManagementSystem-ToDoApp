using System;
using System.Collections.Generic;   
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace WA1.Entities.dto
{
    public class UpdateTaskDto
    {
        public string Title { get; set; } = string.Empty;   
        public string Description { get; set; } = string.Empty;
        
        public DateTime Deadline { get; set; }

    }
}
