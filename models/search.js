var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongodb Connection Url
var url = process.env.MONGOLAB_URI;

mongoose.connect(url, function(err){
	if(err){ throw err;}
});

var searchSchema = new Schema({
	term: String,
	when: Date
});

var Search = mongoose.model('Search', searchSchema);

module.exports = Search;