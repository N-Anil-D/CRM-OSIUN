<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Gelen isteğin WebSocket handshake isteği olduğunu kontrol edelim
        if ($request->is('ws-handshake')) {
            // Burada gelen isteğin orijinini kontrol edebiliriz
            $allowedOrigins = [
                'localhost', // İzin verilen orijinler listesi
                'https://localhost',
                'https://crm.osius.nl',
            ];

            Log::info('Handling WebSocket handshake request');
            $origin = $request->header('Origin');

            // Gelen isteğin orijini izin verilenler listesinde mi kontrol edelim
            if (in_array($origin, $allowedOrigins)) {
                // İzin verilen bir orijinden gelen istek, devam edebiliriz
                return $next($request);
            } else {
                // İzin verilmeyen bir orijinden gelen istek, hata döndürelim
                return response()->json(['error' => 'Origin not allowed'], 403);
            }
        }

        // Diğer HTTP isteklerinde bu middleware'i geçmek gerekmez
        return $next($request);
    }
}
