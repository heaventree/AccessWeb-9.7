import { ChatAudit } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service to handle periodic content audits for the chatbot
 * This keeps the chatbot's knowledge base updated with the latest content from the site
 */

interface ContentTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  lastUpdated: string;
}

interface ContentAuditResults {
  newTopics: ContentTopic[];
  deletedTopics: string[];
  modifiedTopics: ContentTopic[];
}

/**
 * Extracts text content from HTML, removing tags and normalizing whitespace
 */
function extractTextContent(html: string): string {
  // Simple HTML tag removal regex
  // In a production environment, consider using a proper HTML parser
  return html
    .replace(/<[^>]*>/g, ' ') // Replace HTML tags with spaces
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

/**
 * Gets all content from the site for indexing
 * In a real implementation, this would scan through the site content
 */
async function getAllSiteContent(): Promise<ContentTopic[]> {
  // In a real implementation, this would be replaced with actual content fetching
  // For now, we'll simulate by accessing DOM content
  
  const topics: ContentTopic[] = [];
  
  try {
    // Get all article content in the DOM
    const articleElements = document.querySelectorAll('article, .article, [role="article"]');
    
    articleElements.forEach((element, index) => {
      const titleElement = element.querySelector('h1, h2, h3');
      const title = titleElement?.textContent?.trim() || `Unknown Content ${index + 1}`;
      const content = extractTextContent(element.innerHTML);
      
      // Try to determine category from context
      let category = 'General';
      const breadcrumbs = document.querySelector('.breadcrumbs, nav[aria-label="breadcrumb"]');
      if (breadcrumbs) {
        const categoryElement = breadcrumbs.querySelector('li:nth-child(2), a:nth-child(2)');
        if (categoryElement && categoryElement.textContent) {
          category = categoryElement.textContent.trim();
        }
      }
      
      topics.push({
        id: `content-${index}`, // In a real implementation, this would be a stable ID
        title,
        content,
        category,
        lastUpdated: new Date().toISOString() // In a real implementation, this would be the actual update date
      });
    });
  } catch (error) {
    console.error('Error scanning site content:', error);
  }
  
  return topics;
}

/**
 * Gets previously indexed content from storage
 */
function getPreviouslyIndexedContent(): ContentTopic[] {
  try {
    const storedContent = localStorage.getItem('chatbotIndexedContent');
    return storedContent ? JSON.parse(storedContent) : [];
  } catch (error) {
    console.error('Error getting previously indexed content:', error);
    return [];
  }
}

/**
 * Saves indexed content to storage
 */
function saveIndexedContent(topics: ContentTopic[]): void {
  try {
    localStorage.setItem('chatbotIndexedContent', JSON.stringify(topics));
  } catch (error) {
    console.error('Error saving indexed content:', error);
  }
}

/**
 * Logs the content audit for tracking and analytics
 */
function logContentAudit(audit: ChatAudit): void {
  try {
    const storedAudits = localStorage.getItem('chatbotContentAudits');
    const audits = storedAudits ? JSON.parse(storedAudits) : [];
    
    // Add the new audit
    audits.push(audit);
    
    // Keep only the last 100 audits
    if (audits.length > 100) {
      audits.splice(0, audits.length - 100);
    }
    
    localStorage.setItem('chatbotContentAudits', JSON.stringify(audits));
    
    // In a real implementation, this would also send to the server
    // api.logChatbotContentAudit(audit).catch(error => console.error('Error logging content audit:', error));
  } catch (error) {
    console.error('Error logging content audit:', error);
  }
}

/**
 * Compare current content with previously indexed content to identify changes
 */
function compareContent(currentTopics: ContentTopic[], previousTopics: ContentTopic[]): ContentAuditResults {
  const newTopics: ContentTopic[] = [];
  const modifiedTopics: ContentTopic[] = [];
  const currentIds = new Set(currentTopics.map(topic => topic.id));
  
  // Find new and modified topics
  currentTopics.forEach(currentTopic => {
    const previousTopic = previousTopics.find(prev => prev.id === currentTopic.id);
    
    if (!previousTopic) {
      // New topic
      newTopics.push(currentTopic);
    } else if (
      previousTopic.title !== currentTopic.title || 
      previousTopic.content !== currentTopic.content
    ) {
      // Modified topic
      modifiedTopics.push(currentTopic);
    }
  });
  
  // Find deleted topics
  const deletedTopics = previousTopics
    .filter(prev => !currentIds.has(prev.id))
    .map(topic => topic.id);
  
  return {
    newTopics,
    deletedTopics,
    modifiedTopics
  };
}

/**
 * Performs a full content audit and updates the chatbot's knowledge base
 */
export async function performContentAudit(): Promise<ChatAudit> {
  // Get all current site content
  const currentTopics = await getAllSiteContent();
  
  // Get previously indexed content
  const previousTopics = getPreviouslyIndexedContent();
  
  // Compare to identify changes
  const { newTopics, deletedTopics, modifiedTopics } = compareContent(currentTopics, previousTopics);
  
  // Update stored content
  saveIndexedContent(currentTopics);
  
  // Create audit record
  const audit: ChatAudit = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    contentUpdated: newTopics.length > 0 || deletedTopics.length > 0 || modifiedTopics.length > 0,
    newTopics: newTopics.map(topic => topic.title),
    deletedTopics: deletedTopics,
    modifiedTopics: modifiedTopics.map(topic => topic.title)
  };
  
  // Log the audit
  logContentAudit(audit);
  
  return audit;
}

/**
 * Schedules regular content audits
 * Call this when the application starts
 */
export function scheduleContentAudits(intervalHours = 24): void {
  // Perform an initial audit
  performContentAudit().catch(error => console.error('Error performing content audit:', error));
  
  // Schedule regular audits
  const intervalMs = intervalHours * 60 * 60 * 1000;
  setInterval(() => {
    performContentAudit().catch(error => console.error('Error performing scheduled content audit:', error));
  }, intervalMs);
  
  console.log(`Scheduled content audits every ${intervalHours} hours`);
}

/**
 * Gets content audit history
 */
export function getContentAudits(): ChatAudit[] {
  try {
    const storedAudits = localStorage.getItem('chatbotContentAudits');
    return storedAudits ? JSON.parse(storedAudits) : [];
  } catch (error) {
    console.error('Error getting content audits:', error);
    return [];
  }
}