//look here to get movie by filters
//https://developer.themoviedb.org/reference/discover-movie
const year = new Date().getFullYear();
document.getElementById("prefReleaseYear").value = year;
document.getElementById("prefReleaseYear").max = year;

document.getElementById("divGenres").style.opacity = 1;
document.getElementById("divGenres").style.position = "relative";
document.getElementById("divSQ").style.opacity = 0;
document.getElementById("divSQ").style.position = "absolute";
document.getElementById("divResult").style.opacity = 0;
document.getElementById("divResult").style.position = "absolute";


const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTNkYTlkODlkYjgwN2RkODRlY2RkM2EwZjhmNGNhNSIsInN1YiI6IjY1NjViMGUwYzJiOWRmMDEwMDRjMDJmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nDeiMsZTtS8-A89VNgFQLtddwPXc5hcFDT-ipiNsRJc'
	}
};


var ageRatings = [];
function updateAgeRatings(ratingPromise){
	let ratingArray = ratingPromise["certifications"]["GB"];
	tempArr=[4,2,3,6,0,5,1];
	for (i=0; i<ratingArray.length; i++){
		ageRatings.push(ratingArray[tempArr[i]]["certification"]);
	}
	for (i=0; i<ageRatings.length; i++){
		var x = document.createElement("input");
		x.setAttribute("type", "radio");
		x.setAttribute("value", ageRatings[i]+"L");
		x.setAttribute("id", ageRatings[i]+"L");
		x.setAttribute("name", "ageRatingsLower");
		var y = document.createElement("label");
		y.innerHTML = ageRatings[i];
		var z = document.createElement("br")
		document.getElementById("ratingRadioButtonsLower").appendChild(z);
		document.getElementById("ratingRadioButtonsLower").appendChild(x);
		document.getElementById("ratingRadioButtonsLower").appendChild(y);
	}
	for (i=0; i<ageRatings.length; i++){
		var x = document.createElement("input");
		x.setAttribute("type", "radio");
		x.setAttribute("value", ageRatings[i]+"H");
		x.setAttribute("id", ageRatings[i]+"H");
		x.setAttribute("name", "ageRatingsHigher");
		var y = document.createElement("label");
		y.innerHTML = ageRatings[i];
		var z = document.createElement("br")
		document.getElementById("ratingRadioButtonsHigher").appendChild(z);
		document.getElementById("ratingRadioButtonsHigher").appendChild(x);
		document.getElementById("ratingRadioButtonsHigher").appendChild(y);
	}
}

fetch('https://api.themoviedb.org/3/certification/movie/list', options)
  .then(response => response.json())
  .then(response => updateAgeRatings(response))
  .catch(err => console.error(err));

fetch('https://api.themoviedb.org/3/authentication', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

fetch('https://api.themoviedb.org/3/genre/movie/list', options)
	.then(response => response.json())
	.then(response => UpdateGenres(response))
	.catch(err => console.error(err));


var genreIdDict = []

function UpdateGenres(genrePromise){
	const genreList = genrePromise['genres'];
	//console.log(genrePromise);
	document.getElementById('ulGenres').innerHTML = '';
	for (i = 0; i < genreList.length; i++){
		item = [genreList[i]['id'],genreList[i]['name']]
		genreIdDict.push(item);
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(genreList[i]['name']));
		document.getElementById("ulGenres").appendChild(li);
	}
}

let fetchStr = '';
let prefGenreIds = [];

function genreHandler(){
	let genreList = document.getElementById("prefGenre").value.replace(" ","").split(",");
	document.getElementById("prefGenre").value="";
	for (i=0; i<genreIdDict.length; i++){
		for (j=0; j<genreList.length; j++){
			if (genreIdDict[i][1].toUpperCase().replace(" ","")==genreList[j].toUpperCase()){
				prefGenreIds.push(genreIdDict[i][0]);
			}
		}
	}

	genreFetchStr = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=';
	genreFetchStr += prefGenreIds[0];
	for (i=1; i<prefGenreIds.length; i++){
		genreFetchStr += '%2C';
		genreFetchStr += prefGenreIds[i];
	}
	genreFetchStr += "&with_original_language=en";
	fetchStr = genreFetchStr;

	document.getElementById("divGenres").style.opacity = 0;
	document.getElementById("divGenres").style.position = "absolute";

	document.getElementById("divSQ").style.opacity = 1;
	document.getElementById("divSQ").style.position = "relative";

}

var chosenRatingLower = '';
var chosenRatingHigher = '';

function sqHandler(){
	if (document.getElementById("boolReleaseYearY").checked){
		fetchStr += "&primary_release_year=";
		fetchStr += document.getElementById("prefReleaseYear").value;
	}

	fetchStr += "&certification_country=GB";
	for (i=0; i<ageRatings.length; i++){
		if (document.getElementById(ageRatings[i]+"L").checked){
			chosenRatingLower = ageRatings[i];
		}
		if (document.getElementById(ageRatings[i]+"H").checked){
			chosenRatingHigher = ageRatings[i];
		}
	}
	fetchStr += "&certification.gte=" + chosenRatingLower;
	fetchStr += "&certification.lte=" + chosenRatingHigher;

	document.getElementById("divSQ").style.opacity = 0;
	document.getElementById("divSQ").style.position = "absolute";
	getResult();
}

/*fetch('https://api.themoviedb.org/3/movie/603/similar?language=en-US&page=1', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
*/

var resultId;

function getResult(){
	console.log(fetchStr);

	fetch(fetchStr, options)
	  .then(response => response.json())
	  .then(response => updateMovieList(response))
	  .catch(err => console.error(err));

		function updateMovieList(moviePromise){
			const movieList = moviePromise;
			console.log(movieList['results'][0]);

			//console.log("Most popular movie with these genres: " + movieList['results'][0]['title']);
			var out = "Most popular movie with these choices:<br>";
			var movie = movieList['results'][0];

			if (typeof(movie) == "undefined"){
				out = "<br><br>ERROR: NO FILM FOUND FOR THESE CHOICES"
				var exportButton = document.getElementById("exportJsonBtn");
				exportButton.parentNode.removeChild(exportButton);
				document.getElementById("similarBtn").style.opacity=0;
			}
			else {
				out += "<br>Title: " + movie['title'];
				out += "<br>Overview: " + movie['overview'];
				out += "<br>Release Date: " + movie['release_date'];

				resultGenres = [];
				for (i=0; i<genreIdDict.length; i++){
					for (j=0; j<movie['genre_ids'].length; j++){
						if (genreIdDict[i][0] == movie['genre_ids'][j]){
							resultGenres.push(genreIdDict[i][1]);
						}
					}
				}
				console.log(resultGenres);
				out += "<br>Genres: " + resultGenres[0];
				for (i=1; i<resultGenres.length; i++){
					out += ", " + resultGenres[i];
				}

				out += "<br>Average Rating:\t" + movie['vote_average'] + "/10 from " + movie['vote_count'] + " users."
				out += "<br><br><a href=\"https://themoviedb.org/movie/" + movie["id"] + "\"> TMDB LINK</a><br>"
				resultId = movie["id"];
			}

			document.getElementById("divGenres").style.opacity = 0;
			document.getElementById("divGenres").style.position = "absolute";
			document.getElementById("divSQ").style.opacity = 0;
			document.getElementById("divSQ").style.position = "absolute";
			document.getElementById("divResult").style.opacity = 1;
			document.getElementById("divResult").style.position = "relative";
			document.getElementById("pResult").innerHTML = out;
		}
}

function JsonExport(){
	if (document.getElementById("boolReleaseYearY").checked){
		var includeReleaseYear = true;
	}else{
		var includeReleaseYear = false;
	}
	var preferredReleaseYear = document.getElementById("prefReleaseYear").value;
	var jsonObject = {
		"PreferredGenreIds": prefGenreIds,
		"IncludeReleaseYear": includeReleaseYear,
		"PreferredReleaseYear": preferredReleaseYear,
		"ChosenRatingLower": chosenRatingLower,
		"ChosenRatingHigher": chosenRatingHigher
	};
/*	var jsonObjectString = JSON.stringify(jsonObject)
	var blob = new Blob([jsonObjectString],{
		type: "octet/stream"
	});
	var dlLink = document.createElement("a");
	dlLink.href = window.URL.createObjectURL(blob);
	dlLink.setAttribute("download", "userchoices.json");
	document.body.appendChild(dlLink);
	dlLink.click();
	document.body.removeChild(dlLink);*/
	localStorage.setItem("JsonObject", JSON.stringify(jsonObject));
	document.getElementById("exportJsonBtn").value = "Exported";
}

function JsonImport(){
	// *********************************** LOOK HERE DEAR GOD THIS IS KILLING ME ***************************
	var jsonObject = JSON.parse(localStorage.getItem("JsonObject"));
	console.log("JsonObject");
	console.log(jsonObject);
	fetchStr = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=";
	fetchStr += jsonObject["PreferredGenreIds"][0]
	for (i=1; i<jsonObject["PreferredGenreIds"].length; i++){
		fetchStr += '%2C';
		fetchStr += jsonObject["PreferredGenreIds"][i];
	}
	if (jsonObject["IncludeReleaseYear"]){
		fetchStr += "&primary_release_year=";
		fetchStr += jsonObject["PreferredReleaseYear"];
	}
	fetchStr += "&certification_country=GB";
	fetchStr += "&certification.gte=" + jsonObject["ChosenRatingLower"];
	fetchStr += "&certification.lte=" + jsonObject["ChosenRatingHigher"];
	getResult();
}

function FindSimilar(){
	var exportButton = document.getElementById("exportJsonBtn");
	if (exportButton){
		exportButton.parentNode.removeChild(exportButton);
	}
	var brBtn = document.getElementById("brBtn");
	if (brBtn){
		brBtn.parentNode.removeChild(brBtn);
	}
	console.log(resultId);
	fetchStr = "https://api.themoviedb.org/3/movie/" + resultId + "/similar?language=en-US&page=1'"

	fetch(fetchStr, options)
		.then(response => response.json())
		.then(response => updateMovieList(response))
		.catch(err => console.error(err));

	function updateMovieList(moviePromise){
		const movieList = moviePromise;
		console.log(movieList['results'][0]);

		var out = "Similar Movie:<br>";
		var movie = movieList['results'][0];

		if (typeof(movie) == "undefined"){
			out = "<br><br>ERROR: NO FILM FOUND FOR THESE CHOICES"
		}
		else {
			out += "<br>Title: " + movie['title'];
			out += "<br>Overview: " + movie['overview'];
			out += "<br>Release Date: " + movie['release_date'];

			resultGenres = [];
			for (i=0; i<genreIdDict.length; i++){
				for (j=0; j<movie['genre_ids'].length; j++){
					if (genreIdDict[i][0] == movie['genre_ids'][j]){
						resultGenres.push(genreIdDict[i][1]);
					}
				}
			}
			console.log(resultGenres);
			out += "<br>Genres: " + resultGenres[0];
			for (i=1; i<resultGenres.length; i++){
				out += ", " + resultGenres[i];
			}

			out += "<br>Average Rating:\t" + movie['vote_average'] + "/10 from " + movie['vote_count'] + " users."
			out += "<br><br><a href=\"https://themoviedb.org/movie/" + movie["id"] + "\"> TMDB LINK</a><br>"
			resultId = movie["id"];
		}

		document.getElementById("divGenres").style.opacity = 0;
		document.getElementById("divGenres").style.position = "absolute";
		document.getElementById("divSQ").style.opacity = 0;
		document.getElementById("divSQ").style.position = "absolute";
		document.getElementById("divResult").style.opacity = 1;
		document.getElementById("divResult").style.position = "relative";
		document.getElementById("pResult").innerHTML = out;
	}
}

document.getElementById("genreForm").addEventListener('submit', (event) => {
   event.preventDefault();
   genreHandler();
});

document.getElementById("sqForm").addEventListener('submit', (event) => {
   event.preventDefault();
   sqHandler();
});
