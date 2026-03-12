using System;
using Microsoft.EntityFrameworkCore;
using WA1.Entities;

namespace WA1.DataAccess
{
    public class TodoContext : DbContext //sınıf EFC fonksiyon-metotlarını kullanacak SQL içe iletişime geçmek için gerekli kodları içeiryor
    {
        public TodoContext(DbContextOptions<TodoContext> options) : base(options) { } //Constructor TodoContextin hangi veritabanına bağlanacağını öğretir
        public DbSet<TodoTask> Tasks { get; set; } //SQL deki tablolar için gerekli her satır TodoTaskın kopyası olacak 
        
        public DbSet<User> Users { get; set; }
    }
}

/*
 * Bu dosya kod ile SQL arasında bağlantı sğlamak için var
 * 
 */