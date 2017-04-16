/**
 * Patricia Figueroa
 */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');
var app = express();
var jsonParser = bodyParser.json();


// GET Method
app.get('/', function (req, res) {
	res.send('Welcome!, to use please include /movies/{Yourtitle}');
});

// POST
app.post('/', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

// PUT
app.put('/', function (req, res){
	res.status(403).send('HTTP Method not supported.');	
});

// DELETE 
app.delete('/', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

// Gets /movies with no specific queries
app.get('/movies', function (req, res) {

	request({
		
		url: 'https://apibaas-trial.apigee.net/figueroap/sandbox/movies',
		method: 'GET',
		json: true 
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json(body)
					}
					else{
						for (var x = 0 ; x < body.entities.length ; x++){
						delete body.entities[x].uuid;
						delete body.entities[x].type;
						delete body.entities[x].metadata;
						delete body.entities[x].created;
						delete body.entities[x].modified;
						}
					}	
	
				var newBody = {};
				newBody.status = "200";
				newBody.description = "SUCCESSFUL GET Request";
				newBody.movies = body.entities;
				res.json(newBody);
		}
			
		});
	
});


app.put('/movies', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

app.post('/movies', jsonParser, function (req, res) {
	if (req.body.name == undefined || req.body.year == undefined || req.body.actors  == undefined)
	{
		res.status(400).send("Sorry, not enough information!");
	} 
	else 
	{
		request({
		
		url: 'https://apibaas-trial.apigee.net/figueroap/sandbox/movies',
		method: 'POST',
		json: true,
		body: {
				"name" : req.body.name,
				"releasedate" : req.body.year,
				"actor": req.body.actors
			  }
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error){
						res.status(400).json("MOVIE NOT FOUND!")
					}
					else{
						var newBody = {};
			        	newBody.status = "200";
			        	newBody.description = "Successful POST Request";
	    	    		newBody.name = body.entities[0].name;
	        			newBody.year = body.entities[0].year;
	        			newBody.actors = body.entities[0].actors;
	        			res.json(newBody);
					}
				}	

			
		});
		
	}
	
});

// Remove all movie from /movies
app.delete('/movies', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});


app.get('/movies/:name', function (req, res) {
	var rqst = 'https://apibaas-trial.apigee.net/figueroap/sandbox/movies/' + req.params.name;
    var rqst2 = "https://apibaas-trial.apigee.net/figueroap/sandbox/reviews?ql=movie='" + req.params.name + "'";

    
    var get_review = req.query.reviews;
  
  
    if(get_review === 'true'){

        async.parallel
        ([
            function getMovie(callback)
            {

                var responseBody = {};
                request({
                    url: rqst,
                    method: 'GET',
                    json: true
                }, function(error, response, body){
                    if(error) {
                        console.log(error);
                    } else {
                        if(body.error){
                            callback({"status" : "400", "description" : "MOVIE NOT FOUND"}, responseBody);
                            return false;
                        }else{


                            responseBody.status = "200";
                            responseBody.description = "GET Successful!";
                            responseBody.name = body.entities[0].name;
                            responseBody.year = body.entities[0].year;
                            responseBody.actors = body.entities[0].actors;

                            //res.json(responseBody);
                            callback(null, responseBody);
                        }
                    }
                });


            },
            function getReview(callback) {

                var responseBody = {};
                responseBody.revs = [];
                request({
                    url: rqst2,
                    method: 'GET',
                    json: true
                }, function(error, response, body){
                    if(error) {
                        console.log(error);
                    } else {
                        if(body.error){
                            callback({"status" : "400", "description" : "MOVIE NOT FOUND"}, responseBody);
                        }else{

                            for (var i = 0 ; i < body.entities.length ; i++){
								responseBody.revs[i] = {
								"reviewer" : body.entities[i].reviewer,
								"quote" : body.entities[i].quote,
								"review" : body.entities[i].review
								};
                            }
                            callback(null, responseBody);
                        }
                    }
                });


            } 
        ], function(err, result) {
            console.log(result);
            res.send({movie:result[0], review:result[1]});
        })
    }
    else{
       
        request({
            url: rqst,
            method: 'GET',
            json: true
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                if(body.error){
                    res.status(400).json({"status" : "400", "description" : "MOVIE NOT FOUND"});
                }else{
                    var responseBody = {};

                    responseBody.status = "200";
                    responseBody.description = "GET SUCCESSFUL.";
                    responseBody.name = body.entities[0].name;
                    responseBody.year = body.entities[0].year;
                    responseBody.actors = body.entities[0].actors;


                    res.json(responseBody);
                }
            }
        });
    }


});


app.put('/movies/:name', jsonParser, function (req, res) {
request({
		
		url: 'https://apibaas-trial.apigee.net/figueroap/sandbox/movies/' + req.params.name,
		method: 'PUT',
		json: true,
		body: {
				"name" : req.body.name,
				"year" : req.body.year,
				"actors": req.body.actors
			  }
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json("MOVIE NOT FOUND")
					}
					else{
							res.json("PUT SUCCESSFUL");
						}
				}	
			
		});
});


app.post('/movies/:name', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

app.delete('/movies/:name', function (req, res) {
	request({
		
		url: 'https://apibaas-trial.apigee.net/figueroap/sandbox/movies/' + req.params.name,
		method: 'DELETE',
		json: true 
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json("MOVIE NOT FOUND");
					}
					else{
						var newBody = {};
						newBody.status = "200";
						newBody.description = "DELETE SUCCESSFUL!";
						newBody.name = body.entities[0].name;
						newBody.year = body.entities[0].year;
						newBody.actors = body.entities[0].actors;
						res.json(newBody);
						}
				}	
			
		});
	
});


app.listen(3000, function () {
  console.log('server listening!')
});
