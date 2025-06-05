
export interface Lyric {
  id: string;
  title: string;
  artist?: string | null;
  content: string;
  tags?: string[] | null;
  created_at: string;
}
