// Script to apply user-select: none to spans that start with $
document.addEventListener('DOMContentLoaded', function() {
  // Function to process code blocks
  function processCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre[data-language] code > div.ec-line > div.code > span:first-child');
    
    codeBlocks.forEach(span => {
      const text = span.textContent || span.innerText;
      if (text && text.trim().startsWith('$')) {
        span.classList.add('starts-with-dollar');
      }
    });
  }
  
  // Process on page load
  processCodeBlocks();
  
  // Process when content changes (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        processCodeBlocks();
      }
    });
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
