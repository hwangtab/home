const fs = require('fs');
const path = require('path');

const SITE_DATA_PATH = path.join(__dirname, '../src/data/siteData.json');
const VALID_PAGE_TYPES = new Set(['works', 'archive', 'about', 'all']);
const WORK_CATEGORIES = ['music', 'visual', 'writing', 'performance', 'struggle'];
const VALID_ACTION_TYPES = new Set(['play', 'read', 'view', 'watch', 'link']);
const VALID_CONCERT_STATUSES = new Set(['upcoming', 'past', 'cancelled']);
const VALID_MUSIC_TYPES = new Set(['album', 'single']);

const siteData = JSON.parse(fs.readFileSync(SITE_DATA_PATH, 'utf8'));
const errors = [];
const warnings = [];

const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);

const isValidDateString = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

const isValidUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }

  try {
    const url = new URL(value);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const validateAssetPath = (label, value) => {
  if (!value) {
    return;
  }

  if (typeof value !== 'string') {
    addError(`${label} must be a string.`);
    return;
  }

  if (value.startsWith('/')) {
    const publicPath = path.join(__dirname, '../public', value);
    if (!fs.existsSync(publicPath)) {
      addError(`${label} references missing local asset "${value}".`);
    }
    return;
  }

  if (!isValidUrl(value)) {
    addError(`${label} must be a local public path or http(s) URL.`);
  }
};

if (!siteData.metadata?.lastUpdated) {
  addError('metadata.lastUpdated is required.');
} else if (!isValidDateString(siteData.metadata.lastUpdated)) {
  addError('metadata.lastUpdated must be a valid YYYY-MM-DD date.');
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
const validWorkCategorySet = new Set(WORK_CATEGORIES);

if (!siteData.works || typeof siteData.works !== 'object' || Array.isArray(siteData.works)) {
  addError('works must be an object.');
} else {
  Object.keys(siteData.works).forEach((category) => {
    if (!validWorkCategorySet.has(category)) {
      addError(`works contains unknown category "${category}".`);
    }
  });
}

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
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id)) {
      addError(`${label}.id "${work.id}" must be URL-safe kebab-case.`);
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
    } else if (!Number.isInteger(work.year) || work.year < 1900 || work.year > 2100) {
      addError(`${label}.year must be an integer between 1900 and 2100.`);
    }

    if (!work.description) {
      addError(`${label}.description is required.`);
    }

    if (work.type !== undefined && typeof work.type !== 'string') {
      addError(`${label}.type must be a string when present.`);
    } else if (category === 'music' && work.type && !VALID_MUSIC_TYPES.has(work.type)) {
      addError(`${label}.type "${work.type}" is invalid for music.`);
    }

    if (work.archiveCategory && work.archiveCategory !== category) {
      addError(`${label}.archiveCategory must be "${category}".`);
    }

    validateAssetPath(`${label}.cover`, work.cover);

    if (work.images) {
      if (!Array.isArray(work.images)) {
        addError(`${label}.images must be an array.`);
      } else {
        work.images.forEach((image, imageIndex) => validateAssetPath(`${label}.images[${imageIndex}]`, image));
      }
    }

    if (work.audioUrl && !isValidUrl(work.audioUrl)) {
      addError(`${label}.audioUrl must be a valid URL.`);
    }

    if (work.links) {
      if (typeof work.links !== 'object' || Array.isArray(work.links)) {
        addError(`${label}.links must be an object.`);
      } else {
        Object.entries(work.links).forEach(([platform, url]) => {
          if (!isValidUrl(url)) {
            addError(`${label}.links.${platform} must be a valid URL.`);
          }
        });
      }
    }

    if (work.showInPages) {
      if (!Array.isArray(work.showInPages)) {
        addError(`${label}.showInPages must be an array.`);
      } else {
        const seenPageTypes = new Set();
        work.showInPages.forEach((pageType) => {
          if (!VALID_PAGE_TYPES.has(pageType)) {
            addError(`${label}.showInPages contains invalid value "${pageType}".`);
          }
          if (seenPageTypes.has(pageType)) {
            addError(`${label}.showInPages contains duplicate value "${pageType}".`);
          }
          seenPageTypes.add(pageType);
        });
      }
    }

    if (work.tags) {
      if (!Array.isArray(work.tags)) {
        addError(`${label}.tags must be an array.`);
      } else {
        const seenTags = new Set();
        work.tags.forEach((tag, tagIndex) => {
          if (typeof tag !== 'string' || tag.trim() === '') {
            addError(`${label}.tags[${tagIndex}] must be a non-empty string.`);
            return;
          }
          if (seenTags.has(tag)) {
            addError(`${label}.tags contains duplicate value "${tag}".`);
          }
          seenTags.add(tag);
        });
      }
    }

    if (work.primaryAction) {
      if (!work.primaryAction.type || !work.primaryAction.label || !work.primaryAction.url) {
        addError(`${label}.primaryAction must include type, label, and url when present.`);
      } else {
        if (!VALID_ACTION_TYPES.has(work.primaryAction.type)) {
          addError(`${label}.primaryAction.type "${work.primaryAction.type}" is invalid.`);
        }
        if (!isValidUrl(work.primaryAction.url)) {
          addError(`${label}.primaryAction.url must be a valid URL.`);
        }
      }
    }
  });
});

const seenConcertIds = new Set();
const concerts = siteData.events?.concerts;

if (!Array.isArray(concerts)) {
  addError('events.concerts must be an array.');
}

(Array.isArray(concerts) ? concerts : []).forEach((item, index) => {
  const label = `events.concerts[${index}]`;

  if (!item.id) {
    addError(`${label}.id is required.`);
  } else if (seenConcertIds.has(item.id)) {
    addError(`${label}.id "${item.id}" is duplicated.`);
  } else {
    seenConcertIds.add(item.id);
  }

  if (!item.title) {
    addError(`${label}.title is required.`);
  }

  if (!isValidDateString(item.date)) {
    addError(`${label}.date must be a valid YYYY-MM-DD date.`);
  }

  if (!item.location) {
    addError(`${label}.location is required.`);
  }

  if (!VALID_CONCERT_STATUSES.has(item.status)) {
    addError(`${label}.status "${item.status}" is invalid.`);
  }

  if (item.ticketUrl && !isValidUrl(item.ticketUrl)) {
    addError(`${label}.ticketUrl must be a valid URL.`);
  }
});

const seenNewsIds = new Set();
if (!Array.isArray(siteData.news)) {
  addError('news must be an array.');
}

(Array.isArray(siteData.news) ? siteData.news : []).forEach((item, index) => {
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

  if (!item.title) {
    addError(`${label}.title is required.`);
  }

  if (!isValidDateString(item.date)) {
    addError(`${label}.date must be a valid YYYY-MM-DD date.`);
  }

  if (!item.content) {
    addError(`${label}.content is required.`);
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
