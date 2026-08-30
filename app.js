const REFRESH_INTERVAL_MS = 1_000;


/*
 * ==================================================
 * TEAM REGISTRY
 * ==================================================
 */

const TEAMS = {
  'everest blue': {
    name: 'Everest Blue',
    logo: 'assets/everst_blue.jpg'
  },

  'everest white': {
    name: 'Everest White',
    logo: 'assets/everst_white.jpg'
  },

  ltsk: {
    name: 'LTSK',
    logo: 'assets/ltsk.jpg'
  },

  minnel: {
    name: 'Minnel',
    logo: 'assets/minnel.jpg'
  },

  nordavind: {
    name: 'Nordavind',
    logo: 'assets/nordavind.jpg'
  },

  noreel: {
    name: 'Noreel',
    logo: 'assets/noreel.png'
  },

  'stovner giants': {
    name: 'Stovner Giants',
    logo: 'assets/stovner_giants.jpg'
  },

  'stovner lions': {
    name: 'Stovner Lions',
    logo: 'assets/stovner_lions.jpg'
  },

  'unique black': {
    name: 'Unique Black',
    logo: 'assets/unique_black.jpg'
  }
};


/*
 * ==================================================
 * DOM
 * ==================================================
 */

const els = {
  competition:
    document.querySelector('#competition'),

  mainMatch:
    document.querySelector('#mainMatch'),

  mainMatchUpdates:
    document.querySelector('#mainMatchUpdates'),

  eventFeed:
    document.querySelector('#eventFeed'),

  matches:
    document.querySelector('#matches'),

  lastUpdated:
    document.querySelector('#lastUpdated')
};


/*
 * ==================================================
 * HELPERS
 * ==================================================
 */

function safeText(
  value,
  fallback = '—'
) {
  const empty =
    value === undefined ||
    value === null ||
    String(value).trim() === '';

  return empty
    ? fallback
    : String(value);
}


function safeScore(value) {
  const score =
    Number(value);

  if (
    !Number.isFinite(score) ||
    score < 0
  ) {
    return 0;
  }

  return Math.floor(score);
}


function safePenaltyScore(value) {
  const score =
    Number(value);

  if (
    !Number.isFinite(score) ||
    score < 0
  ) {
    return 0;
  }

  return Math.floor(score);
}


function normalizeTeamName(name) {
  return String(name || '')
    .trim()
    .toLowerCase();
}


function normalizeStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
    .replaceAll('_', '-')
    .replaceAll(' ', '-');
}


function normalizePhase(phase) {
  return String(phase || '')
    .trim()
    .toLowerCase()
    .replaceAll('_', '-')
    .replaceAll(' ', '-');
}


function createElement(
  tag,
  className = '',
  text = null
) {
  const element =
    document.createElement(tag);

  if (className) {
    element.className =
      className;
  }

  if (
    text !== null &&
    text !== undefined
  ) {
    element.textContent =
      text;
  }

  return element;
}


/*
 * ==================================================
 * TEAM
 * ==================================================
 */

function getTeam(teamData) {
  const key =
    normalizeTeamName(
      teamData?.name
    );

  const registered =
    TEAMS[key];


  if (registered) {

    return {
      ...registered,

      score:
        safeScore(
          teamData?.score
        ),

      penalties:
        teamData?.penalties === undefined
          ? null
          : safePenaltyScore(
              teamData.penalties
            )
    };

  }


  return {
    name:
      safeText(
        teamData?.name,
        'Unknown team'
      ),

    logo: '',

    score:
      safeScore(
        teamData?.score
      ),

    penalties:
      teamData?.penalties === undefined
        ? null
        : safePenaltyScore(
            teamData.penalties
          )
  };
}


/*
 * ==================================================
 * MATCH STATUS
 * ==================================================
 */

function getStatusData(status) {

  switch (
    normalizeStatus(status)
  ) {

    case 'in-progress':

      return {
        label: 'IN PROGRESS',
        className: 'status-in-progress'
      };


    case 'done':

      return {
        label: 'DONE',
        className: 'status-done'
      };


    default:

      return {
        label: 'NOT STARTED',
        className: 'status-not-started'
      };
  }
}


function createStatusBadge(
  status,
  extraClass = ''
) {
  const statusData =
    getStatusData(status);


  const badge =
    createElement(
      'div',
      `status-badge ${statusData.className} ${extraClass}`.trim()
    );


  const dot =
    createElement(
      'span',
      'status-dot'
    );


  dot.setAttribute(
    'aria-hidden',
    'true'
  );


  badge.append(
    dot,

    createElement(
      'span',
      '',
      statusData.label
    )
  );


  return badge;
}


/*
 * ==================================================
 * MATCH PHASE
 * ==================================================
 */

function getPhaseLabel(
  phase,
  status
) {
  const normalizedPhase =
    normalizePhase(phase);

  const normalizedStatus =
    normalizeStatus(status);


  /*
   * A finished penalty shootout should
   * still say PENALTIES.
   */

  if (
    normalizedPhase === 'penalties' ||
    normalizedPhase === 'penalty' ||
    normalizedPhase === 'penalty-shootout'
  ) {
    return 'PENALTIES';
  }


  /*
   * Normal phases only need to be shown
   * while a match is being played.
   */

  if (
    normalizedStatus !==
    'in-progress'
  ) {
    return '';
  }


  switch (normalizedPhase) {

    case '1st-half':
    case 'first-half':
    case '1st':
    case 'first':
    case '1':

      return '1ST HALF';


    case '2nd-half':
    case 'second-half':
    case '2nd':
    case 'second':
    case '2':

      return '2ND HALF';


    case '1st-extra-half':
    case 'first-extra-half':
    case '1st-extra':
    case 'first-extra':

      return '1ST EXTRA HALF';


    case '2nd-extra-half':
    case 'second-extra-half':
    case '2nd-extra':
    case 'second-extra':

      return '2ND EXTRA HALF';


    default:

      return '';
  }
}


/*
 * ==================================================
 * PENALTIES
 * ==================================================
 */

function hasPenaltyScore(
  teamA,
  teamB
) {
  return (
    teamA.penalties !== null &&
    teamB.penalties !== null
  );
}


function createFeaturedPenaltyScore(
  teamA,
  teamB
) {
  const row =
    createElement(
      'div',
      'featured-penalty-score'
    );


  row.append(
    createElement(
      'span',
      'penalty-label',
      'PENS'
    ),

    createElement(
      'span',
      'penalty-number',
      teamA.penalties
    ),

    createElement(
      'span',
      'penalty-separator',
      ':'
    ),

    createElement(
      'span',
      'penalty-number',
      teamB.penalties
    )
  );


  return row;
}


function createOverviewPenaltyScore(
  teamA,
  teamB
) {
  const row =
    createElement(
      'div',
      'overview-penalty-score'
    );


  row.append(
    createElement(
      'span',
      '',
      'PENS'
    ),

    createElement(
      'strong',
      '',
      `${teamA.penalties} : ${teamB.penalties}`
    )
  );


  return row;
}


/*
 * ==================================================
 * LOGO
 * ==================================================
 */

function createTeamLogo(
  team,
  size = 'small'
) {
  const frame =
    createElement(
      'div',
      `team-logo-frame logo-${size}`
    );


  if (team.logo) {

    const image =
      document.createElement('img');


    image.src =
      team.logo;


    image.alt =
      `${team.name} logo`;


    frame.append(
      image
    );

  } else {

    frame.append(
      createElement(
        'span',
        'team-logo-fallback',
        '?'
      )
    );

  }


  return frame;
}


/*
 * ==================================================
 * EVENTS
 * ==================================================
 */

function getEventData(type) {

  switch (
    String(type || '')
      .trim()
      .toLowerCase()
  ) {

    case 'goal':

      return {
        icon: '⚽',
        label: 'Goal',
        className: 'event-goal'
      };


    case 'yellow-card':

      return {
        icon: '',
        label: 'Yellow card',
        className: 'event-yellow-card'
      };


    case 'red-card':

      return {
        icon: '',
        label: 'Red card',
        className: 'event-red-card'
      };


    case 'penalty-goal':

      return {
        icon: '⚽',
        label: 'Penalty scored',
        className: 'event-penalty-goal'
      };


    case 'penalty-miss':

      return {
        icon: '✕',
        label: 'Penalty missed',
        className: 'event-penalty-miss'
      };


    default:

      return {
        icon: '•',
        label: 'Match update',
        className: 'event-other'
      };
  }
}


function createEventItem(
  event,
  match
) {
  const eventData =
    getEventData(
      event?.type
    );


  const isTeamB =
    String(
      event?.team || 'A'
    )
      .trim()
      .toUpperCase() === 'B';


  const eventTeam =
    isTeamB
      ? getTeam(match.teamB)
      : getTeam(match.teamA);


  const item =
    createElement(
      'li',
      `event-item ${eventData.className}`
    );


  /*
   * ICON
   */

  const icon =
    createElement(
      'div',
      'event-icon'
    );


  if (
    eventData.className ===
    'event-yellow-card'
  ) {

    icon.append(
      createElement(
        'span',
        'card-icon yellow-card-icon'
      )
    );

  } else if (
    eventData.className ===
    'event-red-card'
  ) {

    icon.append(
      createElement(
        'span',
        'card-icon red-card-icon'
      )
    );

  } else {

    icon.textContent =
      eventData.icon;

  }


  /*
   * CONTENT
   */

  const content =
    createElement(
      'div',
      'event-content'
    );


  const heading =
    createElement(
      'div',
      'event-heading'
    );


  heading.append(
    createElement(
      'strong',
      '',
      eventData.label
    ),

    createElement(
      'span',
      'event-team-name',
      eventTeam.name
    )
  );


  content.append(
    heading
  );


  item.append(
    icon,
    content
  );


  return item;
}


function renderEvents(match) {
  els.eventFeed.replaceChildren();


  const events =
    Array.isArray(match?.events)
      ? match.events
      : [];


  if (events.length === 0) {

    els.eventFeed.append(
      createElement(
        'li',
        'events-empty',
        'No match updates yet.'
      )
    );


    return;
  }


  /*
   * Newest event first.
   */

  [...events]
    .reverse()
    .forEach((event) => {

      els.eventFeed.append(
        createEventItem(
          event,
          match
        )
      );

    });
}


/*
 * ==================================================
 * FEATURED TEAM
 * ==================================================
 */

function createFeaturedTeam(team) {
  const container =
    createElement(
      'div',
      'featured-team'
    );


  container.append(
    createTeamLogo(
      team,
      'large'
    ),

    createElement(
      'h3',
      'featured-team-name',
      team.name
    )
  );


  return container;
}


/*
 * ==================================================
 * FEATURED MATCH INFO
 * ==================================================
 */

function createFeaturedMatchInfo(match) {
  const info =
    createElement(
      'div',
      'featured-match-info'
    );


  const phase =
    getPhaseLabel(
      match.phase,
      match.status
    );


  if (phase) {

    info.append(
      createElement(
        'div',
        'featured-phase',
        phase
      )
    );

  }


  info.append(
    createStatusBadge(
      match.status,
      'featured-center-status'
    )
  );


  return info;
}


/*
 * ==================================================
 * MAIN MATCH
 * ==================================================
 */

function renderMainMatch(match) {
  els.mainMatch.replaceChildren();


  if (!match) {

    els.mainMatch.append(
      createElement(
        'div',
        'main-match-empty',
        'No featured match selected.'
      )
    );


    els.mainMatchUpdates.hidden =
      true;


    return;
  }


  els.mainMatchUpdates.hidden =
    false;


  const teamA =
    getTeam(
      match.teamA
    );


  const teamB =
    getTeam(
      match.teamB
    );


  const card =
    createElement(
      'article',
      'featured-match'
    );


  /*
   * HEADER
   */

  const top =
    createElement(
      'div',
      'featured-top'
    );


  const titleArea =
    createElement(
      'div'
    );


  titleArea.append(
    createElement(
      'p',
      'eyebrow',
      'MAIN MATCH'
    ),

    createElement(
      'h2',
      'featured-title',
      `Match ${safeText(
        match.matchNumber,
        ''
      )} · ${safeText(
        match.stage,
        'Match'
      )}`
    )
  );


  top.append(
    titleArea
  );


  /*
   * SCORE AREA
   */

  const scoreArea =
    createElement(
      'div',
      'featured-score-area'
    );


  const teamAElement =
    createFeaturedTeam(
      teamA
    );


  const teamBElement =
    createFeaturedTeam(
      teamB
    );


  const scoreBlock =
    createElement(
      'div',
      'featured-score-block'
    );


  const scoreRow =
    createElement(
      'div',
      'featured-score-row'
    );


  scoreRow.append(
    createElement(
      'span',
      'featured-score',
      teamA.score
    ),

    createElement(
      'span',
      'featured-score-separator',
      ':'
    ),

    createElement(
      'span',
      'featured-score',
      teamB.score
    )
  );


  scoreBlock.append(
    scoreRow
  );


  /*
   * PENALTY SCORE
   */

  if (
    hasPenaltyScore(
      teamA,
      teamB
    )
  ) {

    scoreBlock.append(
      createFeaturedPenaltyScore(
        teamA,
        teamB
      )
    );

  }


  /*
   * PHASE + STATUS
   */

  scoreBlock.append(
    createFeaturedMatchInfo(
      match
    )
  );


  scoreArea.append(
    teamAElement,
    scoreBlock,
    teamBElement
  );


  /*
   * RED ACCENT
   */

  const accent =
    createElement(
      'div',
      'featured-accent'
    );


  accent.append(
    createElement('span')
  );


  card.append(
    top,
    scoreArea,
    accent
  );


  els.mainMatch.append(
    card
  );


  renderEvents(
    match
  );
}


/*
 * ==================================================
 * OVERVIEW TEAM
 * ==================================================
 */

function createOverviewTeam(team) {
  const element =
    createElement(
      'div',
      'overview-team'
    );


  element.append(
    createTeamLogo(
      team,
      'small'
    ),

    createElement(
      'div',
      'overview-team-name',
      team.name
    )
  );


  return element;
}


/*
 * ==================================================
 * OVERVIEW MATCH INFO
 * ==================================================
 */

function createOverviewMatchInfo(match) {
  const area =
    createElement(
      'div',
      'overview-status-area'
    );


  const phase =
    getPhaseLabel(
      match.phase,
      match.status
    );


  if (phase) {

    area.append(
      createElement(
        'span',
        'overview-phase',
        phase
      )
    );

  }


  area.append(
    createStatusBadge(
      match.status
    )
  );


  return area;
}


/*
 * ==================================================
 * MATCH CARD
 * ==================================================
 */

function createMatchCard(
  match,
  mainMatchId
) {
  const teamA =
    getTeam(
      match.teamA
    );


  const teamB =
    getTeam(
      match.teamB
    );


  const isMain =
    match.id ===
    mainMatchId;


  const card =
    createElement(
      'article',
      `match-card ${isMain ? 'is-main-match' : ''}`.trim()
    );


  /*
   * CURRENT MATCH MARKER
   */

  if (isMain) {

    card.append(
      createElement(
        'div',
        'main-match-marker',
        'CURRENT MATCH'
      )
    );

  }


  /*
   * TOP
   */

  const top =
    createElement(
      'div',
      'match-card-top'
    );


  const meta =
    createElement(
      'div',
      'match-meta'
    );


  meta.append(
    createElement(
      'span',
      'match-number',
      `Match ${safeText(
        match.matchNumber,
        ''
      )}`
    ),

    createElement(
      'span',
      'meta-divider'
    ),

    createElement(
      'span',
      '',
      safeText(
        match.stage,
        'Match'
      )
    )
  );


  top.append(
    meta,

    createOverviewMatchInfo(
      match
    )
  );


  /*
   * BODY
   */

  const body =
    createElement(
      'div',
      'match-card-body'
    );


  const scoreArea =
    createElement(
      'div',
      'overview-score-area'
    );


  const score =
    createElement(
      'div',
      'overview-score'
    );


  score.append(
    createElement(
      'span',
      '',
      teamA.score
    ),

    createElement(
      'span',
      'overview-score-separator',
      ':'
    ),

    createElement(
      'span',
      '',
      teamB.score
    )
  );


  scoreArea.append(
    score
  );


  if (
    hasPenaltyScore(
      teamA,
      teamB
    )
  ) {

    scoreArea.append(
      createOverviewPenaltyScore(
        teamA,
        teamB
      )
    );

  }


  body.append(
    createOverviewTeam(
      teamA
    ),

    scoreArea,

    createOverviewTeam(
      teamB
    )
  );


  card.append(
    top,
    body
  );


  return card;
}


/*
 * ==================================================
 * ALL MATCHES
 * ==================================================
 */

function renderMatches(
  matches,
  mainMatchId
) {
  els.matches.replaceChildren();


  if (
    !Array.isArray(matches) ||
    matches.length === 0
  ) {

    els.matches.append(
      createElement(
        'div',
        'matches-empty',
        'No matches available.'
      )
    );


    return;
  }


  matches.forEach(
    (match) => {

      els.matches.append(
        createMatchCard(
          match,
          mainMatchId
        )
      );

    }
  );
}


/*
 * ==================================================
 * LAST UPDATED
 * ==================================================
 */

function renderLastUpdated() {
  const formatted =
    new Intl.DateTimeFormat(
      undefined,
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    ).format(
      new Date()
    );


  els.lastUpdated.textContent =
    `UPDATED ${formatted}`;
}


/*
 * ==================================================
 * RENDER
 * ==================================================
 */

function render(data) {
  const matches =
    Array.isArray(data.matches)
      ? data.matches
      : [];


  const mainMatchId =
    safeText(
      data.mainMatchId,
      ''
    );


  const mainMatch =
    matches.find(
      (match) =>
        match.id === mainMatchId
    ) || null;


  els.competition.textContent =
    safeText(
      data.competition,
      'Noreel Cup'
    );


  renderMainMatch(
    mainMatch
  );


  renderMatches(
    matches,
    mainMatchId
  );


  renderLastUpdated();


  document.title =
    `${safeText(
      data.competition,
      'Noreel Cup'
    )} · Live Scores`;
}


/*
 * ==================================================
 * FETCH JSON
 * ==================================================
 */

async function loadMatchData() {
  try {

    const response =
      await fetch(
        `match-data.json?t=${Date.now()}`,
        {
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    render(
      data
    );

  } catch (error) {

    console.error(
      'Could not load match-data.json:',
      error
    );

  }
}


/*
 * Initial load
 */

loadMatchData();


/*
 * Poll every 10 seconds
 */

setInterval(
  loadMatchData,
  REFRESH_INTERVAL_MS
);
