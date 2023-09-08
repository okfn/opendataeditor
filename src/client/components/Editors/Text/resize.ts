// @ts-nocheck
// TODO: remove this temporary fix when it's fixed upstream
// https://github.com/microsoft/vscode/issues/183324

// Save a reference to the original ResizeObserver
const OriginalResizeObserver = window.ResizeObserver

// Create a new ResizeObserver constructor
window.ResizeObserver = function (callback) {
  const wrappedCallback = (entries, observer) => {
    window.requestAnimationFrame(() => {
      callback(entries, observer)
    })
  }

  // Create an instance of the original ResizeObserver
  // with the wrapped callback
  return new OriginalResizeObserver(wrappedCallback)
}

// Copy over static methods, if any
for (const staticMethod in OriginalResizeObserver) {
  if (Object.prorotype.hasOwnProperty.call(OriginalResizeObserver, staticMethod)) {
    window.ResizeObserver[staticMethod] = OriginalResizeObserver[staticMethod]
  }
}
