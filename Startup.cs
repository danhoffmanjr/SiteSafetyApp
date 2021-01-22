using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MediatR;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Application.Companies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation.AspNetCore;
using PikeSafetyWebApp.Application.Middleware;
using NETCore.MailKit.Extensions;
using NETCore.MailKit.Infrastructure.Internal;
using System;
using Microsoft.IdentityModel.Logging;
using PikeSafetyWebApp.Application.Utils;
using AutoMapper;
using PikeSafetyWebApp.Application.Sites;

namespace PikeSafetyWebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<PikeSafetyDbContext>(options =>
            {
                options.UseMySQL(Configuration.GetConnectionString("PikeSafetyDB"));
            });

            var builder = services.AddIdentityCore<AppUser>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
            });
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddRoles<AppRole>();
            identityBuilder.AddEntityFrameworkStores<PikeSafetyDbContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();
            identityBuilder.AddDefaultTokenProviders();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:TokenKey"])); // TokenKey stored in appsettings.json for development. Will need to be stored on server in Production.
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithExposedHeaders("WWW-Authenticate")
                        .WithOrigins("https://localhost:5001")
                        .AllowCredentials();
                });
            });
            services.AddMediatR(typeof(Login.Handler).Assembly);
            services.AddAutoMapper(typeof(Login.Handler));

            var mailKitOptions = Configuration.GetSection("SmtpSettings").Get<MailKitOptions>();
            services.AddMailKit(config =>
            {
                var options = new MailKitOptions();
                config.UseMailKit(mailKitOptions);
            });

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(config =>
            {
                config.RegisterValidatorsFromAssemblyContaining<Login>();
            });

            services.AddScoped<ITokenGenerator, TokenGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IRoleAccessor, RoleAccessor>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<ISiteService, SiteService>();
            services.AddScoped<IModelConverters, ModelConverters>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            IdentityModelEventSource.ShowPII = true;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
                // app.UseDatabaseErrorPage();
            }
            else
            {
                //app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
