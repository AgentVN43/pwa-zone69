export interface Movie {
  _id?: string;
  id?: string; // fallback vì API có thể trả id hoặc _id
  title: string;
  poster: string;
  url: string; // URL redirect để xem phim
  actressIds: string[]; // hoặc actresses: Actress[]
}

export interface Actress {
  _id: string;
  id?: string; // fallback
  name: string;
  avatar: string;
  movieCount?: number;
  votes?: number; // số lượt vote
  updatedAt?: string; // ISO date
  movies?: Movie[]; // nếu API trả kèm
}
