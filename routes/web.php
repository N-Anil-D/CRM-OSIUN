<?php

use App\Http\Controllers\API\BuildingsController;
use App\Http\Controllers\API\ClientNotesController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\RoomsController;
use App\Http\Controllers\API\TicketController;
use App\Http\Controllers\API\UserBoradController;
use App\Http\Controllers\ClientProjectController;
use App\Http\Controllers\MedewerkersController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ContactPersonController;
use App\Http\Controllers\PushNotificationController;
use App\Http\Controllers\RoomAsigneControlles;
use App\Http\Controllers\StreamController;
use App\Http\Middleware\CheckRole;
use App\Http\Controllers\MemberController;
use App\Models\Customers;
use App\Models\ticket_reacts;
use App\Models\User;
use App\Models\Tickets;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\PasswordController;
Route::redirect('/', '/dashboard');

Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user->roleName != 'user' && $user->roleName != 'Client') {
        return Inertia::render('DashBoards/Dashboard');
    }else {
        return redirect('/tickets');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/fakedash/{dash}', function ($dash) {
    if (Auth::user()->name == 'Ozan') {
        if ($dash == 'supervisor') {
            return Inertia::render('DashBoards/Supervisor.Dashboard');
        } else if ($dash == 'personnel') {
            return Inertia::render('DashBoards/Personnel.Dashboard');
        } else if ($dash == 'Client') {
            return Inertia::render('DashBoards/CManager.Dashboard');
        } else {
            return Inertia::render('DashBoards/User.Dashboard');
        }
    } else {
        return redirect()->route('/');
    }
})->middleware(['auth', 'verified'])->name('fakedash');




Route::middleware(['auth', 'verified', CheckRole::class])->group(function () {

    Route::get('/tickets', [TicketController::class, 'view'])->name('tickets');
    Route::get('/ticketdetail/{ticketId}',[TicketController::class, 'detailindex'])->name('tickets.detail');
    Route::get('/api/getTicketStatus', [TicketController::class, 'getTicketStatus'])->name('getTicketStatus');
    Route::get('/api/tickets/clientindex/{customer}/{building}', [TicketController::class, 'clientindex'])->name('tickets.clientindex');
    Route::get('/api/tickets/supervisorindex/{customer}', [TicketController::class, 'supervisorindex'])->name('tickets.supervisorindex');
    Route::post('/api/tickets/store', [TicketController::class, 'store'])->name('ticketstore');
    Route::post('/api/tickets/update', [TicketController::class, 'update'])->name('ticketupdate');
    Route::post('/api/ticketsmessagestore', [TicketController::class, 'messagestore'])->name('ticketmessagestore');
    Route::get('/api/ticketsindex', [TicketController::class, 'index'])->name('ticketsindex');
    Route::post('/api/tickets/delete/{ticketId}',[TicketController::class, 'gotrash'])->name('ticketsdelete');
    Route::post('/api/ticketstatusupdate/{newstatus}/{ticketId}',[TicketController::class, 'statusupdate'])->name('tickets.statusupdate');
    Route::get('/ticketmediaDownload/{fileId}',[TicketController::class, 'download'])->name('tickets.mediaDownload');
    Route::post('/api/ticketfilesuploads', [TicketController::class, 'ticketFileUpload'])->name('ticketfiles.store');
    Route::post('/api/ticketDetailDataUpdate/{ticketid}', [TicketController::class, 'detailIndexDataPreps'])->name('ticketDetailDataUpdate');
    Route::post('/api/reactticketstore',[TicketController::class, 'reactTicketStore'])->name('reactticket.store');
    Route::post('/api/reactticketupdate',[TicketController::class, 'reactTicketUpdate'])->name('reactticket.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile', [ProfileController::class, 'updateOther'])->name('profile.update.other');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/locations', [BuildingsController::class, 'buildingindex'])->name('locations');
    Route::get('/api/notifications',[NotificationController::class, 'getNotifications'])->name('notifications.get');
    Route::put('/api/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::get('/clients', [CustomerController::class, 'customerindex'])->name('clients');
    Route::post('/api/customerstore', [CustomerController::class, 'store'])->name('customer.store');
    Route::post('/api/customerupdate', [CustomerController::class, 'update'])->name('customer.update');
    Route::post('/api/buildingupdate', [BuildingsController::class, 'update'])->name('buildings.update');
    Route::get('/api/buildingindex', [BuildingsController::class, 'buildingindex'])->name('buildingindex');
    Route::get('/klantdetail/{customerid}', [CustomerController::class, 'showRealitedCustomer'])->name('klantdetail');
    Route::get('/klantdetail/{customerid}/locatie/{locationid}', [BuildingsController::class, 'klantBuildingindex'])->name('klant.location.index');

    Route::get('/userboard',[UserBoradController::class, 'managmentpageindex'] )->name('userboard');
    Route::post('/locationstore', [BuildingsController::class, 'locationstore'])->name('location.store');
    Route::post('/api/bestaandeLocatieStore', [CustomerController::class, 'bestaandeLocatieStore'])->name('location.storebestaandelocatie');
    Route::post('/api/bestaandeLocatieDelete', [CustomerController::class, 'bestaandeLocatieDelete'])->name('location.delete');

    Route::post('/api/memberstore/', [MemberController::class, 'store'])->name('memberstore');
    Route::post('/api/memberupdate/', [MemberController::class, 'update'])->name('memberupdate');
    Route::get('/api/customerindex', [CustomerController::class, 'customerindex'])->name('customerindex');
    Route::get('/api/realitedCustomer/{customerid}', [CustomerController::class, 'customerindex'])->name('realitedCustomer');
    Route::get('/api/relatedBuild/{buildingname}', [BuildingsController::class, 'relatedBuild'])->name('relatedBuild');
    Route::get('/api/relatedBuildasCustomer/{customerid}', [BuildingsController::class, 'relatedBuildasCustomer'])->name('relatedBuildasCustomer');
    Route::get('/api/roomindex/{building}', [RoomsController::class, 'roomindex'])->name('room.index');
    Route::post('/api/roomstore', [RoomsController::class, 'store'])->name('room.store');
    Route::post('/api/roomupdate/{id}', [RoomsController::class, 'update'])->name('room.update');
    Route::post('/api/notes/store', [ClientNotesController::class, 'store'])->name('notes.store');
    Route::post('/api/notes/commentstore', [ClientNotesController::class, 'commentstore'])->name('notes.comments.store');
    Route::get('/locations/detail/{locationid}', [BuildingsController::class, 'buildingdetailindex'])->name('locations.detail.index');
    Route::get('/members/{member_id}', [MemberController::class, 'index'])->name('members.index');
    Route::post('/api/selectmembersrooms/', [MemberController::class, 'selectRoom'])->name('members.selectroom');

    Route::post('/storenewuser/', [UserBoradController::class, 'storenewuser'])->name('storenewuser');

    Route::post('/api/assigntickettype/{ticketid}/{type}',[TicketController::class, 'assigntickettype'])->name('assigntickettype');
    Route::post('/api/clientsendtrash/{id}',[CustomerController::class, 'gotrash'])->name('client.delete');

    Route::put('api/passwordupdateother', [PasswordController::class, 'updateOther'])->name('password.others.update');
    Route::get('/api/routes', [UserBoradController::class, 'getRoutes']);

    Route::get('/contactpersondetail/{personID}', [ContactPersonController::class, 'indexDetail'])->name('contactpersondetail');
    Route::post('/api/storecontactperson', [ContactPersonController::class, 'store'])->name('contactperson.store');
    Route::post('api/updatecontactperson', [ContactPersonController::class, 'update'])->name('contactperson.update');
    Route::post('/api/make_it_user', [ContactPersonController::class, 'make_it_user'])->name('make_it_user');
    Route::post('/api/delete_that_user', [ContactPersonController::class, 'delete_that_user'])->name('delete_that_user');
    Route::post('/api/getpassivethatcontact', [ContactPersonController::class, 'getpassivethatcontact'])->name('getpassivethatcontact');
    Route::post('/api/getactivethatcontact', [ContactPersonController::class, 'getactivethatcontact'])->name('getactivethatcontact');
    Route::post('/api/getpassivethatuser', [ContactPersonController::class, 'getpassivethatuser'])->name('getactivethatcontact');
    Route::post('/api/getactivethatuser', [ContactPersonController::class, 'getactivethatuser'])->name('getactivethatcontact');
    Route::post('/api/addbestaandelocatietocontact', [ContactPersonController::class, 'addbestaandelocatietocontact'])->name('addbestaandelocatietocontact');
    Route::post('/subscribe', [PushNotificationController::class, 'subscribe'])->name('subscribe');

    Route::get('/medewerkers', [MedewerkersController::class, 'index'])->name('medewerkers');
    Route::get('/medewerker/{id}', [MedewerkersController::class, 'detailindex'])->name('medewerker');
    Route::post('/api/medewerkersstore', [MedewerkersController::class, 'store'])->name('medewerkers.store');
    Route::post('/api/medewerkersupdate', [MedewerkersController::class, 'update'])->name('medewerkers.update');
    Route::post('/apí/getcustomersprojects', [ClientProjectController::class, 'getData'])->name('getcustomersprojects');

    Route::post('/api/getlocationsasignedrooms', [RoomAsigneControlles::class, 'getlocationsasignedrooms'])->name('getasignedrooms');
    Route::post('/api/asignclientrooms', [RoomAsigneControlles::class, 'asignClientRooms'])->name('asignClientRoom');
    Route::post('/api/updateclientrooms', [RoomAsigneControlles::class, 'updateClientRooms'])->name('updateclientrooms');
});
Route::post('/public-event', function (Request $request) {
    $channelName = $request->post('ticket-updates');
    broadcast(new TicketEvent($channelName));
})->middleware('throttle:60,1'); // 60 requests/minute are allowed.

require __DIR__ . '/auth.php';
