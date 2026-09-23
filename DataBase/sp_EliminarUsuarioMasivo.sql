use GestionUsuarios;
go 
CREATE OR ALTER PROCEDURE dbo.sp_EliminarUsuariosMasivo
    @IdsUsuarios VARCHAR(MAX),        -- Lista separada por comas, ej: '1,2,3,4'
    @Error INT OUTPUT,                -- 0 = Éxito, 1 = Error
    @Mensaje VARCHAR(250) OUTPUT,
    @FilasAfectadas INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @Error = 0;
    SET @Mensaje = '';
    SET @FilasAfectadas = 0;

    -- Validar entrada vacía
    IF @IdsUsuarios IS NULL OR LTRIM(RTRIM(@IdsUsuarios)) = ''
    BEGIN
        SET @Error = 1;
        SET @Mensaje = 'La lista de identificadores está vacía.';
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Tabla temporal/variable para almacenar y validar IDs enteros
        DECLARE @IdsTable TABLE (Id INT PRIMARY KEY);

        INSERT INTO @IdsTable (Id)
        SELECT DISTINCT CAST(LTRIM(RTRIM(value)) AS INT)
        FROM STRING_SPLIT(@IdsUsuarios, ',')
        WHERE LTRIM(RTRIM(value)) <> '';

        -- Eliminación masiva basada en la lista
        DELETE U
        FROM dbo.Usuarios U
        INNER JOIN @IdsTable T ON U.IdUsuario = T.Id;

        SET @FilasAfectadas = @@ROWCOUNT;
        SET @Error = 0;
        SET @Mensaje = CONCAT('Se eliminaron correctamente ', @FilasAfectadas, ' usuario(s).');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Si falla la conversión a INT o cualquier restricción/clave foránea
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END

        SET @Error = 1;
        SET @Mensaje = ERROR_MESSAGE();
        SET @FilasAfectadas = 0;
    END CATCH
END;
GO