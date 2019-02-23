// Using require to intitiate dotenv to be used with axios for calling bands in town and spotify querys
require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var query = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

//Using case stamtements to execute the correct function based on user input
function userSearch(query, userInput) {

    switch(query){
        case "concert-this":
        concertThis();
        break;
        case "spotify-this-song":
        spotifyThis();
        break;
        case "movie-this":
        movieThis();
        break;
        case "do-what-it-says":
        doThis();
        break;
        default:
            console.log("Please try a different command")
        break;
    }
}
userSearch(query, userInput);


//axios call to access bands in town api and return api array
function concertThis(){
    axios
        .get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function(response){
            var response = response.data;

            // console.log(response)
            // looping through the response array
        
                if (userInput.length > 0){
                    for (var i = 0; i<response.length; i++){

                    console.log("\n")
                
                    var venueName = response[i].venue.name;
                    console.log("Venue: " + venueName) 
    
                    var location = (response[i].venue.city) + ", " + (response[i].venue.region)
                    console.log("City: " + location);
    
                    var countryLoc = response[i].venue.country;
                    console.log("Country: " + countryLoc);
    
                    //capturing each concert date into the local date variable
                    var date = response[i].datetime;
                    //using moment to reformat the returned date structture
                    date = moment(date).format("MM/DD/YYYY");
                
                    console.log("Date: " + date);
                    console.log("----------------")
                }
                }else if (!response){
                    console.log("Sorry, no data for this band!");
            }
        
        })
}

function spotifyThis(){

    if (!userInput){
        userInput = "the sign"
    }

    spotify.search({ type: "track", query: userInput, limit: 1}, function(error, data){
        var songData = data.tracks.items;
    
        if(error){
            return console.log("Error occured: " + error);
        }
        
        for (var i=0;i<songData.length;i++){
            console.log("\nSearching for " + userInput + "...\n")
            console.log("Artist: " + songData[i].album.artists[0].name);
            console.log("Song Title: " + songData[i].name);
            console.log("Preview: " + songData[i].external_urls.spotify);
            console.log("Album: " + songData[i].album.name);
            console.log("Released: " + songData[i].album.release_date)
        }
    })

}

function movieThis(){
    axios
        .get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy")
        .then(function(response){
            console.log(response)
        })
    
}