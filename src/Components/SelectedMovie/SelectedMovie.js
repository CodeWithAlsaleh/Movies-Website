import './SelectedMovie.css';
import { useEffect, useState } from 'react';
import { Loader, Error } from '../Main/Main';
import StarRating from '../StarRating/StarRating';
import { fetchMovie } from '../../helper';

function SelectedMovie({ movieId, setActiveId, watched, setWatched }) {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const rated = watched.find(item => item.imdbID === movieId);

  /*
    Effects are not batched, React runs each useEffect independently
    (their callbacks execute in the order they are declared), and their
    cleanups run before the next run of that effect or on unmount.
  */
  useEffect(() => {
    const controller = new AbortController();

    fetchMovie(movieId, setIsLoading, setError, setMovie, controller.signal);

    return () => controller.abort();
  }, [movieId]);

  useEffect(() => {
    if (movie)
      document.title = `Movie | ${movie.Title}`;

    return () => document.title = 'usePopcorn';
  }, [movie]);

  const handleCloseMovie = function () {
    setActiveId('');
  };

  const handleBackBtn = function () {
    /*
      NOTE: We don't need this cuz the component will be removed
            from the Tree so it will lose it's state (unmount)
            
            
            => setMovie(null);
    */
    handleCloseMovie();
  };

  const handleAddMovie = function (rating) {
    const newMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: +movie.Runtime.split(' ').at(0) || 90, // 90 is the avg movie runtime
      imdbRating: +movie.imdbRating,
      userRating: rating,
    };

    handleCloseMovie();
    setWatched(prev => [...prev, newMovie]);
  };

  const handleKeyDown = function (e) {
    if (e.key !== 'Escape') return;

    handleCloseMovie();
  };

  /*
    In order to use onKeyDown on div [which is not focusable element]
    we should use tabIndex to make it work
  */
  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      {
        error ?
          (<Error>{error}</Error>)
          :
          (
            isLoading || !movie ?
              (<Loader>Loading...</Loader>)
              :
              (
                <Details movie={movie} onBack={handleBackBtn}
                  onAdd={handleAddMovie} rated={rated} />
              )
          )
      }
    </div>
  );
}

function Details({ movie, rated, onBack, onAdd }) {
  return (
    <div className='details'>
      <header>
        <button className='btn-back' onClick={onBack}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="back-svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>

        <img src={movie.Poster} alt={movie.Title} />

        <div className='details-overview'>
          <h2>{movie.Title}</h2>

          <p>
            {movie.Released}

            <span> &bull;</span>

            <span> {movie.Runtime}</span>
          </p>

          <p>
            {movie.Genre}
          </p>

          <p>
            <span>⭐️</span>

            {movie.imdbRating}
            <span> IMDb rating</span>
          </p>
        </div>
      </header>

      <section>
        {
          rated ?
            (
              <p className='rating'>
                You rated with movie {rated.userRating} ⭐️
              </p>
            )
            :
            (<StarRating length={10} onAdd={onAdd} />)
        }

        <em>{movie.Plot}</em>

        <p>Starring {movie.Actors}</p>

        <p>Directed by {movie.Director}</p>
      </section>
    </div>
  );
}

export default SelectedMovie;


/*
    useEffect(() => {
    const id = setTimeout(() => {
      fetchMovie(movieId, setIsLoading, setError, setMovie);
    }, (WAIT_SEC - 0.3) * 1000);

    return () => clearTimeout(id);
  }, [movieId]);
*/