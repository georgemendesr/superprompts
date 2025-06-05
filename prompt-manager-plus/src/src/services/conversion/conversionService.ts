
import { supabase } from '@/integrations/supabase/client';
import { Conversion, ConversionRequest } from '@/types/conversion';

export class ConversionService {
  static async createConversion(request: ConversionRequest): Promise<Conversion> {
    try {
      const { data, error } = await supabase
        .from('conversions')
        .insert({
          url: request.url,
          format: request.format,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar conversão:', error);
      throw error;
    }
  }

  static async getConversions(): Promise<Conversion[]> {
    try {
      const { data, error } = await supabase
        .from('conversions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar conversões:', error);
      throw error;
    }
  }

  static async updateConversionStatus(
    id: string, 
    status: string, 
    updates?: Partial<Conversion>
  ): Promise<Conversion> {
    try {
      const { data, error } = await supabase
        .from('conversions')
        .update({ status, ...updates })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status da conversão:', error);
      throw error;
    }
  }

  static async deleteConversion(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar conversão:', error);
      throw error;
    }
  }

  // Simula o processo de conversão (para demonstração)
  static async simulateConversion(id: string): Promise<void> {
    try {
      // Atualiza para "processing"
      await this.updateConversionStatus(id, 'processing');

      // Simula tempo de processamento
      setTimeout(async () => {
        try {
          // Simula sucesso da conversão
          await this.updateConversionStatus(id, 'completed', {
            title: 'Vídeo Convertido',
            duration: '3:45',
            file_size: '8.2 MB',
            output_url: 'https://example.com/converted-file.mp3'
          });
        } catch (error) {
          // Em caso de erro, atualiza o status
          await this.updateConversionStatus(id, 'error', {
            error_message: 'Erro durante a conversão'
          });
        }
      }, 3000); // 3 segundos de simulação
    } catch (error) {
      console.error('Erro na simulação de conversão:', error);
      throw error;
    }
  }
}
