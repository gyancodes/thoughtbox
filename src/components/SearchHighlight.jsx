import { highlightSearchTermsReact } from '../utils/searchUtils';

const SearchHighlight = ({ 
  text, 
  query, 
  className = "",
  highlightClassName = "bg-yellow-200 px-1 rounded font-medium"
}) => {
  if (!text || !query) {
    return <span className={className}>{text}</span>;
  }

  const parts = highlightSearchTermsReact(text, query);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (typeof part === 'object' && part.type === 'highlight') {
          return (
            <mark 
              key={part.key || `highlight-${index}`}
              className={highlightClassName}
            >
              {part.text}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default SearchHighlight;