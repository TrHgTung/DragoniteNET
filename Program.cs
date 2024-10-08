//using AspNetCoreRateLimit;
using DragoniteNET.Config;
using DragoniteNET.DataContext;
using DragoniteNET.Interface;
using DragoniteNET.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                                .AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowCredentials();
                      });
});


builder.Services.AddControllers();

builder.Services.AddDbContext<DtaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Dragonite API", Version = "1.3" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
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

builder.Services.AddRateLimiter(c =>
{
    c.AddPolicy("LimitedRequests", context =>
        RateLimitPartition.GetFixedWindowLimiter(context.Request.Headers["Authorization"],
        x =>
        {
            return new()
            {
                PermitLimit = 3, // number of requests
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            };
        })
    );
    c.AddPolicy("LimitedVipRequests", context =>
        RateLimitPartition.GetFixedWindowLimiter(context.Request.Headers["Authorization"],
        x =>
        {
            return new()
            {
                PermitLimit = 12, // number of requests (VIP accounts)
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            };
        })
    );
    c.OnRejected = OnRejected;
});

static ValueTask OnRejected(OnRejectedContext context, CancellationToken token)
{
    //throw new NotImplementedException();
    context.HttpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;

    return ValueTask.CompletedTask;
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseIpRateLimiting(); 
//app.UseClientRateLimiting();
app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    await next();
});

app.MapControllers();

app.Run();
