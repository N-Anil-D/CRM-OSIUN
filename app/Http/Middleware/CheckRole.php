<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Roles;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\user_page_auth;

class CheckRole
{
    public function handle(Request $request, Closure $next)
    {
        // Kullanıcının erişmeye çalıştığı route
        $currentRouteName = $request->route()->getName(); // Rota adını alıyoruz (örn: 'dashboard')

        // Kullanıcının bu sayfaya erişim yetkisi olup olmadığını kontrol et
        if (!$this->checkUserPageAccess($request->user(), $currentRouteName)) {
            abort(403, 'U hebt geen toegang tot deze pagina.');
        }

        return $next($request);
    }

    // Kullanıcının sayfaya yetkisini kontrol eden fonksiyon
    private function checkUserPageAccess($user, $path)
    {
        if($user->bann == 1) return false;
        // Burada kullanıcıya ait yetkileri kontrol ediliyor.
        $allowedPages = user_page_auth::where('userid', $user->id)->get('path')->toArray(); // Örneğin, user modelinde yetkiler bir dizi olarak tutuluyor
        foreach ($allowedPages as $allowedPage) {
            if($allowedPage['path'] == $path && $allowedPage['read'] == 1) {
                return false;
            }
        }
        return true;
    }
}
