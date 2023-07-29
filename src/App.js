import { Children, useEffect, useState } from "react";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
function App() {
  return (
    <div className="relative bg-slate-600 h-content">
      <Navbar />
      <Main>
        <Box>
          <MovieList />
        </Box>
        <Box />
      </Main>
    </div>
  );
}

function Main({ children }) {
  return (
    <div className=" bg-slate-600 pt-4 text-center h-screen w-screen flex flex-row gap-14 justify-center">
      {children}
    </div>
  );
}

function Navbar() {
  return (
    <div className="mt-6 rounded-2xl h-20 w-[95%] m-auto   grid grid-cols-3 bg-rose-900 items-center shadow-4xl px-36">
      <Logo>Movify</Logo>
      <Search />
      <Results />
    </div>
  );
}

function Logo({ children }) {
  return (
    <div className="items-center logo-container flex flex-row ">
      <span className="justify-self-end text-5xl mb-5"> &#x1F4F7;</span>
      <span className="text-4xl text-white font-semibold italic">
        {children}
      </span>
    </div>
  );
}
function Results() {
  return (
    <p className="text-xl text-white justify-self-end font-bold">
      3 Results Found
    </p>
  );
}
function Search() {
  return (
    <input
      className=" text-xl text-white p-3 shadow-2xl bg-rose-500 focus:outline-none focus:border-2 focus:bg-slate-300 focus:text-black focus:ring rounded-2xl justify-self-center border-black border-1"
      placeholder="Search Movies...."
      type="text"
    />
  );
}

function Box({ children }) {
  return (
    <div className="w-1/3 h-4/5 bg-slate-400 mt-10 rounded-2xl">{children}</div>
  );
}

function MovieList() {
  const [movies, setMovies] = useState(tempMovieData);
  return (
    <ul className="list-none overflow-auto h-full ">
      {movies.map((movie) => (
        <Movie movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li className="flex flex-row px-5 py-5 gap-4 hover:bg-rose-700 hover:cursor-pointer">
      <img
        className="w-24 h-24"
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <div className="flex flex-col">
        <h3 className="text-dark  text-3xl">{movie.Title}</h3>
        <h4 className="italic text-2xl">({movie.Year})</h4>
      </div>
    </li>
  );
}

export default App;
