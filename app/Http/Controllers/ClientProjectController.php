<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientProjectController extends Controller
{
    public function getData(Request $request)
    {
        Log::info($request);
        return response()->json('basari', 200);
    }
}
