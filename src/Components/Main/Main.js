import './Main.css';
import Summary from '../Summary/Summary';
import { useState } from 'react';
import ResultList from '../ResultList/ResultList';
import WatchedList from '../WatchedList/WatchedList';
import SelectedMovie from '../SelectedMovie/SelectedMovie';
import { useLocalStorageState } from '../../helper';


function Main({ movies, error, isLoading }) {
  const [activeId, setActiveId] = useState('');
  const hasMovie = movies.find(movie => movie.imdbID === activeId);
  const [watched, setWatched] = useLocalStorageState('watchedMovies', []);

  if (activeId && !hasMovie)
    setActiveId('');

  return (
    <main className="main">
      <Box>
        {
          error ?
            (<Error>{error}</Error>)
            :
            (
              isLoading ?
                (<Loader>Loading...</Loader>)
                :
                (<ResultList movies={movies} setActive={setActiveId} />)
            )
        }
      </Box>

      {
        activeId ?
          (
            <Box>
              <SelectedMovie movieId={activeId} setActiveId={setActiveId}
                watched={watched} setWatched={setWatched} />
            </Box>
          )
          :
          (
            <Box>
              <Summary watched={watched} />

              <WatchedList watched={watched} setWatched={setWatched} />
            </Box>
          )
      }
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button isOpen={isOpen} onClick={setIsOpen} />

      {isOpen && children}
    </div>
  );
}

function Loader({ children }) {
  return (
    <div className='loader'>
      {children}
    </div>
  );
}

function Error({ children }) {
  return (
    <div className='error'>
      {children}
    </div>
  );
}

function Button({ isOpen, onClick }) {
  return (
    <button
      className="btn-toggle"
      onClick={() => onClick(open => !open)}
    >
      {
        isOpen ?
          (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          )
          :
          (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )
      }
    </button>
  );
}

export default Main;

export { Loader, Error };