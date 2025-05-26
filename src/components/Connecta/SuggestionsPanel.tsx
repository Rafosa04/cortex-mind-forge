
/**
 * SuggestionsPanel - Painel lateral com sugestões de usuários
 * 
 * @component
 * @example
 * <SuggestionsPanel 
 *   suggestions={suggestions} 
 *   onFollow={(userId) => handleFollow(userId)}
 * />
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";
import { UserSuggestionType } from "@/types/connecta";

interface SuggestionsPanelProps {
  suggestions: UserSuggestionType[];
  onFollow: (userId: string) => void;
}

export default function SuggestionsPanel({ suggestions, onFollow }: SuggestionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-fit"
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-indigo-400" />
            Sugestões para Você
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-600">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white text-sm">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    @{user.username}
                  </div>
                  <div className="text-xs text-indigo-400">
                    {user.commonCells} células em comum
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant={user.isFollowing ? "secondary" : "default"}
                onClick={() => onFollow(user.id)}
                className={
                  user.isFollowing 
                    ? "bg-gray-600 hover:bg-gray-500" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {user.isFollowing ? "Seguindo" : "Seguir"}
              </Button>
            </motion.div>
          ))}
          
          {suggestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhuma sugestão disponível</p>
              <p className="text-xs mt-1">Conecte-se com mais pessoas!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
