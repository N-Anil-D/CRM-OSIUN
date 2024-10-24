<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Buildings;
use Illuminate\Http\Request;
use App\Models\rooms;
use Illuminate\Support\Facades\Log;

class RoomsController extends Controller
{
    public function fullroomindex()
    {
        $data = rooms::all();
        return response()->json($data);
    }
    public function roomindex($building)
    {
        $data = rooms::where('building_id', $building)->get();
        return response()->json($data);
    }
    public function store(Request $request)
    {
        $data = $request->all();
        $data['Binnenzijde'] = str_replace(',', '.', $data['Binnenzijde']);
        $data['Buitenzijde'] = str_replace(',', '.', $data['Buitenzijde']);
        $data['Seperstie_glas'] = str_replace(',', '.', $data['Seperstie_glas']);
        $response = rooms::create($data);
        return response()->json($response);
    }
    public function update(Request $request, $id)
    {
        $user = rooms::findOrFail($id);
        $user->update($request->all());
        return $user;
    }
}
