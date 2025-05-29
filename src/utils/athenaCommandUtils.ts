
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProjectCommand {
  name: string;
  description?: string;
  category?: string;
  deadline?: string;
}

interface HabitCommand {
  name: string;
  description?: string;
  frequency?: string;
  goal?: number;
}

interface SubcerebroCommand {
  name: string;
  description?: string;
  area?: string;
  tags?: string[];
  relevancia?: number;
}

interface DiaryCommand {
  content: string;
  title?: string;
  emotion?: string;
  type?: string;
}

interface ConnectaCommand {
  content: string;
  category?: string;
}

/**
 * Parse project creation commands from text input
 */
export const parseProjectCommand = (text: string): ProjectCommand | null => {
  const projectRegex = /(?:crie|criar)\s+(?:um\s+)?(?:novo\s+)?projeto\s+(?:chamado\s+|intitulado\s+|nomeado\s+)?"?([^"]+)"?/i;
  const match = text.match(projectRegex);
  
  if (!match) return null;
  
  const name = match[1].trim();
  if (!name) return null;
  
  const project: ProjectCommand = { name };
  
  // Extract description
  const descRegex = /(?:com\s+descri(?:ç|c)(?:ã|a)o|descrito\s+como)\s+"([^"]+)"/i;
  const descMatch = text.match(descRegex);
  if (descMatch) {
    project.description = descMatch[1].trim();
  }
  
  // Extract category
  const catRegex = /(?:na\s+categoria|categoria|tipo)\s+"?([^",]+)"?/i;
  const catMatch = text.match(catRegex);
  if (catMatch) {
    project.category = catMatch[1].trim();
  }
  
  // Extract deadline
  const deadlineRegex = /(?:at(?:é|e)|prazo(?:\s+para)?|data\s+limite)\s+(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
  const deadlineMatch = text.match(deadlineRegex);
  if (deadlineMatch) {
    project.deadline = deadlineMatch[1].trim();
  }
  
  return project;
};

/**
 * Parse habit creation commands from text input
 */
export const parseHabitCommand = (text: string): HabitCommand | null => {
  const habitRegex = /(?:crie|criar|adicionar)\s+(?:um\s+)?(?:novo\s+)?h[áa]bito\s+(?:de\s+|para\s+)?"?([^",.]+)"?/i;
  const match = text.match(habitRegex);
  
  if (!match) return null;
  
  const name = match[1].trim();
  if (!name) return null;
  
  const habit: HabitCommand = { name };
  
  // Extract description
  const descRegex = /(?:com\s+descri(?:ç|c)(?:ã|a)o|descrito\s+como)\s+"([^"]+)"/i;
  const descMatch = text.match(descRegex);
  if (descMatch) {
    habit.description = descMatch[1].trim();
  }
  
  // Extract frequency
  const freqRegex = /(?:frequ[êe]ncia|periodicidade)\s+"?([^",]+)"?/i;
  const freqMatch = text.match(freqRegex);
  if (freqMatch) {
    habit.frequency = freqMatch[1].trim();
  }
  
  // Extract goal
  const goalRegex = /(?:meta|objetivo)\s+de\s+(\d+)/i;
  const goalMatch = text.match(goalRegex);
  if (goalMatch) {
    habit.goal = parseInt(goalMatch[1]);
  }
  
  return habit;
};

/**
 * Parse subcerebro creation commands from text input
 */
export const parseSubcerebroCommand = (text: string): SubcerebroCommand | null => {
  const subcerebroRegex = /(?:crie|criar)\s+(?:um\s+)?(?:novo\s+)?subcer[ée]bro\s+(?:chamado\s+|para\s+)?"?([^",.]+)"?/i;
  const match = text.match(subcerebroRegex);
  
  if (!match) return null;
  
  const name = match[1].trim();
  if (!name) return null;
  
  const subcerebro: SubcerebroCommand = { name };
  
  // Extract description
  const descRegex = /(?:com\s+descri(?:ç|c)(?:ã|a)o|descrito\s+como)\s+"([^"]+)"/i;
  const descMatch = text.match(descRegex);
  if (descMatch) {
    subcerebro.description = descMatch[1].trim();
  }
  
  // Extract area
  const areaRegex = /(?:na\s+[áa]rea|[áa]rea)\s+(?:de\s+)?"?([^",]+)"?/i;
  const areaMatch = text.match(areaRegex);
  if (areaMatch) {
    subcerebro.area = areaMatch[1].trim();
  }
  
  // Extract tags
  const tagsRegex = /(?:com\s+)?tags?\s+\[([^\]]+)\]/i;
  const tagsMatch = text.match(tagsRegex);
  if (tagsMatch) {
    subcerebro.tags = tagsMatch[1].split(',').map(tag => tag.trim());
  }
  
  // Extract relevancia
  const relRegex = /relev[âa]ncia\s+(\d+)/i;
  const relMatch = text.match(relRegex);
  if (relMatch) {
    subcerebro.relevancia = parseInt(relMatch[1]);
  }
  
  return subcerebro;
};

/**
 * Parse diary entry commands from text input
 */
export const parseDiaryCommand = (text: string): DiaryCommand | null => {
  const diaryRegex = /(?:registrar|criar|escrever)\s+(?:uma\s+)?entrada\s+(?:no\s+)?di[áa]rio[:\s]+"?([^"]+)"?/i;
  const match = text.match(diaryRegex);
  
  if (!match) return null;
  
  const content = match[1].trim();
  if (!content) return null;
  
  const diary: DiaryCommand = { content };
  
  // Extract title
  const titleRegex = /(?:com\s+t[íi]tulo|t[íi]tulo)\s+"([^"]+)"/i;
  const titleMatch = text.match(titleRegex);
  if (titleMatch) {
    diary.title = titleMatch[1].trim();
  }
  
  // Extract emotion
  const emotionRegex = /(?:sentindo|emo[çc][ãa]o)\s+([a-zA-ZÀ-ÿ]+)/i;
  const emotionMatch = text.match(emotionRegex);
  if (emotionMatch) {
    const emotion = emotionMatch[1].toLowerCase();
    const validEmotions = ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'neutral'];
    const emotionMap = {
      'feliz': 'happy',
      'alegre': 'happy',
      'triste': 'sad',
      'irritado': 'angry',
      'raiva': 'angry',
      'ansioso': 'anxious',
      'animado': 'excited',
      'calmo': 'calm',
      'tranquilo': 'calm',
      'frustrado': 'frustrated',
      'grato': 'grateful',
      'neutro': 'neutral'
    };
    diary.emotion = emotionMap[emotion as keyof typeof emotionMap] || (validEmotions.includes(emotion) ? emotion : 'neutral');
  }
  
  return diary;
};

/**
 * Parse Connecta post commands from text input
 */
export const parseConnectaCommand = (text: string): ConnectaCommand | null => {
  const connectaRegex = /(?:postar|publicar|compartilhar)\s+(?:no\s+)?connecta[:\s]+"?([^"]+)"?/i;
  const match = text.match(connectaRegex);
  
  if (!match) return null;
  
  const content = match[1].trim();
  if (!content) return null;
  
  const post: ConnectaCommand = { content };
  
  // Extract category
  const catRegex = /(?:categoria|na\s+categoria)\s+"?([^",]+)"?/i;
  const catMatch = text.match(catRegex);
  if (catMatch) {
    post.category = catMatch[1].trim();
  }
  
  return post;
};

/**
 * Create a new project in the database
 */
export const createProject = async (userId: string, project: ProjectCommand) => {
  try {
    let deadlineFormatted = null;
    if (project.deadline) {
      try {
        deadlineFormatted = new Date(project.deadline).toISOString().split('T')[0];
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        name: project.name,
        description: project.description || null,
        category: project.category || null,
        deadline: deadlineFormatted,
        status: "ativo",
        progress: 0
      })
      .select();
      
    if (error) {
      console.error("Error creating project:", error);
      return { 
        success: false, 
        message: "Erro ao criar projeto. Tente novamente.",
        error 
      };
    }
    
    return { 
      success: true, 
      message: `Projeto "${project.name}" criado com sucesso!`,
      data
    };
  } catch (e) {
    console.error("Error in createProject:", e);
    return { 
      success: false, 
      message: "Erro ao criar projeto. Tente novamente.",
      error: e 
    };
  }
};

/**
 * Create a new habit in the database
 */
export const createHabit = async (userId: string, habit: HabitCommand) => {
  try {
    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: userId,
        name: habit.name,
        description: habit.description || null,
        frequency: habit.frequency || "diária",
        goal: habit.goal || null,
        progress: 0
      })
      .select();
      
    if (error) {
      console.error("Error creating habit:", error);
      return { 
        success: false, 
        message: "Erro ao criar hábito. Tente novamente.",
        error 
      };
    }
    
    return { 
      success: true, 
      message: `Hábito "${habit.name}" criado com sucesso!`,
      data
    };
  } catch (e) {
    console.error("Error in createHabit:", e);
    return { 
      success: false, 
      message: "Erro ao criar hábito. Tente novamente.",
      error: e 
    };
  }
};

/**
 * Create a new subcerebro in the database
 */
export const createSubcerebro = async (userId: string, subcerebro: SubcerebroCommand) => {
  try {
    const { data, error } = await supabase
      .from("subcerebros")
      .insert({
        user_id: userId,
        nome: subcerebro.name,
        descricao: subcerebro.description || null,
        area: subcerebro.area || null,
        tags: subcerebro.tags || [],
        relevancia: subcerebro.relevancia || 5
      })
      .select();
      
    if (error) {
      console.error("Error creating subcerebro:", error);
      return { 
        success: false, 
        message: "Erro ao criar subcérebro. Tente novamente.",
        error 
      };
    }
    
    return { 
      success: true, 
      message: `Subcérebro "${subcerebro.name}" criado com sucesso!`,
      data
    };
  } catch (e) {
    console.error("Error in createSubcerebro:", e);
    return { 
      success: false, 
      message: "Erro ao criar subcérebro. Tente novamente.",
      error: e 
    };
  }
};

/**
 * Create a new diary entry in the database
 */
export const createDiaryEntry = async (userId: string, diary: DiaryCommand) => {
  try {
    const { data, error } = await supabase
      .from("diary_entries")
      .insert({
        user_id: userId,
        title: diary.title || null,
        content: diary.content,
        emotion: diary.emotion || 'neutral',
        type: diary.type || 'livre',
        date: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error("Error creating diary entry:", error);
      return { 
        success: false, 
        message: "Erro ao criar entrada no diário. Tente novamente.",
        error 
      };
    }
    
    return { 
      success: true, 
      message: `Entrada no diário criada com sucesso!`,
      data
    };
  } catch (e) {
    console.error("Error in createDiaryEntry:", e);
    return { 
      success: false, 
      message: "Erro ao criar entrada no diário. Tente novamente.",
      error: e 
    };
  }
};

/**
 * Create a new Connecta post in the database
 */
export const createConnectaPost = async (userId: string, post: ConnectaCommand) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        content: post.content,
        category: post.category || 'geral'
      })
      .select();
      
    if (error) {
      console.error("Error creating post:", error);
      return { 
        success: false, 
        message: "Erro ao criar post. Tente novamente.",
        error 
      };
    }
    
    return { 
      success: true, 
      message: `Post publicado no Connecta com sucesso!`,
      data
    };
  } catch (e) {
    console.error("Error in createConnectaPost:", e);
    return { 
      success: false, 
      message: "Erro ao criar post. Tente novamente.",
      error: e 
    };
  }
};

/**
 * Process commands in Athena messages
 */
export const processAthenaCommand = async (userId: string, message: string) => {
  // Check for project creation command
  const projectCommand = parseProjectCommand(message);
  if (projectCommand) {
    const result = await createProject(userId, projectCommand);
    return {
      type: 'project',
      command: projectCommand,
      result,
      contextType: 'projeto',
      contextId: result.success ? result.data?.[0]?.id : null
    };
  }
  
  // Check for habit creation command
  const habitCommand = parseHabitCommand(message);
  if (habitCommand) {
    const result = await createHabit(userId, habitCommand);
    return {
      type: 'habit',
      command: habitCommand,
      result,
      contextType: 'hábito',
      contextId: result.success ? result.data?.[0]?.id : null
    };
  }

  // Check for subcerebro creation command
  const subcerebroCommand = parseSubcerebroCommand(message);
  if (subcerebroCommand) {
    const result = await createSubcerebro(userId, subcerebroCommand);
    return {
      type: 'subcerebro',
      command: subcerebroCommand,
      result,
      contextType: 'subcérebro',
      contextId: result.success ? result.data?.[0]?.id : null
    };
  }

  // Check for diary entry creation command
  const diaryCommand = parseDiaryCommand(message);
  if (diaryCommand) {
    const result = await createDiaryEntry(userId, diaryCommand);
    return {
      type: 'diary',
      command: diaryCommand,
      result,
      contextType: 'diário',
      contextId: result.success ? result.data?.[0]?.id : null
    };
  }

  // Check for Connecta post creation command
  const connectaCommand = parseConnectaCommand(message);
  if (connectaCommand) {
    const result = await createConnectaPost(userId, connectaCommand);
    return {
      type: 'connecta',
      command: connectaCommand,
      result,
      contextType: 'post',
      contextId: result.success ? result.data?.[0]?.id : null
    };
  }
  
  // No command recognized
  return null;
};
