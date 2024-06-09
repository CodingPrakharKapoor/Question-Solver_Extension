chrome.commands.onCommand.addListener((command) => {
  if (command === 'solve-question') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      console.log('Sending solveQuestion message to active tab:', activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, { message: 'solveQuestion' });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'fetchSolution') {
    console.log('Fetching solution for:', request.question);
    fetch('http://localhost:3000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: request.question })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Received response:', data);
      sendResponse({ response: data });
    })
    .catch(error => {
      console.error('Error fetching solution:', error);
      sendResponse({ error: error.message });
    });
    return true;  // Keep the message channel open for sendResponse
  }
});
