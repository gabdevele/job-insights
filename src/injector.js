const API_URL = 'https://www.linkedin.com/voyager/api/jobs/jobPostings/';

(() => {
  const jobDataCache = new Map();
  let currentUrl = window.location.href;
  
  function extractJobIdFromUrl(url) {
    const parser = new URL(url);
    return parser.searchParams.get('currentJobId');
  }
  
  function sendCachedData(jobId) {
    jobId = jobId.toString().trim();
    const cachedData = jobDataCache.get(jobId);
    if (!cachedData) {
      console.warn(`No cached data found for job ID: ${jobId}`);
      return;
    }
    window.postMessage({ 
      type: 'LINKEDIN_APPLIES_DATA',
      data: cachedData,
      fromCache: true
    }, '*');
  }
  
  function checkUrlChange() {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      const jobId = extractJobIdFromUrl(newUrl);
      if (jobId) sendCachedData(jobId);
    }
  }
  
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(checkUrlChange, 100);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    setTimeout(checkUrlChange, 100);
  };
  
  window.addEventListener('popstate', () => {
    setTimeout(checkUrlChange, 100);
  });
  
  setTimeout(() => {
    const jobId = extractJobIdFromUrl(currentUrl);
    if (jobId) {
      sendCachedData(jobId);
    }
  }, 1000);

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
          const jobPostingId = response.data.jobPostingId.toString().trim();
          jobDataCache.set(jobPostingId, response);

          window.postMessage({ 
            type: 'LINKEDIN_APPLIES_DATA',
            data: response,
            fromCache: false
          }, '*');
        } else {
          console.warn('No job data found in response:', response);
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
