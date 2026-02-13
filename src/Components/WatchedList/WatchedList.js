import './WatchedList.css';
import StatisticItem from '../StatisticItem/StatisticItem';

function WatchedList({ watched, setWatched }) {
  const handleDelete = function (id) {
    setWatched(prev => prev.filter(movie => movie.imdbID !== id));
  };

  return (
    <ul className="list">
      {
        watched.map(movie => (
          <WatchedMovie movie={movie} onDelete={handleDelete} key={movie.imdbID} />
        ))
      }
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />

      <h3>{movie.Title}</h3>

      <div>
        <StatisticItem>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </StatisticItem>

        <StatisticItem>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </StatisticItem>

        <StatisticItem>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </StatisticItem>

        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

export default WatchedList;