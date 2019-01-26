<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});


/*
function getParam()
{
	if($_SERVER['REQUEST_METHOD'] == 'GET')
	{
		$arg = $_GET;
	}
	else
	{
		ini_set("allow_url_fopen", true);
		$dat = trim( file_get_contents("php://input") );
		if(substr($dat,0,1) == '{' && substr($dat,-1,1) == '}')
		{
			$arg = json_decode($dat);
			if($arg === false || ($dat != '' && $arg === null))
			{
				$this->lastError = 'json Invalid';
				return false;
			}
			if(is_object($arg)){$arg = get_object_vars($arg);}
		}
		else
		{
			$arg = array();
		}
	}
	return $arg;
}
*/


$router->group(['prefix' => 'v1'], function () use ($router) {
	
	/*
	** POST login - Récupération d'un user
	*/
    $router->post('/login', function (Illuminate\Http\Request $request) {
		$res = array('result'=>array(), 'status'=>'KO');
        try {
			$query = array();
			$query[] = array('email',   '=',$request->input('email'));
			$query[] = array('password','=',sha1($request->input('password')));		
			$res = App\Users::where($query)->get();
			if(isset($res[0])){$res = $res[0];$res['status'] = 'OK';unset($res['password']);}
			else{$res = array('status'=>'KO','msg'=>'User not found');}	
		} catch(Exception $e) {
			$res = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($res);
    });
	
	/*
	** GET user - Récupération d'un user
	*/
    $router->get('/users/{id}', function ($id) {
		try {
			$user = App\Users::findOrFail($id);	
			unset($user['password']);
			$user['status'] = 'OK';
		} catch(Exception $e) {
			$user = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($user);
    });
	
	/*
	** POST user - Création d'un user
	*/
    $router->post('/users/', function (Illuminate\Http\Request $request) {
		try {
			$this->validate($request, App\Users::$rules);
		} catch(Illuminate\Validation\ValidationException $e) {
			return response()->json(array('status'=>'KO','msg'=>$e->getMessage()));
		}
		try {
			$user = App\Users::create($request->all());			
			//unset($user['password']);
			$user['password'] = sha1($user['password']);
			$user['status'] = 'OK';
		} catch(Exception $e) {
			$user = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($user);
    });
	
	/*
	** PUT user - Modification d'un user
	*/
    $router->put('/users/{id}', function (Illuminate\Http\Request $request, $id) {
		try {
			$user = App\Users::findOrFail($id);	
			if(!empty($request->input('lastname'))){	$user->lastname=$request->input('lastname');}
			if(!empty($request->input('firstname'))){	$user->firstname=$request->input('firstname');}
			if(!empty($request->input('email'))){		$user->email=$request->input('email');}
			if(!empty($request->input('password'))){		$user->password=$request->input('password');}
			if(!empty($request->input('groups'))){		$user->groups=$request->input('groups');}		
			$user->save();				
			unset($user['password']);
			$user['status'] = 'OK';
		} catch(Exception $e) {
			$user = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($user);
    });
	
	/*
	** DELETE user - Supression d'un user
	*/
    $router->delete('/users/{id}', function ($id) {
		try {
			$user  = App\Users::findOrFail($id);
			$user->delete();
			$res = array('status'=>'OK','msg'=>'User '.$id.' Removed successfully.');
        } catch(Exception $e) {
			$res = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($res);
    });
	
	/*
	** GET export - Export CSV des utilisateurs
	*/
	$router->get('export/', function () {
		$file = 'users_'.time().'.csv';
		$filepath = 'user_tmp.csv';
		$headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',   
			'Content-type'        => 'text/csv',   
			'Content-Disposition' => 'attachment; filename='.$file,   
			'Expires'             => '0',   
			'Pragma'              => 'public'
		];
        try {
			$res = App\Users::all();
		} catch(Exception $e) {
			$res = array();
		}
		
		$FH = fopen($filepath, 'w');
		if($FH!==false && flock ($FH, LOCK_EX ) )
		{
			foreach($res as $l)
			{
				fwrite($FH, $l['id'].';"'.$l['lastname'].'";"'.$l['firstname'].'";"'.$l['email'].'";"'.$l['groups'].'"'."\n");
			}
			flock($FH, LOCK_UN);
			fclose($FH);
		}
		else
		{
			return 'Error';
		}
		return response()->download($filepath,$file, $headers);
    });
	
	/*
	** GET search - Simple recherche de type autocompletion d'un utilisateur
	*/
	$router->get('search/{search}', function ($search) {
		$res = array('result'=>array(), 'status'=>'KO');
        try {
			$res['result'] = App\Users::whereRaw('MATCH( lastname,firstname,email) AGAINST(\''.addslashes($search).'*\' IN BOOLEAN MODE)')->get();	
			$res['status'] = 'OK';
		} catch(Exception $e) {
			$res = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($res);
    });
	
	/*
	** POST search - Recherche complexe d'un utilisateur
	*/
	 $router->post('search/', function (Illuminate\Http\Request $request) {
		$res = array('result'=>array(), 'status'=>'KO');
        try {
			$query = array();
			if(!empty($request->input('lastname'))){$query[] = array('lastname','like','%'.$request->input('lastname').'%');}
			if(!empty($request->input('firstname'))){$query[] = array('firstname','like','%'.$request->input('firstname').'%');}
			if(!empty($request->input('email'))){$query[] = array('email','like','%'.$request->input('email').'%');}
			if(!empty($request->input('groups'))){$query[] = array('groups','like',$request->input('groups'));}			
			$res['result'] = App\Users::where($query)->get();	
			$res['status'] = 'OK';
		} catch(Exception $e) {
			$res = array('status'=>'KO','msg'=>$e->getMessage());
		}
		return response()->json($res);
		
		
    });
});



