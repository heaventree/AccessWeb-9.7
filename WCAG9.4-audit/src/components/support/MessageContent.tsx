// No imports needed

interface MessageContentProps {
  content: string;
  isAssistant?: boolean;
}

// A simple markdown parser since we're having issues with the ReactMarkdown library
export function MessageContent({ content, isAssistant = false }: MessageContentProps) {
  // Only parse markdown for assistant messages
  if (!isAssistant) {
    return <span>{content}</span>;
  }

  // Split the content by line breaks
  const lines = content.split('\n');
  
  return (
    <div className="chat-markdown">
      {lines.map((line, index) => {
        // Empty lines become breaks
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code snippets
        line = line.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Bullet points
        if (line.trim().startsWith('- ')) {
          return (
            <div key={index} className="flex ml-2 my-0.5">
              <span className="mr-1.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '') }} />
            </div>
          );
        }
        
        // Numbered lists (simple)
        if (/^\d+\.\s/.test(line.trim())) {
          const [num, ...rest] = line.trim().split('. ');
          return (
            <div key={index} className="flex ml-2 my-0.5">
              <span className="mr-1.5">{num}.</span>
              <span dangerouslySetInnerHTML={{ __html: rest.join('. ') }} />
            </div>
          );
        }
        
        // Regular paragraph
        return <p key={index} className="my-1" dangerouslySetInnerHTML={{ __html: line }} />;
      })}
    </div>
  );
}