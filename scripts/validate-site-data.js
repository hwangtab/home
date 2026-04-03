const fs = require('fs');
const path = require('path');

const SITE_DATA_PATH = path.join(__dirname, '../src/data/siteData.json');
const VALID_PAGE_TYPES = new Set(['works', 'archive', 'about', 'all']);
const WORK_CATEGORIES = ['music', 'visual', 'writing', 'performance', 'struggle'];

const siteData = JSON.parse(fs.readFileSync(SITE_DATA_PATH, 'utf8'));
const errors = [];
const warnings = [];

const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);

if (!siteData.metadata?.lastUpdated) {
  addError('metadata.lastUpdated is required.');
}

if (!siteData.metadata?.version) {
  addError('metadata.version is required.');
}

if (!siteData.artist?.name) {
  addError('artist.name is required.');
}

if (!siteData.artist?.contact?.email || !siteData.artist?.contact?.phone || !siteData.artist?.contact?.address) {
  addError('artist.contact.email, phone, and address are required.');
}

const seenWorkIds = new Set();

WORK_CATEGORIES.forEach((category) => {
  const works = siteData.works?.[category] ?? [];

  if (!Array.isArray(works)) {
    addError(`works.${category} must be an array.`);
    return;
  }

  works.forEach((work, index) => {
    const label = `works.${category}[${index}]`;

    if (!work.id) {
      addError(`${label}.id is required.`);
    } else if (seenWorkIds.has(work.id)) {
      addError(`${label}.id "${work.id}" is duplicated.`);
    } else {
      seenWorkIds.add(work.id);
    }

    if (!work.title) {
      addError(`${label}.title is required.`);
    }

    if (typeof work.year !== 'number') {
      addError(`${label}.year must be a number.`);
    }

    if (!work.description) {
      addError(`${label}.description is required.`);
    }

    if (work.archiveCategory && work.archiveCategory !== category) {
      addError(`${label}.archiveCategory must be "${category}".`);
    }

    if (work.showInPages) {
      if (!Array.isArray(work.showInPages)) {
        addError(`${label}.showInPages must be an array.`);
      } else {
        work.showInPages.forEach((pageType) => {
          if (!VALID_PAGE_TYPES.has(pageType)) {
            addError(`${label}.showInPages contains invalid value "${pageType}".`);
          }
        });
      }
    } else {
      addWarning(`${label}.showInPages is missing.`);
    }

    if (work.primaryAction && !work.primaryAction.url) {
      addError(`${label}.primaryAction.url is required when primaryAction exists.`);
    }
  });
});

const seenNewsIds = new Set();
(siteData.news ?? []).forEach((item, index) => {
  const label = `news[${index}]`;

  if (!item.id) {
    addError(`${label}.id is required.`);
    return;
  }

  if (seenNewsIds.has(item.id)) {
    addError(`${label}.id "${item.id}" is duplicated.`);
  } else {
    seenNewsIds.add(item.id);
  }
});

if (errors.length > 0) {
  console.error('siteData validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));

  if (warnings.length > 0) {
    console.error('\nWarnings:');
    warnings.forEach((warning) => console.error(`- ${warning}`));
  }

  process.exit(1);
}

console.log('siteData validation passed.');

if (warnings.length > 0) {
  console.log('\nWarnings:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
