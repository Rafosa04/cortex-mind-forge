
import { DiaryEntry } from '@/hooks/useDiary';

export interface AthenaAnalysis {
  insight: string;
  suggestions: string[];
  reflectionQuestion: string;
  emotionalPattern: string;
}

export const generateAthenaAnalysis = (entry: DiaryEntry, recentEntries: DiaryEntry[]): AthenaAnalysis => {
  // Análise baseada na emoção atual
  const emotionInsights: Record<string, string> = {
    reflexivo: "Percebo que você está em um momento de introspecção. Isso é valioso para o autoconhecimento.",
    satisfeito: "Que bom ver você satisfeito! Essa sensação de realização é importante para sua motivação.",
    preocupado: "Noto uma preocupação em suas palavras. É natural, mas vamos trabalhar isso juntos.",
    animado: "Sua energia positiva é contagiante! Aproveite esse momento de entusiasmo.",
    triste: "Vejo que você está passando por um momento difícil. Lembre-se de que é temporário.",
    grato: "A gratidão é uma das emoções mais poderosas. Continue cultivando essa perspectiva.",
    ansioso: "A ansiedade pode ser desafiadora. Vamos encontrar formas de gerenciá-la melhor.",
    inspirado: "Que momento especial! A inspiração é um presente, use-a para criar algo significativo."
  };

  // Sugestões baseadas no tipo de entrada
  const typeSuggestions: Record<string, string[]> = {
    livre: [
      "Continue escrevendo livremente, isso ajuda a processar seus pensamentos",
      "Considere estabelecer uma rotina de escrita para manter essa prática"
    ],
    reflexivo: [
      "Aprofunde suas reflexões com questionamentos sobre 'por que' e 'como'",
      "Conecte suas reflexões com ações práticas que pode tomar"
    ],
    rápido: [
      "Ótimo para capturar momentos! Considere expandir algumas dessas anotações depois",
      "Use essas anotações rápidas como sementes para reflexões mais profundas"
    ]
  };

  // Perguntas reflexivas baseadas no conteúdo
  const reflectionQuestions = [
    "O que esta experiência te ensinou sobre você mesmo?",
    "Como você pode aplicar esse aprendizado no futuro?",
    "Que padrão você consegue identificar em seus sentimentos recentes?",
    "O que você gostaria de fazer diferente se vivesse isso novamente?",
    "Como essa situação se conecta com seus valores pessoais?"
  ];

  // Análise de padrão emocional
  const recentEmotions = recentEntries.slice(0, 5).map(e => e.emotion);
  const emotionCounts = recentEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const emotionPatterns: Record<string, string> = {
    reflexivo: "Você tem estado muito reflexivo ultimamente. Isso indica maturidade emocional.",
    satisfeito: "Suas emoções têm sido predominantemente positivas. Continue assim!",
    preocupado: "Noto uma tendência de preocupação. Que tal explorar técnicas de relaxamento?",
    ansioso: "Tem havido bastante ansiedade. Vamos trabalhar estratégias de enfrentamento."
  };

  return {
    insight: emotionInsights[entry.emotion] || "Obrigada por compartilhar seus sentimentos comigo.",
    suggestions: typeSuggestions[entry.type] || ["Continue escrevendo, é um ótimo hábito!"],
    reflectionQuestion: reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)],
    emotionalPattern: emotionPatterns[dominantEmotion] || "Suas emoções mostram uma rica vida interior."
  };
};
