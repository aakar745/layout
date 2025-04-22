/**
 * Utility functions for sanitizing HTML content
 */

/**
 * Sanitizes HTML content to remove potentially dangerous tags/attributes
 * while preserving formatting and valid HTML
 */
export const sanitizeHtml = (html: string | undefined): string => {
  if (!html) return '';
  
  // Allow a set of safe HTML tags commonly used in rich text
  const allowedTags = [
    'p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 
    'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ];
  
  // Simple regex-based sanitization - Keeps only allowed tags
  // For production, consider using a more robust library like DOMPurify
  const safeHtml = html
    // Remove potentially harmful tags and attributes 
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/javascript:/gi, 'removed:')
    .replace(/on\w+=/gi, 'data-removed=')
    // Strip all attributes except for safe ones
    .replace(/<([a-z][a-z0-9]*)\s+([^>]*)/gi, (match, tag, attributes) => {
      // Only keep safe attributes
      const safeAttributes = attributes
        .replace(/\s+style="[^"]*"/gi, '')
        .replace(/\s+class="[^"]*"/gi, ' ')
        .replace(/\s+id="[^"]*"/gi, ' ')
        .replace(/\s+href="[^"]*"/gi, (attrMatch: string) => {
          // Only allow safe URLs
          if (attrMatch.includes('javascript:') || attrMatch.includes('data:')) {
            return ' href="#"';
          }
          return attrMatch;
        });
      
      return `<${tag} ${safeAttributes}`;
    });
  
  return safeHtml;
};

export default {
  sanitizeHtml
}; 