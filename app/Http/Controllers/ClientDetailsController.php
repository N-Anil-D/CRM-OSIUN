<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Customers;
use Inertia\Inertia;

class ClientDetailsController extends Controller
{
    //
    public function index($id)
    {
        try {
            //code...
            $clientDetail = Customers::findOrFail($id);
            return Inertia::render('Clients', ['clientDetail' => $clientDetail]);
        } catch (Exception $e) {
            Log::error($e);
            // Display a user-friendly error message
            return Inertia::render('Error/InternalServerError');
        }
    }
}
