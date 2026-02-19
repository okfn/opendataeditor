function switchLanguage(path) {
    // No persistence - just navigate based on path
    // Normalize path
    let targetPath = path;
    
    if (!targetPath.endsWith('/')) {
        targetPath += '/';
    }
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Parse current path to extract relative page path
    // Examples:
    //   /build/html/index.html -> index.html
    //   /build/html/es/index.html -> index.html
    //   /build/html/es/introduction/what-is-open-data-editor.html -> introduction/what-is-open-data-editor.html
    
    // Remove build/html prefix and language prefix if present
    const pathParts = currentPath.replace('/build/html/', '').split('/');
    
    // Check if we're in a language subdirectory
    const languageDirs = ['en', 'es', 'fr', 'id', 'pt', 'yua'];
    let relativePagePath;
    
    if (pathParts.length > 0 && languageDirs.includes(pathParts[0])) {
        // In language subdirectory, get page path (excluding language)
        relativePagePath = pathParts.slice(1).join('/');
    } else {
        // At root (English), get full path
        relativePagePath = pathParts.join('/');
    }
    
    // If no page specified (just root), use index.html
    if (!relativePagePath || relativePagePath === '') {
        relativePagePath = 'index.html';
    }
    
    // Construct new path
    const newPath = targetPath + relativePagePath;
    
    // Navigate to new language version
    window.location.href = newPath;
}
