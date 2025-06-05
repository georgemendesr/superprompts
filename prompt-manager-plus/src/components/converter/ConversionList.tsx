
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Trash2, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useConversions } from '@/hooks/useConversions';
import { Conversion } from '@/types/conversion';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'processing':
      return <Loader className="w-4 h-4 animate-spin" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'error':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Aguardando';
    case 'processing':
      return 'Processando';
    case 'completed':
      return 'Concluído';
    case 'error':
      return 'Erro';
    default:
      return 'Desconhecido';
  }
};

interface ConversionItemProps {
  conversion: Conversion;
  onDelete: (id: string) => void;
}

const ConversionItem: React.FC<ConversionItemProps> = ({ conversion, onDelete }) => {
  const handleDownload = () => {
    if (conversion.output_url) {
      window.open(conversion.output_url, '_blank');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={getStatusColor(conversion.status || 'pending')}
              >
                {getStatusIcon(conversion.status || 'pending')}
                <span className="ml-1">{getStatusLabel(conversion.status || 'pending')}</span>
              </Badge>
              <Badge variant="secondary">
                {conversion.format.toUpperCase()}
              </Badge>
            </div>
            
            <h3 className="font-medium text-sm mb-1 truncate">
              {conversion.title || 'Processando...'}
            </h3>
            
            <p className="text-xs text-muted-foreground truncate mb-2">
              {conversion.url}
            </p>
            
            {conversion.status === 'processing' && (
              <Progress value={65} className="w-full h-2 mb-2" />
            )}
            
            {conversion.status === 'completed' && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {conversion.duration && (
                  <span>Duração: {conversion.duration}</span>
                )}
                {conversion.file_size && (
                  <span>Tamanho: {conversion.file_size}</span>
                )}
              </div>
            )}
            
            {conversion.status === 'error' && conversion.error_message && (
              <p className="text-xs text-red-600 mt-1">
                {conversion.error_message}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {conversion.status === 'completed' && conversion.output_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hover:bg-green-50"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(conversion.id)}
              className="hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ConversionList: React.FC = () => {
  const { conversions, isLoading, deleteConversion } = useConversions();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader className="w-6 h-6 animate-spin mr-2" />
            Carregando conversões...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conversions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Nenhuma conversão encontrada. Adicione uma URL acima para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-lg">
          Conversões ({conversions.length})
        </CardTitle>
      </CardHeader>
      
      <div className="space-y-3">
        {conversions.map((conversion) => (
          <ConversionItem
            key={conversion.id}
            conversion={conversion}
            onDelete={deleteConversion}
          />
        ))}
      </div>
    </div>
  );
};
