
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, deletePost } = usePosts();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao gerador
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Seus posts salvos</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {postsLoading ? (
          <div className="text-center py-8">
            <div className="text-lg">Carregando posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum post salvo ainda
              </h3>
              <p className="text-gray-600 mb-4">
                Vá para o gerador e comece a criar posts para vê-los aqui.
              </p>
              <Link to="/">
                <Button>Criar primeiro post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium text-purple-600">
                      {post.platform || 'Post'}
                    </CardTitle>
                    <Button
                      onClick={() => deletePost(post.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 h-auto p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Conteúdo:
                      </h4>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded text-wrap break-words">
                        {post.content}
                      </p>
                    </div>
                    {post.prompt && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Prompt usado:
                        </h4>
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {post.prompt}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
