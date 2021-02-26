using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Data
{
    public class Seed
    {
        public static async Task SeedData(PikeSafetyDbContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (!context.Companies.Any())
            {
                var companies = new List<Company>
                {
                    new Company
                    {
                        Name = "Ashton Woods Atlanta",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Company
                    {
                        Name = "Pike Consulting",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Company
                    {
                        Name = "Chafin Home Builders",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Company
                    {
                        Name = "Fake Testing Company",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = false
                    }
                };

                await context.Companies.AddRangeAsync(companies);
                await context.SaveChangesAsync();
            }

            var PikeConsultingId = await context.Companies.Where(x => x.Name == "Pike Consulting").Select(x => x.Id).FirstOrDefaultAsync();
            var AshtonWoodsAtlantaId = await context.Companies.Where(x => x.Name == "Ashton Woods Atlanta").Select(x => x.Id).FirstOrDefaultAsync();
            var ChafinHomeBuildersId = await context.Companies.Where(x => x.Name == "Chafin Home Builders").Select(x => x.Id).FirstOrDefaultAsync();
            var FakeTestingCompanyId = await context.Companies.Where(x => x.Name == "Fake Testing Company").Select(x => x.Id).FirstOrDefaultAsync();

            if (!context.Sites.Any())
            {
                var sites = new List<Site>
                {
                    new Site
                    {
                        CompanyId = PikeConsultingId,
                        Name = "Pike Community",
                        Address = "101 Devant St. Fayetteville, GA 30214",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = PikeConsultingId,
                        Name = "Century Communities Projects",
                        Address = null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = PikeConsultingId,
                        Name = "Lennar Homes",
                        Address = null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = PikeConsultingId,
                        Name = "Ashton Woods",
                        Address = null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = PikeConsultingId,
                        Name = "Piedmont Residential",
                        Address = null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = PikeConsultingId,
                        Name = "test tkxel",
                        Address = "31 B-III, Gulberg III, Ali Zeb Road",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = AshtonWoodsAtlantaId,
                        Name = "Adair Manor",
                        Address = "7325 Kemper Rd, Johns Creek, GA 30097",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = AshtonWoodsAtlantaId,
                        Name = "Aria North",
                        Address = "740 Abernathy Rd NE, Sandy Springs, GA 30328",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = AshtonWoodsAtlantaId,
                        Name = "Aria West",
                        Address = "6560 Glenridge Dr Sandy Springs, GA 30328",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = AshtonWoodsAtlantaId,
                        Name = "Aria South",
                        Address = "Canopy Drive Sandy Springs, GA 30328",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Brighton Park",
                        Address = "1242 Maddox Rd, Houschton, GA 30548",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Hills at Hamilton Mill",
                        Address = "3140 Hog Mountain Rd NE Dacula, GA 30019",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Jacob's Creek",
                        Address = "3826 Claude Brewer Rd, Loganville, GA 30052, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Jameson Glen",
                        Address = "Twin Lakes Rd, GA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Auburn Station",
                        Address = "1800 Highway 29 (Atlanta Highway Northwest)",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Mallard Landing",
                        Address = "310 Drake Drive, Jefferson, GA, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Mulberry Park",
                        Address = "7090 Silk Tree Pointe Braselton, Georgia 30517",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Mundy Mill",
                        Address = "Millside Parkway, Gainesville, GA 30504, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Paden Ridge",
                        Address = "537 Paden Dr, Lawrenceville, GA 30044, United States",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Settles Bridge",
                        Address = "513 Nichols Drive, Suwanee, GA, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Stonehaven",
                        Address = "2756 Dolostone Way, Dacula, GA 30019, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Stonewater Creek",
                        Address = "2027 Stone Water Court Houschton, Georgia 30548",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Suwanee Overlook",
                        Address = "9456 Settles Rd, Suwanee, GA 30024, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Turnbridge",
                        Address = "Mc Gee Rd SW, Snellville, GA 30078, USA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Villages at Ivy Creek",
                        Address = "2979 Gravel Springs Rd, Buford, GA",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Parkside at Mulberry",
                        Address = null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = ChafinHomeBuildersId,
                        Name = "Creekside at Hamilton Mill",
                        Address = null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = true,
                    },
                    new Site
                    {
                        CompanyId = FakeTestingCompanyId,
                        Name = "Fake Testing Site",
                        Address = "123 Fake Drive Testy, AL 12345",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = DateTime.UtcNow,
                        UpdatedBy = "Seed Data",
                        IsActive = false
                    }
                };

                await context.Sites.AddRangeAsync(sites);
                await context.SaveChangesAsync();
            }

            var StonewaterCreekSiteId = await context.Sites.Where(x => x.Name == "Stonewater Creek").Select(x => x.Id).FirstOrDefaultAsync(); //site for ChafinHomeBuildersId
            var JamesonGlenSiteId = await context.Sites.Where(x => x.Name == "Jameson Glen").Select(x => x.Id).FirstOrDefaultAsync();  //site for ChafinHomeBuildersId
            var AshtonWoodsSiteId = await context.Sites.Where(x => x.Name == "Ashton Woods").Select(x => x.Id).FirstOrDefaultAsync(); //site for PikeConsultingId
            var AriaSouthSiteId = await context.Sites.Where(x => x.Name == "Aria South").Select(x => x.Id).FirstOrDefaultAsync(); //site for AshtonWoodsAtlantaId

            if (!roleManager.Roles.Any())
            {
                var roles = new List<AppRole>
                {
                    new AppRole
                    {
                        Name = RoleNames.Admin,
                        Description = "This role has access to all application features and can access all data without exceptions.",
                        PrivilegeLevel = 100
                    },
                    new AppRole
                    {
                        Name = RoleNames.AreaManager,
                        Description = "This role has access to all application features and can access all data pertaining to their company.",
                        PrivilegeLevel = 50
                    },
                    new AppRole
                    {
                        Name = RoleNames.ConstructionSupervisor,
                        Description = "This role has access to all application features and can access all data pertaining to their company.",
                        PrivilegeLevel = 50
                    },
                    new AppRole
                    {
                        Name = RoleNames.Executive,
                        Description = "This role has access to all application features and can access all data pertaining to their company.",
                        PrivilegeLevel = 50,

                    },
                    new AppRole
                    {
                        Name = RoleNames.Inspector,
                        Description = "This role has limited access to application features and can only access data pertaining to theirself.",
                        PrivilegeLevel = 10
                    }
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }

            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        UserName = "cdmorg9430@gmail.com",
                        FirstName = "Daniel",
                        LastName = "Morgan",
                        Email = "cdmorg9430@gmail.com",
                        CompanyId = ChafinHomeBuildersId,
                        IsActive = true,
                        EmailConfirmed = true
                    },
                    new AppUser
                    {
                        UserName = "dghoffman@gmail.com",
                        FirstName = "Dan",
                        LastName = "Hoffman",
                        Email = "dghoffman@gmail.com",
                        CompanyId = ChafinHomeBuildersId,
                        IsActive = true,
                        EmailConfirmed = true
                    },
                    new AppUser
                    {
                        UserName = "dhasselhoff@protonmail.com",
                        FirstName = "David",
                        LastName = "Hasselhoff",
                        Email = "dhasselhoff@protonmail.com",
                        CompanyId = PikeConsultingId,
                        IsActive = true,
                        EmailConfirmed = true
                    },
                    new AppUser
                    {
                        UserName = "smiller@gmail.com",
                        FirstName = "Sally",
                        LastName = "Miller",
                        Email = "smiller@gmail.com",
                        CompanyId = PikeConsultingId,
                        IsActive = false,
                        EmailConfirmed = true
                    },
                    new AppUser
                    {
                        UserName = "inspector@testmail.com",
                        FirstName = "Inspector",
                        LastName = "McTesterface",
                        Email = "inspector@testmail.com",
                        CompanyId = AshtonWoodsAtlantaId,
                        IsActive = true,
                        EmailConfirmed = true
                    }
                };

                var registerDateClaim = new Claim("RegisterationDate", DateTime.UtcNow.ToShortDateString());

                foreach (var user in users)
                {
                    var result = await userManager.CreateAsync(user, "Pa$$w0rd");

                    if (result.Succeeded)
                    {
                        var newUser = await userManager.FindByEmailAsync(user.Email);
                        var userSite = new UserSite { AppUserId = newUser.Id, SiteId = context.Sites.FirstOrDefault(x => x.CompanyId == newUser.CompanyId).Id };

                        if (user.FirstName == "Inspector")
                        {
                            await userManager.AddToRoleAsync(newUser, RoleNames.Inspector);
                            await userManager.AddClaimAsync(newUser, registerDateClaim);
                            await context.UserSites.AddAsync(userSite);
                            await context.SaveChangesAsync();
                            continue;
                        }

                        if (user.LastName == "Hasselhoff")
                        {
                            await userManager.AddToRoleAsync(newUser, RoleNames.AreaManager);
                            await userManager.AddClaimAsync(newUser, registerDateClaim);
                            await context.UserSites.AddAsync(userSite);
                            await context.SaveChangesAsync();
                            continue;
                        }

                        await userManager.AddToRoleAsync(newUser, RoleNames.Admin);
                        await userManager.AddClaimAsync(newUser, registerDateClaim);
                        await context.UserSites.AddAsync(userSite);
                        await context.SaveChangesAsync();
                    }
                }
            }

            var DghoffmanUser = await userManager.FindByEmailAsync("dghoffman@gmail.com");
            var CdmorganUser = await userManager.FindByEmailAsync("cdmorg9430@gmail.com");

            if (!context.ReportTypes.Any())
            {
                var reportTypes = new List<ReportType>
                {
                    new ReportType
                    {
                        Id = 1,
                        Title = "New User",
                        Fields = JsonSerializer.Serialize(new List<ReportTypeField>
                            {
                                new ReportTypeField
                                {
                                    Type = "Dropdown",
                                    Name = "Title",
                                    Placeholder = "Select Title",
                                    Options = "Mr, Mrs, Ms, Miss",
                                    Required = false
                                },
                                new ReportTypeField
                                {
                                    Type = "Text",
                                    Name = "First Name",
                                    Placeholder = "Input first name",
                                    Options = "",
                                    Required = true,
                                },
                                new ReportTypeField
                                {
                                    Type = "Text",
                                    Name = "Last Name",
                                    Placeholder = "Input last name",
                                    Options = "",
                                    Required = true,
                                },
                                new ReportTypeField
                                {
                                    Type = "Radio",
                                    Name = "Gender",
                                    Placeholder = "",
                                    Options = "Male, Female, Both",
                                    Required = true,
                                },
                                new ReportTypeField
                                {
                                    Type = "Textarea",
                                    Name = "Comments",
                                    Placeholder = "Add comments...",
                                    Options = "",
                                    Required = false,
                                },
                                new ReportTypeField
                                {
                                    Type = "Checkbox",
                                    Name = "Acknowledgment",
                                    Placeholder = "I agree to the Terms of Service",
                                    Options = "",
                                    Required = true,
                                },
                            }
                        ),
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = null,
                        UpdatedBy = null,
                        IsActive = true
                    }
                };

                await context.ReportTypes.AddRangeAsync(reportTypes);
                await context.SaveChangesAsync();
            }

            if (!context.Reports.Any())
            {
                var reports = new List<Report>
                {
                    new Report
                    {
                        Title = "Added McTesteface",
                        ReportType = "New User",
                        ReportTypeId = 1,
                        ReportFields = JsonSerializer.Serialize(new List<ReportField>
                            {
                                new ReportField
                                {
                                    Type = "Dropdown",
                                    Name = "Title",
                                    Placeholder = "Select Title",
                                    Options = "Mr, Mrs, Ms, Miss",
                                    Required = false,
                                    Value = "Mr"
                                },
                                new ReportField
                                {
                                    Type = "Text",
                                    Name = "First Name",
                                    Placeholder = "Input first name",
                                    Options = "",
                                    Required = true,
                                    Value = "Tester"
                                },
                                new ReportField
                                {
                                    Type = "Text",
                                    Name = "Last Name",
                                    Placeholder = "Input last name",
                                    Options = "",
                                    Required = true,
                                    Value = "McTesterface"
                                },
                                new ReportField
                                {
                                    Type = "Radio",
                                    Name = "Gender",
                                    Placeholder = "",
                                    Options = "Male, Female, Both",
                                    Required = true,
                                    Value = "Male"
                                },
                                new ReportField
                                {
                                    Type = "Textarea",
                                    Name = "Comments",
                                    Placeholder = "Add comments...",
                                    Options = "",
                                    Required = false,
                                    Value = "McTesterfaces Rule!"
                                },
                                new ReportField
                                {
                                    Type = "Checkbox",
                                    Name = "Acknowledgment",
                                    Placeholder = "I agree to the Terms of Service",
                                    Options = "",
                                    Required = true,
                                    Value = "true"
                                },
                            }
                        ),
                        IsComplete = false,
                        CompanyId = ChafinHomeBuildersId,
                        CompanyName = "Chafin Home Builders",
                        SiteId = StonewaterCreekSiteId,
                        SiteName = "Stonewater Creek",
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = "Seed Data",
                        UpdatedOn = null,
                        UpdatedBy = null,
                        IsActive = true
                    }
                };

                await context.Reports.AddRangeAsync(reports);
                await context.SaveChangesAsync();
            }
        }
    }
}