export function sanitizeSubject(subject) {
    return subject
        .toLowerCase()
        .trim()
        .replace(/[^\w\-_]/g, '_')  // Replace non-alphanumeric (except -_) with _
        .replace(/_{2,}/g, '_');    // Collapse multiple underscores
}
