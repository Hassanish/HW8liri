var dotenv = require("dotenv").config();
var fs = require('fs'); 
var request = require('request');
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

var Action = process.argv[2];
var Value = "";
for (var i = 3; i < process.argv.length; i++) {
    Value += process.argv[i] + " ";
};

switch (Action) {

  case "spotify-this-song":
      Song(Value);
      break;
  case "my-tweets":
      myTweets();
      break;   
  case "movie-this":
      Movie(Value);
      break;
  case "do-what-it-says":
  doWhatItSays();
      break;
};

function Song(Value) {
    if (Value == "") {
        Value = "The Sign Ace of Base";
    }
    var spotify = new Spotify(keys.spotify);
    var Limit = "";
    if (isNaN(parseInt(process.argv[3])) == false) {
        Limit = process.argv[3];
        console.log("\nValues: " + Limit + " songs");
        Value = "";
        for (var i = 4; i < process.argv.length; i++) {        
            Value += process.argv[i] + " ";
        };
        }
    else {
        console.log(error, occured);
       }
    spotify.search({ type: 'track', query: Value, limit: Limit }, function(Err, response) {
        fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n",);
        
        var song = response.tracks.items;

        for (var i = 0; i < song.length; i++) {
            console.log("\n======= Spotify Search Result "+ (i+1) +" =======\n");
            console.log(("Artist: " + song[i].artists[0].name));
            console.log(("Song title: " + song[i].name));
            console.log(("Album name: " + song[i].album.name));
            console.log(("URL Preview: " + song[i].preview_url));
            console.log("\n=======\n");

            fs.appendFile("log.txt", "\n========= Result "+ (i+1) +" =========\nArtist: " + song[i].artists[0].name + "\nSong title: " + songResp[i].name + "\nAlbum name: " + songResp[i].album.name + "\nURL Preview: " + songResp[i].preview_url + "\n====================\n",);
           }
        fs.appendFile("log.txt","-----Spotify Log Entry End-----\n\n",);
    })
};

function myTweets() {
  var client = new Twitter(keys.twitter); 
  var params = { screen_name: 'hax hax', count: 20};

  client.get('statuses/user_timeline', params, function(Err, tweets, response) {
      fs.appendFile("log.txt", "-----Tweets Log Entry Start-----\n\nProcessed at: \n" + Date() + "\n\n" + "terminal commands: \n" + process.argv + "\n\n" + "Data Output: \n\n")
      console.log("\n----- hax Latest Tweets -----\n");
      for (i = 0; i < tweets.length; i++) {
          console.log(i + 1 + ". Tweet: ", tweets[i].text);
          console.log("   Tweeted on: ", tweets[i].created_at + "\n");
          fs.appendFile("log.txt", (i + 1) + ". Tweet: " + tweets[i].text + "\nTweeted on: " + tweets[i].created_at + "\n\n")
      };
      console.log("--------------------");
  });
};



function Movie(Value) {
    if (Value == "") {
        Value = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + Value.trim() + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(Err, response, body) {
        fs.appendFile("log.txt", "-----OMDB Log Entry Start-----\n\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n\n",);
        if (JSON.parse(body).Error == 'Movie not found!' ) {
            console.log("\nSorry try again " + Value + ".\n")
            fs.appendFile("log.txt", "Sorry try again" + Value + ".\n\n-----OMDB Log Entry End-----\n\n",);
        } 
        else {

            movieBody = JSON.parse(body);
                     console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);
            if (movieBody.Ratings.length < 2) {
                console.log("There is no Rotten Tomatoes Rating for this movie.")
                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: There is no Rotten Tomatoes Rating for this movie \nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n",);
               }
           else {
                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);
                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n",);
                }
            
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
           
        };      
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(Err, data) {
        var doWhatItSaysArray = data.split(", ");
              if (doWhatItSaysArray[0] == "spotify-this-song") {
            Song(doWhatItSaysArray[1]);
        } else if (doWhatItSaysArray[0] == "movie-this") {
            Movie(doWhatItSaysArray[1]);
        } else {
            myTweets();
        }
    });
};



 
