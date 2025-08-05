import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import JobInsightsCard from './components/JobInsightsCard';

const CONFIG = {
  CONTAINER_ID: 'linkedin-job-insights-root',
  TARGET_SELECTOR: '.jobs-details__main-content > div',
  LOADING_DELAY: 300,
  OBSERVER_TIMEOUT: 10000
};

const MESSAGE_TYPES = {
  REQUEST: 'LINKEDIN_APPLIES_REQUEST',
  DATA: 'LINKEDIN_APPLIES_DATA'
};

const extractJobData = (rawData) => {
  const jobData = rawData.data;
  const included = rawData.included || [];
  const staffCountItem = included.find(item => item.staffCount);

  return {
    remote: jobData.workRemoteAllowed,
    experience: jobData.formattedExperienceLevel,
    employment: jobData.formattedEmploymentStatus,
    applies: jobData.applies,
    posted: jobData.originalListedAt,
    expires: jobData.expireAt,
    staffCount: staffCountItem ? staffCountItem.staffCount : 'N/A'
  };
};

const useMessageHandler = () => {
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== window) return;

      const { type, data } = event.data;

      switch (type) {
        case MESSAGE_TYPES.REQUEST:
          setTimeout(() => {
            setLoading(true);
            setJobData(null);
          }, CONFIG.LOADING_DELAY);
          break;

        case MESSAGE_TYPES.DATA:
          setTimeout(() => {
            setLoading(false);
            setJobData(extractJobData(data));
          }, CONFIG.LOADING_DELAY);
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return { loading, jobData };
};

const LinkedInExtensionApp = () => {
  const { loading, jobData } = useMessageHandler();
  return <JobInsightsCard data={jobData} loading={loading} />;
};

const createContainer = () => {
  const existingContainer = document.getElementById(CONFIG.CONTAINER_ID);
  if (existingContainer) return existingContainer;

  const container = document.createElement('div');
  container.id = CONFIG.CONTAINER_ID;
  
  return container;
};

const insertContainer = (container) => {
  const target = document.querySelector(CONFIG.TARGET_SELECTOR);
  if (target) {
    target.insertAdjacentElement('afterend', container);
    return true;
  }
  return false;
};

const setupContainerInsertion = (container) => {
  if (insertContainer(container)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (insertContainer(container)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      if (!container.parentNode) {
        console.warn('Fallback: inserting extension container to body');
        document.body.appendChild(container);
      }
      resolve();
    }, CONFIG.OBSERVER_TIMEOUT);
  });
};

const initExtension = async () => {
  try {
    console.log('LinkedIn Applications extension loaded');

    const container = createContainer();
    await setupContainerInsertion(container);

    const root = createRoot(container);
    root.render(<LinkedInExtensionApp />);
    
  } catch (error) {
    console.error('Failed to initialize LinkedIn extension:', error);
  }
};


initExtension();

export default LinkedInExtensionApp;