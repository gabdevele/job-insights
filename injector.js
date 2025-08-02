(function() {
  console.log('Injector script injected and running.');
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    console.log('XHR open called for:', arguments[1]);
    this.addEventListener('load', function() {
      if (this.responseURL.startsWith('https://www.linkedin.com/voyager/api/jobs/jobPostings/')) {
        console.log('Intercepted LinkedIn jobs API call:', this.responseURL);
        try {
          let response;
          if (this.responseType === 'json') {
            response = this.response;
          } else if (this.response instanceof Blob) {
            this.response.text().then(text => {
              response = JSON.parse(text);
              if (response && response.data && response.data.applies !== undefined) {
                console.log('Found applies data:', response.data.applies);
                window.postMessage({ type: 'FROM_INJECTOR', applies: response.data.applies }, '*');
              } else {
                console.log('Applies data not found in the response.');
              }
            }).catch(err => {
              console.error('Error reading Blob response:', err);
            });
            return;
          } else if (this.responseText) {
            response = JSON.parse(this.responseText);
          }

          if (response && response.data && response.data.applies !== undefined) {
            console.log('Found applies data:', response.data.applies);
            window.postMessage({ type: 'FROM_INJECTOR', applies: response.data.applies }, '*');
          } else {
            console.log('Applies data not found in the response.');
          }
        } catch (e) {
          console.error('Errore nel parsing della risposta JSON:', e);
          console.error('Response URL:', this.responseURL);
          console.error('Response Type:', this.responseType);
          console.log('Response:', this.response);
        }
      }
    });
    originalOpen.apply(this, arguments);
  };
})();
