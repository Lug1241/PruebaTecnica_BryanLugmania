====================================================================
GUÍA DE INSTALACIÓN, DESPLIEGUE Y EJECUCIÓN DEL PROYECTO
====================================================================

ORDEN OBLIGATORIO DE EJECUCIÓN:
1. Base de Datos (SQL Server)
2. Backend (.NET 10 Web API)
3. Frontend (Next.js 16)

--------------------------------------------------------------------
PASO 1: CONFIGURAR LA BASE DE DATOS (SQL SERVER)
--------------------------------------------------------------------
1. Abre SQL Server Management Studio (SSMS) o Azure Data Studio y 
   conéctate a tu servidor local de SQL Server.

2. Abre y ejecuta primero el script principal de estructura:
   - Archivo: DataBase/GestinUsuarios.sql
   (Este script crea la base de datos 'GestionUsuarios', la tabla 'Usuarios'
   y el tipo de tabla 'UsuarioIdList' necesario para la eliminación masiva).

3. Ejecuta en tu base de datos 'GestionUsuarios' los 7 scripts de 
   procedimientos almacenados ubicados en la carpeta DataBase/:
   - DataBase/sp_CrearUsuario.sql
   - DataBase/sp_ConsultarUsuarioPorId.sql
   - DataBase/sp_ListarUsuarios.sql
   - DataBase/sp_EditarUsuario.sql
   - DataBase/sp_CambiarEstadoUsuario.sql
   - DataBase/sp_EliminarUsuario.sql
   - DataBase/sp_EliminarUsuarioMasivo.sql

--------------------------------------------------------------------
PASO 2: CONFIGURAR Y EJECUTAR EL BACKEND (.NET 10 WEB API)
--------------------------------------------------------------------
1. Abre una terminal de comandos (PowerShell o CMD) y entra a la 
   carpeta del proyecto API:
   cd Backend/src/PruebaTecnica.API

2. Abre el archivo 'appsettings.json' y confirma que la cadena de conexión 
   apunte a tu SQL Server:
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1435;Database=GestionUsuarios;User Id=sa;Password=pass123;TrustServerCertificate=True;"
     }
   }
   (Ajusta el servidor, puerto o credenciales si difieren en tu equipo).

3. Restaura los paquetes NuGet y compila el proyecto:
   dotnet restore
   dotnet build

4. Inicia el servidor Web API:
   dotnet run

5. Comprueba que esté en funcionamiento abriendo Swagger en tu navegador:
   https://localhost:7256/swagger

--------------------------------------------------------------------
PASO 3: CONFIGURAR Y EJECUTAR EL FRONTEND (NEXT.JS)
--------------------------------------------------------------------
1. Abre una segunda terminal de comandos y sitúate en la carpeta del cliente:
   cd client

2. Asegúrate de tener el archivo '.env.local' en la raíz de 'client/' con 
   la URL de la API:
   NEXT_PUBLIC_API_URL=https://localhost:7256/api

3. Instala las dependencias del proyecto:
   npm install

4. Inicia el servidor de desarrollo:
   npm run dev

5. Abre el navegador e ingresa a la aplicación:
   http://localhost:3000
