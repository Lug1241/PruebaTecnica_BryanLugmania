use GestionUsuarios;
go

CREATE OR ALTER PROCEDURE dbo.sp_EditarUsuario
    -- Parámetros de entrada
    @IdUsuario INT,
    @Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Correo VARCHAR(150),
    @Rol VARCHAR(50),

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

    -- 2. Validar que el nuevo correo no pertenezca a otro usuario
    IF EXISTS (
        SELECT 1 
        FROM dbo.Usuarios WITH (NOLOCK) 
        WHERE Correo = @Correo AND IdUsuario <> @IdUsuario
    )
    BEGIN
        SET @Error = 1;
        SET @Mensaje = 'El correo electrónico ya está registrado por otro usuario.';
        RETURN;
    END

    -- 3. Transacción para la actualización
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE dbo.Usuarios
        SET 
            Nombre = @Nombre,
            Apellido = @Apellido,
            Correo = @Correo,
            Rol = @Rol
        WHERE IdUsuario = @IdUsuario;

        SET @Error = 0;
        SET @Mensaje = 'Usuario actualizado con éxito.';

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