var express = require('express');
var app = express();
var request = require('request');
var Search = require('./models/search');

var port = process.env.PORT || 3000;

app.use('/api/imagesearch/:searchterm', function(req, res){
	var searchterm = req.params.searchterm;
	var offset = req.query.offset ? req.query.offset : 1;
	request('https://www.googleapis.com/customsearch/v1?q=' + searchterm + '&num='+ offset + '&cx=014631383071913291448:hlf9bqrdt58&alt=json&key=AIzaSyCD3A2gui_w3pyEOs2oNW7CtoEo4vEtelE&searchType=image', function(error, response, body){
		console.log('error: ' + error);
		console.log('response: ' + response);
		var mBody = JSON.parse(body); 
		var newObj = [];
		if (mBody.items instanceof(Object)) {
			for(var i = 0; i < Object.keys(mBody.items).length; i++){
				newObj.push(new Object);
				newObj[i].url = mBody.items[i].link;
				newObj[i].snippet = mBody.items[i].snippet;
				newObj[i].thumbnail = mBody.items[i].image.thumbnailLink;
				newObj[i].context = mBody.items[i].image.contextLink;
			}
			var search = new Search({
				term: searchterm,
				when: new Date()
			});
			search.save(function(err){
				if (err) throw err;

				console.log('Saved Sucessfully: ' );
			})
			res.send(JSON.stringify(newObj));
		} else{
			res.send("No result returned");
		}
	});
});

app.use('/api/latest/imagesearch/', function(req, res){
	Search.find({}, {'_id' : 0, '__v' : 0 }).limit(10).exec(function(err, searches){
		if(err) throw err;

		// send respond
		res.send(JSON.stringify(searches));
	});
});
app.get('/', function(req, res){
	res.send("");
});
app.listen(port, function(){
	console.log('app started on port: ' + port);
});