import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const handleClick = (movie) => {  
    console.log(movie);
    console.log(trailerUrl);
    if(trailerUrl){
      setTrailerUrl("");
    }
    else
    {
      movieTrailer(movie?.name || "Scarface")
      .then(url => {
        console.log(url);
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl( urlParams.get('v'));
        console.log(trailerUrl);
      })
      .catch(error => console.log("ERROR: " + error));
    }

  };

  //a snippet of code that runs based on a variable or condition
  useEffect(() => {
    // if [] is blank, run once when the row loads, and don't run it again
    // if pass in variables, it will run once, then everytime when it loads
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      setTrailerUrl()
      return request;
    }
    fetchData();
    //fetchURL is a dependency in use effect, this will allow it to re-ender the use effect
  }, [fetchUrl]);

  //console.log(movies);

  const opts = {
    height:'390',
    width:'100%',
    playerVars:{
      //url,
      autoplay:1
    },
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
      </div>
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}  /> }
    </div>
  );
}

export default Row;
