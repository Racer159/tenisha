// Setup GroupMe Constants from the Environment
const GROUPMETOKEN = process.env['TOKEN'];
const GROUP = process.env['GROUP'];
const NAME =  process.env['NAME'];
const URL = process.env['URL'];
const AVATAR = process.env['AVATAR'];

// Import External Libraries
const natural = require('natural');
const _ = require('underscore');
const util = require('util');
const request = require('request');
const image = require('google-images');
const words = require('./tokenizer.js');
const google = require('google');
var shorten_me = require('short-url');

google.resultsPerPage = 1;

// Setup the Tokenizer and GroupMe Config
var tokenizer = new natural.WordTokenizer();

var config =	{ token: GROUPMETOKEN,
				name: NAME,
				group: GROUP,
				url: URL
				};

if (AVATAR) {
	config.avatar_url = AVATAR;
}

var bot = require('fancy-groupme-bot')(config);

bot.on('botRegistered', function() {
	console.log("online");
});

bot.on('botMessage', function(bot, message) {
	console.log('incoming');
	var tokens = tokenizer.tokenize(message.text);

	tokens = _.map(tokens, function(t) { return t.toLowerCase(); });

	if (tokens.indexOf('tenisha') == 0) {

		if (words.check( "tenisha what is", tokens )) {
			tokens = _.without(tokens, 'tenisha', 'what', 'is');
			searchTerm = escape(tokens.join('+'))

			request('http://api.urbandictionary.com/v0/define?term=' + searchTerm, function(error, response, body){
			resultJSON = JSON.parse(body)
			if(resultJSON["result_type"] == "no_results") {
				bot.message("I don't know what that is.");
			} else {
				firstDefinition = resultJSON["list"][0]["definition"]

				if (firstDefinition.length > 450) {
					firstDefinition = firstDefinition.substring(0, 439) + " (cont) ...";
				}

				bot.message(firstDefinition);
			}
			});
		} else if (words.check( "tenisha image me", tokens )) {
			tokens = _.without(tokens, 'tenisha', 'image', 'me');
			searchTerm = escape(tokens.join('+'))

			image.search(searchTerm,function(err,images) {
				bot.message(images[0].url);
			})
		} else if (words.check( "tenisha lunch me", tokens )) {
			var preText = ['Get yourself some', 'Try some', 'Why not some', 'How about', 'Try']
			var lunchOptions = ['salad', 'pizza', 'sushi', 'liquid lunch', 'cheesesteaks', 'food cart', 'halal', 'korean', 'mexican', 'chinese', 'vietnamese']
			bot.message(preText[Math.floor(Math.random() * preText.length)] + " " + lunchOptions[Math.floor(Math.random() * lunchOptions.length)] + "!");
		} else if (words.check( "tenisha calories", tokens )) {
			tokens = _.without(tokens, 'tenisha', 'calories');
			var humanSearchTerm = tokens.join(' ');
			var searchTerm = escape(tokens.join('+'));

			request('https://api.nutritionix.com/v1_1/search/' + searchTerm + '?results=0%3A1&cal_min=0&cal_max=5000&fields=item_name%2Cbrand_name%2Cnf_calories&appId=5acc25fb&appKey=056e335168bb29dd99fe206141ff84cc', function(err, resp, body){
				json = eval("(" + body + ')');
				cals = json.hits[0].fields.nf_calories
				bot.message("A " + humanSearchTerm + " is " + cals + " calories.")
			});
		} else if (words.check( "tenisha metar me", tokens )) {
			tokens = _.without(tokens, 'tenisha', 'metar', 'me');
			var searchTerm = tokens[0].toUpperCase();

			request('http://weather.noaa.gov/pub/data/observations/metar/stations/' + searchTerm + '.TXT', function(err, resp, body){
				if (!err && resp.statusCode == 200) {
					bot.message( body );
				} else {
					bot.message( "Sorry, that is an invalid airport code." )
				}
			});
		} else if (words.check( "tenisha help me", tokens )) {
			var commands = "gif me, lunch me, tell me a joke, calories,";
			commands += "spotify me, image me, what is, help me, say, weagle,";
			commands += "metar me, short url, weather me, insult, google";

			bot.message("Here ya go:\n" + commands);
		} else if (words.check( "tenisha say", tokens )) {
			var msg = message.text.toLowerCase().split(" ");
			msg = _.without(msg, 'tenisha', 'say');
			bot.message(msg.join(" "));
		} else if (words.check( "tenisha short url", tokens )) {
			var msg = message.text.split(" ");
			msg = _.without(msg, 'tenisha', 'short', 'url');
			var givenURL = msg[0];

			shorten_me.shorten(givenURL, function(err, url) {
				bot.message(url);
			});
		} else if (words.check( "tenisha google", tokens )) {
			var msg = message.text.toLowerCase().split(" ");
			msg = _.without(msg, 'tenisha', 'google');

			google(msg, function(err, next, links){
				if (err) console.error(err);

				bot.message(links[0].link);
			});
		} else if (words.check( "tenisha insult", tokens )) {
			tokens = _.without(tokens, 'tenisha', 'insult');

			var targetName = tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1);

			var groupOne = ['lazy', 'stupid', 'insecure', 'idiotic', 'slimy',
				'slutty', 'smelly', 'pompous', 'communist', 'dicknose', 'pie-eating',
				'racist', 'elitist', 'white trash', 'drug-loving', 'butterface',
				'tone deaf', 'ugly', 'creepy'];
			var groupTwo = ['douche', 'ass', 'turd', 'rectum', 'butt', 'cock',
				'shit', 'crotch', 'bitch', 'turd', 'prick', 'slut', 'taint',
				'fuck', 'dick', 'boner', 'shart', 'nut', 'sphincter'];
			var groupThree = ['pilot', 'canoe', 'captain', 'pirate',
				'hammer', 'knob', 'box', 'jockey', 'nazi', 'waffle',
				'goblin', 'blossum', 'biscuit', 'clown', 'socket', 'monster',
				'hound', 'dragon', 'balloon'];

			var one = groupOne[Math.floor(Math.random() * groupOne.length)];
			var two = groupTwo[Math.floor(Math.random() * groupTwo.length)];
			var three = groupThree[Math.floor(Math.random() * groupThree.length)];

			bot.message(targetName + " is a " + one + " " + two + " " + three + "!");
		} else {
			 // Do nothing.
		}
	}
});

bot.serve(process.env['PORT'] || 3000);