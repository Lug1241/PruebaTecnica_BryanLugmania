use GestionUsuarios;
go

CREATE OR ALTER PROCEDURE dbo.sp_EliminarUsuario
    @IdUsuario INT,
    @Error INT OUTPUT,                -- 0 = Éxito, 1 = Error
    @Mensaje VARCHAR(250) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @Error = 0;
    SET @Mensaje = '';

    -- 1. Validar que el usuario exista
    IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WITH (NOLOCK) WHERE IdUsuario = @IdUsuario)
    BEGIN
        SET @Error = 1;
        SET @Mensaje = 'El usuario no existe.';
        RETURN;
    END

    -- 2. Transacción de eliminación
    BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM dbo.Usuarios
        WHERE IdUsuario = @IdUsuario;

        SET @Error = 0;
        SET @Mensaje = 'Usuario eliminado con éxito.';

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