// Central Committee & 9 Specialized Subcommittees Configuration
// Full trilingual naming: Khmer (ភាសាខ្មែរ), English, Chinese (中文)

export const OFFICIAL_OFFICE_TITLES = {
  president: {
    key: 'president',
    km: {
      committee: 'ប្រធានគណៈកម្មការ',
      subcommittee: 'ប្រធានអនុគណៈកម្មការ',
      short: 'ប្រធាន'
    },
    en: {
      committee: 'President of the Committee',
      subcommittee: 'President of the Subcommittee',
      short: 'President'
    },
    zh: {
      committee: '委员会主席',
      subcommittee: '分委员会主席',
      short: '主席'
    }
  },
  co_president: {
    key: 'co_president',
    km: {
      committee: 'សហប្រធានគណៈកម្មការ',
      subcommittee: 'សហប្រធានអនុគណៈកម្មការ',
      short: 'សហប្រធាន'
    },
    en: {
      committee: 'Co-President of the Committee',
      subcommittee: 'Co-President of the Subcommittee',
      short: 'Co-President'
    },
    zh: {
      committee: '委员会共同主席',
      subcommittee: '分委员会共同主席',
      short: '共同主席'
    }
  },
  member: {
    key: 'member',
    km: {
      committee: 'សមាជិកគណៈកម្មការ',
      subcommittee: 'សមាជិកអនុគណៈកម្មការ',
      short: 'សមាជិក'
    },
    en: {
      committee: 'Member of the Committee',
      subcommittee: 'Member of the Subcommittee',
      short: 'Member'
    },
    zh: {
      committee: '委员会委员',
      subcommittee: '分委员会委员',
      short: '委员'
    }
  }
};

export const COMMITTEE_STANDARD_PROVISION = {
  km: 'គណៈកម្មការ និងអនុគណៈកម្មការនីមួយៗ ត្រូវមាន៖ ប្រធាន សហប្រធាន និងសមាជិក។',
  en: 'Each committee and subcommittee shall have: President, Co-President, and Members.',
  zh: '各委员会及分委员会均设：主席、共同主席、委员。'
};

export function localizeOfficeRole(role, isMainCommittee = false, lang = 'en') {
  if (!role) {
    const t = OFFICIAL_OFFICE_TITLES.member[lang] || OFFICIAL_OFFICE_TITLES.member.en;
    return isMainCommittee ? t.committee : t.subcommittee;
  }
  const rLower = String(role).toLowerCase().trim();

  // Co-President / Vice President
  if (
    rLower.includes('co-pres') || 
    rLower.includes('copres') || 
    rLower.includes('co pres') ||
    rLower.includes('សហប្រធាន') || 
    rLower.includes('共同主席') ||
    rLower.includes('vice') ||
    rLower.includes('អនុប្រធាន') ||
    rLower.includes('副主席')
  ) {
    const t = OFFICIAL_OFFICE_TITLES.co_president[lang] || OFFICIAL_OFFICE_TITLES.co_president.en;
    return isMainCommittee ? t.committee : t.subcommittee;
  }

  // President / Chair / Lead
  if (
    rLower.includes('presid') || 
    rLower.includes('chair') || 
    rLower.includes('lead') || 
    rLower.includes('ប្រធាន') || 
    rLower.includes('主席')
  ) {
    const t = OFFICIAL_OFFICE_TITLES.president[lang] || OFFICIAL_OFFICE_TITLES.president.en;
    return isMainCommittee ? t.committee : t.subcommittee;
  }

  // Member / Officer
  if (
    rLower.includes('memb') || 
    rLower.includes('officer') || 
    rLower.includes('សមាជិក') || 
    rLower.includes('委员')
  ) {
    const t = OFFICIAL_OFFICE_TITLES.member[lang] || OFFICIAL_OFFICE_TITLES.member.en;
    return isMainCommittee ? t.committee : t.subcommittee;
  }

  return role;
}

export const MAIN_COMMITTEE = {
  id: 'main-committee',
  key: 'Central Committee',
  name: 'Central Committee',
  description: 'Governing board with overall operational responsibility, strategic governance, and final approval authority for EXPO 2026.',
  lead: {
    name: 'LI SIVFONG',
    role: 'President of the Committee',
    username: 'lisivfong',
    avatar: '👨‍💼',
    committee: 'Central Committee',
    bio: 'Leading EXPO 2026 operational governance and final approval authority.'
  },
  members: [],
  color: '#6366f1'
};

export const SUB_COMMITTEES = [
  {
    id: 'sub_protocol',
    key: 'Subcommittee on Reception and Protocol',
    name: 'Subcommittee on Reception and Protocol',
    description: 'Manages VIP delegations, ceremonial protocols, diplomatic reception, and welcoming coordination.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '🤝',
      committee: 'Subcommittee on Reception and Protocol'
    },
    members: [],
    color: '#6366f1',
    badgeClass: 'badge-category-milestone',
    categories: ['milestone', 'activity'],
    memberCount: 0
  },
  {
    id: 'sub_finance',
    key: 'Subcommittee on Finance',
    name: 'Subcommittee on Finance',
    description: 'Oversees budget allocations, sponsorship auditing, financial disbursements, and booth fees.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '💼',
      committee: 'Subcommittee on Finance'
    },
    members: [],
    color: '#10b981',
    badgeClass: 'badge-status-approved',
    categories: ['booth', 'activity', 'milestone'],
    memberCount: 0
  },
  {
    id: 'sub_design_booth',
    key: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    name: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    description: 'Responsible for stage architecture, floor plan layouts, electrical power setups, and booth exhibition management.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '🎪',
      committee: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management'
    },
    members: [],
    color: '#0284c7',
    badgeClass: 'badge-category-booth',
    categories: ['booth'],
    memberCount: 0
  },
  {
    id: 'sub_food',
    key: 'Subcommittee on Organizing the Food and Dessert Exhibition',
    name: 'Subcommittee on Organizing the Food and Dessert Exhibition',
    description: 'Coordinates gourmet culinary booths, dessert exhibitions, food hygiene inspections, and dining court management.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '🍲',
      committee: 'Subcommittee on Organizing the Food and Dessert Exhibition'
    },
    members: [],
    color: '#f59e0b',
    badgeClass: 'badge-status-pending',
    categories: ['booth', 'activity'],
    memberCount: 0
  },
  {
    id: 'sub_arts',
    key: 'Subcommittee on Arts and Singing',
    name: 'Subcommittee on Arts and Singing',
    description: 'Curates artistic live performances, musical showcases, cultural vocal performances, and main stage entertainment.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '🎭',
      committee: 'Subcommittee on Arts and Singing'
    },
    members: [],
    color: '#ec4899',
    badgeClass: 'badge-category-activity',
    categories: ['activity', 'milestone'],
    memberCount: 0
  },
  {
    id: 'sub_media',
    key: 'Subcommittee on Media/Information Dissemination, Photography, and Video',
    name: 'Subcommittee on Media/Information Dissemination, Photography, and Video',
    description: 'Directs press coverage, photography documentation, live broadcasting, and social media dissemination.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '📸',
      committee: 'Subcommittee on Media/Information Dissemination, Photography, and Video'
    },
    members: [],
    color: '#8b5cf6',
    badgeClass: 'badge-category-activity',
    categories: ['activity', 'milestone'],
    memberCount: 0
  },
  {
    id: 'sub_sports',
    key: 'Subcommittee on Sports Competitions and Folk Games',
    name: 'Subcommittee on Sports Competitions and Folk Games',
    description: 'Organizes athletic competitions, traditional folk games, esports tournaments, and interactive crowd challenges.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '🏅',
      committee: 'Subcommittee on Sports Competitions and Folk Games'
    },
    members: [],
    color: '#06b6d4',
    badgeClass: 'badge-category-activity',
    categories: ['activity'],
    memberCount: 0
  },
  {
    id: 'sub_translation',
    key: 'Subcommittee on Khmer-Chinese Translation',
    name: 'Subcommittee on Khmer-Chinese Translation',
    description: 'Provides simultaneous interpretation, trilingual signage translation, and bilateral dialogue coordination.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '🌐',
      committee: 'Subcommittee on Khmer-Chinese Translation'
    },
    members: [],
    color: '#14b8a6',
    badgeClass: 'badge-category-activity',
    categories: ['activity', 'milestone', 'booth'],
    memberCount: 0
  },
  {
    id: 'sub_logistics',
    key: 'Subcommittee on Logistics',
    name: 'Subcommittee on Logistics',
    description: 'Manages freight transport, loading docks, equipment warehousing, venue facilities, and physical supply lines.',
    lead: {
      name: 'To Be Appointed',
      role: 'President of the Subcommittee',
      username: '',
      avatar: '📦',
      committee: 'Subcommittee on Logistics'
    },
    members: [],
    color: '#f97316',
    badgeClass: 'badge-status-rejected',
    categories: ['booth', 'activity', 'milestone'],
    memberCount: 0
  }
];

export const COMMITTEES_MAP = {
  // 1. Central Committee
  'Central Committee': {
    km: 'គណៈកម្មការកណ្តាល',
    en: 'Central Committee',
    zh: '中央委员会'
  },
  'main-committee': {
    km: 'គណៈកម្មការកណ្តាល',
    en: 'Central Committee',
    zh: '中央委员会'
  },
  'Executive Steering Committee': {
    km: 'គណៈកម្មការកណ្តាល',
    en: 'Central Committee',
    zh: '中央委员会'
  },

  // 2. Subcommittee on Reception and Protocol
  'sub_protocol': {
    km: 'អនុគណៈកម្មការបដិសណ្ឋារកិច្ច និងពិធីការ',
    en: 'Subcommittee on Reception and Protocol',
    zh: '礼宾接待分委员会'
  },
  'Subcommittee on Reception and Protocol': {
    km: 'អនុគណៈកម្មការបដិសណ្ឋារកិច្ច និងពិធីការ',
    en: 'Subcommittee on Reception and Protocol',
    zh: '礼宾接待分委员会'
  },

  // 3. Subcommittee on Finance
  'sub_finance': {
    km: 'អនុគណៈកម្មការហិរញ្ញវត្ថុ',
    en: 'Subcommittee on Finance',
    zh: '财务分委员会'
  },
  'Subcommittee on Finance': {
    km: 'អនុគណៈកម្មការហិរញ្ញវត្ថុ',
    en: 'Subcommittee on Finance',
    zh: '财务分委员会'
  },

  // 4. Subcommittee on Design, Stage/Booth Arrangement, and Booth Management
  'sub_design_booth': {
    km: 'អនុគណៈកម្មការរចនា រៀបចំស្តង់ និងឆាក ព្រមទាំងគ្រប់គ្រងស្តង់',
    en: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    zh: '设计、舞台/展台布置及展台管理分委员会'
  },
  'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management': {
    km: 'អនុគណៈកម្មការរចនា រៀបចំស្តង់ និងឆាក ព្រមទាំងគ្រប់គ្រងស្តង់',
    en: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    zh: '设计、舞台/展台布置及展台管理分委员会'
  },
  'Booths & Exhibition': {
    km: 'អនុគណៈកម្មការរចនា រៀបចំស្តង់ និងឆាក ព្រមទាំងគ្រប់គ្រងស្តង់',
    en: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    zh: '设计、舞台/展台布置及展台管理分委员会'
  },
  'sub_booths': {
    km: 'អនុគណៈកម្មការរចនា រៀបចំស្តង់ និងឆាក ព្រមទាំងគ្រប់គ្រងស្តង់',
    en: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    zh: '设计、舞台/展台布置及展台管理分委员会'
  },

  // 5. Subcommittee on Organizing the Food and Dessert Exhibition
  'sub_food': {
    km: 'អនុគណៈកម្មការរៀបចំពិព័រណ៍ម្ហូបអាហារ និងបង្អែម',
    en: 'Subcommittee on Organizing the Food and Dessert Exhibition',
    zh: '美食与甜品展览筹备分委员会'
  },
  'Subcommittee on Organizing the Food and Dessert Exhibition': {
    km: 'អនុគណៈកម្មការរៀបចំពិព័រណ៍ម្ហូបអាហារ និងបង្អែម',
    en: 'Subcommittee on Organizing the Food and Dessert Exhibition',
    zh: '美食与甜品展览筹备分委员会'
  },

  // 6. Subcommittee on Arts and Singing
  'sub_arts': {
    km: 'អនុគណៈកម្មការសិល្បៈ និងចម្រៀង',
    en: 'Subcommittee on Arts and Singing',
    zh: '艺术与歌唱分委员会'
  },
  'Subcommittee on Arts and Singing': {
    km: 'អនុគណៈកម្មការសិល្បៈ និងចម្រៀង',
    en: 'Subcommittee on Arts and Singing',
    zh: '艺术与歌唱分委员会'
  },

  // 7. Subcommittee on Media/Information Dissemination, Photography, and Video
  'sub_media': {
    km: 'អនុគណៈកម្មការប្រព័ន្ធផ្សព្វផ្សាយព័ត៌មាន ថតរូប និងវីដេអូ',
    en: 'Subcommittee on Media/Information Dissemination, Photography, and Video',
    zh: '媒体宣传、摄影及视频分委员会'
  },
  'Subcommittee on Media/Information Dissemination, Photography, and Video': {
    km: 'អនុគណៈកម្មការប្រព័ន្ធផ្សព្វផ្សាយព័ត៌មាន ថតរូប និងវីដេអូ',
    en: 'Subcommittee on Media/Information Dissemination, Photography, and Video',
    zh: '媒体宣传、摄影及视频分委员会'
  },

  // 8. Subcommittee on Sports Competitions and Folk Games
  'sub_sports': {
    km: 'អនុគណៈកម្មការប្រកួតកីឡា និងល្បែងប្រជាប្រិយ',
    en: 'Subcommittee on Sports Competitions and Folk Games',
    zh: '体育比赛与民间游戏分委员会'
  },
  'Subcommittee on Sports Competitions and Folk Games': {
    km: 'អនុគណៈកម្មការប្រកួតកីឡា និងល្បែងប្រជាប្រិយ',
    en: 'Subcommittee on Sports Competitions and Folk Games',
    zh: '体育比赛与民间游戏分委员会'
  },
  'Programs & Activities': {
    km: 'អនុគណៈកម្មការប្រកួតកីឡា និងល្បែងប្រជាប្រិយ',
    en: 'Subcommittee on Sports Competitions and Folk Games',
    zh: '体育比赛与民间游戏分委员会'
  },
  'sub_activities': {
    km: 'អនុគណៈកម្មការប្រកួតកីឡា និងល្បែងប្រជាប្រិយ',
    en: 'Subcommittee on Sports Competitions and Folk Games',
    zh: '体育比赛与民间游戏分委员会'
  },

  // 9. Subcommittee on Khmer-Chinese Translation
  'sub_translation': {
    km: 'អនុគណៈកម្មការបកប្រែ ខ្មែរ-ចិន',
    en: 'Subcommittee on Khmer-Chinese Translation',
    zh: '高棉语—中文翻译分委员会'
  },
  'Subcommittee on Khmer-Chinese Translation': {
    km: 'អនុគណៈកម្មការបកប្រែ ខ្មែរ-ចិន',
    en: 'Subcommittee on Khmer-Chinese Translation',
    zh: '高棉语—中文翻译分委员会'
  },

  // 10. Subcommittee on Logistics
  'sub_logistics': {
    km: 'អនុគណៈកម្មការភស្តុភារ',
    en: 'Subcommittee on Logistics',
    zh: '后勤保障分委员会'
  },
  'Subcommittee on Logistics': {
    km: 'អនុគណៈកម្មការភស្តុភារ',
    en: 'Subcommittee on Logistics',
    zh: '后勤保障分委员会'
  },
  'Safety & Compliance': {
    km: 'អនុគណៈកម្មការភស្តុភារ',
    en: 'Subcommittee on Logistics',
    zh: '后勤保障分委员会'
  },
  'sub_safety': {
    km: 'អនុគណៈកម្មការភស្តុភារ',
    en: 'Subcommittee on Logistics',
    zh: '后勤保障分委员会'
  }
};

export function getSubCommitteeByKey(key) {
  return SUB_COMMITTEES.find(sc => sc.key === key || sc.id === key) || null;
}

export function getDefaultSubCommitteeForCategory(category) {
  switch (category) {
    case 'booth':
      return 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management';
    case 'activity':
      return 'Subcommittee on Sports Competitions and Folk Games';
    case 'milestone':
      return 'Subcommittee on Reception and Protocol';
    default:
      return 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management';
  }
}

export function getSubCommitteeLocalizedName(keyOrId, lang = 'en') {
  if (!keyOrId) return '';
  const item = COMMITTEES_MAP[keyOrId];
  if (item && item[lang]) {
    return item[lang];
  }
  return keyOrId;
}

export const ALL_COMMITTEES_LIST = [
  { ...MAIN_COMMITTEE, type: 'main' },
  ...SUB_COMMITTEES.map(s => ({ ...s, type: 'sub' }))
];

