console.log('Content script loaded.');

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
(document.head || document.documentElement).appendChild(script);

script.onload = function() {
  console.log('Injector script loaded.');
  script.remove();
};

window.addEventListener('message', function(event) {
  console.log('Message received in content script:', event.data);
  if (event.source === window && event.data.type && event.data.type === 'FROM_INJECTOR') {
    console.log('Message is from injector. Applies:', event.data.applies);
    const applies = event.data.applies;
    let appliesElement = document.getElementById('linkedin-applies-counter');
    if (!appliesElement) {
      console.log('Creating applies element.');
      appliesElement = document.createElement('div');
      appliesElement.id = 'linkedin-applies-counter';
      document.body.appendChild(appliesElement);
    }
    appliesElement.textContent = `Numero di candidature: ${applies}`;
    console.log('Applies element updated.');
  }
});
