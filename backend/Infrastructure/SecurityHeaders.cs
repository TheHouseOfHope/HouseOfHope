namespace HouseOfHope.API.Infrastructure;

public static class SecurityHeaders
{
    private const string ContentSecurityPolicy =
        "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'";

    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            context.Response.OnStarting(() =>
            {
                context.Response.Headers["Content-Security-Policy"] = ContentSecurityPolicy;
                return Task.CompletedTask;
            });

            await next();
        });
    }
}
