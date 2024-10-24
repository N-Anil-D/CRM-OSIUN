<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Buildings;
use App\Models\Customers;
use App\Models\members_rooms;
use App\Models\rooms;
use App\Models\User;
use Couchbase\Role;
use Illuminate\Http\Request;
use App\Models\members;
use App\Models\Tickets;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

use Inertia\Inertia;
use Throwable;

class MemberController extends Controller
{
    //
    public function index($member_id)
    {
        try {
            $member = members::where('member_id', $member_id)->first();
            $memberRooms = DB::table('members_rooms')->join('rooms', 'members_rooms.room_id', '=', 'rooms.id')->select('members_rooms.*', 'rooms.*')->where('members_rooms.member_id', $member_id)->get();
            $location = Buildings::where('id', $member->location_id)->first();
            $allLocation = Buildings::where('passive', 0)->get();
            $client = Customers::where('CustomerID', $member->CustomerID)->first();
            $rooms = Rooms::where('building_id', $member->location_id)->get();
            $tickets = Tickets::where('customer', $member->CustomerID)
                ->where('building', $member->location_id)
                ->orWhere(function($query) use ($memberRooms) {
                    foreach ($memberRooms as $room) {
                        $query->where('room', $room->id);
                    }
                })
                ->orderByDesc('id')->get();
            $otherusers = User::where('id', '!=', Auth::user()->id)->get(['id', 'name']);
            return Inertia::render('MemberDetail', ['member' => $member, 'location' => $location, 'allLocation' => $allLocation, 'client' => $client, 'rooms' => $rooms, 'memberRoom' => $memberRooms, 'tickets' => $tickets, 'otherusers' => $otherusers]);
        } catch (Throwable $th) {
            Log::error($th);
            throw $th;
        }
    }
    public function selectRoom(Request $request){
        $response = members_rooms::create($request->all());
        return response()->json($response);
    }
    public function update(Request $request)
    {
        $member = members::findorfail($request->input('id'));
        $resp = $member->update($request->all());
        return response()->json($resp);
    }
    public function store(Request $request)
    {
        $response = members::create($request->all());
        return response()->json($response);
    }
}
