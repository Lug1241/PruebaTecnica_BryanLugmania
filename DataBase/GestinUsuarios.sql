create database GestionUsuarios;
go
use GestionUsuarios;
go

CREATE TABLE dbo.Usuarios (
    IdUsuario INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Correo VARCHAR(150) NOT NULL,
    Clave VARCHAR(255) NOT NULL,
    Rol VARCHAR(50) NOT NULL,
    Estado BIT NOT NULL CONSTRAINT DF_Usuarios_Estado DEFAULT 1,
    FechaCreacion DATETIME NOT NULL CONSTRAINT DF_Usuarios_FechaCreacion DEFAULT GETDATE(),

    -- Restricciones
    CONSTRAINT PK_Usuarios_IdUsuario PRIMARY KEY CLUSTERED (IdUsuario),
    CONSTRAINT UQ_Usuarios_Correo UNIQUE (Correo)
);
GO
