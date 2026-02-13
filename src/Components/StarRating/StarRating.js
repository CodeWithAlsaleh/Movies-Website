import './StarRating.css';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/*
  If we really care about the type of props
  we should use TypeScript instead of this

  NOTE:
  
    I don't know why this library doesn't work
    (it works but not in the same way as jonas video)
*/
StarRating.propTypes = {
  length: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  // color: PropTypes.string.isRequired,
};


function StarRating({ length = 10, color = '#fcc419', defaultRating = 0, onAdd }) {
  const [curStar, setCurStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(defaultRating);
  const stars = Array.from({ length }, (_, i) => i + 1);
  const counter = useRef(0);

  const handleAdd = function () {
    onAdd(selectedStar);
  };

  // We are not allowed to mutate Refs in render logic so we need to use useEffect
  useEffect(() => {
    /*
      => To count how many times the user select diff star

      NOTE: We need to use value that persist on rendering

      Now this will work only cuz [defaultRating = 0]
    */
    if (selectedStar)
      counter.current++;

  }, [selectedStar]);

  return (
    <div className='rating'>
      <StarList>
        {
          stars.map(ele =>
            <Star
              id={ele}
              key={ele}
              cur={curStar}
              color={color}
              onHover={setCurStar}
              selected={selectedStar}
              onClick={setSelectedStar}
            >
            </Star>
          )
        }
      </StarList>

      <p style={{ color }}>
        {curStar || selectedStar || ''}
      </p>

      {selectedStar > 0 && <AddBtn onAdd={handleAdd} />}
    </div>
  );
}

function StarList({ children }) {
  return (
    <ul className='stars'>
      {children}
    </ul>
  );
}

function Star({ id, cur, color, selected, onHover, onClick }) {
  const isActive = cur ? id <= cur : id <= selected;

  return (
    <li
      id={id}
      role="button"
      onClick={() => onClick(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(0)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill={isActive ? `${color}` : 'none'} stroke={color} className='star'>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="{2}"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </li>
  );
}

function AddBtn({ onAdd }) {
  return (
    <button className='btn-add' onClick={onAdd}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="plus-sign"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>

      <span>Add to list</span>
    </button >
  );
}

export default StarRating;
