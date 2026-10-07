export const DEFAULT_EXPO_CONFIG = {
  name: {
    en: 'EXPO Week 2026',
    km: 'សប្តាហ៍ពិព័រណ៍ ២០២៦',
    zh: '2026 世博周'
  },
  shortName: {
    en: 'EXPO Week',
    km: 'សប្តាហ៍ពិព័រណ៍',
    zh: '世博周'
  },
  tagline: {
    en: 'Tech & Innovation Fair',
    km: 'ពិព័រណ៍បច្ចេកវិទ្យា និងនវានុវត្តន៍',
    zh: '科技与创新博览会'
  },
  datesBadge: {
    en: 'October 12–14, 2026 • Phnom Penh Convention Center',
    km: 'ថ្ងៃទី ១២–១៤ ខែតុលា ឆ្នាំ ២០២៦ • មជ្ឈមណ្ឌលសន្និបាតភ្នំពេញ',
    zh: '2026年10月12日至14日 • 金边国际会展中心'
  },
  heroTitle1: {
    en: 'EXPO Week',
    km: 'សប្តាហ៍ពិព័រណ៍',
    zh: '世博周'
  },
  heroTitle2: {
    en: '2026',
    km: '២០២៦',
    zh: '2026'
  },
  heroSubtitle: {
    en: 'Three days of groundbreaking technology, global innovation, and creative discovery. Explore curated exhibition booths, join interactive workshops, and track milestones.',
    km: 'បីថ្ងៃនៃបច្ចេកវិទ្យាឈានមុខគេ នវានុវត្តន៍សកល និងការរកឃើញប្រកបដោយភាពច្នៃប្រឌិត។ ស្វែងរកស្តង់តាំងពិព័រណ៍ ចូលរួមសិក្ខាសាលាអន្តរកម្ម និងតាមដានព្រឹត្តិការណ៍សំខាន់ៗ។',
    zh: '为期三天的前沿科技、全球创新与创意探索盛会。探索精心策划的展位，参与互动工作坊，追踪重要里程碑活动。'
  },
  logoType: 'icon', // 'icon' | 'text' | 'image'
  logoIcon: 'Sparkles',
  logoText: 'E',
  logoUrl: '',
  venue: {
    en: 'Phnom Penh Convention Center',
    km: 'មជ្ឈមណ្ឌលសន្និបាតភ្នំពេញ',
    zh: '金边国际会展中心'
  },
  datesRange: {
    en: 'October 12–14, 2026',
    km: 'ថ្ងៃទី ១២–១៤ ខែតុលា ឆ្នាំ ២០២៦',
    zh: '2026年10月12日–14日'
  },
  startDate: '2026-10-12',
  endDate: '2026-10-14',
  timelineDays: [
    {
      day: 1,
      date: '2026-10-12',
      label: {
        en: 'Day 1: Oct 12',
        km: 'ថ្ងៃទី១: ១២ តុលា',
        zh: '第1天：10月12日'
      },
      theme: {
        en: 'Grand Opening & Keynote Tech',
        km: 'ពិធីបើកសម្ពោធ និងបច្ចេកវិទ្យាសំខាន់ៗ',
        zh: '开幕盛典与主旨科技'
      }
    },
    {
      day: 2,
      date: '2026-10-13',
      label: {
        en: 'Day 2: Oct 13',
        km: 'ថ្ងៃទី២: ១៣ តុលា',
        zh: '第2天：10月13日'
      },
      theme: {
        en: 'Innovation Showcase & Contests',
        km: 'ការបង្ហាញនវានុវត្តន៍ និងការប្រកួតប្រជែង',
        zh: '创新展示与前沿竞赛'
      }
    },
    {
      day: 3,
      date: '2026-10-14',
      label: {
        en: 'Day 3: Oct 14',
        km: 'ថ្ងៃទី៣: ១៤ តុលា',
        zh: '第3天：10月14日'
      },
      theme: {
        en: 'Cultural Gala & Award Honors',
        km: 'ពិធីរាត្រីសមោសរសិល្បៈ និងប្រគល់ពានរង្វាន់',
        zh: '文化盛典与颁奖闭幕'
      }
    }
  ]
};

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-booth',
    key: 'booth',
    name: {
      en: 'Tech & Exhibition Booth',
      km: 'ស្តង់បច្ចេកវិទ្យា និងការតាំងពិព័រណ៍',
      zh: '科技与展览展位'
    },
    description: {
      en: 'Exhibition booths, innovation showcases, and corporate tech displays',
      km: 'ស្តង់តាំងពិព័រណ៍ ការបង្ហាញនវានុវត្តន៍ និងការតាំងបង្ហាញបច្ចេកវិទ្យា',
      zh: '展览展位、创新成果展示与企业科技展台'
    },
    emoji: '🎪',
    icon: 'Layers',
    color: '#0284c7',
    defaultSubCommittee: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management'
  },
  {
    id: 'cat-activity',
    key: 'activity',
    name: {
      en: 'Interactive Activity',
      km: 'សកម្មភាពអន្តរកម្ម និងការប្រកួត',
      zh: '互动体验活动'
    },
    description: {
      en: 'Hands-on demos, mini-competitions, sports, and participatory challenges',
      km: 'ការសាកល្បងផ្ទាល់ ការប្រកួតខ្នាតតូច កីឡា និងសកម្មភាពចូលរួម',
      zh: '动手体验、小型比赛、体育竞赛与互动挑战'
    },
    emoji: '🎯',
    icon: 'Compass',
    color: '#9333ea',
    defaultSubCommittee: 'Subcommittee on Sports Competitions and Folk Games'
  },
  {
    id: 'cat-milestone',
    key: 'milestone',
    name: {
      en: 'Milestone & Ceremony',
      km: 'ពិធីសំខាន់ៗ & កម្មវិធីកិត្តិយស',
      zh: '重要仪式与里程碑'
    },
    description: {
      en: 'Opening ceremony, keynote addresses, VIP delegations, and closing gala',
      km: 'ពិធីបើកសម្ពោធ បាឋកថាសំខាន់ៗ គណៈប្រតិភូជាន់ខ្ពស់ និងរាត្រីសមោសរបិទ',
      zh: '开幕仪式、主旨演讲、贵宾接待与闭幕颁奖盛典'
    },
    emoji: '🏆',
    icon: 'Flag',
    color: '#d97706',
    defaultSubCommittee: 'Subcommittee on Reception and Protocol'
  }
];
