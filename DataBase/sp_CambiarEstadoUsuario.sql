use GestionUsuarios;
go

CREATE OR ALTER PROCEDURE dbo.sp_CambiarEstadoUsuario
    -- Parámetros de entrada
    @IdUsuario INT,
    @NuevoEstado BIT,                 -- 1 = Activo, 0 = Inactivo

    -- Parámetros de salida obligatorios
    @Error INT OUTPUT,                -- 0 = Éxito, 1 = Error
    @Mensaje VARCHAR(250) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @Error = 0;
    SET @Mensaje = '';

    -- 1. Validar existencia del usuario
    IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WITH (NOLOCK) WHERE IdUsuario = @IdUsuario)
    BEGIN
        SET @Error = 1;
        SET @Mensaje = 'El usuario especificado no existe.';
        RETURN;
    END

    -- 2. Transacción para la actualización de estado
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE dbo.Usuarios
        SET Estado = @NuevoEstado
        WHERE IdUsuario = @IdUsuario;

        SET @Error = 0;
        SET @Mensaje = CASE 
            WHEN @NuevoEstado = 1 THEN 'Usuario activado con éxito.'
            ELSE 'Usuario desactivado con éxito.'
        END;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END

        SET @Error = 1;
        SET @Mensaje = ERROR_MESSAGE();
    END CATCH
END;
GO