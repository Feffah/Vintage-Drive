using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Security.Claims;
using Vintage_Drive.Data;
using Vintage_Drive.Models.Entities;
using Vintage_Drive.Models.Exceptions;
using Vintage_Drive.Services;
var builder = WebApplication.CreateBuilder(args);


Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.File("log.txt")
    .CreateLogger();

Log.Information("Starting Application");
Log.Information("Registering Services");

builder.Services.AddSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentity<Users, IdentityRole>(
    options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 8;
        options.SignIn.RequireConfirmedAccount = false;

    }).AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();


builder.Services.AddAuthorization();

try
{
    string connection = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new ConfigurationException("String di connessione non trovata");

}
catch (ConfigurationException ex)
{
    Log.Fatal(ex.ToString());
    await Log.CloseAndFlushAsync();
    Environment.Exit(1);
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;


}).AddJwtBearer(
    options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            RoleClaimType = ClaimTypes.Role,
            ValidateIssuer = true, //validazione del server che emette il token
            ValidateAudience = true,//validazione del destinatario del token
            ValidateLifetime = true, //validazione della scadenza del token
            ValidateIssuerSigningKey = true, //validazione della firma del token
            ValidIssuer = "https://",
            ValidAudience = "https://",
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes("11b57b25e1c4a98e5a1b51e9bc3a480c9d03bcb8a3b98662fd00183f684d37a1")
                ),

        };

    });

builder.Services.AddScoped<CarsService>();
builder.Services.AddScoped<CategoriesService>();
builder.Services.AddScoped<OrdersService>();
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddScoped<ShipmentsService>();
builder.Services.AddScoped<UsersService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Inserisci: Bearer {il tuo token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

await Log.CloseAndFlushAsync();