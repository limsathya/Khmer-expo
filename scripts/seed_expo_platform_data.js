const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Checking and seeding platform data...');

    // 1. BOOTHS (75 curated 2m x 2m booths across Hall A, Hall B, Plaza)
    const boothsCount = await client.query('SELECT COUNT(*) FROM public.booths');
    if (parseInt(boothsCount.rows[0].count, 10) === 0) {
      console.log('Seeding 75 exhibition booths...');
      const zones = ['Hall A (Business & Tech)', 'Hall B (Culture & Tourism)', 'Plaza Pavilion (Food & Crafts)'];
      const categories = ['Premium', 'Standard', 'Corner Island'];
      
      for (let i = 1; i <= 75; i++) {
        const zoneIdx = i <= 25 ? 0 : i <= 50 ? 1 : 2;
        const prefix = i <= 25 ? 'A' : i <= 50 ? 'B' : 'C';
        const numInZone = i <= 25 ? i : i <= 50 ? (i - 25) : (i - 50);
        const bNum = `${prefix}-${String(numInZone).padStart(2, '0')}`;
        const zone = zones[zoneIdx];
        const category = i % 5 === 0 ? 'Corner Island' : i % 3 === 0 ? 'Premium' : 'Standard';
        const status = i <= 6 ? 'occupied' : i <= 15 ? 'assigned' : i <= 20 ? 'reserved' : 'available';

        await client.query(`
          INSERT INTO public.booths (id, booth_number, zone, category, size, status, price)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [`booth-${i}`, bNum, zone, category, '2m x 2m', status, category === 'Corner Island' ? 800 : category === 'Premium' ? 650 : 500]);
      }
    }

    // 2. COMPANIES
    const compCount = await client.query('SELECT COUNT(*) FROM public.companies');
    if (parseInt(compCount.rows[0].count, 10) === 0) {
      console.log('Seeding companies...');
      const companies = [
        {
          id: 'comp-1',
          name: 'Angkor Tech Solutions',
          slug: 'angkor-tech-solutions',
          country: 'Cambodia',
          industry: 'Information Technology',
          description: 'Pioneering AI-driven agricultural solutions and fintech platforms for Southeast Asian enterprises.',
          website: 'https://angkortech.kh',
          email: 'contact@angkortech.kh',
          phone: '+855 23 888 123',
          address: 'Canadia Tower, Phnom Penh, Cambodia',
          contact_person: 'Mr. Seng Visal',
          products: ['AgriTech Cloud', 'B2B Payment Gateway', 'Supply Chain ERP'],
          booth_id: 'booth-1',
          status: 'active'
        },
        {
          id: 'comp-2',
          name: 'Yunnan Green Energy Group',
          slug: 'yunnan-green-energy-group',
          country: 'China',
          industry: 'Renewable Energy',
          description: 'Leading provider of solar photovoltaic systems, high-altitude microgrids, and eco-friendly storage.',
          website: 'https://yunnangreenenergy.cn',
          email: 'info@yunnangreenenergy.cn',
          phone: '+86 871 6331 4455',
          address: 'High-Tech Industrial Park, Kunming, Yunnan, China',
          contact_person: 'Ms. Chen Wei',
          products: ['Solar Roof Arrays', 'Commercial BESS Storage', 'Smart Grid Monitoring'],
          booth_id: 'booth-2',
          status: 'active'
        },
        {
          id: 'comp-3',
          name: 'Mekong Heritage Silk & Handicrafts',
          slug: 'mekong-heritage-silk',
          country: 'Cambodia',
          industry: 'Culture & Textile',
          description: 'Preserving authentic golden silk weaving and traditional Khmer artisanal handicrafts for global markets.',
          website: 'https://mekongheritagesilk.com',
          email: 'export@mekongheritagesilk.com',
          phone: '+855 63 963 852',
          address: 'Pokambor Avenue, Siem Reap, Cambodia',
          contact_person: 'Mrs. Chanthou Pich',
          products: ['Golden Silk Scarves', 'Handcrafted Ceramics', 'Silverware Lacquerware'],
          booth_id: 'booth-3',
          status: 'active'
        },
        {
          id: 'comp-4',
          name: 'Kunming Cross-Border Logistics Express',
          slug: 'kunming-cross-border-logistics',
          country: 'China',
          industry: 'Logistics & Supply Chain',
          description: 'Specialized multimodal cold chain and rail-freight connectivity connecting Kunming to ASEAN economic corridors.',
          website: 'https://km-expresslogistics.com',
          email: 'sales@km-expresslogistics.com',
          phone: '+86 871 6722 9900',
          address: 'Tongde Plaza Commercial Tower, Kunming, China',
          contact_person: 'Mr. Liu Jianhua',
          products: ['Rail Freight Express', 'Agricultural Cold Chain', 'Bonded Warehousing'],
          booth_id: 'booth-4',
          status: 'active'
        },
        {
          id: 'comp-5',
          name: 'Royal Phnom Penh Organic Rice',
          slug: 'royal-phnom-penh-rice',
          country: 'Cambodia',
          industry: 'Agriculture & Food',
          description: 'Award-winning Cambodian Jasmine Phka Rumduol rice and premium organic cashew nuts export.',
          website: 'https://royalorganics.kh',
          email: 'orders@royalorganics.kh',
          phone: '+855 23 427 119',
          address: 'Veng Sreng Blvd, Phnom Penh, Cambodia',
          contact_person: 'Mr. Keo Sovann',
          products: ['Premium Jasmine Rice (Phka Rumduol)', 'Organic Cashews', 'Kampot Pepper PGI'],
          booth_id: 'booth-5',
          status: 'active'
        },
        {
          id: 'comp-6',
          name: 'Southwest International University Alliance',
          slug: 'southwest-university-alliance',
          country: 'China',
          industry: 'Education & Research',
          description: 'Consortium of top universities fostering academic exchanges, scholarship programs, and joint engineering research.',
          website: 'https://sw-edu-alliance.cn',
          email: 'admissions@sw-edu-alliance.cn',
          phone: '+86 871 6503 1212',
          address: 'University Town, Chenggong District, Kunming, China',
          contact_person: 'Prof. Zhang Ting',
          products: ['Bilateral Scholarship Programs', 'Joint Masters Degrees', 'Faculty Exchange'],
          booth_id: 'booth-6',
          status: 'active'
        }
      ];

      for (const c of companies) {
        await client.query(`
          INSERT INTO public.companies (id, name, slug, country, industry, description, website, email, phone, address, contact_person, products, booth_id, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [c.id, c.name, c.slug, c.country, c.industry, c.description, c.website, c.email, c.phone, c.address, c.contact_person, c.products, c.booth_id, c.status]);

        // Also update booth assignment
        await client.query(`
          UPDATE public.booths 
          SET company_id = $1, company_name = $2, status = 'occupied' 
          WHERE id = $3
        `, [c.id, c.name, c.booth_id]);
      }
    }

    // 3. EXHIBITORS
    const exhCount = await client.query('SELECT COUNT(*) FROM public.exhibitors');
    if (parseInt(exhCount.rows[0].count, 10) === 0) {
      console.log('Seeding exhibitors...');
      const comps = await client.query('SELECT id, name, booth_id, email, contact_person, phone FROM public.companies LIMIT 6');
      for (const row of comps.rows) {
        const bRow = await client.query('SELECT booth_number FROM public.booths WHERE id = $1', [row.booth_id]);
        const boothNumber = bRow.rows[0]?.booth_number || 'A-01';
        await client.query(`
          INSERT INTO public.exhibitors (id, company_id, company_name, booth_id, booth_number, contact_name, contact_email, contact_phone, status, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved', true)
        `, [
          `exh-${row.id}`,
          row.id,
          row.name,
          row.booth_id,
          boothNumber,
          row.contact_person,
          row.email,
          row.phone
        ]);
      }
    }

    // 4. SPEAKERS
    const spkCount = await client.query('SELECT COUNT(*) FROM public.speakers');
    if (parseInt(spkCount.rows[0].count, 10) === 0) {
      console.log('Seeding speakers...');
      const speakers = [
        {
          id: 'spk-1',
          name: 'H.E. Dr. Sreng Sokha',
          slug: 'dr-sreng-sokha',
          position: 'Secretary of State for Commerce',
          organization: 'Ministry of Commerce, Cambodia',
          country: 'Cambodia',
          bio: 'Distinguished economic policymaker specializing in cross-border trade agreements, digital commerce corridors, and ASEAN-China economic partnerships.',
          featured: true,
          display_order: 1
        },
        {
          id: 'spk-2',
          name: 'Prof. Li Weidong',
          slug: 'prof-li-weidong',
          position: 'Director of International Trade Institute',
          organization: 'Yunnan Academy of Social Sciences',
          country: 'China',
          bio: 'Renowned scholar on the Belt and Road Initiative, specialized in regional connectivity and Southeast Asian multilateral trade growth.',
          featured: true,
          display_order: 2
        },
        {
          id: 'spk-3',
          name: 'Oknha Bun Narith',
          slug: 'oknha-bun-narith',
          position: 'Vice President',
          organization: 'Cambodia Chamber of Commerce (CCC)',
          country: 'Cambodia',
          bio: 'Prominent business leader advancing private sector industrial collaboration, foreign direct investments, and technological modernization.',
          featured: true,
          display_order: 3
        },
        {
          id: 'spk-4',
          name: 'Dr. Zhang Meihua',
          slug: 'dr-zhang-meihua',
          position: 'Chief Scientist of Smart Energy Systems',
          organization: 'China Clean Energy Technology Center',
          country: 'China',
          bio: 'Leading innovator in cross-border renewable grid integration, rural electrification, and green supply chains.',
          featured: true,
          display_order: 4
        }
      ];

      for (const s of speakers) {
        await client.query(`
          INSERT INTO public.speakers (id, name, slug, position, organization, country, bio, featured, display_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [s.id, s.name, s.slug, s.position, s.organization, s.country, s.bio, s.featured, s.display_order]);
      }
    }

    // 5. PROGRAMS / SCHEDULE
    const prgCount = await client.query('SELECT COUNT(*) FROM public.programs');
    if (parseInt(prgCount.rows[0].count, 10) === 0) {
      console.log('Seeding programs...');
      const programs = [
        {
          id: 'prog-1',
          title: 'Grand Opening Ceremony & Bilateral Ministerial Summit',
          date: '2026-10-12',
          start_time: '09:00',
          end_time: '11:00',
          venue: 'Grand Ballroom & Main Plenary Stage',
          category: 'Opening Ceremony',
          description: 'Official welcome addresses by national dignitaries, ribbon-cutting ceremony, keynote speeches on Cambodia-China trade future.',
          featured: true,
          speaker_names: ['H.E. Dr. Sreng Sokha', 'Prof. Li Weidong']
        },
        {
          id: 'prog-2',
          title: 'Cambodia–China Trade & Investment Matchmaking (B2B)',
          date: '2026-10-12',
          start_time: '14:00',
          end_time: '17:00',
          venue: 'Exhibition Hall A Conference Center',
          category: 'Business',
          description: 'Targeted matchmaking sessions connecting 150+ buyers, manufacturers, and export enterprises across agriculture, tech, and logistics.',
          featured: true,
          speaker_names: ['Oknha Bun Narith']
        },
        {
          id: 'prog-3',
          title: 'Clean Energy & Smart Agriculture Innovation Forum',
          date: '2026-10-13',
          start_time: '10:00',
          end_time: '12:30',
          venue: 'Hall B Innovation Theatre',
          category: 'Education',
          description: 'Keynote panel exploring solar electrification, water management tech, and high-yield sustainable agricultural models.',
          featured: true,
          speaker_names: ['Dr. Zhang Meihua']
        },
        {
          id: 'prog-4',
          title: 'Traditional Cultural Evening & Folk Performance Showcase',
          date: '2026-10-13',
          start_time: '18:30',
          end_time: '21:00',
          venue: 'Outdoor Plaza Amphitheatre',
          category: 'Culture',
          description: 'Bilateral celebration featuring Royal Ballet of Cambodia, Yunnan ethnic music, and traditional artistic showcases.',
          featured: true,
          speaker_names: []
        },
        {
          id: 'prog-5',
          title: 'Culinary Gastronomy Gala & Best Product Awards',
          date: '2026-10-14',
          start_time: '11:30',
          end_time: '14:00',
          venue: 'Gourmet Exhibition Court',
          category: 'Food',
          description: 'Celebrity chef demonstrations, food tasting pavilion, and presentation of the Expo Quality Product Awards 2026.',
          featured: false,
          speaker_names: []
        },
        {
          id: 'prog-6',
          title: 'Closing Ceremony & Bilateral Cooperation Declaration',
          date: '2026-10-14',
          start_time: '16:00',
          end_time: '18:00',
          venue: 'Grand Ballroom Plenary Hall',
          category: 'Closing Ceremony',
          description: 'Summary of trade agreements signed, presentation of exhibitor awards, and official closing remarks.',
          featured: true,
          speaker_names: ['H.E. Dr. Sreng Sokha', 'Prof. Li Weidong', 'Oknha Bun Narith']
        }
      ];

      for (const p of programs) {
        await client.query(`
          INSERT INTO public.programs (id, title, date, start_time, end_time, venue, category, description, featured, speaker_names)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [p.id, p.title, p.date, p.start_time, p.end_time, p.venue, p.category, p.description, p.featured, p.speaker_names]);
      }
    }

    // 6. SUBCOMMITTEES (13 Domain Subcommittees)
    const subCount = await client.query('SELECT COUNT(*) FROM public.subcommittees');
    if (parseInt(subCount.rows[0].count, 10) === 0) {
      console.log('Seeding 13 domain subcommittees...');
      const subcommittees = [
        { id: 'sub-1', key: 'sub_secretariat', name: 'Administration & Secretariat', head_name: 'Mr. Keo Sambath', deputy_head_name: 'Ms. Liu Jing', desc: 'Central administrative coordination, document verification, and executive liaison.' },
        { id: 'sub-2', key: 'sub_booths', name: 'Exhibition & Booth Management', head_name: 'Mr. Seng Visal', deputy_head_name: 'Mr. Zhao Qiang', desc: 'Floor plan layout, booth allocation, contractor oversight, and exhibition logistics.' },
        { id: 'sub-3', key: 'sub_protocol', name: 'Protocol & VIP Reception', head_name: 'H.E. Suon Kamsan', deputy_head_name: 'Mrs. Wang Xiaoyan', desc: 'Diplomatic reception, delegation welcoming, bilateral meetings, and VIP security.' },
        { id: 'sub-4', key: 'sub_registration', name: 'Registration & Accreditation', head_name: 'Mr. Chan Bora', deputy_head_name: 'Ms. Chen Hui', desc: 'Online registration validation, badging, QR credential issuance, and attendee check-in.' },
        { id: 'sub-5', key: 'sub_program', name: 'Program & Speakers Coordination', head_name: 'Dr. Heng Sokly', deputy_head_name: 'Prof. Li Jun', desc: 'Curating agenda timelines, plenary keynote coordination, and speaker management.' },
        { id: 'sub-6', key: 'sub_culture', name: 'Culture & Performance Arts', head_name: 'Mrs. Tep Bopha', deputy_head_name: 'Mr. Yang Ming', desc: 'Live traditional stage performances, musical shows, and heritage exhibitions.' },
        { id: 'sub-7', key: 'sub_education', name: 'Education & Universities', head_name: 'Prof. Nhem Rithy', deputy_head_name: 'Dr. Zhang Ting', desc: 'Higher education partnership forums, student delegations, and academic showcases.' },
        { id: 'sub-8', key: 'sub_business', name: 'Business & B2B Matchmaking', head_name: 'Oknha Pich Dara', deputy_head_name: 'Mr. Huang Wei', desc: 'Enterprise networking sessions, contract signing ceremonies, and trade delegations.' },
        { id: 'sub-9', key: 'sub_media', name: 'Media & Communications', head_name: 'Mr. Chea Sovann', deputy_head_name: 'Ms. Wu Fang', desc: 'Press accreditation, official releases, live broadcast, and social media coverage.' },
        { id: 'sub-10', key: 'sub_finance', name: 'Sponsorship & Finance', head_name: 'Mr. Long Vicheth', deputy_head_name: 'Mr. Zhou Peng', desc: 'Budget oversight, sponsor benefits execution, financial auditing, and receipts.' },
        { id: 'sub-11', key: 'sub_logistics', name: 'Logistics & Transportation', head_name: 'Mr. Kem Sopheap', deputy_head_name: 'Mr. Sun Gang', desc: 'Shuttle buses, cargo freight customs, warehouse supply, and venue equipment.' },
        { id: 'sub-12', key: 'sub_security', name: 'Security & Safety', head_name: 'Maj. Prum Samnang', deputy_head_name: 'Col. Zhang Lei', desc: 'Emergency response, hall security, crowd control, and first aid coordination.' },
        { id: 'sub-13', key: 'sub_tech', name: 'IT & Technical Support', head_name: 'Mr. San Limsathya', deputy_head_name: 'Mr. Lin Haoran', desc: 'Platform operations, QR scanning network, high-speed WiFi, and audiovisual streaming.' }
      ];

      for (let i = 0; i < subcommittees.length; i++) {
        const sub = subcommittees[i];
        await client.query(`
          INSERT INTO public.subcommittees (id, key, name, description, head_name, deputy_head_name, status, display_order)
          VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)
        `, [sub.id, sub.key, sub.name, sub.desc, sub.head_name, sub.deputy_head_name, i + 1]);
      }
    }

    // 7. TASKS (KANBAN)
    const taskCount = await client.query('SELECT COUNT(*) FROM public.tasks');
    if (parseInt(taskCount.rows[0].count, 10) === 0) {
      console.log('Seeding Kanban tasks...');
      const tasks = [
        { id: 'task-1', title: 'Finalize VIP motorcade & police escort route', committee_id: 'main-committee', subcommittee_id: 'sub-3', assignee: 'H.E. Suon Kamsan', priority: 'urgent', status: 'in_progress', due_date: '2026-10-10' },
        { id: 'task-2', title: 'Verify Tongde Plaza electrical 3-phase load capacity', committee_id: 'main-committee', subcommittee_id: 'sub-2', assignee: 'Mr. Seng Visal', priority: 'high', status: 'completed', due_date: '2026-10-05' },
        { id: 'task-3', title: 'Conduct dry run for QR badging printer kiosks', committee_id: 'main-committee', subcommittee_id: 'sub-13', assignee: 'Mr. San Limsathya', priority: 'high', status: 'in_progress', due_date: '2026-10-11' },
        { id: 'task-4', title: 'Confirm simultaneous interpreters for opening plenary', committee_id: 'main-committee', subcommittee_id: 'sub-5', assignee: 'Dr. Heng Sokly', priority: 'medium', status: 'completed', due_date: '2026-10-06' },
        { id: 'task-5', title: 'Draft and release official Press Bulletin #3', committee_id: 'main-committee', subcommittee_id: 'sub-9', assignee: 'Mr. Chea Sovann', priority: 'medium', status: 'todo', due_date: '2026-10-10' },
        { id: 'task-6', title: 'Customs clearance for Cambodian Jasmine rice samples', committee_id: 'main-committee', subcommittee_id: 'sub-11', assignee: 'Mr. Kem Sopheap', priority: 'urgent', status: 'blocked', due_date: '2026-10-09' },
        { id: 'task-7', title: 'Print 5,000 trilingual venue guides & badges', committee_id: 'main-committee', subcommittee_id: 'sub-4', assignee: 'Mr. Chan Bora', priority: 'medium', status: 'in_progress', due_date: '2026-10-10' }
      ];

      for (const t of tasks) {
        await client.query(`
          INSERT INTO public.tasks (id, title, committee_id, subcommittee_id, assignee, priority, status, due_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [t.id, t.title, t.committee_id, t.subcommittee_id, t.assignee, t.priority, t.status, t.due_date]);
      }
    }

    // 8. VIP GUESTS
    const vipCount = await client.query('SELECT COUNT(*) FROM public.vip_guests');
    if (parseInt(vipCount.rows[0].count, 10) === 0) {
      console.log('Seeding VIP guests...');
      const vips = [
        { id: 'vip-1', name: 'H.E. Pan Sorasak', position: 'Senior Minister', organization: 'Royal Government of Cambodia', country: 'Cambodia', protocol_level: 'Head of Delegation (Level 1)', invitation_status: 'Confirmed', attendance_status: 'Attending', seating: 'Row A, Seat 01' },
        { id: 'vip-2', name: 'Hon. Wang Yubo', position: 'Governor of Yunnan Province', organization: 'Yunnan Provincial People\'s Government', country: 'China', protocol_level: 'Head of Delegation (Level 1)', invitation_status: 'Confirmed', attendance_status: 'Attending', seating: 'Row A, Seat 02' },
        { id: 'vip-3', name: 'Ambassador Soeung Rathchavy', position: 'Ambassador Extraordinary and Plenipotentiary', organization: 'Royal Embassy of Cambodia to China', country: 'Cambodia', protocol_level: 'Diplomatic (Level 1)', invitation_status: 'Confirmed', attendance_status: 'Attending', seating: 'Row A, Seat 03' },
        { id: 'vip-4', name: 'Mr. Zhang Guohua', position: 'Director of Department of Commerce', organization: 'Yunnan Provincial Commerce Department', country: 'China', protocol_level: 'Ministerial (Level 2)', invitation_status: 'Confirmed', attendance_status: 'Attending', seating: 'Row B, Seat 04' }
      ];

      for (const v of vips) {
        await client.query(`
          INSERT INTO public.vip_guests (id, name, position, organization, country, protocol_level, invitation_status, attendance_status, seating)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [v.id, v.name, v.position, v.organization, v.country, v.protocol_level, v.invitation_status, v.attendance_status, v.seating]);
      }
    }

    // 9. SPONSORS
    const sponCount = await client.query('SELECT COUNT(*) FROM public.sponsors');
    if (parseInt(sponCount.rows[0].count, 10) === 0) {
      console.log('Seeding sponsors...');
      const sponsors = [
        { id: 'sp-1', name: 'Bank of China (Cambodia)', level: 'Strategic Partner', website: 'https://bankofchina.com.kh', description: 'Premier financial institution powering cross-border trade settlements in KHR and RMB.', order_num: 1 },
        { id: 'sp-2', name: 'Canadia Bank Group', level: 'Platinum', website: 'https://canadiabank.com.kh', description: 'Leading full-service commercial banking conglomerate in Cambodia.', order_num: 2 },
        { id: 'sp-3', name: 'Yunnan Construction and Investment Holding Group', level: 'Platinum', website: 'https://yncih.com', description: 'Major international infrastructure developer across the Mekong subregion.', order_num: 3 },
        { id: 'sp-4', name: 'Cambodia Airways', level: 'Gold', website: 'https://cambodia-airways.com', description: 'Official airline carrier providing direct flight connectivity between Phnom Penh and Kunming.', order_num: 4 },
        { id: 'sp-5', name: 'Huawei Cloud Cambodia', level: 'Gold', website: 'https://huaweicloud.com', description: 'Global digital cloud infrastructure and AI solutions partner.', order_num: 5 },
        { id: 'sp-6', name: 'Khmer Times Media Group', level: 'Media Partner', website: 'https://khmertimeskh.com', description: 'Leading national English and trilingual news media outlet.', order_num: 6 }
      ];

      for (const sp of sponsors) {
        await client.query(`
          INSERT INTO public.sponsors (id, name, level, website, description, display_order, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, true)
        `, [sp.id, sp.name, sp.level, sp.website, sp.description, sp.order_num]);
      }
    }

    // 10. NEWS
    const newsCount = await client.query('SELECT COUNT(*) FROM public.news');
    if (parseInt(newsCount.rows[0].count, 10) === 0) {
      console.log('Seeding news...');
      const newsArticles = [
        {
          id: 'news-1',
          title: 'Official Announcement: Cambodia–China Expo Week 2026 Dates Confirmed',
          slug: 'dates-confirmed-expo-week-2026',
          category: 'Announcement',
          summary: 'The Joint Organizing Committee has officially announced October 12–14, 2026 as the official dates for Expo Week at Tongde Kunming Plaza.',
          content: `The Joint Organizing Committee of the Cambodia–China Expo Week has formally confirmed that the international exhibition will take place from October 12 to 14, 2026 at the prestigious Tongde Kunming Plaza in Yunnan Province, China.\n\nFeaturing over 75 curated commercial booths, ministerial summits, and business matchmaking sessions, the Expo represents a monumental step in deepening bilateral economic, educational, and cultural cooperation. Online visitor and exhibitor registration is now officially open through the platform.`,
          author: 'Secretariat Press Office',
          is_featured: true
        },
        {
          id: 'news-2',
          title: 'Keynote Plenary: High-Level Trade Delegation from Ministry of Commerce',
          slug: 'trade-delegation-ministry-of-commerce',
          category: 'Press Release',
          summary: 'Over 120 leading Cambodian enterprises across agro-industry and tech to participate alongside Chinese commerce counterparts.',
          content: `A high-level trade delegation led by senior officials from the Ministry of Commerce of Cambodia will arrive in Kunming for the bilateral trade summit.\n\nThe delegation will present priority investment opportunities in special economic zones, green energy transitions, and agricultural processing hubs. B2B matchmaking sessions will take place on Day 1 and Day 2 of the Expo.`,
          author: 'Economic Affairs Desk',
          is_featured: false
        },
        {
          id: 'news-3',
          title: 'Digital Accreditation & Instant QR Check-in System Launched',
          slug: 'digital-accreditation-qr-check-in-launched',
          category: 'Operations',
          summary: 'Attendees will benefit from seamless digital pass generation and mobile verification at all venue checkpoints.',
          content: `In line with international best practices for green events, Expo Week 2026 has deployed a zero-paper QR digital credential system.\n\nRegistered visitors and exhibitors receive a secure, tamper-proof QR code pass upon registration that allows instant contactless badge printing and access to all designated exhibition halls.`,
          author: 'IT & Technical Subcommittee',
          is_featured: true
        }
      ];

      for (const n of newsArticles) {
        await client.query(`
          INSERT INTO public.news (id, title, slug, category, summary, content, author, is_featured, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published')
        `, [n.id, n.title, n.slug, n.category, n.summary, n.content, n.author, n.is_featured]);
      }
    }

    // 11. INITIAL REGISTRATIONS SEED
    const regCount = await client.query('SELECT COUNT(*) FROM public.registrations');
    if (parseInt(regCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial verified registrations...');
      const seedRegistrations = [
        {
          id: 'reg-001',
          reg_number: 'EXP-2026-1001',
          full_name: 'David Hem',
          gender: 'Male',
          nationality: 'Cambodian',
          organization: 'Apex Import Export Co.',
          position: 'Managing Director',
          email: 'david.hem@apex-trade.kh',
          phone: '+855 12 345 678',
          country: 'Cambodia',
          city: 'Phnom Penh',
          reg_type: 'Business Buyer',
          status: 'approved',
          qr_token: 'QR-EXP-2026-1001-A79B',
          checked_in: false
        },
        {
          id: 'reg-002',
          reg_number: 'EXP-2026-1002',
          full_name: 'Wang Ling',
          gender: 'Female',
          nationality: 'Chinese',
          organization: 'Yunnan Investment Corporation',
          position: 'Senior Investment Analyst',
          email: 'ling.wang@yn-invest.cn',
          phone: '+86 138 0871 2233',
          country: 'China',
          city: 'Kunming',
          reg_type: 'Visitor',
          status: 'approved',
          qr_token: 'QR-EXP-2026-1002-88EF',
          checked_in: true,
          checked_in_at: new Date().toISOString()
        },
        {
          id: 'reg-003',
          reg_number: 'EXP-2026-1003',
          full_name: 'Sok Vicheka',
          gender: 'Male',
          nationality: 'Cambodian',
          organization: 'National University of Management',
          position: 'Dean of Business Faculty',
          email: 'sok.vicheka@num.edu.kh',
          phone: '+855 17 890 123',
          country: 'Cambodia',
          city: 'Phnom Penh',
          reg_type: 'University / Education Institution',
          status: 'approved',
          qr_token: 'QR-EXP-2026-1003-C34A',
          checked_in: false
        }
      ];

      for (const r of seedRegistrations) {
        await client.query(`
          INSERT INTO public.registrations (id, reg_number, full_name, gender, nationality, organization, position, email, phone, country, city, reg_type, status, qr_token, checked_in, checked_in_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [r.id, r.reg_number, r.full_name, r.gender, r.nationality, r.organization, r.position, r.email, r.phone, r.country, r.city, r.reg_type, r.status, r.qr_token, r.checked_in, r.checked_in_at]);

        if (r.checked_in) {
          await client.query(`
            INSERT INTO public.checkins (id, registration_id, reg_number, attendee_name, organization, reg_type, staff_username)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [`chk-${r.id}`, r.id, r.reg_number, r.full_name, r.organization, r.reg_type, 'admin']);
        }
      }
    }

    console.log('✓ Seeding complete with authentic platform records!');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
