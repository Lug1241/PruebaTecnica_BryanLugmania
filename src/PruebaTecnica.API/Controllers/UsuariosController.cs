using Microsoft.AspNetCore.Mvc;
using PruebaTecnica.Core.DTOs;
using PruebaTecnica.Core.Interfaces;
using PruebaTecnica.Core.Responses;

namespace PruebaTecnica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuariosController(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    // POST /api/usuarios
    [HttpPost]
    public async Task<IActionResult> CrearUsuario([FromBody] UsuarioCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Datos del formulario inválidos"));
        }

        try
        {
            // Hasheo seguro de la contraseña antes de enviar al SP
            string hashClave = BCrypt.Net.BCrypt.HashPassword(dto.Clave);

            var (error, mensaje, idGenerado) = await _usuarioRepository.CrearUsuarioAsync(dto, hashClave);

            if (error != 0)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(mensaje));
            }

            var resultado = new { IdUsuario = idGenerado };
            return CreatedAtAction(
                nameof(ConsultarPorId),
                new { id = idGenerado },
                ApiResponse<object>.SuccessResponse(resultado, mensaje)
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }

    // GET /api/usuarios?buscar=&rol=&estado=
    [HttpGet]
    public async Task<IActionResult> ListarUsuarios(
        [FromQuery] string? buscar = null,
        [FromQuery] string? rol = null,
        [FromQuery] bool? estado = null)
    {
        try
        {
            var usuarios = await _usuarioRepository.ListarUsuariosAsync(buscar, rol, estado);
            return Ok(ApiResponse<IEnumerable<UsuarioDto>>.SuccessResponse(usuarios, "Usuarios consultados exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }

    // GET /api/usuarios/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ConsultarPorId(int id)
    {
        try
        {
            var usuario = await _usuarioRepository.ConsultarUsuarioPorIdAsync(id);

            if (usuario == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse($"No se encontró el usuario con ID {id}"));
            }

            return Ok(ApiResponse<UsuarioDto>.SuccessResponse(usuario, "Usuario encontrado"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }

    // PUT /api/usuarios/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditarUsuario(int id, [FromBody] UsuarioUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Datos del formulario inválidos"));
        }

        try
        {
            var (error, mensaje) = await _usuarioRepository.EditarUsuarioAsync(id, dto);

            if (error != 0)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(mensaje));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, mensaje));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }

    // PATCH /api/usuarios/{id}/estado
    [HttpPatch("{id:int}/estado")]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] CambiarEstadoDto dto)
    {
        try
        {
            var (error, mensaje) = await _usuarioRepository.CambiarEstadoUsuarioAsync(id, dto.Estado);

            if (error != 0)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(mensaje));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, mensaje));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }

    // DELETE /api/usuarios/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarIndividual(int id)
    {
        try
        {
            var (error, mensaje) = await _usuarioRepository.EliminarUsuarioAsync(id);

            if (error != 0)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(mensaje));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, mensaje));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }

    // POST /api/usuarios/eliminar-masivo
    [HttpPost("eliminar-masivo")]
    public async Task<IActionResult> EliminarMasivo([FromBody] EliminarMasivoDto dto)
    {
        if (dto.Ids == null || !dto.Ids.Any())
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Debe enviar al menos un ID para eliminar"));
        }

        try
        {
            var (error, mensaje, filasAfectadas) = await _usuarioRepository.EliminarUsuariosMasivoAsync(dto.Ids);

            if (error != 0)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(mensaje));
            }

            var resultado = new { FilasAfectadas = filasAfectadas };
            return Ok(ApiResponse<object>.SuccessResponse(resultado, mensaje));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error interno: {ex.Message}"));
        }
    }
}