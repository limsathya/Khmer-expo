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

// --- FUNCTIONAL WORKING GROUPS / SQUADS (Designed for large committees with 50+ to 100+ members) ---
export const COMMITTEE_WORKING_GROUPS = {
  // 1. Central Committee
  'main-committee': [
    {
      key: 'steering',
      icon: '🏛️',
      name: { km: 'ក្រុមអភិបាលកិច្ច និងយុទ្ធសាស្ត្រ', en: 'Executive Steering & Strategic Governance Group', zh: '执行决策与战略治理工作组' },
      description: { km: 'ដឹកនាំគោលនយោបាយ និងការសម្រេចចិត្តកំពូល', en: 'Directs overarching expo governance and executive decisions', zh: '负责世博会全局发展战略规划与最高决策审批' }
    },
    {
      key: 'operations',
      icon: '📋',
      name: { km: 'ក្រុមប្រតិបត្តិការទូទៅ និងអធិការកិច្ច', en: 'General Operations & Oversight Group', zh: '运营统筹与督导巡查工作组' },
      description: { km: 'ត្រួតពិនិត្យដំណើរការប្រតិបត្តិការជារួម', en: 'Monitors holistic operations across all event zones', zh: '全面督导巡视展会各区域落地执行与现场运转' }
    },
    {
      key: 'secretariat',
      icon: '📑',
      name: { km: 'ក្រុមលេខាធិការដ្ឋាន និងសម្របសម្រួល', en: 'Secretariat & Comprehensive Coordination Group', zh: '秘书处与综合协调工作组' },
      description: { km: 'សម្របសម្រួលឯកសារ និងទំនាក់ទំនងរដ្ឋបាល', en: 'Handles administrative documentation and inter-committee liaison', zh: '负责跨委员会沟通联络、文书收发与决议下达' }
    }
  ],

  // 2. Protocol
  'sub_protocol': [
    {
      key: 'vip_protocol',
      icon: '🤝',
      name: { km: 'ក្រុមបដិសណ្ឋារកិច្ចជាន់ខ្ពស់ VIP', en: 'VIP & Diplomatic Protocol Group', zh: '贵宾与外交礼宾接待工作组' },
      description: { km: 'ទទួលស្វាគមន៍គណៈប្រតិភូ និងថ្នាក់ដឹកនាំជាន់ខ្ពស់', en: 'Receives and coordinates high-level VIPs and dignitaries', zh: '负责重要嘉宾、政府代表团及驻华使节现场迎候与礼遇' }
    },
    {
      key: 'welcome_desk',
      icon: '🎫',
      name: { km: 'ក្រុមទទួលភ្ញៀវ និងចុះឈ្មោះ', en: 'Registration & Welcome Desk Group', zh: '迎宾引导与签到接待工作组' },
      description: { km: 'សម្របសម្រួលការចុះឈ្មោះ និងការស្វាគមន៍ភ្ញៀវ', en: 'Manages registration counters, badge issuance, and information desks', zh: '负责现场办证、证件核发、咨询服务台与嘉宾签到' }
    },
    {
      key: 'ceremony_usher',
      icon: '✨',
      name: { km: 'ក្រុមពិធីការ និងសម្របសម្រួលពិធី', en: 'Ceremony & Event Ushering Group', zh: '典礼主持与仪式礼仪工作组' },
      description: { km: 'រៀបចំពិធីបើក-បិទផ្លូវការ និងការកាត់ខ្សែបូ', en: 'Orchestrates opening/closing ceremonies, ribbon cutting, and stage escort', zh: '负责开幕式、闭幕式、签约仪式剪彩与舞台仪式引导' }
    }
  ],

  // 3. Finance
  'sub_finance': [
    {
      key: 'budget_accounting',
      icon: '📊',
      name: { km: 'ក្រុមថវិកា និងគណនេយ្យ', en: 'Budgeting & Financial Accounting Group', zh: '预算编制与财务核算工作组' },
      description: { km: 'រៀបចំថវិកា និងកត់ត្រាគណនេយ្យទូទៅ', en: 'Plans budgets and maintains official transaction ledgers', zh: '负责整体财务预算编制、账目记账与资金流水跟踪' }
    },
    {
      key: 'sponsorship_revenue',
      icon: '💰',
      name: { km: 'ក្រុមចំណូល និងជំនួយឧបត្ថម្ភ', en: 'Sponsorship & Revenue Management Group', zh: '赞助款项与招商收益工作组' },
      description: { km: 'គ្រប់គ្រងចំណូលពីម្ចាស់ឧបត្ថម្ភ និងថ្លៃស្តង់', en: 'Manages incoming sponsor capital and booth leasing revenue', zh: '负责企业赞助款项核算、展位租赁结算与收入统筹' }
    },
    {
      key: 'disbursement_audit',
      icon: '🧾',
      name: { km: 'ក្រុមទូទាត់ និងសវនកម្មចំណាយ', en: 'Disbursement & Expenditure Audit Group', zh: '资金支出与合规审计工作组' },
      description: { km: 'ផ្ទៀងផ្ទាត់ និងទូទាត់វិក្កយបត្រចំណាយ', en: 'Audits supplier invoices, reimburses expenses, and verifies compliance', zh: '负责各类采购发票审查、支出报销审批与合规性内部审计' }
    }
  ],

  // 4. Design & Booth
  'sub_design_booth': [
    {
      key: 'stage_architecture',
      icon: '🎪',
      name: { km: 'ក្រុមរចនាស្ថាបត្យកម្ម និងសាងសង់ឆាក', en: 'Stage Architecture & Structural Design Group', zh: '舞台空间设计与搭建工程组' },
      description: { km: 'រចនាប្លង់ឆាកធំ និងត្រួតពិនិត្យការសាងសង់', en: 'Engineers main stage blueprints and oversees physical build-outs', zh: '统筹主舞台舞美方案设计、结构施工与施工安全监管' }
    },
    {
      key: 'booth_operations',
      icon: '📐',
      name: { km: 'ក្រុមប្លង់ស្តង់ និងគ្រប់គ្រងប្រតិបត្តិការស្តង់', en: 'Booth Layout & Floor Management Group', zh: '展位空间规划与现场运营组' },
      description: { km: 'បែងចែកទីតាំងស្តង់ និងសម្របសម្រួលអ្នកតាំងពិព័រណ៍', en: 'Allots exhibition spaces and manages booth field personnel', zh: '负责展厅各分区点位划分、展位入场及现场运营管理' }
    },
    {
      key: 'power_technical',
      icon: '⚡',
      name: { km: 'ក្រុមបច្ចេកទេស និងបណ្តាញអគ្គិសនី', en: 'Electrical Power & Utilities Engineering Group', zh: '强弱电工程与技术负荷保障组' },
      description: { km: 'ធានាការផ្គត់ផ្គង់អគ្គិសនី និងប្រព័ន្ធបច្ចេកវិទ្យា', en: 'Safeguards power grids, breaker loads, and booth electricity hookups', zh: '负责展馆高低压配电调度、展位用电接驳与强弱电安全保障' }
    }
  ],

  // 5. Food & Dessert
  'sub_food': [
    {
      key: 'culinary_booths',
      icon: '🍲',
      name: { km: 'ក្រុមពិព័រណ៍ម្ហូបអាហារ និងស្តង់ចម្អិន', en: 'Gourmet Food Exhibition & Cookery Group', zh: '特色美食展区与烹饪展位工作组' },
      description: { km: 'គ្រប់គ្រងស្តង់ម្ហូបអាហារក្តៅៗ និងចម្អិនផ្ទាល់', en: 'Coordinates hot food preparation zones and restaurant exhibitors', zh: '负责热食档口、风味餐饮展位准入审核与现场烹饪管理' }
    },
    {
      key: 'dessert_beverage',
      icon: '🧁',
      name: { km: 'ក្រុមបង្អែមខ្មែរ និងភេសជ្ជៈ', en: 'Traditional Desserts & Confectionery Group', zh: '高棉传统糕点与特色饮品展区组' },
      description: { km: 'រៀបចំការតាំងបង្ហាញបង្អែមប្រពៃណី និងភេសជ្ជៈ', en: 'Curates artisanal desserts, confectionery, and refreshments', zh: '负责高棉传统风味甜品、茶歇茶点与精品饮品专区筹划' }
    },
    {
      key: 'safety_hygiene',
      icon: '🥗',
      name: { km: 'ក្រុមអនាម័យ និងសុវត្ថិភាពចំណីអាហារ', en: 'Food Safety & Hygiene Inspection Group', zh: '食品安全检验与卫生督察工作组' },
      description: { km: 'ត្រួតពិនិត្យអនាម័យ និងគុណភាពចំណីអាហារ', en: 'Inspects kitchen sanitization, food temperature, and health certs', zh: '负责食材源头溯源、餐具消毒检疫与全天候卫生动态巡检' }
    }
  ],

  // 6. Arts & Singing
  'sub_arts': [
    {
      key: 'stage_performances',
      icon: '🎭',
      name: { km: 'ក្រុមសម្តែងសិល្បៈ និងរបាំ', en: 'Artistic Performances & Dance Ensemble Group', zh: '舞台艺术表演与舞蹈戏剧工作组' },
      description: { km: 'រៀបចំក្បាច់រាំប្រពៃណី របាំបុរាណ និងសម្តែងផ្ទាល់', en: 'Directs cultural dances, choreography, and theatrical performances', zh: '负责大型舞蹈节目录制排练、非遗戏剧展演与主舞台调度' }
    },
    {
      key: 'music_vocal',
      icon: '🎵',
      name: { km: 'ក្រុមតន្ត្រី និងចម្រៀងប្រពៃណី-សម័យ', en: 'Musical Bands & Vocal Artistry Group', zh: '现场音乐乐团与声乐歌唱工作组' },
      description: { km: 'សម្របសម្រួលតារាចម្រៀង ក្រុមតន្ត្រីបុរាណ និងសម័យ', en: 'Manages live vocalists, classical orchestras, and modern music bands', zh: '负责著名歌手统筹、民族交响乐团与流行乐队现场表演' }
    },
    {
      key: 'sound_lighting',
      icon: '💡',
      name: { km: 'ក្រុមបច្ចេកទេសសំឡេង និងពន្លឺឆាក', en: 'Stage Audio, Lighting & AV Production Group', zh: '音响扩声与舞台灯光视听保障组' },
      description: { km: 'គ្រប់គ្រងម៉ាស៊ីនសំឡេង ពន្លឺ និងអេក្រង់ LED', en: 'Operates mixing consoles, lighting rigs, and jumbo video walls', zh: '负责专业调音台音效调优、电脑灯光秀编排与主屏LED视频播控' }
    }
  ],

  // 7. Media & Photography
  'sub_media': [
    {
      key: 'press_broadcast',
      icon: '📰',
      name: { km: 'ក្រុមសារព័ត៌មាន និងទំនាក់ទំនងសាធារណៈ', en: 'Press Relations & Public Information Group', zh: '新闻公关媒体通联与文案发布组' },
      description: { km: 'ផ្សព្វផ្សាយសេចក្តីប្រកាសព័ត៌មាន និងទំនាក់ទំនងទូរទស្សន៍', en: 'Distributes press releases and coordinates television journalists', zh: '负责官方新闻通稿撰写、中柬主流媒体记者接待与新闻发布会' }
    },
    {
      key: 'photo_video_crew',
      icon: '📸',
      name: { km: 'ក្រុមថតរូប វីដេអូ និងប័ណ្ណសារ', en: 'Photography, Cinematography & Archive Group', zh: '专业摄影摄像与影像档案摄制组' },
      description: { km: 'ថតរូបភាពកម្រិតខ្ពស់ និងផលិតវីដេអូសង្ខេបប្រចាំថ្ងៃ', en: 'Captures official photos, documentary clips, and recap reels', zh: '负责现场高精度照片抓拍、精彩花絮录制与官方纪录短片拍摄' }
    },
    {
      key: 'social_livestream',
      icon: '📡',
      name: { km: 'ក្រុមផ្សាយបន្តផ្ទាល់ និងបណ្តាញសង្គម', en: 'Live Streaming & Digital Media Hub Group', zh: '官方网络直播与新媒体矩阵运营组' },
      description: { km: 'ផ្សាយផ្ទាល់តាម Facebook, YouTube, TikTok', en: 'Operates multichannel social broadcasts and real-time streaming', zh: '负责Facebook、抖音、微信等跨平台多机位全天候高清网络直播' }
    }
  ],

  // 8. Sports & Folk Games
  'sub_sports': [
    {
      key: 'folk_games',
      icon: '🎯',
      name: { km: 'ក្រុមល្បែងប្រជាប្រិយខ្មែរ និងវប្បធម៌', en: 'Traditional Khmer Folk Games Group', zh: '高棉传统民间游戏与民俗互动组' },
      description: { km: 'រៀបចំល្បែងប្រជាប្រិយខ្មែរ ដូចជាទាញព្រ័ត្រ ចោលឈូង លាក់កន្សែង', en: 'Organizes classic Cambodian games (tug-of-war, chol chhoung, etc.)', zh: '负责拔河、丢安昆、藏手绢等高棉传统经典民间游园趣味互动' }
    },
    {
      key: 'sports_competitions',
      icon: '🏅',
      name: { km: 'ក្រុមការប្រកួតកីឡា និងអាជ្ញាកណ្តាល', en: 'Sports Competitions & Officiating Group', zh: '竞技体育对抗赛与裁判统筹组' },
      description: { km: 'រៀបចំការប្រកួតកីឡា និងកាត់សេចក្តីដោយយុត្តិធម៌', en: 'Runs athletic brackets, referee assignments, and scorekeeping', zh: '负责各单项体育锦标赛对阵排程、裁判员指派与比赛比分裁决' }
    },
    {
      key: 'field_engagement',
      icon: '🏃',
      name: { km: 'ក្រុមសម្របសម្រួលទីលាន និងសកម្មភាពមហាជន', en: 'Field Coordination & Public Challenge Group', zh: '赛场秩序维护与观众游乐挑战组' },
      description: { km: 'គ្រប់គ្រងសុវត្ថិភាពទីលាន និងលើកទឹកចិត្តអ្នកចូលរួម', en: 'Maintains field boundaries, audience queues, and participant prizes', zh: '负责竞技现场动线引导、参赛检录秩序维护与优胜奖品发放' }
    }
  ],

  // 9. Khmer-Chinese Translation
  'sub_translation': [
    {
      key: 'simultaneous_stage',
      icon: '🎙️',
      name: { km: 'ក្រុមបកប្រែផ្ទាល់មាត់លើឆាក និងពិធីការ', en: 'Simultaneous & Stage Interpretation Group', zh: '大会同声传译与高层商务交传组' },
      description: { km: 'បកប្រែផ្ទាល់មាត់ ខ្មែរ-ចិន ក្នុងកម្មវិធីផ្លូវការ', en: 'Provides real-time simultaneous Khmer-Chinese voice translation', zh: '负责峰会论坛高规格同声传译、领导致辞即席交传与重要会见交传' }
    },
    {
      key: 'document_signage',
      icon: '📝',
      name: { km: 'ក្រុមបកប្រែឯកសារ ផ្លាកសញ្ញា និងខ្លឹមសារ', en: 'Document Translation & Trilingual Signage Group', zh: '中柬双语文案笔译与导视标牌审核组' },
      description: { km: 'បកប្រែកូនសៀវភៅ ផ្លាកសញ្ញា និងឯកសារផ្លូវការ', en: 'Translates event handbooks, schedule boards, and safety warnings', zh: '负责展会手册、日程安排表、赞助协议与全馆双语导视指示标牌笔译' }
    },
    {
      key: 'booth_liaison',
      icon: '🌐',
      name: { km: 'ក្រុមទំនាក់ទំនងទ្វេភាសាតាមស្តង់ពិព័រណ៍', en: 'Booth Trade Liaison & Bilingual Escort Group', zh: '展区经贸对接随行双语服务工作组' },
      description: { km: 'ជួយសម្របសម្រួលការចរចាពាណិជ្ជកម្មនៅតាមស្តង់', en: 'Assists buyers and exhibitors in B2B bilateral trade negotiations', zh: '进驻重点展台协助中柬展商经贸洽谈、业务对接与商务合作沟通' }
    }
  ],

  // 10. Logistics
  'sub_logistics': [
    {
      key: 'freight_transport',
      icon: '🚚',
      name: { km: 'ក្រុមដឹកជញ្ជូន និងផែផ្ទុកទំនិញ', en: 'Freight Transport & Dock Inbound Group', zh: '物流货运调度与装卸码头作业保障组' },
      description: { km: 'គ្រប់គ្រងរថយន្តដឹកទំនិញ និងកាលវិភាគផ្ទុកទំនិញ', en: 'Schedules freight trucks, forklift loading docks, and cargo check-in', zh: '统筹展品货车排队入场、叉车装卸接驳与重型设备吊装入馆' }
    },
    {
      key: 'warehouse_supplies',
      icon: '📦',
      name: { km: 'ក្រុមឃ្លាំង និងគ្រប់គ្រងសម្ភារបរិក្ខារ', en: 'Warehousing & Asset Custody Group', zh: '仓储物资调配与资产保管工作组' },
      description: { km: 'គ្រប់គ្រងឃ្លាំងផ្ទុកទំនិញ និងសម្ភារតាំងពិព័រណ៍', en: 'Guards secure warehouse stock, crates, and loaned exhibit supplies', zh: '负责保税及普通仓储管理、物资借还登记与空箱存放回收' }
    },
    {
      key: 'venue_support',
      icon: '🛠️',
      name: { km: 'ក្រុមទ្រទ្រង់ទីតាំង និងបោសសម្អាត', en: 'Venue Maintenance & Environmental Support Group', zh: '场馆勤务维保与环境卫生保障组' },
      description: { km: 'ថែទាំទីតាំងពិព័រណ៍ បោសសម្អាត និងជួយសម្រួលទូទៅ', en: 'Coordinates hall janitorial sweeps, waste clearing, and emergency fixes', zh: '负责展厅全天候保洁清扫、设施应急抢修与后勤勤务响应' }
    }
  ]
};

export function getWorkingGroupsForCommittee(committeeKeyOrId, lang = 'en') {
  if (!committeeKeyOrId) return [];
  let groups = COMMITTEE_WORKING_GROUPS[committeeKeyOrId];
  if (!groups) {
    for (const [k, v] of Object.entries(COMMITTEE_WORKING_GROUPS)) {
      if (k === 'main-committee' && (committeeKeyOrId === 'Central Committee' || committeeKeyOrId === 'main-committee')) {
        groups = v;
        break;
      }
      const mapped = COMMITTEES_MAP[k];
      if (mapped && (mapped.en === committeeKeyOrId || mapped.km === committeeKeyOrId || mapped.zh === committeeKeyOrId)) {
        groups = v;
        break;
      }
      const subItem = SUB_COMMITTEES.find(s => s.id === k || s.key === k);
      if (subItem && (subItem.id === committeeKeyOrId || subItem.key === committeeKeyOrId)) {
        groups = v;
        break;
      }
    }
  }
  if (!groups) groups = [];
  return groups.map(g => ({
    key: g.key,
    icon: g.icon,
    name: g.name[lang] || g.name.en,
    description: g.description[lang] || g.description.en,
    rawName: g.name
  }));
}

export function getWorkingGroupLocalizedName(committeeKeyOrId, groupKey, lang = 'en') {
  const groups = getWorkingGroupsForCommittee(committeeKeyOrId, lang);
  const found = groups.find(g => g.key === groupKey || g.name === groupKey);
  if (found) return found.name;
  return groupKey || '';
}

