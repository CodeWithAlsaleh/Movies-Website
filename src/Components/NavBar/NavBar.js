import { useEffect, useRef } from 'react';
import './NavBar.css';

function NavBar({ query, setQuery, numOfResults }) {
  return (
    <nav className="nav-bar">
      <Logo />

      <Search query={query} setQuery={setQuery} />

      <NumResults numOfResults={numOfResults} />
    </nav >
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>

      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  /*
    NOTE: To select DOM ele using Ref we should follow 3 steps:

    1. Creating the Ref using useRef hook
    2. Add ref={ele} prop to the element that we want to select
    3. Using it inside useEffect hook (don't use it in the render logic)
  */
  const searchBar = useRef(null);

  /*
    We need to use an effect in order to use a ref that
    contains a DOM element like this one because the ref
    only gets added to this DOM element here after the DOM
    has already loaded. And so therefore we can only access
    it in effect which also runs after the DOM has been loaded.
  */

  useEffect(() => {
    searchBar.current.focus();
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={searchBar}
    />
  );
}

function NumResults({ numOfResults }) {
  return (
    <p className="num-results">
      Found <strong>{numOfResults}</strong> results
    </p>
  );
}

export default NavBar;
