import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserPlus, 
  MessageCircle, 
  Eye, 
  Copy, 
  Share2,
  Heart
} from 'lucide-react';

interface QuickActionsProps {
  onFollowToggle?: () => void;
  onMessage?: () => void;
  onSilentFollow?: () => void;
  onCloneBrains?: () => void;
  onShare?: () => void;
  isFollowing?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onFollowToggle,
  onMessage,
  onSilentFollow,
  onCloneBrains,
  onShare,
  isFollowing = false
}) => {
  const actions = [
    {
      id: 'follow',
      icon: isFollowing ? Heart : UserPlus,
      label: isFollowing ? 'Seguindo' : 'Seguir',
      onClick: onFollowToggle,
      variant: (isFollowing ? 'default' : 'outline') as 'default' | 'outline',
      className: isFollowing ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
    },
    {
      id: 'message',
      icon: MessageCircle,
      label: 'Mensagem',
      onClick: onMessage,
      variant: 'outline' as const,
      className: 'border-blue-500/50 text-blue-400 hover:bg-blue-500/10'
    },
    {
      id: 'silent-follow',
      icon: Eye,
      label: 'Seguir Evolução',
      onClick: onSilentFollow,
      variant: 'outline' as const,
      className: 'border-green-500/50 text-green-400 hover:bg-green-500/10'
    },
    {
      id: 'clone',
      icon: Copy,
      label: 'Clonar Subcérebros',
      onClick: onCloneBrains,
      variant: 'outline' as const,
      className: 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10'
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Compartilhar',
      onClick: onShare,
      variant: 'ghost' as const,
      className: 'text-gray-400 hover:text-white'
    }
  ];

  return (
    <>
      {/* Desktop - Sidebar fixa */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-10"
      >
        <Card className="bg-gray-800/90 backdrop-blur-md border-gray-700 w-16">
          <CardContent className="p-3">
            <div className="space-y-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="icon"
                    className={action.className}
                    onClick={action.onClick}
                    aria-label={action.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mobile - Barra inferior */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-20 p-4"
      >
        <Card className="bg-gray-800/90 backdrop-blur-md border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="sm"
                    className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${action.className}`}
                    onClick={action.onClick}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{action.label.split(' ')[0]}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="lg:hidden h-24" />
    </>
  );
};
