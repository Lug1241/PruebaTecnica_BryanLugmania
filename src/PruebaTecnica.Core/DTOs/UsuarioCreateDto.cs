using System.ComponentModel.DataAnnotations;

namespace PruebaTecnica.Core.DTOs;

public class UsuarioCreateDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio")]
    [MaxLength(100)]
    public string Apellido { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo es obligatorio")]
    [EmailAddress(ErrorMessage = "El formato de correo no es válido")]
    [MaxLength(150)]
    public string Correo { get; set; } = string.Empty;

    [Required(ErrorMessage = "La clave es obligatoria")]
    [MinLength(6, ErrorMessage = "La clave debe tener al menos 6 caracteres")]
    public string Clave { get; set; } = string.Empty;

    [Required(ErrorMessage = "El rol es obligatorio")]
    [MaxLength(50)]
    public string Rol { get; set; } = string.Empty;

    public bool Estado { get; set; } = true;
}