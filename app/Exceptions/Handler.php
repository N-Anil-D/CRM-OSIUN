<?php

namespace App\Exceptions;

use Exception;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends Exception
{
    public function render($request, Throwable $exception)
    {
        // Eğer bu bir Inertia isteği ise (frontend tarafından yapılan istek)
        if ($request->header('X-Inertia')) {
            if ($exception instanceof HttpException && $exception->getStatusCode() == 403) {
                // 403 Hatası için Inertia yönlendirmesi
                return Inertia::render('Errors/403', [
                    'message' => 'U hebt geen toegang tot deze pagina.',
                ])->toResponse($request)->setStatusCode(403);
            }

            // Diğer hatalar
            if ($exception instanceof HttpException && $exception->getStatusCode() == 404) {
                return Inertia::render('Errors/404', [
                    'message' => 'Sayfa bulunamadı.',
                ])->toResponse($request)->setStatusCode(404);
            }
        }

        return parent::render($request, $exception);
    }
}
