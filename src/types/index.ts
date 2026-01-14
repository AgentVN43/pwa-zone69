export interface Movie {
  _id?: string;
  id?: string; // fallback vì API có thể trả id hoặc _id
  title: string;
  poster: string;
  url: string; // URL redirect Ž` ¯Ÿ xem phim
  actressIds: string[]; // ho §úc actresses: Actress[]
}

export interface Actress {
  _id: string;
  name: string;
  avatar: string;
  movieCount?: number;
  movies?: Movie[]; // n §¨u API tr §œ kA"m
}
