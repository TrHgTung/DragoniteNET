using System.ComponentModel.DataAnnotations;

namespace DragoniteNET.Models
{
    public class Suggestions
    {
        [Key]
        public int Id { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }
}
