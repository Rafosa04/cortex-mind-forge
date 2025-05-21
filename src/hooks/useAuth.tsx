import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  createTestUser: () => Promise<{ error: any, user: any, email: string, password: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para limpar estado de autenticação
  const cleanupAuthState = () => {
    // Remover tokens padrão de autenticação
    localStorage.removeItem('supabase.auth.token');
    // Remover todas as chaves de autenticação do Supabase do localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remover do sessionStorage se estiver em uso
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Função para buscar perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  // Atualizar perfil
  const refreshProfile = async () => {
    if (!user) return;
    
    const profile = await fetchProfile(user.id);
    setProfile(profile);
  };

  useEffect(() => {
    // Configurar listener de alteração de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Usar setTimeout para evitar deadlocks
          setTimeout(async () => {
            const profile = await fetchProfile(currentSession.user.id);
            setProfile(profile);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(profile => {
          setProfile(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const signIn = async (email: string, password: string) => {
    try {
      // Limpar estado de autenticação existente
      cleanupAuthState();
      
      // Tentar desconectar globalmente
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar mesmo se isso falhar
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta ao CÓRTEX!",
      });

      // Forçar reload da página para estado limpo
      window.location.href = '/';
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Cadastro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Limpar estado de autenticação existente
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return { error, user: null };
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao CÓRTEX!",
      });

      return { error: null, user: data.user };
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta",
        variant: "destructive",
      });
      return { error, user: null };
    }
  };

  // Criar usuário de teste com acesso total
  const createTestUser = async () => {
    try {
      // Gerar email e senha aleatórios para o usuário de teste
      const randomString = Math.random().toString(36).substring(2, 10);
      const email = `test_${randomString}@cortex-test.com`;
      const password = `Test${randomString}!`;
      const name = "Usuário de Teste";
      
      // Limpar estado de autenticação existente
      cleanupAuthState();
      
      // Criar usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        toast({
          title: "Erro ao criar usuário de teste",
          description: error.message,
          variant: "destructive",
        });
        return { error, user: null, email: "", password: "" };
      }

      if (!data.user) {
        toast({
          title: "Erro ao criar usuário de teste",
          description: "Não foi possível criar o usuário",
          variant: "destructive",
        });
        return { error: new Error("Não foi possível criar o usuário"), user: null, email: "", password: "" };
      }
      
      // Atualizar o perfil para ser admin
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error("Erro ao atualizar perfil para admin:", profileError);
        }
      }

      toast({
        title: "Usuário de teste criado com sucesso!",
        description: `Email: ${email} | Senha: ${password}`,
      });

      return { error: null, user: data.user, email, password };
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário de teste",
        description: error.message || "Ocorreu um erro ao tentar criar o usuário de teste",
        variant: "destructive",
      });
      return { error, user: null, email: "", password: "" };
    }
  };

  // Logout
  const signOut = async () => {
    try {
      // Limpar estado de autenticação
      cleanupAuthState();
      
      // Tentar desconectar globalmente
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Até breve!",
      });
      
      // Forçar reload da página para estado limpo
      window.location.href = '/login';
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao tentar fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        createTestUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
