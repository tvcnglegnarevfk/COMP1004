//look here to get movie by filters
//https://developer.themoviedb.org/reference/discover-movie
//https://api.themoviedb.org/3/movie/{movie_id}/similar

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTNkYTlkODlkYjgwN2RkODRlY2RkM2EwZjhmNGNhNSIsInN1YiI6IjY1NjViMGUwYzJiOWRmMDEwMDRjMDJmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nDeiMsZTtS8-A89VNgFQLtddwPXc5hcFDT-ipiNsRJc'
	}
};

fetch('https://api.themoviedb.org/3/authentication', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));


fetch('https://api.themoviedb.org/3/genre/movie/list', options)
	.then(response => response.json())
	.then(response => UpdateGenres(response))
	.catch(err => console.error(err));


function UpdateGenres(genrePromise){
	const genreList = genrePromise['genres'];
	document.getElementById('ulGenres').innerHTML = ''
	for (i = 0; i < genreList.length; i++){
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(genreList[i]['name']));
		document.getElementById("ulGenres").appendChild(li);
	}
}


fetch('https://api.themoviedb.org/3/movie/603/similar?language=en-US&page=1', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
