use GestionUsuarios;
go 

CREATE OR ALTER PROCEDURE dbo.sp_ConsultarUsuarioPorId
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        IdUsuario,
        Nombre,
        Apellido,
        Correo,
        Rol,
        Estado,
        FechaCreacion
    FROM dbo.Usuarios WITH (NOLOCK)
    WHERE IdUsuario = @IdUsuario;
END;
GO

