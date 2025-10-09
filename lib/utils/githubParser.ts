// lib/utils/githubParser.ts

interface ParsedTrack {
  trackName: string;
  trackTitle: string;
  trackColor: string;
  weeks: Record<string, any>;
}

export async function parseGithubTrack(url: string): Promise<ParsedTrack> {
  try {
    // Convert GitHub URL to raw content URL
    const rawUrl = convertToRawUrl(url);
    
    // Fetch the content
    const response = await fetch(rawUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub content');
    }
    
    const content = await response.text();
    
    // Determine file type and parse accordingly
    if (url.endsWith('.json')) {
      return parseJsonTrack(content);
    } else {
      return await parseMarkdownTrack(content); // Add await here
    }
  } catch (error: any) {
    throw new Error(`Failed to parse GitHub track: ${error.message}`);
  }
}

function convertToRawUrl(url: string): string {
  // Convert GitHub URL to raw content URL
  return url
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/');
}

function parseJsonTrack(content: string): ParsedTrack {
  try {
    const data = JSON.parse(content);
    
    return {
      trackName: data.trackName || 'custom_track',
      trackTitle: data.trackTitle || '🎯 Custom Track',
      trackColor: data.trackColor || 'from-purple-500 to-pink-600',
      weeks: data.weeks || {}
    };
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

async function parseMarkdownTrack(content: string): Promise<ParsedTrack> {
  const lines = content.split('\n');
  const weeks: Record<string, any> = {};
  
  let trackTitle = '🎯 Custom Track';
  let currentWeek: string | null = null;
  let currentProblems: number[] = [];
  let weekCounter = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Extract track title from first H1
    if (line.startsWith('# ') && !trackTitle.includes(line.substring(2))) {
      trackTitle = line.substring(2).trim();
      continue;
    }
    
    // Week headers (## Week X: Title)
    if (line.startsWith('## ')) {
      // Save previous week if exists
// Save last week
if (currentWeek && currentProblems.length > 0) {
  saveWeek(weeks, currentWeek, currentProblems);
}
      
      // Parse new week
      const weekMatch = line.match(/##\s*Week\s*(\d+)[\s:]+(.+)/i);
      if (weekMatch) {
        currentWeek = `Week ${weekMatch[1]}`;
        currentProblems = [];
      } else {
        // Generic header becomes a week
        currentWeek = `Week ${weekCounter++}`;
        currentProblems = [];
      }
      continue;
    }
    
    // Problem lines (- Problem 123 or - 123 or - [Problem Name](link))
    if (line.startsWith('-') || line.startsWith('*')) {
      const problemNum = extractProblemNumber(line);
      if (problemNum !== null) {
        currentProblems.push(problemNum);
      }
    }
  }
  
  // Save last week
// Save last week
if (currentWeek && currentProblems.length > 0) {
  await saveWeek(weeks, currentWeek, currentProblems);
}
  
  if (Object.keys(weeks).length === 0) {
    throw new Error('No valid weeks found in markdown');
  }
  
  return {
    trackName: trackTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    trackTitle,
    trackColor: 'from-purple-500 to-pink-600',
    weeks
  };
}

async function saveWeek(weeks: Record<string, any>, weekKey: string, problems: number[]) {
  // Note: This function is now async and needs to be awaited
  const { LeetCodeService } = await import('@/lib/services/leetcodeService');
  const { validProblems } = await LeetCodeService.validateAndFetchProblems(problems);
  
  weeks[weekKey] = {
    title: `Week ${weekKey.split(' ')[1]} Problems`,
    days: [
      {
        topic: `Week ${weekKey.split(' ')[1]} Problems`,
        problems: validProblems
      }
    ]
  };
}

function extractProblemNumber(line: string): number | null {
  // Try different patterns
  const patterns = [
    /Problem\s+(\d+)/i,           // "Problem 123"
    /\[.*?\]\(.*?\/(\d+).*?\)/,   // "[Name](url/123/)"
    /^[-*]\s*(\d+)/,              // "- 123" or "* 123"
    /#(\d+)/,                      // "#123"
    /LC\s*(\d+)/i                 // "LC 123"
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match && match[1]) {
      const num = parseInt(match[1]);
      if (!isNaN(num) && num > 0 && num < 10000) {
        return num;
      }
    }
  }
  
  return null;
}