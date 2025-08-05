import React from 'react';

const COMPETITION_LEVELS = {
  LOW: { threshold: 50, class: 'competition-low', text: '🟢 Low' },
  MEDIUM: { threshold: 200, class: 'competition-medium', text: '🟡 Medium' },
  HIGH: { class: 'competition-high', text: '🔴 High' }
};

const COMPANY_SIZE_CATEGORIES = [
  { threshold: 10, label: 'Micro' },
  { threshold: 50, label: 'Small' },
  { threshold: 250, label: 'Medium' },
  { label: 'Large' }
];

const INSIGHT_ITEMS = [
    'Applications',
    'Experience Level', 
    'Employment Type',
    'Posted Date',
    'Company Size',
    'Remote Work'
  ];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const JobInsightsCard = ({ data, loading }) => {
  const getCompetitionLevel = (applications) => {
    if (!applications || applications === 'N/A') {
      return { class: '', text: '' };
    }
    
    const num = parseInt(applications, 10);
    if (isNaN(num)) return { class: '', text: '' };
    
    if (num < COMPETITION_LEVELS.LOW.threshold) return COMPETITION_LEVELS.LOW;
    if (num < COMPETITION_LEVELS.MEDIUM.threshold) return COMPETITION_LEVELS.MEDIUM;
    return COMPETITION_LEVELS.HIGH;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / MS_PER_DAY);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatCompanySize = (size) => {
    if (!size || size === 'N/A') return 'N/A';
    
    const numSize = parseInt(size, 10);
    if (isNaN(numSize)) return 'N/A';
    
    for (const category of COMPANY_SIZE_CATEGORIES) {
      if (!category.threshold || numSize < category.threshold) {
        return `${numSize} (${category.label})`;
      }
    }
    
    return `${numSize}`;
  };

  const InsightItem = ({ label, value, type, rawValue = null }) => (
    <li className="job-insights-item" data-type={type}>
      <span className="job-insights-label">{label}</span>
      <span className="job-insights-value">
        {type === 'applications' && rawValue !== null ? (
          <>
            {value || 'N/A'}
            <span className={`competition-indicator ${getCompetitionLevel(rawValue).class}`}>
              {getCompetitionLevel(rawValue).text}
            </span>
          </>
        ) : (
          value || 'N/A'
        )}
      </span>
    </li>
  );

  const LoadingState = () => (
    <section id="linkedin-job-insights" className="artdeco-card p4 mt4 job-insights-loading">
      <div className="loading-spinner"></div>
      <div className="loading-text">
        Loading job insights<span className="loading-dots"></span>
      </div>
      <div className="loading-skeleton">
        {INSIGHT_ITEMS.map((item, index) => (
          <div key={index} className="skeleton-item">
            <div className="skeleton-label"></div>
            <div className="skeleton-value"></div>
          </div>
        ))}
      </div>
    </section>
  );

  if (loading) {
    return <LoadingState />;
  }

  if (!data) {
    return null;
  }

  return (
    <section id="linkedin-job-insights" className="artdeco-card p4 mt4">
      <h2 className="job-insights-title">Job Insights Extension</h2>
      <ul className="job-insights-list">
        <InsightItem 
          label="Applications" 
          value={data.applies} 
          type="applications" 
          rawValue={data.applies} 
        />
        <InsightItem 
          label="Experience Level" 
          value={data.experience} 
          type="experience" 
        />
        <InsightItem 
          label="Employment Type" 
          value={data.employment} 
          type="employment" 
        />
        <InsightItem 
          label="Posted" 
          value={formatDate(data.posted)} 
          type="posted" 
        />
        <InsightItem 
          label="Expires" 
          value={formatDate(data.expires)} 
          type="expires" 
        />
        <InsightItem 
          label="Company Size" 
          value={formatCompanySize(data.staffCount)} 
          type="company" 
        />
        <InsightItem 
          label="Remote Work" 
          value={data.remote ? 'Yes' : 'No'} 
          type="remote" 
        />
      </ul>
      <div className="job-insights-footer">
        <span className="developer-credit">
          Developed by{' '}
          <a 
            href="https://github.com/gabdevele" 
            target="_blank" 
            rel="noopener noreferrer"
            className="developer-link"
          >
            @gabdevele
          </a>
        </span>
      </div>
    </section>
  );
};

export default JobInsightsCard;
