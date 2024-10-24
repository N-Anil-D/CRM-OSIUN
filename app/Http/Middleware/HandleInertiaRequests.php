<?php

namespace App\Http\Middleware;

use App\Models\Customers;
use App\Models\Buildings;
use App\Models\user_page_auth;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn() => $request->user()
                    ? $this->getUserWithPermissions($request->user()->id)
                    : $request->user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }

    private function getUserWithPermissions(int $userId)
    {
        $user = User::where('id',$userId)->firstOrFail();

        // Kullanıcının rollerini ve yetkilerini al
        $permissions = user_page_auth::where('userid', $user->id)->whereNull('parent_id')->with('children')->get();

        $buildingsQuery = Buildings::query();
        if ($user->connectedBuild !== 'ALL') {
            // Kullanıcı yetkili olduğu bina verilerine erişmek istiyor
            $buildingsQuery->join('user_auth_buildings', 'buildings.id', '=', 'user_auth_buildings.buildid')
                ->where('user_auth_buildings.userid', $user->id);
        }
        $buildings = $buildingsQuery->select('buildings.*')->get();
        $customerQuery = Customers::query();
        if ($user->connectedCustomer !== 'ALL') {
            $customerQuery->join('user_auth_customer', 'customers.id', '=', 'user_auth_customer.customerid')
                ->where('user_auth_customer.userid', $user->id);
        }
        $customers = $customerQuery->select('customers.*')->get();
        // Kullanıcıyı yönlendir


        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'roleName' => $user->roleName,
            'connectedBuild' => $user->connectedBuild,
            'connectedCustomer' => $user->connectedCustomer,
            'bann' => $user->bann,
            'profile_image_path' => $user->profile_image_path,
            'permissions' => $permissions,
            'customers' => $customers,
            'buildings' => $buildings,
        ];
    }
}
