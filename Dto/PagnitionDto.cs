using System.ComponentModel.DataAnnotations;

namespace DragoniteNET.Dto
{
    public class PagnitionDto
    {
        [Required]
        public int PageIndex { get; set; } // so trang hien taji
        [Required]
        public int ItemNumber { get; set; } // tong so item (thu da gui)
    }
}
