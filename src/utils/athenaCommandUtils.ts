
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

/**
 * Parse project creation commands from text input
 * @param text The input text from Athena chat
 * @returns ProjectCommand object if valid command, null otherwise
 */
export const parseProjectCommand = (text: string): ProjectCommand | null => {
  // Match "crie um novo projeto chamado X" or "criar projeto X" patterns
  const projectRegex = /crie\s+um\s+(?:novo\s+)?projeto\s+(?:chamado\s+|intitulado\s+|nomeado\s+)?"?([^"]+)"?/i;
  const match = text.match(projectRegex);
  
  if (!match) return null;
  
  const name = match[1].trim();
  if (!name) return null;
  
  const project: ProjectCommand = { name };
  
  // Extract description if present
  const descRegex = /(?:com\s+descri(?:ç|c)(?:ã|a)o|descrito\s+como)\s+"([^"]+)"/i;
  const descMatch = text.match(descRegex);
  if (descMatch) {
    project.description = descMatch[1].trim();
  }
  
  // Extract category if present
  const catRegex = /(?:na\s+categoria|categoria|tipo)\s+"?([^",]+)"?/i;
  const catMatch = text.match(catRegex);
  if (catMatch) {
    project.category = catMatch[1].trim();
  }
  
  // Extract deadline if present (supports formats like "até 10/12/2025" or "com prazo para 10/12/2025")
  const deadlineRegex = /(?:at(?:é|e)|prazo(?:\s+para)?|data\s+limite)\s+(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+de\s+[^\s,]+(?:\s+de\s+\d{4})?)/i;
  const deadlineMatch = text.match(deadlineRegex);
  if (deadlineMatch) {
    project.deadline = deadlineMatch[1].trim();
  }
  
  return project;
};

/**
 * Parse habit creation commands from text input
 * @param text The input text from Athena chat
 * @returns HabitCommand object if valid command, null otherwise
 */
export const parseHabitCommand = (text: string): HabitCommand | null => {
  // Match "criar hábito X" or "quero criar o hábito de X" patterns
  const habitRegex = /(?:crie|criar|quero\s+criar)\s+(?:um\s+)?(?:novo\s+)?h[áa]bito\s+(?:de\s+|para\s+)?"?([^",.]+)"?/i;
  const match = text.match(habitRegex);
  
  if (!match) return null;
  
  const name = match[1].trim();
  if (!name) return null;
  
  const habit: HabitCommand = { name };
  
  // Extract description if present
  const descRegex = /(?:com\s+descri(?:ç|c)(?:ã|a)o|descrito\s+como)\s+"([^"]+)"/i;
  const descMatch = text.match(descRegex);
  if (descMatch) {
    habit.description = descMatch[1].trim();
  }
  
  // Extract frequency if present
  const freqRegex = /(?:frequ[êe]ncia|periodicidade)\s+"?([^",]+)"?/i;
  const freqMatch = text.match(freqRegex);
  if (freqMatch) {
    habit.frequency = freqMatch[1].trim();
  }
  
  // Extract goal if present
  const goalRegex = /(?:meta|objetivo)\s+de\s+(\d+)/i;
  const goalMatch = text.match(goalRegex);
  if (goalMatch) {
    habit.goal = parseInt(goalMatch[1]);
  }
  
  return habit;
};

/**
 * Create a new project in the database
 * @param userId The user ID
 * @param project The project details
 * @returns Object with success status and message or error
 */
export const createProject = async (userId: string, project: ProjectCommand) => {
  try {
    // Format deadline if present
    let deadlineFormatted = null;
    if (project.deadline) {
      try {
        // Simple date formatting - in a production app you'd use a more robust solution
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
 * @param userId The user ID
 * @param habit The habit details
 * @returns Object with success status and message or error
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
 * Process commands in Athena messages
 * @param userId The user ID
 * @param message The message from user to Athena
 * @returns Result object with details of processed command or null if no command recognized
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
  
  // No command recognized
  return null;
};
