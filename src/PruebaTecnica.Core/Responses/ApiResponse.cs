namespace PruebaTecnica.Core.Responses;

public class ApiResponse<T>
{
    public bool Error { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> SuccessResponse(T? data, string message = "Operación realizada con éxito")
    {
        return new ApiResponse<T>
        {
            Error = false,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> ErrorResponse(string message, T? data = default)
    {
        return new ApiResponse<T>
        {
            Error = true,
            Message = message,
            Data = data
        };
    }
}