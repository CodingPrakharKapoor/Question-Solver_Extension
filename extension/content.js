chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'solveQuestion') {
    const selection = window.getSelection().toString();
    console.log('Selected text:', selection);
    if (selection) {
      chrome.runtime.sendMessage({ message: 'fetchSolution', question: selection }, response => {
        if (response.error) {
          alert(`Error: ${response.error}`);
        } else {
          const answerWindow = window.open(
            chrome.runtime.getURL('answer.html'),
            'Answer',
            'width=400,height=300'
          );
          answerWindow.onload = () => {
            answerWindow.document.body.innerText = `Solution: ${response.response.choices[0].text}`;
          };
        }
      });
    } else {
      alert('Please select a question.');
    }
  }
});
