use GestionUsuarios;
go

CREATE OR ALTER PROCEDURE dbo.sp_CrearUsuario
    -- Parámetros de entrada
    @Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Correo VARCHAR(150),
    @Clave VARCHAR(255),
    @Rol VARCHAR(50),
    @Estado BIT = 1, -- Opcional, por defecto 1 si no se envía

    -- Parámetros de salida obligatorios
    @Error INT OUTPUT,                -- 0 = Éxito, 1 = Error
    @Mensaje VARCHAR(250) OUTPUT,
    @IdGenerado INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Inicialización de parámetros de salida
    SET @Error = 0;
    SET @Mensaje = '';
    SET @IdGenerado = 0;

    -- 2. Validación de correo duplicado antes de iniciar transacción
    IF EXISTS (SELECT 1 FROM dbo.Usuarios WITH (NOLOCK) WHERE Correo = @Correo)
    BEGIN
        SET @Error = 1;
        SET @Mensaje = 'El correo electrónico ya se encuentra registrado.';
        RETURN;
    END

    -- 3. Manejo transaccional
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.Usuarios (Nombre, Apellido, Correo, Clave, Rol, Estado)
        VALUES (@Nombre, @Apellido, @Correo, @Clave, @Rol, @Estado);

        -- Capturar el identificador recién generado
        SET @IdGenerado = SCOPE_IDENTITY();
        SET @Error = 0;
        SET @Mensaje = 'Usuario creado con éxito.';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Si existe una transacción abierta, hacer rollback
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END

        SET @Error = 1;
        SET @Mensaje = ERROR_MESSAGE();
        SET @IdGenerado = 0;
    END CATCH
END;
GO