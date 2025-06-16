import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Share, Sparkles, RefreshCw, Copy, Heart, LogIn, UserPlus, User, LogOut, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';

interface FormData {
  tipoPost: string;
  tom: string;
  produto: string;
  evento: string;
  dataLimite: string;
  link: string;
}

const Index = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { savePost } = usePosts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    tipoPost: '',
    tom: '',
    produto: '',
    evento: '',
    dataLimite: '',
    link: ''
  });
  const [textoGerado, setTextoGerado] = useState('');
  const [textoRevisado, setTextoRevisado] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevising, setIsRevising] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const generatePost = async () => {
    if (!formData.tipoPost || !formData.tom) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione o tipo de post e o tom de voz.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulação de geração de post (substitua pela integração com API)
    setTimeout(async () => {
      let post = '';
      
      switch (formData.tipoPost) {
        case 'promoção':
          post = formData.tom === 'descontraído' 
            ? `🔥 PROMOÇÃO IMPERDÍVEL! 🔥\n\n${formData.produto ? `Nosso ${formData.produto}` : 'Produto incrível'} está com desconto especial! 🎉\n\n${formData.dataLimite ? `⏰ Apenas até ${formData.dataLimite}` : '⏰ Por tempo limitado'}\n\nNão deixe essa oportunidade passar! 💫\n\n#promoção #oferta #desconto`
            : `Oferta Especial Disponível\n\n${formData.produto ? `${formData.produto}` : 'Produto selecionado'} com condições especiais.\n\n${formData.dataLimite ? `Válido até ${formData.dataLimite}.` : 'Oferta por tempo limitado.'}\n\nAproveite esta oportunidade única.\n\n#oferta #promoção #qualidade`;
          break;
        case 'notícia':
          post = formData.tom === 'descontraído'
            ? `📰 NOVIDADES CHEGANDO! 📰\n\n${formData.evento ? `${formData.evento}` : 'Algo incrível está acontecendo'} e queremos compartilhar com vocês! 🎊\n\n${formData.link ? `Saiba mais: ${formData.link}` : 'Em breve mais detalhes!'}\n\nFiquem ligados! ✨\n\n#novidades #news #acontecendo`
            : `Comunicado Oficial\n\n${formData.evento ? `${formData.evento}` : 'Informação importante para compartilhar.'}\n\n${formData.link ? `Mais informações: ${formData.link}` : 'Detalhes em breve.'}\n\nAcompanhem nossas atualizações.\n\n#comunicado #informação #oficial`;
          break;
        case 'evento':
          post = formData.tom === 'descontraído'
            ? `🎉 EVENTO IMPERDÍVEL! 🎉\n\n${formData.evento ? `${formData.evento}` : 'Evento incrível'} está chegando e vocês estão convidados! 🎊\n\n${formData.dataLimite ? `📅 Data: ${formData.dataLimite}` : '📅 Em breve a data!'}\n\nVem com a gente! 🚀\n\n#evento #convite #diversão`
            : `Convite para Evento\n\n${formData.evento ? `${formData.evento}` : 'Evento especial'} - sua presença é importante.\n\n${formData.dataLimite ? `Data: ${formData.dataLimite}` : 'Data a ser confirmada.'}\n\nContamos com sua participação.\n\n#evento #convite #participação`;
          break;
      }
      
      setTextoGerado(post);
      setIsGenerating(false);
      
      // Salvar o post no banco de dados se o usuário estiver logado
      if (user) {
        const prompt = `Tipo: ${formData.tipoPost}, Tom: ${formData.tom}${formData.produto ? `, Produto: ${formData.produto}` : ''}${formData.evento ? `, Evento: ${formData.evento}` : ''}${formData.dataLimite ? `, Data: ${formData.dataLimite}` : ''}${formData.link ? `, Link: ${formData.link}` : ''}`;
        await savePost(post, formData.tipoPost, prompt);
      }
      
      toast({
        title: "Post gerado com sucesso!",
        description: user ? "Seu post foi criado e salvo no histórico." : "Seu post foi criado. Faça login para salvar no histórico.",
      });
    }, 2000);
  };

  const revisarTexto = async () => {
    if (!textoGerado) {
      toast({
        title: "Nenhum texto para revisar",
        description: "Gere um post primeiro para poder revisá-lo.",
        variant: "destructive"
      });
      return;
    }

    setIsRevising(true);
    
    // Simulação de revisão (substitua pela integração com API)
    setTimeout(() => {
      const revisado = textoGerado + '\n\n✨ Texto revisado e otimizado para melhor engajamento!';
      setTextoRevisado(revisado);
      setIsRevising(false);
      
      toast({
        title: "Texto revisado!",
        description: "Seu post foi revisado e otimizado.",
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  const shouldShowField = (field: string) => {
    switch (field) {
      case 'produto':
        return formData.tipoPost === 'promoção';
      case 'evento':
        return formData.tipoPost === 'notícia' || formData.tipoPost === 'evento';
      case 'dataLimite':
        return formData.tipoPost === 'promoção' || formData.tipoPost === 'evento';
      case 'link':
        return formData.tipoPost === 'notícia';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Logos */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <img 
              src="/lovable-uploads/d19aa7ad-be3e-46d2-8d8a-9d19ef9c9e32.png" 
              alt="Logo 1" 
              className="h-16 w-auto"
            />
            <img 
              src="/lovable-uploads/17b1d5b4-caaf-4167-8f85-80cca2102ee1.png" 
              alt="Eficaz Marketing e Tecnologia" 
              className="h-16 w-auto"
            />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Share className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gerador de Posts
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-6">
            Crie posts incríveis para suas redes sociais em segundos
          </p>
          
          {/* Login/Register buttons ou User info */}
          {user ? (
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">
                  Bem-vindo, {user.user_metadata?.name || user.email?.split('@')[0]}!
                </span>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" className="h-10 px-6">
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="h-10 px-6 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Link to="/auth">
                <Button variant="outline" className="h-10 px-6">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Configurações do Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipoPost" className="text-sm font-medium">
                  Tipo de Post *
                </Label>
                <Select onValueChange={(value) => handleInputChange('tipoPost', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promoção">🔥 Promoção</SelectItem>
                    <SelectItem value="notícia">📰 Notícia</SelectItem>
                    <SelectItem value="evento">🎉 Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tom" className="text-sm font-medium">
                  Tom de Voz *
                </Label>
                <Select onValueChange={(value) => handleInputChange('tom', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="descontraído">😊 Descontraído</SelectItem>
                    <SelectItem value="formal">👔 Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {shouldShowField('produto') && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="produto" className="text-sm font-medium">
                    Produto
                  </Label>
                  <Input
                    id="produto"
                    placeholder="Nome do produto em promoção"
                    className="h-12"
                    value={formData.produto}
                    onChange={(e) => handleInputChange('produto', e.target.value)}
                  />
                </div>
              )}

              {shouldShowField('evento') && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="evento" className="text-sm font-medium">
                    {formData.tipoPost === 'evento' ? 'Nome do Evento' : 'Notícia/Evento'}
                  </Label>
                  <Input
                    id="evento"
                    placeholder={formData.tipoPost === 'evento' ? 'Digite o nome do evento' : 'Descreva a notícia/evento'}
                    className="h-12"
                    value={formData.evento}
                    onChange={(e) => handleInputChange('evento', e.target.value)}
                  />
                </div>
              )}

              {shouldShowField('dataLimite') && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="dataLimite" className="text-sm font-medium">
                    {formData.tipoPost === 'evento' ? 'Data do Evento' : 'Data Limite'}
                  </Label>
                  <Input
                    id="dataLimite"
                    placeholder="Ex: 31/12/2024"
                    className="h-12"
                    value={formData.dataLimite}
                    onChange={(e) => handleInputChange('dataLimite', e.target.value)}
                  />
                </div>
              )}

              {shouldShowField('link') && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="link" className="text-sm font-medium">
                    Link da Notícia
                  </Label>
                  <Input
                    id="link"
                    placeholder="https://exemplo.com"
                    className="h-12"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                  />
                </div>
              )}

              <Button 
                onClick={generatePost}
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Gerando Post...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resultados */}
          <div className="space-y-6">
            {/* Texto Gerado */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Texto Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                {textoGerado ? (
                  <div className="space-y-4">
                    <Textarea
                      value={textoGerado}
                      readOnly
                      className="min-h-[200px] resize-none border-0 bg-gray-50 text-sm leading-relaxed"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(textoGerado)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        onClick={revisarTexto}
                        disabled={isRevising}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isRevising ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Revisando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Revisar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Share className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Seu post aparecerá aqui após a geração</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Texto Revisado */}
            {textoRevisado && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-green-800">Texto Revisado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={textoRevisado}
                      readOnly
                      className="min-h-[200px] resize-none border-0 bg-white/70 text-sm leading-relaxed"
                    />
                    <Button
                      onClick={() => copyToClipboard(textoRevisado)}
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Texto Revisado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">
              Desenvolvido com carinho | Projeto de Geração de Conteúdo
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
