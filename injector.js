const API_URL = 'https://www.linkedin.com/voyager/api/jobs/jobPostings/';
(function() {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', async function() {
      if (!this.responseURL.startsWith(API_URL)) {
        return;
      }
      try {
        let response;
        if (this.response instanceof Blob) {
          const text = await this.response.text();
          response = JSON.parse(text);
        } else {
          response = typeof this.response === 'string' ? JSON.parse(this.response) : this.response;
        }
        
        if (response && response.data) {
          window.postMessage({ 
            type: 'LINKEDIN_APPLIES_DATA',
            data: response
          }, '*');
        } else {
          console.warn('Applies data not found in the response.');
        }
      } catch (e) {
        console.error('Something went wrong on injector.js:', e);
        console.error('Response:', this.response);
      }
    });
    this.addEventListener('readystatechange', async function() {
      if (this.readyState !== XMLHttpRequest.HEADERS_RECEIVED) return;
      if (!this.responseURL.startsWith(API_URL)) return;
      
      window.postMessage({
        type: 'LINKEDIN_APPLIES_REQUEST',
      }, '*');
    });
    originalOpen.apply(this, arguments);
  };
})();
