console.log('LinkedIn Applications extension loaded');

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
(document.head || document.documentElement).appendChild(script);

script.onload = function () {
  console.log('Injector loaded');
  script.remove();
};

const createLoadingCard = () => {
  let container = document.getElementById('linkedin-job-insights');
  if (container) {
    container.remove();
  }

  container = document.createElement('section');
  container.id = 'linkedin-job-insights';
  container.className = 'artdeco-card p4 mt4 job-insights-loading';

  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';

  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.innerHTML = 'Loading job insights<span class="loading-dots"></span>';

  const skeleton = document.createElement('div');
  skeleton.className = 'loading-skeleton';

  const skeletonItems = [
    'Applications',
    'Experience Level', 
    'Employment Type',
    'Posted Date',
    'Company Size',
    'Remote Work'
  ];

  skeletonItems.forEach(() => {
    const skeletonItem = document.createElement('div');
    skeletonItem.className = 'skeleton-item';
    
    const skeletonLabel = document.createElement('div');
    skeletonLabel.className = 'skeleton-label';
    
    const skeletonValue = document.createElement('div');
    skeletonValue.className = 'skeleton-value';
    
    skeletonItem.appendChild(skeletonLabel);
    skeletonItem.appendChild(skeletonValue);
    skeleton.appendChild(skeletonItem);
  });

  container.appendChild(spinner);
  container.appendChild(loadingText);
  container.appendChild(skeleton);

  const target = document.querySelector(".jobs-details__main-content > div");
  if (target) {
    target.insertAdjacentElement('afterend', container);
  } else {
    console.warn('Fallback: inserting loading card to body.');
    document.body.appendChild(container);
  }
};

const createJobInfoCard = (data) => {
  let container = document.getElementById('linkedin-job-insights');
  if (container){
    container.remove();
  }

  container = document.createElement('section');
  container.id = 'linkedin-job-insights';
  container.className = 'artdeco-card p4 mt4';

  const title = document.createElement('h2');
  title.textContent = 'Job Insights Extension';
  title.className = 'job-insights-title';

  const list = document.createElement('ul');
  list.className = 'job-insights-list';

  const addItem = (label, value, type, rawValue = null) => {
    const li = document.createElement('li');
    li.className = 'job-insights-item';
    li.setAttribute('data-type', type);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'job-insights-label';
    labelSpan.textContent = label;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'job-insights-value';
    
    if (type === 'applications' && rawValue !== null) {
      const competitionLevel = getCompetitionLevel(rawValue);
      valueSpan.innerHTML = `${value || 'N/A'} <span class="competition-indicator ${competitionLevel.class}">${competitionLevel.text}</span>`;
    } else {
      valueSpan.textContent = value || 'N/A';
    }

    li.appendChild(labelSpan);
    li.appendChild(valueSpan);
    list.appendChild(li);
  };

  const getCompetitionLevel = (applications) => {
    if (!applications || applications === 'N/A') return { class: '', text: '' };
    
    const num = parseInt(applications);
    if (num < 10) return { class: 'competition-low', text: '🟢 Low' };
    if (num < 50) return { class: 'competition-medium', text: '🟡 Medium' };
    return { class: 'competition-high', text: '🔴 High' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatCompanySize = (size) => {
    if (!size || size === 'N/A') return 'N/A';
    if (size < 50) return `${size} (Startup)`;
    if (size < 200) return `${size} (Small)`;
    if (size < 1000) return `${size} (Medium)`;
    if (size < 5000) return `${size} (Large)`;
    return `${size} (Enterprise)`;
  };

  addItem('Applications', data.applies, 'applications', data.applies);
  addItem('Experience Level', data.experience, 'experience');
  addItem('Employment Type', data.employment, 'employment');
  addItem('Posted', formatDate(data.posted), 'posted');
  addItem('Expires', formatDate(data.expires), 'expires');
  addItem('Company Size', formatCompanySize(data.staffCount), 'company');
  addItem('Remote Work', data.remote ? 'Yes' : 'No', 'remote');

  container.appendChild(title);
  container.appendChild(list);

  const target = document.querySelector(".jobs-details__main-content > div");
  if (target) {
    target.insertAdjacentElement('afterend', container);
  } else {
    console.warn('Fallback: inserting job insights to body.');
    document.body.appendChild(container);
  }
};


window.addEventListener('message', function (event) {
  if (event.source === window) {
    if (event.data.type === 'LINKEDIN_APPLIES_REQUEST') {
      setTimeout(() => {
        createLoadingCard();
      }, 300);
    }
    
    if (event.data.type === 'LINKEDIN_APPLIES_DATA') {
      const raw = event.data.data;

      const extractedData = {
        remote: raw.data.workRemoteAllowed,
        experience: raw.data.formattedExperienceLevel,
        employment: raw.data.formattedEmploymentStatus,
        applies: raw.data.applies,
        posted: raw.data.originalListedAt,
        expires: raw.data.expireAt,
      };

      const included = event.data.data.included || [];
      const staffCount = included.find(item => item.staffCount);

      extractedData.staffCount = staffCount ? staffCount.staffCount : 'N/A';

      setTimeout(() => {
        createJobInfoCard(extractedData);
      }, 300);
    }
  }
});