using PruebaTecnica.Core.DTOs;

namespace PruebaTecnica.Core.Interfaces;

public interface IUsuarioRepository
{
    Task<(int Error, string Mensaje, int IdGenerado)> CrearUsuarioAsync(UsuarioCreateDto dto, string claveHasheada);
    Task<IEnumerable<UsuarioDto>> ListarUsuariosAsync(string? buscar, string? rol, bool? estado);
    Task<UsuarioDto?> ConsultarUsuarioPorIdAsync(int idUsuario);
    Task<(int Error, string Mensaje)> EditarUsuarioAsync(int idUsuario, UsuarioUpdateDto dto);
    Task<(int Error, string Mensaje)> CambiarEstadoUsuarioAsync(int idUsuario, bool nuevoEstado);
    Task<(int Error, string Mensaje)> EliminarUsuarioAsync(int idUsuario);
    Task<(int Error, string Mensaje, int FilasAfectadas)> EliminarUsuariosMasivoAsync(List<int> ids);
}