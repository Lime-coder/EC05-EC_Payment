// Mock movies. Replace with backend API call later.
export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  poster: string;
}

export const mockMovies: Movie[] = [
  { id: "m1", title: "Dune: Part Three", genre: "Sci-Fi", duration: "2h 45m", poster: "🏜️" },
  { id: "m2", title: "The Batman Returns", genre: "Action", duration: "2h 30m", poster: "🦇" },
  { id: "m3", title: "Inside Out 3", genre: "Animation", duration: "1h 50m", poster: "🎭" },
  { id: "m4", title: "Mission: Impossible 8", genre: "Action", duration: "2h 35m", poster: "💥" },
  { id: "m5", title: "Avatar: Fire and Ash", genre: "Sci-Fi", duration: "3h 10m", poster: "🌊" },
  { id: "m6", title: "Spider-Man: Beyond", genre: "Action", duration: "2h 20m", poster: "🕷️" },
  { id: "m7", title: "The Conjuring: Last Rites", genre: "Horror", duration: "1h 55m", poster: "👻" },
  { id: "m8", title: "Wicked: Part Two", genre: "Musical", duration: "2h 40m", poster: "🧙" },
];
