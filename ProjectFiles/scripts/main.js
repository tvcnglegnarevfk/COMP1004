//look here to get movie by filters
//https://developer.themoviedb.org/reference/discover-movie
//https://api.themoviedb.org/3/movie/{movie_id}/similar
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
	for (i=0; i<ratingArray.length; i++){
		ageRatings.push(ratingArray[i]["certification"]);
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

function genreHandler(){
	let genreList = document.getElementById("prefGenre").value.replace(" ","").split(",");
	document.getElementById("prefGenre").value="";
	let prefGenreIds = []
	for (i=0; i<genreIdDict.length; i++){
		for (j=0; j<genreList.length; j++){
			if (genreIdDict[i][1].toUpperCase().replace(" ","")==genreList[j].toUpperCase()){
				prefGenreIds.push(genreIdDict[i][0]);
			}
		}
	}
	console.log(prefGenreIds);

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

function sqHandler(){
	fetchStr += "&primary_release_year=";
	fetchStr += document.getElementById("prefReleaseYear").value;

	fetchStr += "&certification_country=GB";
	var chosenRatingLower = '';
	var chosenRatingHigher = ''
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
			var out = "Most popular movie with these genres:<br>";
			var movie = movieList['results'][0];
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
