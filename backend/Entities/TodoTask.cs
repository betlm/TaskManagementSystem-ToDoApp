namespace WA1.Entities
{
    public class TodoTask
    {
        public int Id { get; set; } //
        public string? Title { get; set; } 
        public string ? Description { get; set; }
        public bool IsDone { get; set; } = false;  //

        public DateTime CreatedDate { get; set; } = DateTime.Now; 
        public DateTime Deadline { get; set; } 
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
       public string remainingtime
        {
            get 
            {
                var difference = Deadline - DateTime.Now;
                if (difference.TotalSeconds <= 0)
                {
                    return "Süre doldu";
                }
                return $"{difference.Days} gün, {difference.Hours} saat, {difference.Minutes} dakika";
            }
        } 
    }
}


