<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ClientNotes;
use App\Models\ClientNotesComments;
use Illuminate\Http\Request;

class ClientNotesController extends Controller
{
    //
    public function index($clientID){
        $data = ClientNotes::where ('clientID', $clientID)->orderBy('created_at', 'desc')->get();
        return response()->json($data);
    }
    public function store(Request $data)
    {
        return ClientNotes::create($data->all());
    }
    public function commentstore(Request $data){
        return ClientNotesComments::create($data->all());
    }
    public function update(Request $request, $id)
    {
        $note = ClientNotes::findOrFail($id);
        $note->update($request->all());
        return $note;
    }
}
