import './Summary.css';
import { average } from '../../helper';
import StatisticItem from '../StatisticItem/StatisticItem';

function Summary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>

      <div>
        <StatisticItem>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </StatisticItem>

        <StatisticItem>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </StatisticItem>

        <StatisticItem>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </StatisticItem>

        <StatisticItem>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </StatisticItem>
      </div>
    </div>
  );
}

export default Summary;