
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

interface Post {
  id: string;
  content: string;
  platform: string | null;
  prompt: string | null;
  created_at: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de posts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (content: string, platform?: string, prompt?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_posts')
        .insert({
          user_id: user.id,
          content,
          platform,
          prompt
        });

      if (error) throw error;

      toast({
        title: "Post salvo!",
        description: "Seu post foi salvo no histórico.",
      });

      // Recarregar posts
      fetchPosts();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o post.",
        variant: "destructive"
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('generated_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post excluído",
        description: "Post removido do histórico.",
      });

      // Recarregar posts
      fetchPosts();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    savePost,
    deletePost,
    refreshPosts: fetchPosts
  };
};
