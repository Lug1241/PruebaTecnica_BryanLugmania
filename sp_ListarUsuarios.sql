use GestionUsuarios;
go 

CREATE OR ALTER PROCEDURE dbo.sp_ListarUsuarios
    @buscar VARCHAR(150) = NULL,
    @rol VARCHAR(50) = NULL,
    @estado BIT = NULL
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
    WHERE 
        -- Filtro opcional por búsqueda de texto (Nombre o Correo)
        (@buscar IS NULL OR LTRIM(RTRIM(@buscar)) = '' 
            OR Nombre LIKE '%' + @buscar + '%' 
            OR Correo LIKE '%' + @buscar + '%')
        
        -- Filtro opcional por Rol
        AND (@rol IS NULL OR LTRIM(RTRIM(@rol)) = '' OR Rol = @rol)
        
        -- Filtro opcional por Estado (1 / 0)
        AND (@estado IS NULL OR Estado = @estado)
    ORDER BY FechaCreacion DESC;
END;
GO