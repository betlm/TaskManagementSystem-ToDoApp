namespace WA1.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    
    
    public byte[] PasswordHash { get; set; } = null!;
    public byte[] PasswordSalt { get; set; }  = null!;

    public List<TodoTask> Tasks { get; set; } = new();

}