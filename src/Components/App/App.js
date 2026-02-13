import Main from "../Main/Main";
import { useState } from "react";
import NavBar from "../NavBar/NavBar";
import { useFetchMovies } from '../../helper';

export default function App() {
  const [query, setQuery] = useState('');
  const { movies, error, isLoading } = useFetchMovies(query);

  return (
    <div className="app">
      <NavBar query={query} setQuery={setQuery} numOfResults={movies.length} />

      <Main movies={movies} error={error} isLoading={isLoading} />
    </div>
  );
}
