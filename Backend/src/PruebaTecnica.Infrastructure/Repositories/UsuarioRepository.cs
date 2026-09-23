using System.Data;
using Dapper;
using PruebaTecnica.Core.DTOs;
using PruebaTecnica.Core.Interfaces;
using PruebaTecnica.Infrastructure.Data;

namespace PruebaTecnica.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public UsuarioRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<(int Error, string Mensaje, int IdGenerado)> CrearUsuarioAsync(UsuarioCreateDto dto, string claveHasheada)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();

        parameters.Add("@Nombre", dto.Nombre, DbType.String, ParameterDirection.Input, 100);
        parameters.Add("@Apellido", dto.Apellido, DbType.String, ParameterDirection.Input, 100);
        parameters.Add("@Correo", dto.Correo, DbType.String, ParameterDirection.Input, 150);
        parameters.Add("@Clave", claveHasheada, DbType.String, ParameterDirection.Input, 255);
        parameters.Add("@Rol", dto.Rol, DbType.String, ParameterDirection.Input, 50);
        parameters.Add("@Estado", dto.Estado, DbType.Boolean, ParameterDirection.Input);

        // Parámetros OUTPUT
        parameters.Add("@Error", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@Mensaje", dbType: DbType.String, size: 250, direction: ParameterDirection.Output);
        parameters.Add("@IdGenerado", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "dbo.sp_CrearUsuario",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return (
            parameters.Get<int>("@Error"),
            parameters.Get<string>("@Mensaje"),
            parameters.Get<int>("@IdGenerado")
        );
    }

    public async Task<IEnumerable<UsuarioDto>> ListarUsuariosAsync(string? buscar, string? rol, bool? estado)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();

        parameters.Add("@buscar", string.IsNullOrWhiteSpace(buscar) ? null : buscar, DbType.String);
        parameters.Add("@rol", string.IsNullOrWhiteSpace(rol) ? null : rol, DbType.String);
        parameters.Add("@estado", estado, DbType.Boolean);

        return await connection.QueryAsync<UsuarioDto>(
            "dbo.sp_ListarUsuarios",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<UsuarioDto?> ConsultarUsuarioPorIdAsync(int idUsuario)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("@IdUsuario", idUsuario, DbType.Int32);

        return await connection.QueryFirstOrDefaultAsync<UsuarioDto>(
            "dbo.sp_ConsultarUsuarioPorId",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<(int Error, string Mensaje)> EditarUsuarioAsync(int idUsuario, UsuarioUpdateDto dto)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();

        parameters.Add("@IdUsuario", idUsuario, DbType.Int32, ParameterDirection.Input);
        parameters.Add("@Nombre", dto.Nombre, DbType.String, ParameterDirection.Input, 100);
        parameters.Add("@Apellido", dto.Apellido, DbType.String, ParameterDirection.Input, 100);
        parameters.Add("@Correo", dto.Correo, DbType.String, ParameterDirection.Input, 150);
        parameters.Add("@Rol", dto.Rol, DbType.String, ParameterDirection.Input, 50);

        // Parámetros OUTPUT
        parameters.Add("@Error", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@Mensaje", dbType: DbType.String, size: 250, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "dbo.sp_EditarUsuario",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return (
            parameters.Get<int>("@Error"),
            parameters.Get<string>("@Mensaje")
        );
    }

    public async Task<(int Error, string Mensaje)> CambiarEstadoUsuarioAsync(int idUsuario, bool nuevoEstado)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();

        parameters.Add("@IdUsuario", idUsuario, DbType.Int32, ParameterDirection.Input);
        parameters.Add("@NuevoEstado", nuevoEstado, DbType.Boolean, ParameterDirection.Input);

        // Parámetros OUTPUT
        parameters.Add("@Error", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@Mensaje", dbType: DbType.String, size: 250, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "dbo.sp_CambiarEstadoUsuario",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return (
            parameters.Get<int>("@Error"),
            parameters.Get<string>("@Mensaje")
        );
    }

    public async Task<(int Error, string Mensaje)> EliminarUsuarioAsync(int idUsuario)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();

        parameters.Add("@IdUsuario", idUsuario, DbType.Int32, ParameterDirection.Input);

        // Parámetros OUTPUT
        parameters.Add("@Error", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@Mensaje", dbType: DbType.String, size: 250, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "dbo.sp_EliminarUsuario",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return (
            parameters.Get<int>("@Error"),
            parameters.Get<string>("@Mensaje")
        );
    }

    public async Task<(int Error, string Mensaje, int FilasAfectadas)> EliminarUsuariosMasivoAsync(List<int> ids)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();

        // Convertir la lista a cadena delimitada por comas para STRING_SPLIT
        string idsDelimitados = string.Join(",", ids);

        parameters.Add("@IdsUsuarios", idsDelimitados, DbType.String, ParameterDirection.Input);

        // Parámetros OUTPUT
        parameters.Add("@Error", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@Mensaje", dbType: DbType.String, size: 250, direction: ParameterDirection.Output);
        parameters.Add("@FilasAfectadas", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "dbo.sp_EliminarUsuariosMasivo",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return (
            parameters.Get<int>("@Error"),
            parameters.Get<string>("@Mensaje"),
            parameters.Get<int>("@FilasAfectadas")
        );
    }
}