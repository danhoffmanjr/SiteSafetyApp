using System.ComponentModel;

namespace PikeSafetyWebApp.Models
{
    public static class RoleNames
    {
        public const string Admin = "Admin";
        public const string AreaManager = "Area Manager";
        public const string ConstructionSupervisor = "Construction Supervisor";
        public const string Executive = "Executive";
        public const string Inspector = "Inspector";

        public enum RoleNamesEnum
        {
            [Description("Admin")]
            Admin,
            [Description("Area Manager")]
            AreaManager,
            [Description("Construction Supervisor")]
            ConstructionSupervisor,
            [Description("Executive")]
            Executive,
            [Description("Inspector")]
            Inspector
        }
    }
}