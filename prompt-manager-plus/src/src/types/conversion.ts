
export interface Conversion {
  id: string;
  url: string;
  format: 'mp3' | 'mp4';
  status: 'pending' | 'processing' | 'completed' | 'error';
  title?: string;
  duration?: string;
  file_size?: string;
  output_url?: string;
  error_message?: string;
  created_at: string;
}

export interface ConversionRequest {
  url: string;
  format: 'mp3' | 'mp4';
}

export interface ConversionProgress {
  id: string;
  progress: number;
  status: string;
  message?: string;
}
