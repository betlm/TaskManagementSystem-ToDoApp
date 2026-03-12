using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WA1.Business.Abstract;
using WA1.Business.Concrete;
using WA1.DataAccess;
    
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(); // controller sınıfımın çalışması için isteklerin karşılanması için
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // tarayıcıya /swagger yazıldığında bu görsel testin gelmesi için API dökümantasyonu 

builder.Services.AddDbContext<TodoContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000","http://localhost:5173") // React'in çalýþtýðý adres
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .SetIsOriginAllowed(origin => true)
                  .AllowCredentials();
            
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowReactApp");
app.UseAuthorization();

app.MapControllers();

app.Run();


/*
 Dosya projedeki katmanları bir araya getiriyor- tanıtma gibi

 */