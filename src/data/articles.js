import cover1 from '../assets/blog/blog-inside/1.svg';
import card1 from '../assets/blog/images/1-card.webp';
import cover2 from '../assets/blog/blog-inside/2.svg';
import card2 from '../assets/blog/images/2-card.webp';
import cover3 from '../assets/blog/blog-inside/3.svg';
import card3 from '../assets/blog/images/3-card.webp';
import cover4 from '../assets/blog/blog-inside/4.svg';
import card4 from '../assets/blog/images/4-card.webp';
import cover5 from '../assets/blog/blog-inside/5.svg';
import card5 from '../assets/blog/images/5-card.webp';
import cover6 from '../assets/blog/blog-inside/6.svg';
import card6 from '../assets/blog/images/6-card.webp';
import cover7 from '../assets/blog/blog-inside/7.svg';
import card7 from '../assets/blog/images/7-card.webp';

export const articles = [
  {
    slug: 'the-2026-entry-level-developer-market',
    aliases: ['how-can-designers-prepare-for-the-future'],
    title: 'The 2026 Entry-Level Developer Market, India vs the World',
    summary:
      'What freshers actually face in India, the US and Europe, and where the real openings are hiding.',
    date: 'Oct 2, 2026',
    cover: cover1,
    cardImage: card1,
    cardDescription:
      'What freshers actually face in India, the US and Europe, and where the real openings are hiding.',
    blocks: [
      {
        type: 'heading',
        text: 'What Changed for Freshers',
      },
      {
        type: 'paragraph',
        text: 'Every year brings a new batch of graduates and a new wave of headlines about whether software jobs are disappearing. The reality is less dramatic and more useful to understand. The entry-level ladder did not vanish. Its first rung moved higher, and the people who understand why are the ones climbing it.',
      },
      {
        type: 'quote',
        text: 'The entry-level ladder did not disappear. It moved.',
      },
      {
        type: 'heading',
        text: 'Why the First Rung Feels Higher',
      },
      {
        type: 'paragraph',
        text: 'AI coding assistants now handle much of the work that once trained juniors: boilerplate, simple bug fixes, routine screens and repetitive tests. Teams still need people, but they expect new hires to contribute to real problems sooner and to review machine-written code with a critical eye.',
      },
      {
        type: 'list',
        items: [
          'Routine tasks are faster, so fewer hours are billed for pure routine work',
          'Reviewing and verifying code has become a core junior skill',
          'Employers ask for proof of building, not just proof of studying',
        ],
      },
      {
        type: 'heading',
        text: 'India: Three Doors Into the Industry',
      },
      {
        type: 'paragraph',
        text: 'The Indian market is large and layered, and each door suits a different kind of fresher.',
      },
      {
        type: 'list',
        items: [
          'IT services companies: high-volume hiring, structured training and a steady start, but hiring follows client demand and pay can grow slowly',
          'Product startups and scaleups: fewer openings, faster ownership and broader exposure, but they expect you to be useful early',
          'Global capability centres: in-house engineering hubs of multinational companies in Indian cities, doing serious product work with competitive hiring bars',
        ],
      },
      {
        type: 'paragraph',
        text: 'Most freshers apply only to the first door. Candidates who build a visible project and also target the other two face far less competition per seat.',
      },
      {
        type: 'heading',
        text: 'The US and Europe: A Narrower Entrance',
      },
      {
        type: 'paragraph',
        text: 'In larger Western markets, entry-level roles are often filled through internships, referrals and graduate programmes. Work authorisation adds another filter, and fully remote junior roles are rare because teams prefer to mentor in person. For an Indian developer, the realistic path abroad is usually a first job at home, an internal transfer, remote work after gaining experience, or further study.',
      },
      {
        type: 'heading',
        text: 'What Hiring Teams Reward Everywhere',
      },
      {
        type: 'paragraph',
        text: 'Across countries, the signals that move a fresher forward look surprisingly similar.',
      },
      {
        type: 'list',
        items: [
          'A finished, deployed project with a clear README',
          'The ability to explain every decision in your own code',
          'Basic data structures and problem-solving fundamentals',
          'Clear written communication in emails, commits and documentation',
        ],
      },
      {
        type: 'heading',
        text: 'Where the Hidden Openings Are',
      },
      {
        type: 'paragraph',
        text: 'Some of the least crowded roles are the ones fewer freshers target: QA automation, internal tooling, data engineering support, developer support and AI-adjacent roles at small companies. They are less glamorous, but they teach real systems and often lead into core engineering faster than expected.',
      },
      {
        type: 'heading',
        text: 'A Practical 12-Month Plan',
      },
      {
        type: 'paragraph',
        text: 'In the first three months, strengthen fundamentals in one language and one data structures routine. In the next three, ship one real project end to end. Then spend three months applying across all three Indian doors while writing about what was built. Use the final three months to interview, learn from each rejection and fill the gaps they reveal.',
      },
      {
        type: 'heading',
        text: 'Read the Market as It Is',
      },
      {
        type: 'paragraph',
        text: 'The market rewards people who adapt, not people who wait. Understand where the bar moved, build toward it deliberately and the 2026 job market looks far less like a wall and far more like a steep staircase.',
      },
    ],
  },
  {
    slug: 'skills-that-survive-ai-coding-assistants',
    title: 'Skills That Survive AI Coding Assistants',
    summary:
      'When autocomplete writes the boilerplate, these are the abilities that still make a developer valuable.',
    date: 'Aug 24, 2026',
    cover: cover2,
    cardImage: card2,
    cardDescription:
      'When autocomplete writes the boilerplate, these are the abilities that still make a developer valuable.',
    blocks: [
      {
        type: 'heading',
        text: 'What Machines Do Well, and What They Do Not',
      },
      {
        type: 'paragraph',
        text: 'AI assistants are excellent at producing plausible code quickly. They are far weaker at understanding why a product exists, which trade-offs a team can live with and what quietly breaks three weeks later. The developers who thrive are the ones who own that second set of questions.',
      },
      {
        type: 'quote',
        text: 'Writing code is getting cheaper. Knowing what to build, and whether it works, is not.',
      },
      {
        type: 'heading',
        text: 'Problem Decomposition',
      },
      {
        type: 'paragraph',
        text: 'Turning a vague request into small, testable pieces is the skill that makes every other tool useful. An assistant can solve a well-framed problem in seconds, but it cannot frame the problem for you.',
      },
      {
        type: 'heading',
        text: 'Reading and Debugging Code',
      },
      {
        type: 'paragraph',
        text: 'Most professional work is understanding code that already exists, including code a machine wrote moments ago. Developers who can trace execution, read stack traces calmly and form a hypothesis before changing anything will always be needed.',
      },
      {
        type: 'list',
        items: [
          'Reproduce the bug before touching the code',
          'Change one thing at a time',
          'Explain the cause in one sentence before writing the fix',
        ],
      },
      {
        type: 'heading',
        text: 'System Design Thinking',
      },
      {
        type: 'paragraph',
        text: 'Choosing how data flows, where state lives, what fails gracefully and what it will cost at scale is judgment, not syntax. Even small projects teach it: a Firebase-backed app and a Python service with local storage force very different decisions.',
      },
      {
        type: 'heading',
        text: 'Testing and Skepticism',
      },
      {
        type: 'paragraph',
        text: 'AI-written code often looks correct while hiding edge cases. A habit of writing tests, checking inputs and distrusting confident output is quickly becoming one of the most valuable traits a junior can show.',
      },
      {
        type: 'heading',
        text: 'Security and Data Awareness',
      },
      {
        type: 'paragraph',
        text: 'Leaked keys, unvalidated input and careless data storage are mistakes machines repeat as easily as humans do. Knowing the basics of authentication, secrets handling and privacy turns a developer from helpful into trustworthy.',
      },
      {
        type: 'heading',
        text: 'Domain Knowledge and Communication',
      },
      {
        type: 'paragraph',
        text: 'The strongest engineers understand the field they build for, whether that is finance, health, logistics or education, and can explain technical choices to non-technical people. This is the layer that no assistant can fully supply.',
      },
      {
        type: 'heading',
        text: 'How to Practise Without Becoming Dependent',
      },
      {
        type: 'paragraph',
        text: 'Build small things by hand first so the fundamentals stay sharp. Then use assistants for speed, with one rule: never ship a line you cannot explain. Treat the tool as a fast colleague whose work always needs review.',
      },
    ],
  },
  {
    slug: 'how-indian-freshers-get-hired-without-campus-placement',
    title: 'How Indian Freshers Get Hired Without Campus Placement',
    summary:
      'A practical off-campus route built on proof of work, smart applications and well-aimed outreach.',
    date: 'Jul 15, 2026',
    cover: cover3,
    cardImage: card3,
    cardDescription:
      'A practical off-campus route built on proof of work, smart applications and well-aimed outreach.',
    blocks: [
      {
        type: 'heading',
        text: 'Why Off-Campus Is Not the Backup Plan',
      },
      {
        type: 'paragraph',
        text: 'Campus drives are a single door that opens for a limited number of students at specific times. Off-campus hiring is every other door in the industry. It takes more initiative, but it also reaches startups, product companies and teams that never visit colleges.',
      },
      {
        type: 'quote',
        text: 'Campus placement is one door. The industry has hundreds.',
      },
      {
        type: 'heading',
        text: 'Start With Proof of Work',
      },
      {
        type: 'paragraph',
        text: 'A recruiter has seconds to decide whether to keep reading. Visible work answers the question before it is asked.',
      },
      {
        type: 'list',
        items: [
          'Two or three finished projects that solve a real problem',
          'Live demos or downloadable releases, not just source code',
          'A README that explains the problem, the stack and the key decision made',
          'Short write-ups about what broke and how it was fixed',
        ],
      },
      {
        type: 'heading',
        text: 'Make Your GitHub and LinkedIn Readable',
      },
      {
        type: 'paragraph',
        text: 'Pin the best repositories, write one-line descriptions and keep commit history honest. On LinkedIn, replace vague headlines with something specific, such as the languages you build in and what you have shipped. Both profiles should tell the same story as the resume.',
      },
      {
        type: 'heading',
        text: 'Apply Where Few Others Look',
      },
      {
        type: 'paragraph',
        text: 'Large job boards are crowded within hours of a posting. Company career pages, startup job boards, hackathons, open-source communities and developer groups often surface openings earlier and with less competition. Internship platforms remain a valuable first step, because a short internship is usually the quickest way to turn "no experience" into "some experience".',
      },
      {
        type: 'heading',
        text: 'Cold Outreach That Gets Replies',
      },
      {
        type: 'paragraph',
        text: 'A good message is short, specific and easy to answer. Name the person\'s team or product, mention one relevant thing you built, and make a small ask, such as feedback or a pointer to the right person. Avoid mass copy-paste messages, because they are easy to spot and easy to ignore.',
      },
      {
        type: 'heading',
        text: 'Prepare for the Interview You Will Actually Get',
      },
      {
        type: 'paragraph',
        text: 'Expect a mix of data structures basics, questions about your projects and a conversation about how you think. Practise explaining each project from the problem to the trade-offs, because interviewers often spend more time on what you built than on textbook questions.',
      },
      {
        type: 'heading',
        text: 'Handling Rejection and Timelines',
      },
      {
        type: 'paragraph',
        text: 'Off-campus searches commonly take months. Track every application, note the stage reached and review the pattern. Silence usually means timing, not talent, and every rejection after an interview is data about what to practise next.',
      },
      {
        type: 'heading',
        text: 'Keep Building While You Search',
      },
      {
        type: 'paragraph',
        text: 'Candidates who keep shipping during the search tell a stronger story than those who only wait. A new project, a contribution to an open-source repository or a published write-up gives every future conversation something fresh to point to.',
      },
    ],
  },
  {
    slug: 'working-for-foreign-companies-from-india',
    title: 'Working for Foreign Companies from India',
    summary:
      'How remote hiring really works, where the legitimate openings are and how to avoid the common traps.',
    date: 'May 29, 2026',
    cover: cover4,
    cardImage: card4,
    cardDescription:
      'How remote hiring really works, where the legitimate openings are and how to avoid the common traps.',
    blocks: [
      {
        type: 'heading',
        text: 'Why Global Hiring Is Opening Up',
      },
      {
        type: 'paragraph',
        text: 'Remote work taught companies that talent does not need to sit in the same city. For Indian developers this means access to employers and salary ranges that were once out of reach, but it also means competing with people everywhere and following rules that local jobs never required.',
      },
      {
        type: 'quote',
        text: 'Remote work removes the commute. It does not remove the standards.',
      },
      {
        type: 'heading',
        text: 'Where Legitimate Openings Come From',
      },
      {
        type: 'list',
        items: [
          'Remote-first startups that hire across time zones',
          'Agencies and product teams that use contractors for specific projects',
          'Open-source work that grows into paid roles',
          'Global job boards that filter for remote positions',
        ],
      },
      {
        type: 'heading',
        text: 'Three Ways You Can Be Engaged',
      },
      {
        type: 'paragraph',
        text: 'Understanding the arrangement matters as much as the offer.',
      },
      {
        type: 'list',
        items: [
          'Full-time through the company\'s own entity or an employer-of-record service',
          'Independent contractor with a service agreement and invoices',
          'Freelance project work, usually fixed-scope or hourly',
        ],
      },
      {
        type: 'paragraph',
        text: 'Each model changes how you are paid, taxed and protected, so ask which one is being offered before accepting.',
      },
      {
        type: 'heading',
        text: 'Time Zones and Async Communication',
      },
      {
        type: 'paragraph',
        text: 'Working with US or European teams often means overlapping only a few hours with the team. Clear writing becomes a competitive advantage: concise updates, well-documented decisions and questions asked with enough context to be answered without a call.',
      },
      {
        type: 'heading',
        text: 'How to Get Noticed',
      },
      {
        type: 'paragraph',
        text: 'Remote employers cannot see you in an office, so they rely on evidence. Publish projects, write about your work, contribute to open source and keep a profile that shows reliability. A short, specific application beats a long generic one every time.',
      },
      {
        type: 'heading',
        text: 'Money, Contracts and Compliance',
      },
      {
        type: 'paragraph',
        text: 'Read the contract fully, including scope, payment terms, intellectual property and termination. Understand how international payments reach you and what tax obligations apply to foreign income. These rules change, so confirm the current details with a qualified chartered accountant before signing.',
      },
      {
        type: 'heading',
        text: 'Red Flags to Walk Away From',
      },
      {
        type: 'list',
        items: [
          'Any job that asks you to pay a fee to get hired',
          'Offers with no interview and unusually high pay',
          'Requests to buy equipment from a specific seller and be reimbursed later',
          'Employers who refuse to put terms in writing',
        ],
      },
      {
        type: 'heading',
        text: 'Start Smaller Than You Think',
      },
      {
        type: 'paragraph',
        text: 'A short contract, a small freelance project or a part-time role is often the best first step. It builds references, teaches the payment and communication workflow and makes the next, larger opportunity much easier to win.',
      },
    ],
  },
  {
    slug: 'from-python-developer-to-ai-engineer',
    title: 'From Python Developer to AI Engineer',
    summary:
      'A step-by-step roadmap from solid Python to building reliable AI applications with LLMs, RAG and agents.',
    date: 'Apr 14, 2026',
    cover: cover5,
    cardImage: card5,
    cardDescription:
      'A step-by-step roadmap from solid Python to building reliable AI applications with LLMs, RAG and agents.',
    blocks: [
      {
        type: 'heading',
        text: 'What an AI Engineer Actually Does',
      },
      {
        type: 'paragraph',
        text: 'An AI engineer rarely trains a model from scratch. The work is building dependable products on top of existing models: connecting them to data, giving them tools, measuring their behaviour and keeping costs and failures under control. A strong Python developer already has half the foundation.',
      },
      {
        type: 'quote',
        text: 'The model is the engine. The engineering is everything that keeps it on the road.',
      },
      {
        type: 'heading',
        text: '1. Make Python and APIs Second Nature',
      },
      {
        type: 'paragraph',
        text: 'Comfort with HTTP, JSON, async code, environment variables and error handling matters more than any framework. Most AI applications are careful orchestration of API calls.',
      },
      {
        type: 'heading',
        text: '2. Learn to Work With LLM APIs',
      },
      {
        type: 'paragraph',
        text: 'Start by calling a model directly before using any wrapper library. Practise writing clear instructions, controlling output format and requesting structured results that your code can parse safely.',
      },
      {
        type: 'list',
        items: [
          'Write prompts as specifications, not wishes',
          'Ask for structured output and validate it',
          'Handle timeouts, rate limits and malformed replies',
        ],
      },
      {
        type: 'heading',
        text: '3. Build Retrieval-Augmented Generation',
      },
      {
        type: 'paragraph',
        text: 'Models do not know your private documents. Retrieval-augmented generation fixes this by finding relevant passages, supplying them as context and asking the model to answer from them. Learn how to split documents, store and search embeddings and check whether the right passages were actually retrieved.',
      },
      {
        type: 'heading',
        text: '4. Add Tools and Agents Carefully',
      },
      {
        type: 'paragraph',
        text: 'Tool calling lets a model trigger actions such as searching, querying a database or sending a request. Agents chain these decisions together. Start with a single tool and a fixed workflow, and add autonomy only when a simple workflow clearly cannot do the job.',
      },
      {
        type: 'heading',
        text: '5. Learn to Evaluate',
      },
      {
        type: 'paragraph',
        text: 'Without measurement, an AI feature is only a demo. Build a small set of test questions with expected behaviour, run it after every change and track failures. This habit separates hobby projects from production systems.',
      },
      {
        type: 'heading',
        text: '6. Ship, Monitor and Control Cost',
      },
      {
        type: 'paragraph',
        text: 'Deploy something real. Log inputs and outputs, watch latency, cache repeated work and choose smaller models where quality allows. Cost awareness is a professional skill, not an afterthought.',
      },
      {
        type: 'heading',
        text: 'Projects That Prove the Skill',
      },
      {
        type: 'list',
        items: [
          'A document question-answering app over your own notes',
          'An automation that summarises and routes incoming email',
          'A small agent with one safe tool and a written evaluation set',
        ],
      },
      {
        type: 'heading',
        text: 'Start Where You Are',
      },
      {
        type: 'paragraph',
        text: 'The path is a sequence of small, buildable steps, not a leap. Finish one stage, build something with it and move on. Within months, a Python developer can show real AI engineering work.',
      },
    ],
  },
  {
    slug: 'why-your-portfolio-matters-more-than-your-degree',
    aliases: ['designing-products-with-purpose'],
    title: 'Why Your Portfolio Matters More Than Your Degree',
    summary:
      'What recruiters actually look at, and how to turn your projects into evidence they trust.',
    date: 'Mar 8, 2026',
    cover: cover6,
    cardImage: card6,
    cardDescription:
      'What recruiters actually look at, and how to turn your projects into evidence they trust.',
    blocks: [
      {
        type: 'heading',
        text: 'The Question Behind Every Resume',
      },
      {
        type: 'paragraph',
        text: 'Hiring teams are trying to answer one question: can this person do the work? A degree suggests that you studied. A portfolio shows that you built. When time is short, evidence of building is far easier to trust.',
      },
      {
        type: 'quote',
        text: 'A degree says you studied. A portfolio shows you can ship.',
      },
      {
        type: 'heading',
        text: 'Where Degrees Still Matter',
      },
      {
        type: 'paragraph',
        text: 'This is not an argument against education. Many Indian employers still use degree criteria as an eligibility filter, and some visa and further-study routes require one. A degree opens doors. A portfolio is what convinces the person on the other side of them.',
      },
      {
        type: 'heading',
        text: 'What a Strong Portfolio Contains',
      },
      {
        type: 'list',
        items: [
          'A small number of finished projects, not a long list of half-finished ones',
          'Live links that actually work',
          'Clear explanations of the problem, the stack and the trade-offs',
          'Evidence of ongoing learning, such as recent commits or write-ups',
        ],
      },
      {
        type: 'heading',
        text: 'Write READMEs Like Case Studies',
      },
      {
        type: 'paragraph',
        text: 'A good README answers four questions: what the project does, why it exists, how to run it and what was hardest to build. Screenshots or a short demo clip make the work instantly understandable, even to a non-technical recruiter.',
      },
      {
        type: 'heading',
        text: 'Choose Projects That Show Judgment',
      },
      {
        type: 'paragraph',
        text: 'Another to-do app proves little. Projects that solve a real, specific problem, handle messy data or run entirely on a user\'s own device show product thinking and technical depth.',
      },
      {
        type: 'heading',
        text: 'Make It Easy to Evaluate',
      },
      {
        type: 'paragraph',
        text: 'Recruiters do not dig. Put the best work first, keep descriptions brief and make contact details obvious. A fast, clean site is itself a demonstration of craft.',
      },
      {
        type: 'heading',
        text: 'Common Mistakes',
      },
      {
        type: 'list',
        items: [
          'Tutorial clones with no original thinking',
          'Broken demo links and missing documentation',
          'Too many projects with too little depth',
          'Copying code you cannot explain in an interview',
        ],
      },
      {
        type: 'heading',
        text: 'Treat the Portfolio as a Living Product',
      },
      {
        type: 'paragraph',
        text: 'Update it as you learn, retire weak projects and add short notes on what changed. A portfolio that grows tells recruiters that you do too.',
      },
    ],
  },
  {
    slug: 'freelancing-in-ai-automation',
    title: 'Freelancing in AI Automation: A Beginner\'s Guide',
    summary:
      'How to find clients, scope projects, price your work and avoid the mistakes that sink new freelancers.',
    date: 'Jan 22, 2026',
    cover: cover7,
    cardImage: card7,
    cardDescription:
      'How to find clients, scope projects, price your work and avoid the mistakes that sink new freelancers.',
    blocks: [
      {
        type: 'heading',
        text: 'Why Automation Is a Freelance Opportunity',
      },
      {
        type: 'paragraph',
        text: 'Small businesses, agencies and solo professionals lose hours every week to repetitive tasks such as sorting emails, copying data between tools, drafting reports and following up with leads. They rarely have anyone who can fix this. A developer who can connect tools and add AI where it helps is easy to hire.',
      },
      {
        type: 'quote',
        text: 'Clients do not buy automation. They buy their time back.',
      },
      {
        type: 'heading',
        text: 'What You Can Actually Offer',
      },
      {
        type: 'list',
        items: [
          'Email and message triage with AI summaries',
          'Lead capture and follow-up workflows',
          'Report generation from spreadsheets or databases',
          'Simple chat assistants trained on a business\'s own documents',
        ],
      },
      {
        type: 'heading',
        text: 'Tools Worth Learning First',
      },
      {
        type: 'paragraph',
        text: 'Workflow platforms such as n8n let you build useful automations quickly, and Python fills the gaps when logic gets complex. Learn to connect APIs, handle errors, log runs and add a human approval step where mistakes would be costly.',
      },
      {
        type: 'heading',
        text: 'Finding the First Clients',
      },
      {
        type: 'paragraph',
        text: 'Start close to home: local businesses, college clubs, relatives with small shops and communities where you already have trust. Offer one specific result, such as "I will save you five hours a week on invoicing", instead of a general service. Document each finished job as a short case study for the next client.',
      },
      {
        type: 'heading',
        text: 'Scoping Without Surprises',
      },
      {
        type: 'paragraph',
        text: 'Most freelance trouble begins with unclear scope. Write down what is included, what is not, how many revisions are covered and what the client must provide. Agree on a small first milestone so both sides see progress early.',
      },
      {
        type: 'heading',
        text: 'Pricing Your Work',
      },
      {
        type: 'list',
        items: [
          'Fixed price for clearly defined projects',
          'Monthly retainer for maintenance and improvements',
          'Hourly only when scope is truly unknown',
        ],
      },
      {
        type: 'paragraph',
        text: 'Price by the value delivered, not by the hours typed. A workflow that saves a business weeks of effort is worth more than the time it took you to build.',
      },
      {
        type: 'heading',
        text: 'Reliability, Privacy and Honesty',
      },
      {
        type: 'paragraph',
        text: 'Test automations thoroughly, explain limits clearly and protect client data. Never promise that AI will be perfect. Clients value the freelancer who says what could go wrong and has a plan for it.',
      },
      {
        type: 'heading',
        text: 'Start Small, Then Compound',
      },
      {
        type: 'paragraph',
        text: 'One successful project becomes a case study, a referral and a stronger price. Begin with a single narrow service, deliver it well and let the results do the selling.',
      },
    ],
  },
];

export default articles;
