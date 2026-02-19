function switchLanguage(path) {
    // No persistence - just navigate based on path
    // Normalize path
    let targetPath = path;

    // Navigate to new language version
    window.location.href = targetPath;
}
