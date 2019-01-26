'use strict';

const Hapi = require('hapi');
const Config = require('config');
const Joi = require('joi');
const options = Config.get('logger');
const connectDB = Config.get('connectDB');


/*
** Mes services
*/
var Users       = require ('./services/users.js');
var Crimes      = require ('./services/crimes.js');
var Login       = require ('./services/login.js');
/**/

var hapiAuthJwt  = require ('hapi-auth-jwt');
const server = new Hapi.Server();
server.connection(Config.get('api'));

server.register([

	{register: require('hapi-plugin-mysql'),
     options: connectDB
    },
	
	{register:hapiAuthJwt,
	 options:function () {}
	}
], (err) => {
	server.auth.strategy('jwt', 'jwt', {
		key: Config.get('secret'),
		verifyOptions: { algorithms: [ 'HS256' ] }
	});
				
	/*
	** Routage de mes services
	*/
	server.route(Crimes);
	server.route(Users);
	server.route(Login);
    server.start((err) => {
        if(err) {throw err;}
        server.log('info', `Server running at: ${server.info.uri}`);
    })
} );