<?php

namespace App\Http\Controllers;

use App\User;

class UsersController extends Controller
{
    /**
     * Retrieve the user for the given ID.
     *
     * @param  int  $id
     * @return Response
     */
    public function get($id)
    {
        return User::findOrFail($id);
    }
}