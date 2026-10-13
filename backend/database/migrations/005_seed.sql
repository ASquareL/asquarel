-- ================================================
-- MIGRATION 005 — Seed Data
-- ================================================

-- PLANS
INSERT INTO plans (slug, name, description, price_cents, currency, interval, features, display_order, active)
VALUES
    ('free', 'Free', 'Access to starter lessons and community support.',
     0, 'NGN', 'month',
     ARRAY['Starter lessons', 'Community support', 'Progress tracking'], 1, true),
    ('pro', 'Pro', 'Full access to all courses, quizzes, and certificates.',
     500000, 'NGN', 'month',
     ARRAY['All courses', 'All quizzes', 'Certificates', 'Discussion access'], 2, true),
    ('mentorship', 'Mentorship', 'Everything in Pro plus direct mentor access.',
     2500000, 'NGN', 'month',
     ARRAY['Everything in Pro', 'Direct mentor access', '1-on-1 sessions', 'Priority support'], 3, true);

-- COURSES
INSERT INTO courses (slug, title, tagline, description, icon, duration_weeks, level,
                     certificate_enabled, outcomes, projects, requirements, faq,
                     published, display_order)
VALUES
    ('web-development', 'Web Development',
     'Master HTML, CSS, JavaScript, and modern frameworks by building real projects from scratch.',
     'A complete beginner-to-intermediate web development track covering HTML, CSS, responsive design, JavaScript, and modern workflow tools.',
     'fa-solid fa-code', 12, 'Beginner', true,
     ARRAY[
        'Build complete websites from scratch using semantic HTML and modern CSS',
        'Write clean, maintainable JavaScript — from variables to async/await',
        'Create responsive layouts that work perfectly on phone, tablet, and desktop',
        'Master DOM manipulation, events, and interactive UI behaviour',
        'Work with Git, GitHub, and modern developer tools used in real jobs',
        'Ship real projects to the internet and build a portfolio that gets noticed'
     ],
     '[
        {"title":"Personal Portfolio","description":"A responsive site that showcases your skills, projects, and contact information.","icon":"fa-solid fa-id-card"},
        {"title":"Task Manager App","description":"An interactive task tracker with add, complete, delete, and filter features.","icon":"fa-solid fa-list-check"},
        {"title":"Weather Dashboard","description":"A real API-powered app that fetches live weather data and renders it beautifully.","icon":"fa-solid fa-cloud-sun"}
     ]'::jsonb,
     ARRAY[
        'No prior programming experience needed — we start from zero',
        'A phone, tablet, or laptop with internet access',
        'Consistency — 30 minutes a day beats 5 hours once a week',
        'Curiosity and willingness to make mistakes (that''s how you learn)'
     ],
     '[
        {"q":"Is this course really beginner-friendly?","a":"Yes. We start from zero. Module 1 assumes no prior experience."},
        {"q":"How long does it take to finish?","a":"At 30 minutes a day, roughly 3 months. At 1 hour a day, about 6 weeks."},
        {"q":"Can I learn from my phone?","a":"Yes. Every lesson is designed to work on a phone."},
        {"q":"Do I get a certificate?","a":"Yes. Complete all lessons and earn a shareable certificate."},
        {"q":"What if I get stuck?","a":"Pro and Mentorship plan students get direct mentor access. Free plan students have community support."},
        {"q":"Will this get me a job?","a":"It gives you the foundation, real projects, and the skills employers ask for."}
     ]'::jsonb,
     true, 1),

    ('crypto-blockchain', 'Crypto & Blockchain',
     'Understand blockchain fundamentals, wallet safety, DEX trading, and decentralized finance.',
     'A practical introduction to blockchain technology, from how Bitcoin works to safely using wallets and DeFi protocols.',
     'fa-brands fa-bitcoin', 10, 'Beginner', true,
     ARRAY[
        'Understand how blockchain technology actually works',
        'Set up and secure a personal crypto wallet',
        'Safely send, receive, and store digital assets',
        'Trade on decentralized exchanges (DEX) with confidence',
        'Understand DeFi protocols and yield opportunities',
        'Recognize and avoid common scams and pitfalls'
     ],
     '[]'::jsonb,
     ARRAY[
        'No prior crypto experience needed',
        'A phone or laptop with internet access',
        'Willingness to practice on test networks before risking real funds'
     ],
     '[
        {"q":"Is crypto safe to learn?","a":"Yes, when you follow best practices. We teach safety-first from lesson one."},
        {"q":"Do I need money to start?","a":"No. You can learn everything on test networks before using real funds."}
     ]'::jsonb,
     true, 2),

    ('smartphone-graphic-design', 'Smartphone Graphic Design',
     'Create premium flyers, logos, and brand visuals using just your mobile phone.',
     'A practical design course built specifically for mobile-first creators. Learn layout, color, typography, and brand thinking — all from your phone.',
     'fa-solid fa-pen-ruler', 8, 'Beginner', true,
     ARRAY[
        'Design professional-looking flyers entirely on your phone',
        'Create simple, memorable logos using mobile tools',
        'Understand color theory, typography, and layout principles',
        'Build a small brand identity from scratch',
        'Export and share high-quality visuals for print and social media'
     ],
     '[]'::jsonb,
     ARRAY[
        'A smartphone (Android or iOS)',
        'A free design app (we recommend one in lesson 1)',
        'An eye for detail and a willingness to iterate'
     ],
     '[
        {"q":"Which phone do I need?","a":"Any modern Android or iPhone works. We recommend free apps that run on both."},
        {"q":"Do I need design experience?","a":"No. We start with the absolute basics — no prior design knowledge required."}
     ]'::jsonb,
     true, 3);

-- MODULES — Web Development
WITH c AS (SELECT id FROM courses WHERE slug = 'web-development')
INSERT INTO modules (course_id, title, description, order_index)
SELECT c.id, m.title, m.description, m.order_index
FROM c, (VALUES
    ('HTML Fundamentals', 'Structure, semantics, forms, accessibility, and the building blocks of every web page.', 1),
    ('CSS Fundamentals', 'Selectors, the box model, colors, typography, and styling that scales.', 2),
    ('CSS Layout & Responsive Design', 'Flexbox, Grid, media queries, and building layouts that work on every screen.', 3),
    ('JavaScript Fundamentals', 'Variables, functions, arrays, objects, control flow, and how to think like a programmer.', 4),
    ('Advanced JavaScript', 'DOM manipulation, events, async/await, fetch API, and building interactive interfaces.', 5),
    ('Modern Workflow & Deployment', 'Git, GitHub, package managers, build tools, and shipping real projects to production.', 6)
) AS m(title, description, order_index);

-- MODULES — Crypto & Blockchain
WITH c AS (SELECT id FROM courses WHERE slug = 'crypto-blockchain')
INSERT INTO modules (course_id, title, description, order_index)
SELECT c.id, m.title, m.description, m.order_index
FROM c, (VALUES
    ('Blockchain Foundations', 'What a blockchain is, how it works, and why it matters.', 1),
    ('Bitcoin & Ethereum', 'The two dominant networks — their differences, use cases, and communities.', 2),
    ('Wallets & Security', 'Hot vs cold storage, seed phrases, and protecting your assets.', 3),
    ('Trading & Exchanges', 'Centralized vs decentralized exchanges, order types, and safe trading.', 4),
    ('DeFi Fundamentals', 'Lending, borrowing, staking, and yield protocols.', 5),
    ('Safety, Scams & Best Practices', 'How to recognize phishing, rug pulls, and common traps.', 6)
) AS m(title, description, order_index);

-- MODULES — Smartphone Graphic Design
WITH c AS (SELECT id FROM courses WHERE slug = 'smartphone-graphic-design')
INSERT INTO modules (course_id, title, description, order_index)
SELECT c.id, m.title, m.description, m.order_index
FROM c, (VALUES
    ('Design Foundations', 'The core principles behind every great-looking design.', 1),
    ('Color & Typography', 'Choosing palettes and fonts that work together.', 2),
    ('Layout & Composition', 'Arranging elements so the eye knows where to look.', 3),
    ('Logo Design', 'Creating simple, memorable marks that scale.', 4),
    ('Flyers & Social Media', 'Designing for print and digital platforms.', 5),
    ('Brand Identity', 'Pulling everything together into a consistent system.', 6)
) AS m(title, description, order_index);

-- LESSONS — Web Development (52 total)
-- Module 1: HTML Fundamentals (8)
WITH m AS (SELECT id, course_id FROM modules
           WHERE course_id = (SELECT id FROM courses WHERE slug = 'web-development')
           AND order_index = 1)
INSERT INTO lessons (course_id, module_id, slug, number, title, duration_minutes)
SELECT m.course_id, m.id, x.slug, x.num, x.title, x.dur
FROM m, (VALUES
    ('lesson-01', 1, 'Welcome — What is the Web?', 20),
    ('lesson-02', 2, 'How the Internet Works', 25),
    ('lesson-03', 3, 'Setting Up Your Tools', 30),
    ('lesson-04', 4, 'Your First HTML Page', 40),
    ('lesson-05', 5, 'Structure & Semantics', 45),
    ('lesson-06', 6, 'Links, Images & Media', 40),
    ('lesson-07', 7, 'Forms & Inputs', 50),
    ('lesson-08', 8, 'Accessibility Basics', 40)
) AS x(slug, num, title, dur);

-- Module 2: CSS Fundamentals (10)
WITH m AS (SELECT id, course_id FROM modules
           WHERE course_id = (SELECT id FROM courses WHERE slug = 'web-development')
           AND order_index = 2)
INSERT INTO lessons (course_id, module_id, slug, number, title, duration_minutes)
SELECT m.course_id, m.id, x.slug, x.num, x.title, x.dur
FROM m, (VALUES
    ('lesson-09', 9, 'Introduction to CSS', 30),
    ('lesson-10', 10, 'Selectors & Specificity', 45),
    ('lesson-11', 11, 'The Box Model', 40),
    ('lesson-12', 12, 'Colors & Backgrounds', 35),
    ('lesson-13', 13, 'Typography on the Web', 45),
    ('lesson-14', 14, 'Borders, Shadows & Effects', 40),
    ('lesson-15', 15, 'Pseudo-classes & Pseudo-elements', 50),
    ('lesson-16', 16, 'Transitions & Animations', 45),
    ('lesson-17', 17, 'CSS Variables', 35),
    ('lesson-18', 18, 'Organizing Your CSS', 50)
) AS x(slug, num, title, dur);

-- Module 3: CSS Layout & Responsive (8)
WITH m AS (SELECT id, course_id FROM modules
           WHERE course_id = (SELECT id FROM courses WHERE slug = 'web-development')
           AND order_index = 3)
INSERT INTO lessons (course_id, module_id, slug, number, title, duration_minutes)
SELECT m.course_id, m.id, x.slug, x.num, x.title, x.dur
FROM m, (VALUES
    ('lesson-19', 19, 'Flexbox Fundamentals', 55),
    ('lesson-20', 20, 'Flexbox Patterns', 50),
    ('lesson-21', 21, 'CSS Grid Fundamentals', 55),
    ('lesson-22', 22, 'Grid Layout Patterns', 50),
    ('lesson-23', 23, 'Responsive Design Principles', 45),
    ('lesson-24', 24, 'Media Queries in Practice', 50),
    ('lesson-25', 25, 'Mobile-First Workflow', 45),
    ('lesson-26', 26, 'Building a Full Layout', 60)
) AS x(slug, num, title, dur);

-- Module 4: JavaScript Fundamentals (10)
WITH m AS (SELECT id, course_id FROM modules
           WHERE course_id = (SELECT id FROM courses WHERE slug = 'web-development')
           AND order_index = 4)
INSERT INTO lessons (course_id, module_id, slug, number, title, duration_minutes)
SELECT m.course_id, m.id, x.slug, x.num, x.title, x.dur
FROM m, (VALUES
    ('lesson-27', 27, 'Introduction to JavaScript', 35),
    ('lesson-28', 28, 'Variables & Data Types', 40),
    ('lesson-29', 29, 'Operators & Expressions', 40),
    ('lesson-30', 30, 'Control Flow — If & Switch', 45),
    ('lesson-31', 31, 'Loops', 45),
    ('lesson-32', 32, 'Functions', 50),
    ('lesson-33', 33, 'Arrays', 50),
    ('lesson-34', 34, 'Objects', 50),
    ('lesson-35', 35, 'Scope & Closures', 55),
    ('lesson-36', 36, 'Error Handling', 40)
) AS x(slug, num, title, dur);

-- Module 5: Advanced JavaScript (8)
WITH m AS (SELECT id, course_id FROM modules
           WHERE course_id = (SELECT id FROM courses WHERE slug = 'web-development')
           AND order_index = 5)
INSERT INTO lessons (course_id, module_id, slug, number, title, duration_minutes)
SELECT m.course_id, m.id, x.slug, x.num, x.title, x.dur
FROM m, (VALUES
    ('lesson-37', 37, 'The DOM', 55),
    ('lesson-38', 38, 'Events & Event Handling', 55),
    ('lesson-39', 39, 'Forms & Validation', 50),
    ('lesson-40', 40, 'Asynchronous JavaScript', 60),
    ('lesson-41', 41, 'Promises & Async/Await', 60),
    ('lesson-42', 42, 'The Fetch API', 55),
    ('lesson-43', 43, 'Working with JSON', 40),
    ('lesson-44', 44, 'Building an Interactive App', 70)
) AS x(slug, num, title, dur);

-- Module 6: Modern Workflow & Deployment (8)
WITH m AS (SELECT id, course_id FROM modules
           WHERE course_id = (SELECT id FROM courses WHERE slug = 'web-development')
           AND order_index = 6)
INSERT INTO lessons (course_id, module_id, slug, number, title, duration_minutes)
SELECT m.course_id, m.id, x.slug, x.num, x.title, x.dur
FROM m, (VALUES
    ('lesson-45', 45, 'Git Fundamentals', 50),
    ('lesson-46', 46, 'GitHub & Collaboration', 50),
    ('lesson-47', 47, 'Branching & Merging', 55),
    ('lesson-48', 48, 'Package Managers & NPM', 45),
    ('lesson-49', 49, 'Build Tools Overview', 50),
    ('lesson-50', 50, 'Deploying to Production', 55),
    ('lesson-51', 51, 'Working with APIs', 55),
    ('lesson-52', 52, 'Final Project & Next Steps', 70)
) AS x(slug, num, title, dur);

-- QUIZZES — One per module (web-development)
INSERT INTO quizzes (course_id, module_id, title, description, pass_threshold, max_attempts)
SELECT m.course_id, m.id,
       m.title || ' — Quiz',
       'Test your understanding of ' || m.title || '.',
       70, NULL
FROM modules m
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'web-development');