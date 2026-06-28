// Editor type hints only (JSDoc typedefs). No build step — pure documentation/autocomplete.

/**
 * @typedef {Object} SchoolStream
 * @property {string} id
 * @property {string} schoolName
 * @property {string} eventType            // 'Varsity Basketball' | 'Spring Musical' | 'Graduation' | ...
 * @property {string} eventTitle
 * @property {('YouTube'|'Hudl'|'NFHS')} streamPlatform
 * @property {string} streamUrl
 * @property {string} scheduledStartTime   // ISO 8601 (UTC)
 * @property {boolean} isLive
 */

/**
 * @typedef {Object} FieldClip
 * @property {string} id
 * @property {string} correspondentName
 * @property {string} title
 * @property {string} videoUrl             // vertical 9:16 source (mock for now)
 * @property {string} thumbnailUrl         // 9:16 poster
 * @property {string} dateCreated          // ISO 8601 (UTC)
 */

/**
 * @typedef {Object} School
 * @property {string} id
 * @property {string} name
 * @property {string} shortName
 * @property {string} city
 * @property {('Oneida'|'Herkimer'|'Madison')} county
 * @property {('public'|'private'|'college')} type
 * @property {('hs'|'college')} level
 */

/**
 * Replay/archive fields present on a school event when status === 'past':
 * @typedef {Object} SchoolStreamReplayFields
 * @property {('upcoming'|'live'|'past')} status
 * @property {string} replayUrl     // public YouTube link (embed-only / link-out)
 * @property {string} thumbnailUrl
 * @property {string} recordedDate  // ISO 8601 (when it happened)
 * @property {string} source        // credit, e.g. 'RFA Athletics'
 */
