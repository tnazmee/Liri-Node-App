require("dotenv").config();

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var users = process.argv[2];
var inputs = process.argv[3];

UserInputs(users, inputs);

function UserInputs(users, inputs) {
    switch (users) {
        case 'concert-this':
            displayConcertInfo(inputs);
            break;
        case 'spotify-this-song':
            displaySongInfo(inputs);
            break;
        case 'movie-this':
            displayMovieInfo(inputs);
            break;
        case 'do-what-it-says':
            displayInfo();
            break;
        default:
            console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}

function displayConcertInfo(inputs) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            for (var i = 0; i < concerts.length; i++) {
                console.log("Event Info:");
                fs.appendFileSync("log.txt", "Event Info:\n");
                console.log(i);
                fs.appendFileSync("log.txt", i + "\n");
                console.log("Name of the Venue: " + concerts[i].venue.name);
                fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name + "\n");
                console.log("Venue Location: " + concerts[i].venue.city);
                fs.appendFileSync("log.txt", "Venue Location: " + concerts[i].venue.city + "\n");
                console.log("Date of the Event: " + concerts[i].datetime);
                fs.appendFileSync("log.txt", "Date of the Event: " + concerts[i].datetime + "\n");
                console.log("*****************************");
                fs.appendFileSync("log.txt", "*****************************" + "\n");
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function displaySongInfo(inputs) {
    if (inputs === undefined) {
        inputs = "The Sign";
    }
    spotify.search({
            type: "track",
            query: inputs
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("Song Info:");
                fs.appendFileSync("log.txt", "Song Info:\n");
                console.log(i);
                fs.appendFileSync("log.txt", i + "\n");
                console.log("Song name: " + songs[i].name);
                fs.appendFileSync("log.txt", "song name: " + songs[i].name + "\n");
                console.log("Preview song: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url + "\n");
                console.log("Album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                console.log("Artist(s): " + songs[i].artists[0].name);
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
                console.log("*****************************");
                fs.appendFileSync("log.txt", "*****************************\n");
            }
        }
    );
};


function displayMovieInfo(inputs) {
    if (inputs === undefined) {
        inputs = "Mr. Nobody"
        console.log("*****************************");
        fs.appendFileSync("log.txt", "*****************************\n");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" + "\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=b3c0b435";
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var movies = JSON.parse(body);
            console.log("Movie Info:");
            fs.appendFileSync("log.txt", "Movie Info:\n");
            console.log("Title: " + movies.Title);
            fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
            console.log("Release Year: " + movies.Year);
            fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
            console.log("IMDB Rating: " + movies.imdbRating);
            fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
            console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
            fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
            console.log("Country of Production: " + movies.Country);
            fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
            console.log("Language: " + movies.Language);
            fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
            console.log("Plot: " + movies.Plot);
            fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
            console.log("Actors: " + movies.Actors);
            fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
            console.log("*****************************");
            fs.appendFileSync("log.txt", "*****************************\n");
        } else {
            console.log('Error occurred.');
        }

    });
}

function getRottenTomatoesRatingObject(data) {
    return data.Ratings.find(function (item) {
        return item.Source === "Rotten Tomatoes";
    });
}

function getRottenTomatoesRatingValue(data) {
    return getRottenTomatoesRatingObject(data).Value;
}

function displayInfo() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
    });
}