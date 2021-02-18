namespace PikeSafetyWebApp.Models
{
    public class FormField
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Placeholder { get; set; }
        public string Options { get; set; }
        public bool Required { get; set; }
    }
}