// requierements
var Boom 	= require('boom');
var Joi		= require('joi');
var Config = require('config');
var sha1 = require('sha1');

var Users	= function() {};

// Get a user by id_user
Users.prototype.get = function (request, reply) {
	var data 	= {}
	if(request.auth.credentials.groups == 'none')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var id = request.params.id;
		var request = require('request');
		var options = {
		  uri: Config.get('servicesURL')+'users/'+id,
		  method: 'GET'
		};
		data['status'] = "KO";
		var req = request(options,
			function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					if(typeof body == 'string'){body = JSON.parse(body);}
					if(body['status'] == 'OK' && parseInt(body['id']) > 0)
					{
						data = body;
						data['status'] = "OK";
					}
					else if(body.msg != '')
					{
						data['msg'] = body.msg;
					}
					reply(data);
				}
				else 
				{
					console.log(error);
					console.log(response);
					reply(data);
				}			
			}
		);
	}
};



Users.prototype.put = function (request, reply) {
	var data 	= {};
	if(request.auth.credentials.groups != 'chef officer')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var id = request.params.id;
		if(typeof request.payload.email != 'undefined'){data["email"] = request.payload.email;}
		if(typeof request.payload.lastname != 'undefined'){data["lastname"] = request.payload.lastname;}
		if(typeof request.payload.firstname != 'undefined'){data["firstname"] = request.payload.firstname;}
		if(typeof request.payload.password != 'undefined'){data["password"] = request.payload.password;}
		if(typeof request.payload.groups != 'undefined'){data["groups"] = request.payload.groups;}
		
		var request = require('request');
		var options = {
		  uri: Config.get('servicesURL')+'users/'+id,
		  method: 'PUT',
		  json: data
		};
		data['status'] = "KO";
		var req = request(options,
			function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					if(typeof body == 'string'){body = JSON.parse(body);}
					if(body.status == 'OK' && parseInt(body.id) > 0)
					{
						data = body;
						data['status'] = "OK";
						console.log('Update user : '+body.id);
					}
					else if(body.msg != '')
					{
						data['msg'] = body.msg;
					}
					reply(data);
				}
				else 
				{
					console.log(error);
					console.log(body);
					reply(data);
				}			
			}
		);
	}
};



// TOKEN CREATION
// TODO CHECK Users + PASSWORD
Users.prototype.post = function (request, reply) {
	var data 	= {
		"email": request.payload.email,
		"lastname": request.payload.lastname,
		"firstname": request.payload.firstname,
		"password": sha1(request.payload.password),
		"groups":"none"
	}	
	var request = require('request');
	var options = {
	  uri: Config.get('servicesURL')+'users',
	  method: 'POST',
	  json: data
	};
	data['status'] = "KO";
	var req = request(options,
		function (error, response, body) 
		{
			if (!error && response.statusCode == 200) 
			{
				if(typeof body == 'string'){body = JSON.parse(body);}
				if(body.status == 'OK' && parseInt(body.id) > 0)
				{
					data['id'] = body.id;
					data['status'] = "OK";
					console.log('New user : '+body.id);
					/*
					TO DO envoyer un email au chef pour qu'il valide
					*/
				}
				else if(body.msg != '')
				{
					data['msg'] = body.msg;
				}
				reply(data);
			}
			else 
			{
				console.log(error);
				console.log(response);
				reply(data);
			}			
		}
	);
};

module.exports = [
	{	method: 'GET',
   		path: '/v1/users/{id}',
   		handler: Users.prototype.get,
   		config: {
      		auth: {
        		strategy: 'jwt',
   			},
       		validate: {
           		params: {
               		id: Joi.number().integer().required()
           		}
       		},
       		cache : {
       			expiresIn : 30 * 1000,
       			privacy : 'private'
       		}
   		}
    },
	{	method: 'PUT',
   		path: '/v1/users/{id}',
   		handler: Users.prototype.put,
   		config: {
      		auth: {
        		strategy: 'jwt',
   			},
       		validate: {
           		payload: Joi.object({
               		email: Joi.string().email(),
					lastname: Joi.string(),
					firstname: Joi.string(),
					password: Joi.string(),		
					groups: Joi.string()		
           		}),
				params:{
					id: Joi.number().integer().required()
				}
       		},
       		cache : {
       			expiresIn : 1,
       			privacy : 'private'
       		}
   		}
    },
    {	method: 'POST',
   		path: '/v1/users',
   		handler: Users.prototype.post,
   		config: {
       		validate: {
           		payload: Joi.object({
               		email: Joi.string().email().required(),
					lastname: Joi.string().required(),
					firstname: Joi.string().required(),
					password: Joi.string().required()				
           		})
       		},
       		cache : {
       			expiresIn : 1,
       			privacy : 'private'
       		}
   		}
    }
];