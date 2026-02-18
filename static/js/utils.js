export function sanitizeSubject(subject) {
    'Sanitize the subject by converting to lowercase, trimming whitespace, and replacing non-alphanumeric characters with underscores.'
    return subject
        .toLowerCase()
        .trim()
        .replace(/[^\w\-_]/g, '_')  // Replace non-alphanumeric (except -_) with _
        .replace(/_{2,}/g, '_');    // Collapse multiple underscores
}

export function formatTitle(str) {
    return str
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letters
      .join(' ');
  }