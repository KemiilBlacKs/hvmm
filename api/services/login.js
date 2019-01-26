// requierements
var Boom 	= require('boom');
var Joi		= require('joi');
var Config = require('config');
var jwt		= require('jsonwebtoken');
var sha1 = require('sha1');
var Login	= function() {};


Login.prototype.get = function(request, reply) {
	//var id = request.auth.credentials.id; 
	reply(request.auth.credentials);
};



// TOKEN CREATION
// TODO CHECK LOGIN + PASSWORD
Login.prototype.post = function (request, reply) {
	var data 	= {
		"jwt": "",
		"email":request.payload.email,
		"password":request.payload.password,
	}

	var request = require('request');
	var options = {
	  uri: Config.get('servicesURL')+'login',
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
				if(parseInt(body.id) > 0 && body.groups != 'none')
				{
					var key = jwt.sign({ id: body.id, lastname: body.lastname, firstname: body.firstname, email: body.email, groups: body.groups }, Config.get('secret'), { algorithm: 'HS256', expiresIn: "1h" } ); // Génére un token
					data['jwt'] = key;
					data['status'] = "OK";
					console.log('Token : '+key);
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
	{
		method : 'GET',
      	path : '/v1/login',
      	handler : Login.prototype.get,
      	
      	config : {
      		auth: {
        		strategy: 'jwt',
   			},
          	cache : {
       			expiresIn : 1,
       			privacy : 'private'
       		}
      	} 
    },
    {	method: 'POST',
   		path: '/v1/login',
   		handler: Login.prototype.post,
   		config: {
       		validate: {
           		payload: Joi.object({
               		email: Joi.string().email().required(),
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