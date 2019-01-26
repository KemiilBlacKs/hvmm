var Boom        = require('boom');
var BaseJoi     = require('joi');
var Joi 		= BaseJoi.extend(require('joi-date-extensions'));
var Config 		= require('config');

var Crimes = function() {};
var mysql = require('mysql');


Crimes.prototype.get = function(request, reply) {
	if(request.auth.credentials.groups == 'none')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var id = request.params.id;
		var sql = "SELECT * FROM crime_incident_reports WHERE id="+id+";";
		console.log(sql);
		request.app.db.query(sql, function(err, results, fields) 
		{
			if (err) throw err;		
			results.status = 'OK';			
			reply(JSON.stringify(results));
		});
	}
};

Crimes.prototype.listing = function(request, reply) {
	if(request.auth.credentials.groups == 'none')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM crime_incident_reports WHERE 1=1';
		if(typeof request.query.naturecode != 'undefined'){sql = sql + " AND naturecode LIKE " + mysql.escape(request.query.naturecode) + "";}
		if(typeof request.query.incident_type_description != 'undefined'){sql = sql + " AND incident_type_description LIKE " + mysql.escape(request.query.incident_type_description) + "";}
		if(typeof request.query.main_crimecode != 'undefined'){sql = sql + " AND main_crimecode LIKE " + mysql.escape(request.query.main_crimecode) + "";}
		if(typeof request.query.reptdistrict != 'undefined'){sql = sql + " AND reptdistrict LIKE " + mysql.escape(request.query.reptdistrict) + "";}
		if(typeof request.query.reportingarea != 'undefined'){sql = sql + " AND reportingarea LIKE " + mysql.escape(request.query.reportingarea) + "";}
		if(typeof request.query.fromdate_start != 'undefined'){sql = sql + " AND fromdate >= " + mysql.escape(request.query.fromdate_start) + "";}
		if(typeof request.query.fromdate_end != 'undefined'){sql = sql + " AND fromdate <= " + mysql.escape(request.query.fromdate_end) + "";}
		if(typeof request.query.weapontype != 'undefined'){sql = sql + " AND weapontype LIKE " + mysql.escape(request.query.weapontype) + "";}
		if(typeof request.query.shooting != 'undefined'){sql = sql + " AND shooting LIKE " + mysql.escape(request.query.shooting) + "";}
		if(typeof request.query.domestic != 'undefined'){sql = sql + " AND domestic LIKE " + mysql.escape(request.query.domestic) + "";}
		if(typeof request.query.shift != 'undefined'){sql = sql + " AND shift LIKE " + mysql.escape(request.query.shift) + "";}
		if(typeof request.query.year != 'undefined'){sql = sql + " AND year = " + mysql.escape(request.query.year) + "";}
		if(typeof request.query.month != 'undefined'){sql = sql + " AND month = " + mysql.escape(request.query.month) + "";}
		if(typeof request.query.day_week != 'undefined'){sql = sql + " AND day_week LIKE " + mysql.escape(request.query.day_week) + "";}
		/* TO DO recherhce par coordonée pour map
					location_x: Joi.string(),
					location_y: Joi.string()
		*/		
		if(request.query.sens == 'DESC'){var sens = "DESC";}else{var sens = "ASC";}
		sql = sql + " ORDER BY `" + request.query.order + "` " + sens;
		sql = sql + " LIMIT " + ((parseInt(request.query.page)-1) * parseInt(request.query.pagination) ) + ", " + parseInt(request.query.pagination)+";";
		console.log(sql);
		request.app.db.query(sql, function(err, results, fields) 
		{
			if (err) throw err;
			var sql2 = ' SELECT FOUND_ROWS() AS nb;';
			request.app.db.query(sql2, function(err2, results2, fields2) 
			{
				if (err2) throw err2;				
				var rep = {
					"listing" : results,
					"pagination" : {
						"current_page":parseInt(request.query.page),
						"pagination":parseInt(request.query.pagination),
						"max_page":Math.ceil(parseInt(results2[0].nb) / parseInt(request.query.pagination))
					}					
				};
				reply(JSON.stringify(rep));
			});			
		});
	}	
};

Crimes.prototype.post = function (request, reply){
	if(request.auth.credentials.groups != 'detective' && request.auth.credentials.groups != 'chef officer')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var sql = "INSERT INTO crime_incident_reports SET ";	
		
		if(typeof request.payload.naturecod != 'undefined'){sql = sql + "naturecode = "+mysql.escape(request.payload.naturecode)+",";}else{sql = sql + "naturecode = '',";}
		if(typeof request.payload.incident_type_description != 'undefined'){sql = sql + "incident_type_description = "+mysql.escape(request.payload.incident_type_description)+",";}else{sql = sql + "incident_type_description = '',";}
		if(typeof request.payload.main_crimecode != 'undefined'){sql = sql + "main_crimecode = "+mysql.escape(request.payload.main_crimecode)+",";}else{sql = sql + "main_crimecode = '',";}
		if(typeof request.payload.reptdistrict != 'undefined'){sql = sql + "reptdistrict = "+mysql.escape(request.payload.reptdistrict)+",";}else{sql = sql + "reptdistrict = '',";}
		if(typeof request.payload.reportingarea != 'undefined'){sql = sql + "reportingarea = "+mysql.escape(request.payload.reportingarea)+",";}else{sql = sql + "reportingarea = '',";}
		if(typeof request.payload.fromdate != 'undefined'){sql = sql + "fromdate = "+mysql.escape(request.payload.fromdate+'.000000')+",";}
		if(typeof request.payload.weapontype != 'undefined'){sql = sql + "weapontype = "+mysql.escape(request.payload.weapontype)+",";}
		if(typeof request.payload.shooting != 'undefined'){sql = sql + "shooting = "+mysql.escape(request.payload.shooting)+",";}else{sql = sql + "shooting = '',";}
		if(typeof request.payload.domestic != 'undefined'){sql = sql + "domestic = "+mysql.escape(request.payload.domestic)+",";}else{sql = sql + "domestic = '',";}
		if(typeof request.payload.shift != 'undefined'){sql = sql + "shift = "+mysql.escape(request.payload.shift)+",";}else{sql = sql + "shift = '',";}
		if(typeof request.payload.year != 'undefined'){sql = sql + "year = "+mysql.escape(request.payload.year)+",";}else{sql = sql + "year = '',";}
		if(typeof request.payload.month != 'undefined'){sql = sql + "month = "+mysql.escape(request.payload.month)+",";}else{sql = sql + "month = '',";}
		if(typeof request.payload.day_week != 'undefined'){sql = sql + "day_week = "+mysql.escape(request.payload.day_week)+",";}else{sql = sql + "day_week = '',";}
		if(typeof request.payload.ucrpart != 'undefined'){sql = sql + "ucrpart = "+mysql.escape(request.payload.ucrpart)+",";}else{sql = sql + "ucrpart = '',";}
		if(typeof request.payload.x != 'undefined'){sql = sql + "x = "+mysql.escape(request.payload.x)+",";}else{sql = sql + "x = 0,";}
		if(typeof request.payload.y != 'undefined'){sql = sql + "y = "+mysql.escape(request.payload.y)+",";}else{sql = sql + "y = 0,";}
		if(typeof request.payload.streetname != 'undefined'){sql = sql + "streetname = "+mysql.escape(request.payload.streetname)+",";}else{sql = sql + "streetname = '',";}
		if(typeof request.payload.xstreetname != 'undefined'){sql = sql + "xstreetname = "+mysql.escape(request.payload.xstreetname)+",";}else{sql = sql + "xstreetname = '',";}
		if(typeof request.payload.location != 'undefined'){sql = sql + "location = "+mysql.escape(request.payload.location)+",";}else{sql = sql + "location = '',";}
		sql = sql + "compnos = "+mysql.escape(request.payload.compnos)+";";
		console.log(sql);
		request.app.db.query(sql, function(err, results, fields) 
		{
			if (err) throw err;		
			results.status = 'OK';			
			reply(JSON.stringify(results));
		});
	}
};

Crimes.prototype.put = function (request, reply){
		if(request.auth.credentials.groups != 'detective' && request.auth.credentials.groups != 'chef officer')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var id = request.params.id;
		var sql = "";			
		if(typeof request.payload.naturecod != 'undefined'){sql = sql + ",naturecode = "+mysql.escape(request.payload.naturecode)+"";}
		if(typeof request.payload.incident_type_description != 'undefined'){sql = sql + ",incident_type_description = "+mysql.escape(request.payload.incident_type_description)+"";}
		if(typeof request.payload.main_crimecode != 'undefined'){sql = sql + ",main_crimecode = "+mysql.escape(request.payload.main_crimecode)+"";}
		if(typeof request.payload.reptdistrict != 'undefined'){sql = sql + ",reptdistrict = "+mysql.escape(request.payload.reptdistrict)+",";}
		if(typeof request.payload.reportingarea != 'undefined'){sql = sql + ",reportingarea = "+mysql.escape(request.payload.reportingarea)+"";}
		if(typeof request.payload.fromdate != 'undefined'){sql = sql + ",fromdate = "+mysql.escape(request.payload.fromdate+'.000000')+"";}
		if(typeof request.payload.weapontype != 'undefined'){sql = sql + ",weapontype = "+mysql.escape(request.payload.weapontype)+"";}
		if(typeof request.payload.shooting != 'undefined'){sql = sql + ",shooting = "+mysql.escape(request.payload.shooting)+"";}
		if(typeof request.payload.domestic != 'undefined'){sql = sql + ",domestic = "+mysql.escape(request.payload.domestic)+"";}
		if(typeof request.payload.shift != 'undefined'){sql = sql + ",shift = "+mysql.escape(request.payload.shift)+"";}
		if(typeof request.payload.year != 'undefined'){sql = sql + ",year = "+mysql.escape(request.payload.year)+"";}
		if(typeof request.payload.month != 'undefined'){sql = sql + ",month = "+mysql.escape(request.payload.month)+"";}
		if(typeof request.payload.day_week != 'undefined'){sql = sql + ",day_week = "+mysql.escape(request.payload.day_week)+"";}
		if(typeof request.payload.ucrpart != 'undefined'){sql = sql + ",ucrpart = "+mysql.escape(request.payload.ucrpart)+"";}
		if(typeof request.payload.x != 'undefined'){sql = sql + ",x = "+mysql.escape(request.payload.x)+"";}
		if(typeof request.payload.y != 'undefined'){sql = sql + ",y = "+mysql.escape(request.payload.y)+"";}
		if(typeof request.payload.streetname != 'undefined'){sql = sql + ",streetname = "+mysql.escape(request.payload.streetname)+"";}
		if(typeof request.payload.xstreetname != 'undefined'){sql = sql + ",xstreetname = "+mysql.escape(request.payload.xstreetname)+"";}
		if(typeof request.payload.location != 'undefined'){sql = sql + ",location = "+mysql.escape(request.payload.location)+"";}
		if(typeof request.payload.compnos != 'undefined'){sql = sql + ",compnos = "+mysql.escape(request.payload.compnos)+"";}
		if(sql != '')
		{
			sql = "UPDATE crime_incident_reports SET " + sql.substring(1) + " WHERE id = "+parseInt(id)+";";
			console.log(sql);
			request.app.db.query(sql, function(err, results, fields) 
			{
				if (err) throw err;		
				results.status = 'OK';			
				reply(results);
			});
		}
		else
		{
			reply({"status":"KO","msg":"no data"});
		}
	}
};

Crimes.prototype.delete = function (request, reply){
	if(request.auth.credentials.groups != 'chef officer')
	{
		reply({"status":"KO","msg":"Forbidden"});
	}
	else
	{
		var id = request.params.id;
		var sql = "DELETE FROM crime_incident_reports WHERE id="+id+";";
		console.log(sql);
		request.app.db.query(sql, function(err, results, fields) 
		{
			if (err) throw err;		
			results.status = 'OK';			
			reply(JSON.stringify(results));
		});
	}
};


module.exports = [
	{	method : 'GET',
      	path : '/v1/crimes',
      	handler : Crimes.prototype.listing,
      	
      	config : {
      		auth: {
        		strategy: 'jwt',
   			},
       		validate: {
           		query: {
               		order: Joi.string().required(),
               		sens: Joi.string().required(),
					page: Joi.number().required(),
					pagination: Joi.number().required(),
					naturecode: Joi.string(),
					incident_type_description: Joi.string(),
					main_crimecode: Joi.string(),
					reptdistrict: Joi.string(),
					reportingarea: Joi.string(),
					fromdate_start:Joi.date().format('YYYY-MM-DD'),
					fromdate_end: Joi.date().format('YYYY-MM-DD'),
					weapontype: Joi.string(),
					shooting: Joi.string(),
					domestic: Joi.string(),
					shift: Joi.string(),
					year: Joi.number(),
					month: Joi.number(),
					day_week: Joi.string(),
					location_x: Joi.string(),
					location_y: Joi.string()
           		}
          	},
          	cache : {
       			expiresIn : 30 * 1000,
       			privacy : 'private'
       		}
      	} 
    },
	{	method : 'GET',
      	path : '/v1/crimes/{id}',
      	handler : Crimes.prototype.get,
      	
      	config : {
      		auth: {
        		strategy: 'jwt',
   			},
          	validate : {
              	params : {
                  	id : Joi.number().integer()
              	}
          	},
          	cache : {
       			expiresIn : 30 * 1000,
       			privacy : 'private'
       		}
      	} 
    },
	{	method: 'POST',
	    path: '/v1/crimes',
	    handler: Crimes.prototype.post,
	    config: {
      		auth: {
        		strategy: 'jwt',
   			},
	        validate: {
	            payload: Joi.object({
					compnos: 		Joi.number().integer().required(),
					naturecode: 	Joi.string().required(),
					incident_type_description: Joi.string(),
					main_crimecode: Joi.string(),
					reptdistrict: 	Joi.string(),
					reportingarea: 	Joi.string(),
					fromdate:		Joi.string(),
					weapontype: 	Joi.string(),
					shooting: 		Joi.string(),
					domestic: 		Joi.string(),
					shift: 			Joi.string(),
					year: 			Joi.number().integer(),
					month: 			Joi.number().integer(),
					day_week: 		Joi.string(),
					ucrpart : 		Joi.string(),
					x: 				Joi.number(),
					y: 				Joi.number(),
					streetname: 	Joi.string(),
					xstreetname: 	Joi.string(),
					location: 		Joi.string()
	            })
	        },
	        cache : {
       			expiresIn : 30 * 1000,
       			privacy : 'private'
       		}
	    }
	},
	{	method: 'PUT',
	    path: '/v1/crimes/{id}',
	    handler: Crimes.prototype.put,
	    config: {
      		auth: {
        		strategy: 'jwt',
   			},
	        validate: {
	           payload: Joi.object({
					compnos: 		Joi.number().integer(),
					naturecode: 	Joi.string(),
					incident_type_description: Joi.string(),
					main_crimecode: Joi.string(),
					reptdistrict: 	Joi.string(),
					reportingarea: 	Joi.string(),
					fromdate:		Joi.string(),
					weapontype: 	Joi.string(),
					shooting: 		Joi.string(),
					domestic: 		Joi.string(),
					shift: 			Joi.string(),
					year: 			Joi.number().integer(),
					month: 			Joi.number().integer(),
					day_week: 		Joi.string(),
					ucrpart : 		Joi.string(),
					x: 				Joi.number(),
					y: 				Joi.number(),
					streetname: 	Joi.string(),
					xstreetname: 	Joi.string(),
					location: 		Joi.string()
	            }),
				params:{
					id: Joi.number().integer().required()
				}
	        },
	        cache : {
       			expiresIn : 30 * 1000,
       			privacy : 'private'
       		}
	    }
	},
	{	method : 'DELETE',
      	path : '/v1/crimes/{id}',
      	handler : Crimes.prototype.delete,
      	
      	config : {
      		auth: {
        		strategy: 'jwt',
   			},
          	validate : {
              	params : {
                  	id : Joi.number().integer().required()
              	}
          	},
          	cache : {
       			expiresIn : 30 * 1000,
       			privacy : 'private'
       		}
      	} 
    },
];
