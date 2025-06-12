import React from 'react';
import { ChatMessage } from '../types';
import { GroundingChunk } from '@google/genai'; // Changed import from Part to GroundingChunk

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

// Removed local WebContent interface as GroundingChunk.web will be used directly.

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const formatText = (text: string): React.ReactNode => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    text.replace(codeBlockRegex, (match, lang, code, offset) => {
        if (offset > lastIndex) {
            parts.push(text.substring(lastIndex, offset).split('\n').map((line, idx, arr) => (
                <React.Fragment key={`text-${idx}`}>{line}{idx < arr.length - 1 && <br />}</React.Fragment>
            )));
        }
        parts.push(
            <pre key={`code-${offset}`} className="bg-gray-900 p-3 my-2 rounded-md overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
                <code className={`language-${lang || 'plaintext'} text-sm`}>{code.trim()}</code>
            </pre>
        );
        lastIndex = offset + match.length;
        return match; 
    });

    if (lastIndex < text.length) {
         parts.push(text.substring(lastIndex).split('\n').map((line, idx, arr) => (
            <React.Fragment key={`text-end-${idx}`}>{line}{idx < arr.length - 1 && <br />}</React.Fragment>
        )));
    }
    
    return parts.length > 0 ? parts : text.split('\n').map((line, idx, arr) => (
        <React.Fragment key={`default-${idx}`}>{line}{idx < arr.length - 1 && <br />}</React.Fragment>
    ));
  };

  const renderGroundingSources = (chunks?: GroundingChunk[]) => { // Parameter type changed to GroundingChunk[]
    if (!chunks || chunks.length === 0) return null;

    const webSources = chunks
      .filter(chunk => chunk.web && typeof chunk.web.uri === 'string')
      .map(chunk => ({
        uri: chunk.web!.uri, // chunk.web is checked in filter, so non-null assertion is safe
        title: chunk.web!.title || chunk.web!.uri,
      }));
    
    if (webSources.length === 0) return null;

    return (
      <div className="mt-3 pt-2 border-t border-gray-600">
        <p className="text-xs font-semibold text-gray-400 mb-1">Sources:</p>
        <ul className="list-none space-y-1 pl-0">
          {webSources.map((item, index) => (
            <li key={index} className="text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-4-4a2 2 0 012.828-2.828L8 7.172l3.586-3.586z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M8.414 11.586a2 2 0 01-2.828 0L2 7.999V14a2 2 0 002 2h10a2 2 0 002-2V7.999l-3.586 3.587z" clipRule="evenodd" />
              </svg>
              <a 
                href={item.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 hover:underline truncate"
                title={item.title}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div 
        className={`max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-xl shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none' 
            : 'bg-gray-700 text-gray-100 rounded-bl-none'
        }`}
      >
        <div className="text-sm prose prose-sm prose-invert max-w-none" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {formatText(message.text)}
        </div>
        {!isUser && renderGroundingSources(message.groundingChunks)}
        <p className={`text-xs mt-2 ${isUser ? 'text-indigo-200 text-right' : 'text-gray-400 text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;