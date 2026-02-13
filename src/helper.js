import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;
const TIME_OUT_SEC = 10;
const WAIT_SEC = 0.5;

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt1375661",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133092",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751663",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt1375664",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133095",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751666",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) => arr.reduce((acc, cur) => acc + cur, 0) / (arr.length || 1);

const timeout = function () {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${TIME_OUT_SEC} seconds`));
    }, TIME_OUT_SEC * 1000);
  });
};

const fetchData = async function (url, setIsLoading, setError, setData,
  errorMessage, isList, signal) {
  try {
    // Loading
    setIsLoading(true);

    // Set Error to nothing at the beginning
    setError(''); // REVIEW: if this works fine or not

    /*
      When a request got canceled JS will see it as Error
      so we need to handle that in the catch block using
      something like 'if (err.name === 'AbortError') return'
    */
    const res = await Promise.race(
      [
        fetch(url, { signal }),
        timeout()
      ]
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (data.Response === 'False') throw new Error(errorMessage);

    isList ? setData(data.Search) : setData(data);
  }
  catch (err) {
    // We won't throw err if it was AbortError
    if (err.name === 'AbortError')
      return;

    // When an error occur we have to setMovies
    // to [] in case we are loding moviesList
    if (isList)
      setData([]);

    if (err.name === 'TypeError')
      setError('⛔️ Internet disconnected or network error');
    else
      setError(err.message);
  }
  finally {
    setIsLoading(false);
  }
};

const fetchMoviesList = async function (title, setIsLoading, setError,
  setMovies, signal) {
  fetchData(`${API_URL}s=${title}`, setIsLoading, setError, setMovies, '⛔️ Movie not found', true, signal)
};

const fetchMovie = async function (movieId, setIsLoading, setError,
  setMovie, signal) {
  fetchData(`${API_URL}i=${movieId}`, setIsLoading, setError, setMovie, '⛔️ Fetching Error', false, signal)
};

const getFromLocalStorage = function (key) {
  return JSON.parse(localStorage.getItem(key));
};

const setToLocalStorage = function (key, data) {
  localStorage.setItem(key, JSON.stringify(data));
};

const useFetchMovies = function (query) {
  const [error, setError] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /*
    IMPORTANT:

      Jonas said that since this is just play role more like event listener
      so we can convert it from useEffect to regular event handler
  */
  useEffect(() => {
    // It's a native browser API which has nothing to do with React
    const controller = new AbortController();

    if (!query.trim()) {
      setError('');
      setMovies([]);
      return;
    }

    /*
      In order to connect the abort controller with the fetch function
      we pass in a second argument where we define an object with the
      signal property. And so there we pass in 'controller.signal'.
      
      So it's not really important to understand exactly how this abort
      controller works. This is basically just following a recipe.
    */
    const id = setTimeout(() => {
      fetchMoviesList(query, setIsLoading, setError, setMovies, controller.signal);
    }, WAIT_SEC * 1000);

    return () => {
      controller.abort();
      clearTimeout(id);
    };
  }, [query]);

  return { movies, error, isLoading };
};

const useLocalStorageState = function (key, initialVal) {
  const [state, setState] = useState(getFromLocalStorage(key) || initialVal);

  // It's better to use useEffect
  useEffect(() => {
    setToLocalStorage(key, state);
  }, [key, state]);

  return [state, setState];
};

export { useFetchMovies, useLocalStorageState, fetchMovie, average, getFromLocalStorage, setToLocalStorage, WAIT_SEC };