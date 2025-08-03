console.log('LinkedIn Applications extension loaded');

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
(document.head || document.documentElement).appendChild(script);

script.onload = function () {
  console.log('Injector loaded');
  script.remove();
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
  title.textContent = 'Job Insights';
  title.className = 'job-insights-title';

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = 0;
  list.style.margin = 0;

  const addItem = (label, value) => {
    const li = document.createElement('li');
    li.className = 'job-insights-item mb1';

    const strong = document.createElement('strong');
    strong.textContent = label + ': ';
    li.appendChild(strong);

    li.appendChild(document.createTextNode(value || 'N/A'));
    list.appendChild(li);
  };

  addItem('Applications', data.applies);
  addItem('Experience Level', data.experience);
  addItem('Employment Type', data.employment);
  addItem('Posted', new Date(data.posted).toLocaleDateString());
  addItem('Expires', new Date(data.expires).toLocaleDateString());
  addItem('Company Size', data.staffCount);
  addItem('Remote Work', data.remote ? 'Yes' : 'No');

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
  if (event.source === window && event.data.type === 'LINKEDIN_APPLIES_DATA') {
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
    }, 1000);
  }
});