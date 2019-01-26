<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Users extends Model {

    protected $table = 'users';
	
    public $timestamps = false;
	
    protected $fillable = ['lastname', 'firstname', 'email', 'password', 'groups'];

    protected $dates = [];

    public static $rules = [
		"lastname" => "required",
		"firstname" => "required",
		"groups" => "required",
		"email" => "email|unique:users,email",
		"password" => "required",
    ];

    // Relationships

}

