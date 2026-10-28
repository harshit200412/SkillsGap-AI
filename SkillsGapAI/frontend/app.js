/* ============ ROLE LIBRARY ============
   Each role carries its own persona, skills, roadmap, library, projects and job data.
   Format is compact on purpose: arrays, not objects, for the repeated rows. */
const TRACKS=[
 {k:'Technology',i:'i-code',d:'Software, data and IT roles'},
 {k:'Business & management',i:'i-case',d:'MBA, commerce and management roles'},
 {k:'Core engineering',i:'i-build',d:'Civil, mechanical and site-based roles'}
];


async function fetchJobRoles() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/roles`);

        if (!response.ok) {
            throw new Error("Failed to fetch job roles");
        }

        const roles = await response.json();

        console.log("Job roles loaded from backend:", roles);

        return roles;
    } catch (error) {
        console.error("Could not load job roles:", error);
        return null;
    }
}


async function loadResumeRoleOptions() {
    const select = document.getElementById("resumeRole");

    if (!select) return;

    // Keep the current options as a fallback if the API fails.
    const fallbackOptions = Array.from(select.options).map(option => ({
        value: option.value,
        label: option.textContent
    }));

    const roles = await fetchJobRoles();

    if (!Array.isArray(roles) || roles.length === 0) {
        console.warn("Using existing job role options.");
        return;
    }

    // Clear the dropdown and create a placeholder.
    select.replaceChildren(
        new Option("Select a target job role", "")
    );

    // Add every role received from PostgreSQL through the API.
    roles.forEach(role => {
        if (!role.key || !role.name) return;

        const option = new Option(role.name, role.key);
        select.add(option);
    });

    // If the API returned no valid roles, restore the old options.
    if (select.options.length === 1) {
        select.replaceChildren(
            ...fallbackOptions.map(
                option => new Option(option.label, option.value)
            )
        );
    }

    console.log("Resume role dropdown updated.");
}


const ROLES={

/* ---------------- 1. BACKEND ENGINEER ---------------- */
'backend':{name:'Backend Engineer',track:'Technology',icon:'i-code',level:'Mid-level',
 blurb:'Python or Java services, databases, APIs and the infrastructure under them.',
 posts:180,score:68,hrs:6,weeksLeft:9,finish:'21 December',streak:12,hours:86.5,doneRes:47,totalRes:112,
 persona:{first:'Aarav',last:'Mehta',ini:'AM',edu:'B.Tech Computer Science, PES University',cur:'Junior Backend Developer',co:'Zentrix Labs',loc:'Bengaluru',exp:'2 yrs 3 mo',
  email:'aarav.mehta@gmail.com',phone:'+91 98860 41127',links:'github.com/aaravm · linkedin.com/in/aaravmehta',
  summary:'Backend developer with two years building Python services for a logistics platform handling 40,000 shipments a day. Strongest in API design and relational data; working towards system design and containers.'},
 skills:[['Python',88,85],['Django',82,75],['REST API design',85,80],['SQL',86,80],['Git',90,70],['Testing',78,70],['Linux',72,65],['Task queues',70,60],
  ['PostgreSQL tuning',62,80],['Redis & caching',55,78],['Docker',48,75],['AWS',45,72],['CI/CD',40,70],['System design',42,85],['Kubernetes',18,75]],
 roadmap:[
  ['Python, properly','Intermediate','6 h','None','Python|Async|Typing','Close the gap between writing Python and understanding it: the data model, generators, context managers and the async runtime.','Fluent Python ch.1–5|Async IO walkthrough|30 typing exercises','Read ch.1–5|Rewrite a service with dataclasses|Finish async course|Typing exercises',4],
  ['SQL and data modelling','Intermediate','7 h','Python, properly','SQL|PostgreSQL|Normalisation','Model a real schema, then break it and watch what the query planner does about it.','Use The Index, Luke|EXPLAIN ANALYZE guide|40 SQL problems','Normalisation drills|Design an orders schema|EXPLAIN 10 slow queries|40 SQL problems',4],
  ['API design','Beginner','5 h','SQL and data modelling','REST|OpenAPI|Versioning','Versioning, pagination, idempotency and error contracts — the parts that show up in code review, not in tutorials.','API design guidelines|Idempotency keys explained|Paginated API exercise','Read the design guide|Add pagination to your API|Write an OpenAPI spec|Idempotent POST exercise',4],
  ['PostgreSQL performance','Intermediate','6 h','SQL and data modelling','PostgreSQL|Indexing|Pooling','Indexes, query plans, connection pooling, and the three ways an ORM quietly ruins a page load.','Indexing strategies course|N+1 queries in Django|pgbench lab','Indexing course|Fix N+1 in your project|Run a pgbench baseline|Add a partial index',3],
  ['Caching and Redis','Intermediate','6 h','PostgreSQL performance','Redis|Caching|Invalidation','Cache-aside, write-through, and the invalidation strategies behind them. Three of your saved postings ask for this by name.','Redis data structures|Caching patterns essay|Redis University RU101','Watch data structures|Read caching patterns|Add cache-aside to the shortener|Handle invalidation on write',3],
  ['Build a rate limiter','Advanced','8 h','Caching and Redis','Redis|Concurrency|Distributed systems','Token bucket shared across instances, with Redis holding the counter. A portfolio piece that shows distributed thinking rather than CRUD.','Rate limiting algorithms|Redis Lua scripting|Load testing with k6','Implement token bucket|Move counters to Redis + Lua|Load test to 5k rps|Write the README with trade-offs',0],
  ['Docker and containers','Intermediate','7 h','Build a rate limiter','Docker|Compose|Images','Multi-stage builds, image size, layer caching, and a compose stack you can actually hand to someone else.','Docker in practice|Multi-stage builds doc|Slim your image','Containerise the service|Build under 120 MB|Compose with Postgres + Redis|Healthchecks and restarts',0],
  ['System design','Advanced','10 h','Docker and containers','System design|Scalability|Trade-offs','Your largest single readiness gain. Load balancing, replication, partitioning, and how to talk through a design in 45 minutes without freezing.','DDIA ch.5–7|System design primer|6 mock design prompts','Read DDIA ch.5–7|Design a shortener end to end|Design a news feed|Two timed mocks',0],
  ['CI/CD pipelines','Beginner','4 h','Docker and containers','CI/CD|Actions|Testing','A pipeline that runs tests, builds an image and deploys. The cheapest gap on your list to close.','GitHub Actions essentials|Pipeline patterns','Test job on every PR|Build and push an image|Deploy on tag',0],
  ['Kubernetes basics','Advanced','7 h','CI/CD pipelines','Kubernetes|Deployments|Probes','Pods, deployments, services and configmaps, then your own service running on a local cluster.','Kubernetes up and running|kubectl basics|Deploy to kind','Cluster on kind|Deployment + service manifests|ConfigMaps and secrets|Rolling update and rollback',0],
  ['Interview practice','Intermediate','8 h','System design','DSA|Behavioural|Design','Timed practice across coding, design and story-telling, using the projects you built in weeks 6–10.','Blind 75|STAR story worksheet|4 mock interviews','40 DSA problems|Write 6 STAR stories|Two coding mocks|Two design mocks',0],
  ['Applications','Beginner','5 h','Interview practice','Resume|Portfolio|Outreach','Final resume pass with the new projects, a portfolio page, and a first batch of 20 targeted applications.','Resume final pass|Outreach templates','Rebuild resume with new projects|Publish portfolio page|20 targeted applications|10 referral messages',0]],
 lib:[
  ['Kubernetes for developers','KodeKloud','course','Kubernetes','Beginner',420,'not','Covers the gap that blocks three of your saved postings. Browser labs, no cluster setup.',1],
  ['System design interview, part 1','ByteByteGo','course','System design','Intermediate',600,'progress','The largest readiness gain available to you. You are 42% through.',1],
  ['Redis caching patterns','Redis University','video','Redis','Intermediate',42,'progress','Finishes week 5 and unlocks the rate-limiter project.',1],
  ['Designing Data-Intensive Applications, ch.5–7',"O'Reilly",'article','System design','Advanced',180,'not','Replication and partitioning come up in every mid-level design round.',1],
  ['Indexing strategies in PostgreSQL','PGExercises','course','PostgreSQL','Intermediate',55,'done','Finished 17 September. Your tuning level moved from 48 to 62.',1],
  ['GitHub Actions essentials','GitHub Docs','docs','CI/CD','Beginner',90,'not','Four hours for roughly +4 readiness. Cheapest win on the list.',1],
  ['Docker multi-stage builds','Docker Docs','docs','Docker','Intermediate',35,'not','Addresses the "local only" flag on your Docker skill.',1],
  ['Blind 75 problem set','LeetCode','practice','Python','Intermediate',900,'progress','31 of 75 solved. Three a week beats a weekend binge.',0],
  ['Your notes — caching trade-offs','You','notes','Redis','Intermediate',15,'done','Written 15 September while working through cache-aside versus write-through.',0],
  ['Container networking explained','Julia Evans','article','Docker','Intermediate',30,'not','Clears up the bridge-versus-host confusion from your last mock.',0],
  ['Postgres EXPLAIN walkthrough','Depesz','video','PostgreSQL','Advanced',62,'not','Reading query plans out loud is a mid-level interview staple.',0],
  ['Deploy a service to Kubernetes','SkillGap','project','Kubernetes','Advanced',420,'not','Turns a critical gap into something you can demo.',0]],
 projects:[
  ['Distributed URL shortener','Intermediate','12–16 h',30,'Base62 encoding, a Redis read cache, and a load test that proves the cache earns its place.','Python|PostgreSQL','Redis|Caching|Load testing','Python|FastAPI|Redis|k6'],
  ['Distributed rate limiter','Advanced','8–10 h',0,'Token bucket across instances using Redis and a Lua script for atomicity. Covers the distributed-systems evidence your job match flagged.','Redis|Python','Distributed systems|Lua|Concurrency','Python|Redis|Lua|Docker'],
  ['Service on Kubernetes','Advanced','10–14 h',0,'Take an existing service to a local cluster with deployments, configmaps and a clean rolling update.','Docker','Kubernetes|Manifests|Rollouts','Kubernetes|kind|Helm'],
  ['Order event pipeline','Advanced','14–18 h',0,'Order state transitions as events with a replayable log and an idempotent consumer.','Python|PostgreSQL','Kafka|Event design|Idempotency','Python|Kafka|Postgres'],
  ['CI pipeline for a monorepo','Beginner','4–6 h',0,'Test, build and publish three services from one repo, with path filters so only what changed runs.','Git|Docker','CI/CD|Actions|Build caching','Actions|Docker|Make'],
  ['Realtime order dashboard','Intermediate','9 h',100,'Finished 11 September. Streams order state to 200 concurrent clients with a replayable event log.','Python|JavaScript','WebSockets|FastAPI','FastAPI|React']],
 jd:{co:'Swiggy',title:'Backend Engineer (SDE-2)',loc:'Bengaluru · Hybrid',exp:'3+ years',
  text:`Backend Engineer (SDE-2) — Swiggy, Bengaluru (Hybrid)

About the role
Own services in our order fulfilment platform, which handles peak traffic of 1.2M orders a day. You will design APIs, own data models, and take services from design through to production operation.

Responsibilities
- Design, build and operate backend services in Python or Go
- Own relational data models and query performance in PostgreSQL
- Build event-driven flows with Kafka for order state transitions
- Instrument services and join the on-call rotation
- Partner with product and mobile teams on API contracts
- Review code and mentor junior engineers

Requirements
- 3+ years building production backend services
- Strong Python; Django or FastAPI experience
- Solid understanding of distributed systems and system design
- Hands-on with PostgreSQL, Redis and caching strategies
- Docker and Kubernetes in production
- CI/CD pipelines and infrastructure as code

Nice to have
- Go, gRPC, Elasticsearch
- AWS or GCP at scale
- Observability tooling (Prometheus, Grafana)`,
  req:[['Python',1],['Django',1],['FastAPI',1],['PostgreSQL',1],['Redis',1],['REST API design',1],['Caching',1],['Distributed systems',0],['System design',0],['Docker',0],['Kubernetes',0]],
  pref:[['AWS',1],['Linux',1],['Go',0],['gRPC',0],['Elasticsearch',0],['Prometheus',0],['Grafana',0],['GCP',0]],
  tools:['Python','Go','Django','FastAPI','PostgreSQL','Redis','Kafka','Docker','Kubernetes','Terraform','AWS','Prometheus'],
  resp:[['Design and operate backend services',92],['Own data models and query performance',80],['Event-driven flows with Kafka',58],['Instrumentation and on-call',47],['API contracts with product and mobile',40],['Code review and mentoring',24]],
  reqs:[['y','3+ years production backend','You have 2 years 3 months'],['g','CS degree or equivalent','B.Tech CS, 2023'],['r','Production Kubernetes','No evidence in your profile']],
  kwGrid:[['Kubernetes',5,'missing'],['system design',4,'missing'],['PostgreSQL',4,'present'],['Python',4,'present'],['Kafka',3,'missing'],['caching',3,'partial'],['Docker',2,'partial'],['CI/CD',2,'missing']]},
 kw:[['Kubernetes','82%','Skills, then a project bullet once week 10 lands','+9','r'],
  ['system design','91%','Summary line plus one design-focused bullet','+7','r'],
  ['caching','76%','Rewrite the shortener bullet — you already built this','+6','y'],
  ['Kafka','44%','Skills, after the event pipeline project','+5','r'],
  ['CI/CD','68%','Skills and the pipeline project in week 9','+4','r'],
  ['distributed systems','71%','Summary, backed by the rate limiter','+4','r'],
  ['containerisation','58%','Rephrase your Docker line to name it','+3','y'],
  ['observability','39%','Only once you have a dashboard to point at','+2','r']],
 kwGroups:[['Languages',95],['Frameworks',90],['Data',72],['Infrastructure',26],['Practices',58]],
 match:{pct:71,verdict:'Interview-worthy, not yet a clean fit',
  note:'You clear the language, framework and database bar. The shortfall is infrastructure and distributed-systems evidence — three of the four must-haves you are missing sit in that one area.',
  cats:[['Languages',95],['Frameworks',90],['Data',78],['Infrastructure',25],['Experience',67]],
  matching:['Python','Django','FastAPI','PostgreSQL','Redis','REST APIs','SQL','Git','Linux','Testing','Task queues','AWS basics','CS degree'],
  partial:[['Docker','They want production containers; you have dev compose files.',45],['Caching','Week 5 covers exactly the patterns they name.',60],['Experience length','2.3 of 3 years. Lead with scope, not tenure.',77],['AWS','EC2 and S3 only. No IAM, VPC or managed services.',40]],
  missing:[['Kubernetes','−9','Required · week 10 of your plan'],['System design','−7','Required · week 8'],['Kafka','−5','Required · not yet scheduled'],['CI/CD','−3','Required · week 9'],['Go','−2','Preferred · not on your plan']],
  fixes:[['+6%','Name caching in the shortener bullet','You built a Redis read cache. The posting says caching three times; your resume never uses the word.'],
   ['+4%','Add a technical summary naming Python, PostgreSQL, Redis, AWS','Puts four required terms in the first forty words anyone reads.'],
   ['+3%','Describe the Docker setup you actually have','Local compose across six services is worth stating. Claiming production Kubernetes is not.'],
   ['+2%','Move certifications above projects','AWS Cloud Practitioner is your only cloud signal. Do not bury it.']]},
 an:{score:76,ats:82,cover:64,head:'Strong foundation, thin on infrastructure',
  sub:'Clean structure and quantified impact. The gaps are keyword coverage for cloud tooling and two bullets that describe duties rather than outcomes.',
  weak:[['Experience · Zentrix Labs','Responsible for maintaining backend services and fixing bugs.','Maintained nine Django services, cutting recurring 500-level errors by 63% over two quarters.'],
   ['Experience · Foldr','Worked with the team on the billing module.','Automated the weekly billing export with Celery, replacing a three-hour manual process run by two people.'],
   ['Projects · Shortener','Made a URL shortener using Python and Redis.','Built a Base62 shortener sustaining 10k req/min in load tests with a 99.2% cache hit rate.']],
  missing:[['r','Certifications','You hold two. Neither is on the page'],['y','Technical summary','The first thing a reviewer reads'],['y','Links to live projects','GitHub is listed; deployments are not']],
  fmt:[['y','Two-column skills block','One parser read it out of order'],['y','Dates in three formats','Use "Mon YYYY" throughout'],['g','Fonts embed correctly','No substitution risk']],
  found:['Python','Django','FastAPI','PostgreSQL','Redis','REST APIs','Git','Docker','Task queues','Linux','SQL','Testing'],
  absent:['Kubernetes','Terraform','CI/CD','System design','gRPC','Kafka'],
  recs:[['+7','Add a three-line technical summary','Lead with Python, Django, PostgreSQL, AWS'],['+5','Flatten the skills block to one column','Removes the parse-order risk'],['+4','Quantify the two flagged bullets','Rewrites are ready above'],['+3','List both certifications','AWS Cloud Practitioner reads as cloud exposure']]},
 resume:{title:'Backend Engineer',skillsA:'Python, Django, FastAPI, JavaScript, SQL',skillsB:'PostgreSQL, Redis, Docker, AWS (EC2, S3), Git, Linux',
  job1:'Junior Backend Developer',co1:'Zentrix Labs',d1:'Jul 2023 – Present',l1:'Bengaluru',
  b1:'Built and shipped 14 REST endpoints in Django for the shipment tracking service used by 40k daily orders.\nCut p95 response time from 820 ms to 240 ms by adding indexes and removing N+1 lookups.\nWrote the integration test suite that raised backend coverage from 41% to 78%.',
  job2:'Backend Intern',co2:'Foldr Technologies',d2:'Jan 2023 – Jun 2023',l2:'Remote',
  b2:'Automated the weekly billing export with a scheduled job, replacing a three-hour manual process.\nAdded structured logging across six services, halving mean incident triage time.',
  p1:'Distributed URL shortener — Python, Redis, Postgres',p1d:'Base62 shortener with a Redis read cache and a 10k req/min load test; 99.2% cache hit rate.',
  p2:'Realtime order dashboard — FastAPI, WebSockets',p2d:'Streams order state changes to 200 concurrent clients with a replayable event log.',
  certs:'AWS Certified Cloud Practitioner (2024)\nMeta Backend Developer Certificate (2023)',
  ach:'Winner, PESU Hack 2022 — logistics routing track (240 teams)\nTop 4% on LeetCode weekly contests, 610 problems solved',
  degree:'B.Tech, Computer Science',school:'PES University, Bengaluru',eduYears:'2019 – 2023',grade:'CGPA 8.4 / 10'},
 activity:[['g','Finished "Indexing strategies in PostgreSQL"','2 hours ago · 55 min'],
  ['b','Resume v3 analysed — ATS 82','Yesterday · up 11 points'],
  ['y','Started "Distributed URL shortener"','2 days ago · 30% done'],
  ['b','Matched against Swiggy Backend SDE-2','3 days ago · 71% match'],
  ['g','Cleared the concurrency quiz','4 days ago · 9 of 10']],
 today:'Finish "Redis caching patterns"',todaySub:'38 minutes left. It unlocks the rate-limiter project, which covers your largest interview gap.'},

/* ---------------- 2. DATA ANALYST ---------------- */
'analyst':{name:'Data Analyst',track:'Technology',icon:'i-trend',level:'Entry to mid',
 blurb:'SQL, dashboards and the business questions behind them.',
 posts:210,score:57,hrs:7,weeksLeft:8,finish:'14 December',streak:6,hours:52,doneRes:28,totalRes:96,
 persona:{first:'Sneha',last:'Iyer',ini:'SI',edu:'B.Sc Statistics, Fergusson College',cur:'MIS Executive',co:'Kalyani Retail',loc:'Pune',exp:'1 yr 8 mo',
  email:'sneha.iyer@outlook.com',phone:'+91 99236 70418',links:'linkedin.com/in/snehaiyer · github.com/sneha-i',
  summary:'MIS executive who builds the weekly sales reporting pack for a 60-store retail chain. Comfortable in Excel and Power BI, moving towards SQL-first analysis and proper experiment design.'},
 skills:[['Excel / Sheets',82,80],['Data cleaning',66,80],['Presentation',60,70],['Business acumen',50,75],['Statistics',55,75],
  ['Power BI',62,85],['SQL',58,88],['Dashboard design',48,75],['Storytelling with data',44,80],['Python (pandas)',40,75],
  ['Tableau',30,60],['A/B testing',25,65],['ETL basics',30,60],['Git',20,45]],
 roadmap:[
  ['SQL from joins to windows','Beginner','8 h','None','SQL|Joins|Aggregation','Every analyst job description opens with SQL. Get past SELECT * into joins, grouping, CTEs and window functions.','SQLBolt|Mode SQL tutorial|80 practice queries','Finish SQLBolt|Joins and subqueries set|CTE exercises|20 window-function queries',4],
  ['Cleaning messy data','Beginner','5 h','SQL from joins to windows','Data cleaning|Excel|Validation','Duplicate customers, three date formats, negative quantities. The unglamorous work that decides whether the analysis is right.','Data cleaning checklist|Power Query basics|Messy dataset exercise','Dedupe a customer table|Standardise date columns|Build a validation sheet|Document your rules',4],
  ['Power BI that people use','Intermediate','7 h','Cleaning messy data','Power BI|DAX|Modelling','A star schema, real DAX measures, and a dashboard that answers a question rather than showing everything at once.','Power BI in a day|DAX fundamentals|Dashboard critique gallery','Model a star schema|Write 10 DAX measures|Rebuild your sales pack|Get it critiqued',3],
  ['Statistics you will actually use','Intermediate','6 h','None','Statistics|Distributions|Significance','Distributions, sampling, confidence intervals and significance — enough to avoid confidently reporting noise.','StatQuest playlist|Practical statistics for analysts|Exercise set','Watch the distributions set|Confidence interval drills|Read ch.2–3|Apply to last quarter sales',2],
  ['Python for analysis','Intermediate','8 h','Cleaning messy data','Python|pandas|Notebooks','pandas for the work Excel starts to struggle with: joins across millions of rows, repeatable pipelines, and charts you can regenerate.','pandas in 10 minutes|Kaggle pandas course|Notebook template','pandas basics|Groupby and merge drills|Rewrite one Excel report|Publish the notebook',1],
  ['Telling the story','Intermediate','5 h','Power BI that people use','Storytelling|Visual design|Writing','The analysis is half the job. The other half is a one-page summary a regional manager reads in ninety seconds and acts on.','Storytelling with Data ch.1–4|Chart choice guide|Executive summary template','Read ch.1–4|Rebuild three bad charts|Write a one-page summary|Present it to someone',0],
  ['Experiments and A/B tests','Advanced','7 h','Statistics you will actually use','A/B testing|Sample size|Causality','Designing a test, sizing it, and reading the result honestly. This is what separates a reporting analyst from a decision analyst.','Trustworthy Online Experiments ch.1–3|Sample size calculator walkthrough|Case studies','Read ch.1–3|Size three hypothetical tests|Analyse a public dataset|Write the readout',0],
  ['Portfolio and interviews','Intermediate','6 h','Telling the story','Case study|SQL interview|Communication','Three case studies on a portfolio page, plus timed SQL and case practice, which is how analyst interviews are actually run.','SQL interview question bank|Case interview framework|Portfolio examples','Publish three case studies|40 SQL interview questions|Two case mocks|Rewrite your resume',0]],
 lib:[
  ['SQL window functions','Mode Analytics','docs','SQL','Intermediate',90,'progress','Window functions appear in 7 of 10 analyst SQL rounds. You are midway through.',1],
  ['Power BI: data modelling and DAX','Microsoft Learn','course','Power BI','Intermediate',300,'not','Your Power BI is report-level. Modelling is what the job descriptions mean.',1],
  ['Storytelling with Data, ch.1–4','Cole Knaflic','article','Storytelling with data','Beginner',150,'not','Your biggest non-technical gap, and the cheapest to close.',1],
  ['StatQuest: distributions and significance','StatQuest','video','Statistics','Beginner',110,'progress','Short, plain-spoken videos. Good before the experiments week.',1],
  ['80 SQL practice queries','DataLemur','practice','SQL','Intermediate',480,'not','Interview-shaped questions rather than textbook ones.',1],
  ['pandas in 10 minutes','pandas docs','docs','Python (pandas)','Beginner',35,'not','Start here before the Kaggle course; it frames the rest.',1],
  ['Cleaning a messy retail dataset','SkillGap','project','Data cleaning','Beginner',120,'done','Finished in August. Good material for a portfolio case study.',0],
  ['Chart choice cheat sheet','Financial Times','notes','Dashboard design','Beginner',15,'not','Pin it. Stops the default bar-chart-for-everything habit.',0],
  ['Trustworthy Online Experiments, ch.1–3','Kohavi','article','A/B testing','Advanced',180,'not','The reference text. Read it before claiming A/B testing on a resume.',0],
  ['Excel to Python: rewriting a report','Real Python','video','Python (pandas)','Intermediate',48,'not','Mirrors exactly what you would do with the weekly sales pack.',0],
  ['Tableau fundamentals','Tableau','course','Tableau','Beginner',240,'not','Only worth it if you target firms that standardised on Tableau.',0],
  ['Your notes — star schema attempt','You','notes','Power BI','Intermediate',12,'done','Written while modelling the sales pack. Revisit before the DAX work.',0]],
 projects:[
  ['Retail sales dashboard, rebuilt','Intermediate','10–12 h',45,'Take your weekly sales pack from a flat Excel dump to a modelled Power BI report with three questions it answers well.','Excel / Sheets|Power BI','Data modelling|DAX|Dashboard design','Power BI|SQL|Excel'],
  ['Cohort and retention analysis','Intermediate','8 h',0,'Monthly cohorts from a transactions table, retention curves, and a written view on which acquisition month actually paid back.','SQL','Cohort analysis|Window functions|Storytelling','SQL|Python|Sheets'],
  ['Pricing experiment readout','Advanced','10 h',0,'Design and analyse a hypothetical price test on a public dataset: hypothesis, sample size, result, and what you would not conclude.','Statistics','A/B testing|Sample sizing|Causality','Python|SQL'],
  ['Automated weekly report','Beginner','5–6 h',0,'Replace a manual Monday-morning report with a scheduled notebook that emails a two-page PDF.','Python (pandas)','Automation|pandas|Reporting','Python|pandas|Sheets'],
  ['Store performance deep dive','Beginner','6 h',100,'Finished in July. Ranked 60 stores on four metrics and found the two where footfall and conversion disagreed.','Excel / Sheets','Segmentation|Presentation','Excel|Power BI'],
  ['Public dataset case study','Intermediate','7 h',0,'One clean end-to-end case on an open dataset, written up the way a hiring manager wants to read it.','SQL|Python (pandas)','Case framing|Writing|Charts','SQL|Python']],
 jd:{co:'Zomato',title:'Data Analyst — Growth',loc:'Gurugram · Hybrid',exp:'2+ years',
  text:`Data Analyst — Growth, Zomato (Gurugram, Hybrid)

About the role
Sit with the growth team and answer the questions behind acquisition, retention and promo spend. You will own the metrics for two funnels end to end.

Responsibilities
- Write SQL against a large event warehouse to answer business questions
- Own dashboards for the acquisition and retention funnels
- Design and read out A/B tests with the product managers
- Build weekly readouts leadership actually uses
- Partner with data engineering on event instrumentation

Requirements
- 2+ years in an analytics role
- Advanced SQL including window functions and CTEs
- Strong Excel and one BI tool (Power BI, Tableau or Looker)
- Working knowledge of statistics and experiment design
- Ability to explain findings to non-technical stakeholders
- Python or R for analysis
Nice to have
- dbt, Airflow or similar
- Experience in consumer internet or marketplaces
- Exposure to Amplitude or Mixpanel`,
  req:[['SQL',1],['Excel',1],['Power BI',1],['Data cleaning',1],['Stakeholder communication',1],['Statistics',0],['A/B testing',0],['Python',0],['Window functions',0]],
  pref:[['Dashboard design',1],['dbt',0],['Airflow',0],['Amplitude',0],['Marketplace experience',0]],
  tools:['SQL','Power BI','Tableau','Looker','Excel','Python','dbt','Airflow','Amplitude','BigQuery'],
  resp:[['Answer business questions in SQL',90],['Own funnel dashboards',78],['Design and read out A/B tests',66],['Weekly leadership readouts',52],['Event instrumentation with engineering',34],['Ad-hoc deep dives',30]],
  reqs:[['y','2+ years in analytics','You have 1 year 8 months in MIS, which counts'],['g','Statistics background','B.Sc Statistics'],['r','Experiment design experience','Nothing on your profile yet']],
  kwGrid:[['SQL',6,'partial'],['A/B test',4,'missing'],['dashboards',4,'present'],['Python',3,'missing'],['window functions',3,'missing'],['stakeholders',3,'partial'],['Excel',2,'present'],['retention',2,'missing']]},
 kw:[['window functions','74%','SQL line in skills, plus the cohort project','+8','r'],
  ['A/B testing','61%','Only after the experiment readout project','+7','r'],
  ['Python / pandas','68%','Skills, then the automated report bullet','+6','r'],
  ['cohort analysis','44%','Projects section','+5','r'],
  ['stakeholder communication','71%','Rewrite your MIS bullet to name who used the report','+4','y'],
  ['data modelling','52%','Once the Power BI rebuild is done','+4','r'],
  ['funnel','39%','Only if you analyse one','+2','r'],
  ['dashboard','82%','Already there — make the audience explicit','+1','g']],
 kwGroups:[['SQL & querying',58],['BI tools',72],['Statistics',45],['Programming',30],['Communication',66]],
 match:{pct:59,verdict:'Close on tooling, short on evidence',
  note:'Your reporting work maps well to the dashboard half of this role. What is missing is anything that shows you have answered an open question rather than produced a recurring report.',
  cats:[['SQL',62],['BI tools',78],['Statistics',58],['Programming',34],['Communication',70]],
  matching:['Excel','Power BI','Data cleaning','Reporting','Statistics degree','Stakeholder updates','Business context','Presentation'],
  partial:[['SQL','You write joins daily but no window functions or CTEs.',58],['Dashboard ownership','You build reports; they want owned metrics.',55],['Statistics','Strong on paper, unused since college.',60],['Python','Read it, never shipped with it.',35]],
  missing:[['A/B testing','−8','Required · week 7 of your plan'],['Window functions','−6','Required · week 1'],['Python for analysis','−6','Required · week 5'],['Cohort / retention analysis','−4','Implied by the funnel work'],['dbt','−2','Preferred · not scheduled']],
  fixes:[['+7%','Say what changed because of your report','"Weekly sales pack" means nothing. "Flagged two underperforming stores; both were re-merchandised" does.'],
   ['+5%','Name the SQL you actually write','Joins, aggregation and subqueries across a 2M-row table is a real claim.'],
   ['+4%','Add the cleaning project as a case study','It is your only end-to-end piece right now.'],
   ['+3%','List Power BI modelling, not just Power BI','Distinguishes you from people who only drag fields.']]},
 an:{score:64,ats:78,cover:51,head:'Reads as a reporting role, not an analyst one',
  sub:'Every bullet describes something you produce on a schedule. None describes a question you answered or a decision that followed.',
  weak:[['Experience · Kalyani Retail','Responsible for preparing weekly MIS reports for management.','Built the weekly sales pack covering 60 stores; flagged two underperforming locations that were re-merchandised the next quarter.'],
   ['Experience · Kalyani Retail','Worked on data in Excel and Power BI.','Cleaned and consolidated 2M rows of POS data monthly, cutting report preparation from six hours to ninety minutes.'],
   ['Projects · Store analysis','Did an analysis of store performance.','Ranked 60 stores across four metrics and identified two where footfall and conversion moved in opposite directions.']],
  missing:[['r','Projects section','You have finished work that is not on the page'],['r','Technical skills block','SQL and Power BI are buried in prose'],['y','Summary line','Nothing tells the reader you are moving MIS to analytics']],
  fmt:[['y','Tables used for layout','Two parsers merged your columns'],['g','One page, clean headings','No parsing problems'],['y','Skills written as sentences','List them instead']],
  found:['Excel','Power BI','MIS reporting','Data cleaning','Presentation','Statistics'],
  absent:['SQL','Python','A/B testing','Window functions','Cohort analysis','Dashboards (owned)'],
  recs:[['+9','Add a skills block with SQL and Power BI named','Right now a keyword filter never sees them'],['+6','Add the two finished projects','Evidence beats claims'],['+5','Rewrite three bullets around outcomes','Rewrites are ready above'],['+3','Drop the tables, use plain headings','Fixes the parsing issue']]},
 resume:{title:'Data Analyst',skillsA:'SQL, Excel, Power BI, Python (learning), Statistics',skillsB:'Data cleaning, Dashboard design, Reporting, Stakeholder communication',
  job1:'MIS Executive',co1:'Kalyani Retail',d1:'Feb 2025 – Present',l1:'Pune',
  b1:'Build the weekly sales pack covering 60 stores, read by the regional and category heads.\nConsolidate and clean 2M rows of POS data each month, cutting preparation time from six hours to ninety minutes.\nFlagged two underperforming stores that were re-merchandised the following quarter.',
  job2:'Reporting Intern',co2:'Kalyani Retail',d2:'Aug 2024 – Jan 2025',l2:'Pune',
  b2:'Automated three recurring Excel reports with Power Query, removing a daily manual refresh.\nBuilt the first stock-out tracker used by the supply team.',
  p1:'Store performance deep dive — Excel, Power BI',p1d:'Ranked 60 stores on four metrics and surfaced two where footfall and conversion disagreed.',
  p2:'Retail data cleaning pipeline — Power Query',p2d:'Deduplicated a customer table of 180k rows and standardised three date formats into one.',
  certs:'Microsoft Power BI Data Analyst (PL-300), in progress\nGoogle Data Analytics Certificate (2024)',
  ach:'Topper, B.Sc Statistics batch of 2024 (Fergusson College)\nBuilt the college fest ticketing dashboard used by 40 volunteers',
  degree:'B.Sc, Statistics',school:'Fergusson College, Pune',eduYears:'2021 – 2024',grade:'First class, 78%'},
 activity:[['g','Finished the joins and subqueries set','Yesterday · 45 min'],
  ['y','Started "Power BI: data modelling and DAX"','2 days ago'],
  ['b','Resume analysed — ATS 78','4 days ago'],
  ['g','Completed the retail cleaning project','Last week'],
  ['b','Matched against Zomato Data Analyst','Last week · 59% match']],
 today:'Finish 20 window-function queries',todaySub:'Eleven left. Window functions show up in seven of ten analyst SQL rounds.'},

/* ---------------- 3. PRODUCT MANAGER ---------------- */
'pm':{name:'Product Manager',track:'Business & management',icon:'i-target',level:'Associate to mid',
 blurb:'For MBAs and analysts moving into product: discovery, prioritisation and shipping.',
 posts:140,score:61,hrs:6,weeksLeft:8,finish:'18 December',streak:9,hours:64,doneRes:33,totalRes:104,
 persona:{first:'Rhea',last:'Kapoor',ini:'RK',edu:'MBA Marketing, SIBM Pune · B.Com, Christ University',cur:'Business Analyst',co:'Finlyte',loc:'Mumbai',exp:'2 yrs 6 mo',
  email:'rhea.kapoor@gmail.com',phone:'+91 98201 33472',links:'linkedin.com/in/rheakapoor · rheawrites.substack.com',
  summary:'Business analyst on a lending product, sitting between operations and engineering. Writes the requirements, runs the UAT, and wants the decision rights that come with owning the roadmap.'},
 skills:[['Stakeholder management',70,85],['Agile ways of working',65,80],['Writing specs',60,85],['Go-to-market',55,75],['Prioritisation frameworks',55,80],
  ['Roadmapping',50,80],['Metrics and north stars',45,80],['User research',45,80],['Wireframing',40,65],['Technical literacy',40,70],
  ['Product analytics',35,75],['Pricing',35,65],['A/B testing',30,70],['SQL',30,70]],
 roadmap:[
  ['What a PM actually owns','Beginner','4 h','None','Product sense|Role clarity|Scope','Before frameworks: the difference between a BA writing requirements and a PM owning an outcome. Most of your gap is decision rights, not knowledge.','Inspired ch.1–5|PM role breakdowns|Three job description teardowns','Read Inspired ch.1–5|Teardown three PM job posts|Write your own role gap note|Talk to two working PMs',4],
  ['Talking to users','Intermediate','7 h','What a PM actually owns','User research|Interviews|Synthesis','Running an interview without leading the witness, and turning six conversations into something a team can act on.','The Mom Test|Interview script template|Synthesis workshop','Read The Mom Test|Write an interview guide|Run five real interviews|Synthesise into three insights',3],
  ['Metrics that mean something','Intermediate','6 h','What a PM actually owns','Metrics|North star|Funnels','Picking a north star, building the tree underneath it, and noticing when a metric is being gamed.','Amplitude north star playbook|Metric trees guide|Case examples','Read the playbook|Draw a metric tree for your product|Critique two vanity metrics|Define an input metric set',2],
  ['SQL for product managers','Beginner','6 h','Metrics that mean something','SQL|Analysis|Self-service','Enough SQL to answer your own questions instead of queuing behind the data team. This is the single most-cited gap for BAs moving into product.','Mode SQL for PMs|50 practice queries|Funnel query walkthrough','SQL basics|Joins and grouping|Write a funnel query|Answer three of your own questions',1],
  ['Prioritisation and roadmaps','Intermediate','6 h','Talking to users','Prioritisation|Roadmapping|Trade-offs','RICE, opportunity scoring, and the harder skill underneath them: saying no to a senior stakeholder with a reason they accept.','Prioritisation frameworks compared|Roadmap formats|Saying no, well','Score your backlog with RICE|Build a now/next/later roadmap|Write a "not doing this" note|Review with a mentor',0],
  ['Writing a PRD people read','Intermediate','5 h','Prioritisation and roadmaps','Specs|Writing|Alignment','Problem, evidence, scope, non-goals, success measures. Short enough that engineers read it, complete enough that they do not need you in the room.','PRD templates from three companies|Writing for engineers|Example teardowns','Read three real PRDs|Write one for a feature you know|Get engineering feedback|Rewrite it half as long',0],
  ['Experiments and launches','Advanced','7 h','Metrics that mean something','A/B testing|GTM|Launch','Designing a test, reading the result honestly, then the unglamorous launch checklist that decides whether anyone notices the feature.','Trustworthy experiments ch.1–3|Launch checklist|Two launch post-mortems','Read ch.1–3|Design a test for your product|Write a launch plan|Read two post-mortems',0],
  ['Product interviews','Advanced','8 h','Writing a PRD people read','Case practice|Product sense|Estimation','Product sense, analytical and execution rounds, practised out loud and timed, because the format is what catches most MBA candidates.','Decode and Conquer|Case question bank|Four mock interviews','20 product sense questions|10 estimation questions|Two case mocks|Write three STAR stories',0]],
 lib:[
  ['Inspired, ch.1–5','Marty Cagan','article','Product sense','Beginner',180,'progress','The clearest statement of what the job is. You are three chapters in.',1],
  ['The Mom Test','Rob Fitzpatrick','article','User research','Beginner',150,'not','Short, blunt, and fixes the leading-question habit before your first real interview.',1],
  ['SQL for product managers','Mode','course','SQL','Beginner',300,'not','Your most-cited gap. Six hours buys you self-service analysis.',1],
  ['North star metric playbook','Amplitude','docs','Metrics and north stars','Intermediate',60,'not','Read before you draw a metric tree for your own product.',1],
  ['Prioritisation frameworks compared','Reforge','article','Prioritisation frameworks','Intermediate',45,'not','RICE is not the answer to everything; this says when it is.',1],
  ['Decode and Conquer','Lewis Lin','course','Case practice','Advanced',420,'not','Interview format drill. Start it in week 8, not before.',1],
  ['Writing PRDs engineers read','Lenny Rachitsky','article','Writing specs','Intermediate',35,'not','Three real templates with commentary on what each leaves out.',0],
  ['Product analytics with Amplitude','Amplitude','course','Product analytics','Beginner',180,'not','Hands-on with a sandbox dataset; no access to your own tool needed.',0],
  ['Figma for non-designers','Figma','video','Wireframing','Beginner',75,'not','Enough to sketch a flow. You are not expected to design.',0],
  ['Your notes — Finlyte onboarding funnel','You','notes','Metrics and north stars','Intermediate',20,'done','Your own drop-off analysis. Good raw material for a case study.',0],
  ['How engineers think about estimates','Will Larson','article','Technical literacy','Intermediate',30,'not','Closes some of the credibility gap in engineering conversations.',0],
  ['Run a discovery sprint','SkillGap','project','User research','Intermediate',360,'not','Five interviews and a synthesis, on a product you already know.',0]],
 projects:[
  ['Discovery sprint on your own product','Intermediate','8–10 h',20,'Five user interviews on the lending onboarding flow, synthesised into three insights and one prioritised bet.','Stakeholder management','User research|Synthesis|Insight writing','Interviews|Notion|Figma'],
  ['Teardown and roadmap for an app you use','Beginner','6 h',0,'Pick a product, work out its strategy from the outside, then write the six-month roadmap you would argue for.','Product sense','Roadmapping|Strategy|Writing','Notion|Figma'],
  ['Onboarding funnel analysis','Intermediate','8 h',0,'Pull the funnel yourself in SQL, find the biggest drop, and write the one-page case for fixing it.','SQL','Product analytics|Funnels|Business case','SQL|Sheets|Amplitude'],
  ['PRD for a real feature','Beginner','5 h',0,'Write the spec for something your engineering team is about to build, and have them mark it up.','Writing specs','Specs|Scoping|Non-goals','Notion|Confluence'],
  ['Pricing study for a B2B tool','Advanced','9 h',0,'Van Westendorp survey, willingness-to-pay analysis, and a packaging recommendation with the risks named.','Pricing','Pricing|Research|Packaging','Sheets|Typeform'],
  ['Launch plan and post-mortem','Intermediate','6 h',100,'Finished in June for the UPI autopay release. Checklist, comms plan, and an honest three-week readout.','Go-to-market','GTM|Launch|Post-mortem','Notion|Sheets']],
 jd:{co:'Groww',title:'Associate Product Manager',loc:'Bengaluru · On-site',exp:'2–4 years',
  text:`Associate Product Manager — Groww (Bengaluru, On-site)

About the role
Own one surface of the investing app end to end, from problem definition to launch and the metrics afterwards. You will work with two engineering pods, a designer and an analyst.

Responsibilities
- Define problems from user research, support tickets and data
- Own and communicate a quarterly roadmap for your surface
- Write clear specs and work daily with engineering and design
- Define success metrics and run experiments to validate changes
- Drive launches with marketing, support and compliance
- Report outcomes to leadership every month

Requirements
- 2–4 years in product, consulting, analytics or a founding role
- Evidence of shipping something and measuring the result
- Comfortable writing SQL or equivalent self-service analysis
- Strong written communication
- Structured thinking under ambiguity
- Understanding of experiment design

Nice to have
- Fintech or regulated-industry exposure
- Familiarity with Amplitude or Mixpanel
- MBA or equivalent analytical training`,
  req:[['Stakeholder management',1],['Writing specs',1],['Agile ways of working',1],['Structured thinking',1],['Roadmapping',0],['SQL',0],['Experiment design',0],['User research',0],['Shipping evidence',0]],
  pref:[['Fintech exposure',1],['MBA',1],['Amplitude',0],['Mixpanel',0],['Design literacy',0]],
  tools:['Jira','Confluence','Figma','Amplitude','Mixpanel','SQL','Notion','Looker'],
  resp:[['Define problems from research and data',88],['Own a quarterly roadmap',76],['Write specs and work with engineering',72],['Define metrics and run experiments',64],['Drive launches across functions',48],['Report outcomes to leadership',35]],
  reqs:[['g','2–4 years analytical role','2 years 6 months as a BA on a lending product'],['g','MBA or analytical training','MBA Marketing, SIBM Pune'],['r','Evidence of shipping and measuring','Your resume stops at "supported the release"']],
  kwGrid:[['roadmap',5,'missing'],['experiment',4,'missing'],['SQL',4,'missing'],['stakeholders',4,'present'],['metrics',3,'partial'],['user research',3,'missing'],['launch',3,'partial'],['specs',2,'present']]},
 kw:[['roadmap ownership','84%','Summary plus the teardown project','+8','r'],
  ['experiment design','66%','Only after you have designed one','+7','r'],
  ['SQL','71%','Skills, once week 4 is done','+7','r'],
  ['user research','69%','Discovery sprint project','+6','r'],
  ['north star metric','48%','Metrics work in week 3','+4','r'],
  ['cross-functional','77%','Rewrite your UAT bullet — you already do this','+4','y'],
  ['go-to-market','52%','You ran the autopay launch. Say so.','+3','y'],
  ['customer obsession','41%','Only with an example attached','+1','r']],
 kwGroups:[['Discovery',44],['Delivery',72],['Analytics',32],['Strategy',55],['Communication',78]],
 match:{pct:63,verdict:'The experience is there; the framing is not',
  note:'You do most of this job already, under a different title and without the decision rights. The gap that shows on paper is analytical self-service and any evidence that you measured what you shipped.',
  cats:[['Discovery',48],['Delivery',78],['Analytics',35],['Strategy',58],['Communication',82]],
  matching:['Stakeholder management','Requirements writing','Agile ceremonies','UAT','Cross-functional work','Written communication','Fintech domain','MBA'],
  partial:[['Roadmap input','You feed the roadmap; you do not own it.',55],['Metrics','You report them; you do not define them.',45],['Launches','You supported one. Lead the next.',60],['Technical literacy','Comfortable in conversation, not in the data.',40]],
  missing:[['SQL','−8','Required · week 4 of your plan'],['Experiment design','−7','Required · week 7'],['User research','−6','Required · week 2'],['Product analytics','−4','Required · week 3'],['Wireframing','−2','Preferred · week 2 stretch']],
  fixes:[['+8%','Say what shipped and what moved','"Supported the autopay release" hides that you ran the launch and it lifted adoption.'],
   ['+5%','Reframe requirements as problem definition','Same work, the vocabulary the role uses.'],
   ['+4%','Add the discovery sprint once it is done','It is the only user-research evidence you will have.'],
   ['+3%','Put the MBA and the domain in the first two lines','Fintech plus analytical training is the reason they will read further.']]},
 an:{score:69,ats:84,cover:57,head:'A business analyst resume applying for a product job',
  sub:'Clean and well written, but every verb is supporting rather than owning. Nothing on the page shows you decided something and then measured it.',
  weak:[['Experience · Finlyte','Responsible for gathering requirements from business stakeholders.','Defined the problem and scope for the autopay flow with operations and risk, then wrote the spec two pods built from.'],
   ['Experience · Finlyte','Supported the UPI autopay release.','Ran the autopay launch across support, compliance and marketing; adoption reached 34% of eligible users in three weeks.'],
   ['Experience · Finlyte','Coordinated with the tech team for UAT.','Owned UAT for six releases, cutting post-release defects from eleven to three per cycle.']],
  missing:[['r','Metrics anywhere','Not one number on the page'],['y','Product projects section','Your teardowns and launch plan are invisible'],['y','Tools block','Jira, Figma and Confluence are never named']],
  fmt:[['g','Single column, clean dates','Parses everywhere'],['y','Three-line paragraphs under each role','Bullets read faster'],['y','MBA listed last','Move education up; it is a selling point here']],
  found:['Stakeholder management','Requirements','UAT','Agile','Documentation','Fintech'],
  absent:['Roadmap','Experiment','SQL','User research','North star metric','Product analytics'],
  recs:[['+8','Put a number in every second bullet','Adoption, defects, cycle time — you have all three'],['+6','Rename requirements work as problem definition','Truthful, and it is the role vocabulary'],['+5','Add a projects block','The teardown and launch plan belong on the page'],['+3','Lead with MBA plus fintech','It is why they will keep reading']]},
 resume:{title:'Product Manager',skillsA:'Product discovery, Roadmapping, Specs, Stakeholder management, Agile',skillsB:'Jira, Confluence, Figma, Excel, SQL (learning), Amplitude (learning)',
  job1:'Business Analyst',co1:'Finlyte',d1:'Apr 2024 – Present',l1:'Mumbai',
  b1:'Defined scope for the UPI autopay flow with operations and risk, and wrote the spec two engineering pods built from.\nRan the autopay launch across support, compliance and marketing; adoption reached 34% of eligible users in three weeks.\nOwned UAT for six releases, cutting post-release defects from eleven to three per cycle.',
  job2:'Operations Associate',co2:'Finlyte',d2:'Jul 2023 – Mar 2024',l2:'Mumbai',
  b2:'Mapped the loan disbursal process end to end and removed two redundant approval steps.\nBuilt the weekly collections tracker used by the regional operations leads.',
  p1:'Discovery sprint — lending onboarding',p1d:'Five user interviews synthesised into three insights and one prioritised bet on document upload.',
  p2:'Product teardown — a savings app',p2d:'Outside-in strategy read and the six-month roadmap I would argue for, with the trade-offs named.',
  certs:'Reforge Product Management Foundations (2025)\nCertified Scrum Product Owner (2024)',
  ach:'MBA placement committee lead, SIBM Pune 2023\nRunner-up, HUL L.I.M.E. case competition, campus round',
  degree:'MBA, Marketing',school:'SIBM Pune · B.Com, Christ University',eduYears:'2021 – 2023',grade:'CGPA 3.4 / 4'},
 activity:[['g','Finished Inspired ch.1–3','Yesterday · 1 h 10 m'],
  ['y','Started the discovery sprint','2 days ago · 1 of 5 interviews'],
  ['b','Matched against Groww APM','3 days ago · 63% match'],
  ['g','Wrote a metric tree for the lending funnel','Last week'],
  ['b','Resume analysed — ATS 84','Last week']],
 today:'Write the interview guide for the discovery sprint',todaySub:'Thirty minutes. Four interviews are booked for Thursday and you cannot wing them.'},

/* ---------------- 4. MARKETING MANAGER ---------------- */
'marketing':{name:'Marketing Manager',track:'Business & management',icon:'i-mega',level:'Mid-level',
 blurb:'Brand, performance, content and the analytics that decide budget.',
 posts:165,score:58,hrs:5,weeksLeft:9,finish:'28 December',streak:7,hours:41,doneRes:22,totalRes:88,
 persona:{first:'Karan',last:'Suri',ini:'KS',edu:'MBA Marketing, NMIMS · BBA, Symbiosis',cur:'Marketing Executive',co:'Brewhouse Co.',loc:'Delhi NCR',exp:'2 yrs 10 mo',
  email:'karan.suri@gmail.com',phone:'+91 98738 20915',links:'linkedin.com/in/karansuri · karansuri.work',
  summary:'Marketing executive for a D2C coffee brand, running social, content and the email calendar. Strong on craft and copy; building the analytics and paid-media side that mid-level roles are actually hired for.'},
 skills:[['Social media',70,70],['Storytelling',68,80],['Copywriting',65,75],['Content strategy',60,80],['Campaign management',58,80],
  ['Brand positioning',55,80],['Market research',50,70],['Marketing analytics',45,85],['Budget management',40,75],['SEO',40,75],
  ['Lifecycle / CRM',38,70],['Performance advertising',35,80],['Martech stack',30,70],['SQL and dashboards',20,55]],
 roadmap:[
  ['Positioning before tactics','Beginner','5 h','None','Positioning|Segmentation|Messaging','Most marketing gaps are positioning gaps wearing a channel costume. Get the category, the alternative and the differentiator written down first.','Obviously Awesome|Positioning canvas|Three brand teardowns','Read Obviously Awesome|Fill the canvas for Brewhouse|Teardown three competitors|Write a one-line positioning statement',3],
  ['The numbers behind marketing','Intermediate','7 h','Positioning before tactics','Analytics|CAC|Attribution','CAC, LTV, payback, contribution margin and blended versus channel attribution. This is the gap that keeps executives from promoting executives.','Marketing metrics primer|CAC and LTV workbook|Attribution explained','Build a CAC model in Sheets|Calculate payback by channel|Read the attribution guide|Rebuild last quarter as a P&L view',2],
  ['GA4 and reporting','Intermediate','6 h','The numbers behind marketing','GA4|Reporting|Dashboards','Events, conversions and a report someone outside marketing can read. GA4 appears in roughly three quarters of the postings you saved.','GA4 fundamentals|Event setup guide|Looker Studio basics','GA4 fundamentals|Set up three conversion events|Build a channel dashboard|Write a monthly readout',1],
  ['Paid media, hands on','Advanced','8 h','GA4 and reporting','Meta Ads|Google Ads|Budgeting','Structure, creative testing, bid strategy and the arithmetic of a budget. Run a real campaign, even a small one, because "managed agency" is not the same claim.','Meta Blueprint essentials|Google Ads search course|Creative testing framework','Blueprint essentials|Build a campaign structure|Run a ₹10k test|Write the results readout',0],
  ['SEO and content that compounds','Intermediate','7 h','Positioning before tactics','SEO|Content strategy|Briefs','Keyword research, search intent, briefs writers can use, and the internal linking work everyone skips.','SEO starter guide|Keyword research walkthrough|Content brief template','Google SEO starter guide|Research 30 keywords|Write three briefs|Audit ten existing pages',0],
  ['Lifecycle and CRM','Intermediate','6 h','The numbers behind marketing','Lifecycle|Email|Retention','Welcome, win-back and post-purchase flows, segmented properly, measured on revenue rather than open rate.','Lifecycle marketing guide|Klaviyo flows course|Segmentation examples','Map the current flows|Design a win-back flow|Segment the list four ways|Set a revenue-per-email baseline',0],
  ['Planning and budget','Advanced','6 h','Paid media, hands on','Planning|Budget|Forecasting','A quarterly plan with a budget split, a forecast, and the argument you would make to a CFO for each line.','Annual planning template|Media mix basics|Two real plan examples','Build a quarterly plan|Split a ₹40L budget|Forecast the pipeline|Write the CFO memo',0],
  ['Portfolio and interviews','Intermediate','5 h','Planning and budget','Case studies|Interview|Portfolio','Three campaign case studies with numbers, and practice for the "walk me through a campaign you ran" question that decides these interviews.','Case study template|Marketing interview bank|Portfolio examples','Write three case studies|Publish the portfolio|20 interview questions|Two mock interviews',0]],
 lib:[
  ['Obviously Awesome','April Dunford','article','Brand positioning','Beginner',150,'progress','Short and practical. You are two thirds through.',1],
  ['GA4 fundamentals','Google Skillshop','course','Marketing analytics','Beginner',240,'not','Named in 74% of the postings you saved. Start here.',1],
  ['CAC, LTV and payback workbook','Reforge','practice','Marketing analytics','Intermediate',180,'not','The arithmetic that separates executive from manager roles.',1],
  ['Meta Blueprint essentials','Meta','course','Performance advertising','Beginner',300,'not','Free, official, and enough to run your own small test budget.',1],
  ['SEO starter guide','Google','docs','SEO','Beginner',90,'not','The only SEO document worth reading before the tactics ones.',1],
  ['Creative testing framework','Motion','article','Performance advertising','Intermediate',40,'not','How to test ad creative without fooling yourself with small samples.',1],
  ['Klaviyo flows for D2C','Klaviyo','course','Lifecycle / CRM','Intermediate',150,'not','Directly applicable to Brewhouse; you could ship this at work.',0],
  ['Looker Studio in an afternoon','Google','video','Marketing analytics','Beginner',60,'not','Turns your GA4 data into something leadership will actually open.',0],
  ['Your notes — competitor teardown','You','notes','Brand positioning','Beginner',18,'done','Three D2C coffee brands, written in September. Reuse in the case studies.',0],
  ['Media mix modelling, plainly','Recast','article','Budget management','Advanced',45,'not','Read after the planning week, not before.',0],
  ['Content brief template','Animalz','notes','Content strategy','Beginner',12,'not','Saves an hour per brief and makes freelancers better.',0],
  ['Run a ₹10,000 paid test','SkillGap','project','Performance advertising','Intermediate',300,'not','Small budget, real data, one defensible case study.',0]],
 projects:[
  ['Positioning canvas for Brewhouse','Beginner','5 h',60,'Category, competitive alternative, differentiator and the one-line statement, backed by three competitor teardowns.','Market research','Positioning|Messaging|Research','Docs|Sheets'],
  ['CAC and payback model','Intermediate','6 h',0,'A channel-level model in Sheets: spend, CAC, contribution margin and payback period, with the assumptions visible.','Budget management','Unit economics|Modelling|Attribution','Sheets|GA4'],
  ['Run a ₹10,000 paid test','Intermediate','8–10 h',0,'One objective, three creative variants, a fair test, and a readout that says what you would spend next.','Performance advertising','Meta Ads|Creative testing|Readouts','Meta Ads|GA4|Sheets'],
  ['SEO audit of ten pages','Intermediate','7 h',0,'Intent, titles, internal links and a prioritised fix list with the traffic each fix is worth.','SEO','SEO|Prioritisation|Auditing','Search Console|Ahrefs'],
  ['Win-back email flow','Beginner','5 h',0,'Segment lapsed buyers, write a three-email sequence, and measure it on revenue per recipient.','Copywriting','Lifecycle|Segmentation|Email','Klaviyo|Sheets'],
  ['Festive campaign case study','Intermediate','4 h',100,'Finished in October. The Diwali gifting campaign written up properly: objective, spend, result, what you would change.','Campaign management','Case writing|Reporting','Docs|GA4']],
 jd:{co:'Wakefit',title:'Marketing Manager — Growth',loc:'Bengaluru · Hybrid',exp:'3–5 years',
  text:`Marketing Manager — Growth, Wakefit (Bengaluru, Hybrid)

About the role
Own acquisition for two product categories: budget, channel mix, creative direction and the number at the end of the month.

Responsibilities
- Own a monthly paid budget across Meta, Google and marketplaces
- Set the creative brief and run a structured testing calendar
- Report CAC, ROAS and contribution margin to the leadership team
- Own the content and SEO plan for your categories
- Work with the lifecycle team on retention and repeat purchase
- Brief and manage two agencies

Requirements
- 3–5 years in performance or growth marketing
- Hands-on with Meta Ads Manager and Google Ads
- Strong command of GA4 and marketing analytics
- Comfortable building and defending a budget
- Evidence of campaigns you ran and what they returned
- Excellent written communication

Nice to have
- D2C or e-commerce background
- SQL or Looker Studio
- Experience managing agencies`,
  req:[['Copywriting',1],['Content strategy',1],['Campaign management',1],['Social media',1],['Performance advertising',0],['GA4',0],['Budget ownership',0],['CAC and ROAS',0],['SEO',0]],
  pref:[['D2C background',1],['Storytelling',1],['SQL',0],['Looker Studio',0],['Agency management',0]],
  tools:['Meta Ads','Google Ads','GA4','Looker Studio','Klaviyo','Ahrefs','Shopify','Excel'],
  resp:[['Own a monthly paid budget',90],['Creative briefs and testing calendar',74],['Report CAC, ROAS, contribution margin',70],['Content and SEO plan',56],['Lifecycle and repeat purchase',42],['Brief and manage agencies',36]],
  reqs:[['y','3–5 years performance marketing','2 years 10 months, mostly organic'],['g','D2C background','Brewhouse, direct-to-consumer coffee'],['r','Budget ownership','Your largest owned spend is ₹2L of influencer budget']],
  kwGrid:[['ROAS',5,'missing'],['CAC',5,'missing'],['Meta Ads',4,'missing'],['GA4',4,'missing'],['budget',4,'partial'],['creative testing',3,'missing'],['content',3,'present'],['SEO',2,'partial']]},
 kw:[['CAC and payback','79%','Summary, once the model exists','+9','r'],
  ['ROAS','74%','Only with a campaign you ran','+8','r'],
  ['GA4','74%','Skills block, after week 3','+7','r'],
  ['budget ownership','81%','Say the influencer budget number — ₹2L is still ownership','+6','y'],
  ['creative testing','58%','After the ₹10k test','+5','r'],
  ['lifecycle / retention','49%','Once the win-back flow ships','+4','r'],
  ['SEO','66%','You write briefs already. Name the discipline.','+3','y'],
  ['brand positioning','52%','Add the canvas as a project','+2','y']],
 kwGroups:[['Brand & content',78],['Performance',28],['Analytics',34],['Lifecycle',40],['Planning',46]],
 match:{pct:54,verdict:'A brand marketer applying for a growth job',
  note:'Your craft is strong and the D2C context is right. The role is bought and sold on paid media and unit economics, and neither appears on your page.',
  cats:[['Brand & content',82],['Performance',25],['Analytics',32],['Lifecycle',45],['Planning',48]],
  matching:['Copywriting','Content strategy','Social media','Campaign execution','Influencer marketing','D2C context','Storytelling','MBA'],
  partial:[['Budget','₹2L influencer spend versus the ₹40L monthly they own.',35],['Reporting','You report reach and engagement, not CAC.',40],['SEO','You write briefs; you do not do keyword research.',45],['Agency work','You brief freelancers, not agencies.',50]],
  missing:[['Meta and Google Ads','−10','Required · week 4 of your plan'],['GA4','−8','Required · week 3'],['CAC and ROAS','−8','Required · week 2'],['Creative testing','−5','Required · week 4'],['Looker Studio','−2','Preferred · week 3 stretch']],
  fixes:[['+9%','Put numbers on the campaigns you ran','Reach, revenue, repeat rate — anything. Right now the page has none.'],
   ['+6%','Claim the influencer budget explicitly','₹2L a month managed is budget ownership at your level. Say it.'],
   ['+5%','Name the tools you touch daily','Shopify, Klaviyo and Meta Business Suite are all missing.'],
   ['+3%','Lead with D2C','It is the part of your background this employer cares about most.']]},
 an:{score:62,ats:80,cover:44,head:'Well written, almost no numbers',
  sub:'Your copy is the best-written resume in this sample. It also contains one figure in total, which is the problem for a growth role.',
  weak:[['Experience · Brewhouse','Handled social media and content for the brand.','Grew Instagram from 14k to 61k in eighteen months and moved social-attributed revenue from 4% to 11% of monthly sales.'],
   ['Experience · Brewhouse','Worked with influencers for campaigns.','Ran a ₹2L monthly influencer programme across 30 creators; the Diwali round returned 3.1x on tracked codes.'],
   ['Experience · Brewhouse','Responsible for the email calendar.','Own a fortnightly email calendar to 48k subscribers, lifting click-through from 1.8% to 3.4% over two quarters.']],
  missing:[['r','Metrics block or results summary','Nothing quantifies three years of work'],['r','Tools and platforms','Shopify, Klaviyo, Meta Business Suite unnamed'],['y','Campaign case studies','You have them written; they are not on the resume']],
  fmt:[['y','Decorative header graphic','Two parsers dropped your contact details'],['y','Two-column layout','Reorders badly in older systems'],['g','Consistent dates','No issues']],
  found:['Social media','Content','Copywriting','Influencer marketing','Email','Brand'],
  absent:['Meta Ads','Google Ads','GA4','CAC','ROAS','Performance marketing'],
  recs:[['+10','Add a number to every bullet','Followers, revenue share, CTR, return — you have all of these'],['+6','Remove the header graphic','It is costing you your phone number in two systems'],['+5','Add a tools line','Keyword filters look for platform names'],['+4','Attach one campaign case study','The Diwali write-up is ready']]},
 resume:{title:'Marketing Manager',skillsA:'Brand positioning, Content strategy, Copywriting, Campaign management, Social media',skillsB:'Meta Business Suite, Klaviyo, Shopify, Canva, GA4 (learning), Google Ads (learning)',
  job1:'Marketing Executive',co1:'Brewhouse Co.',d1:'Jan 2024 – Present',l1:'Delhi NCR',
  b1:'Grew Instagram from 14k to 61k followers in eighteen months and moved social-attributed revenue from 4% to 11% of monthly sales.\nRun a ₹2L monthly influencer programme across 30 creators; the Diwali round returned 3.1x on tracked codes.\nOwn a fortnightly email calendar to 48k subscribers, lifting click-through from 1.8% to 3.4%.',
  job2:'Marketing Associate',co2:'Nurture Foods',d2:'Jun 2023 – Dec 2023',l2:'Gurugram',
  b2:'Wrote the packaging and landing copy for two product launches.\nCoordinated a 12-city sampling drive with the sales team, reaching 22,000 trials.',
  p1:'Diwali gifting campaign — case study',p1d:'Objective, ₹6L spend, 3.1x tracked return, and the three things I would change next year.',
  p2:'Positioning canvas — Brewhouse',p2d:'Category, alternative and differentiator, backed by teardowns of three competing D2C coffee brands.',
  certs:'Google Analytics 4 Certification, in progress\nHubSpot Content Marketing Certified (2024)',
  ach:'Best campaign, NMIMS marketing conclave 2023\nWrote a coffee newsletter that reached 3,400 subscribers organically',
  degree:'MBA, Marketing',school:'NMIMS Mumbai · BBA, Symbiosis',eduYears:'2021 – 2023',grade:'CGPA 3.3 / 4'},
 activity:[['g','Finished Obviously Awesome ch.1–6','Yesterday · 50 min'],
  ['y','Drafted the Brewhouse positioning canvas','2 days ago · 60% done'],
  ['b','Matched against Wakefit Marketing Manager','4 days ago · 54% match'],
  ['g','Wrote the Diwali campaign case study','Last week'],
  ['b','Resume analysed — ATS 80','Last week']],
 today:'Finish the CAC model in Sheets',todaySub:'Forty minutes. Without it, every growth interview stalls at the same question.'},

/* ---------------- 5. FINANCIAL ANALYST ---------------- */
'finance':{name:'Financial Analyst',track:'Business & management',icon:'i-coins',level:'Analyst to associate',
 blurb:'Modelling, valuation and the deck. For MBA finance and commerce graduates.',
 posts:120,score:52,hrs:8,weeksLeft:10,finish:'4 January',streak:15,hours:97,doneRes:38,totalRes:92,
 persona:{first:'Ananya',last:'Rao',ini:'AR',edu:'MBA Finance, IIM Indore · B.Com (Hons), SRCC',cur:'Credit Analyst',co:'Meridian Capital',loc:'Mumbai',exp:'2 yrs 1 mo',
  email:'ananya.rao@gmail.com',phone:'+91 99304 18826',links:'linkedin.com/in/ananyarao',
  summary:'Credit analyst underwriting mid-market lending, with an MBA in finance. Strong on accounting and industry work; building the modelling and valuation depth that investment banking and corporate finance roles test for.'},
 skills:[['Excel',70,92],['PowerPoint',68,85],['Communication',66,80],['Accounting',65,85],['Industry research',60,78],
  ['Pitch decks',55,80],['Financial modelling',45,90],['Comparable analysis',42,80],['Valuation (DCF)',40,88],['Regulation',35,60],
  ['Due diligence',30,65],['M&A process',25,70],['Python / VBA',20,45],['LBO modelling',15,70]],
 roadmap:[
  ['Three statements, linked','Intermediate','8 h','None','Accounting|Modelling|Excel','Build a linked income statement, balance sheet and cash flow from scratch, twice, until the circularity stops scaring you.','Wall Street Prep three-statement|Accounting refresher|Two blank build exercises','Refresh accounting linkages|Build a model from a 10-K|Build a second from scratch|Get it checked',4],
  ['Excel at speed','Beginner','6 h','None','Excel|Shortcuts|Formatting','Keyboard-only navigation, INDEX MATCH, data tables and clean formatting conventions. Speed is genuinely tested in these interviews.','Excel for finance shortcuts|Formatting conventions|Timed drills','No-mouse day|INDEX MATCH drills|Build a data table|Three timed exercises',3],
  ['DCF, properly','Advanced','9 h','Three statements, linked','DCF|WACC|Terminal value','Free cash flow, WACC, terminal value and sensitivity. Then defend every assumption out loud, because that is the interview.','DCF walkthrough|WACC deep dive|Sensitivity tables','Build a DCF for a listed company|Derive WACC from scratch|Run a sensitivity grid|Present the assumptions',2],
  ['Comparables and precedents','Intermediate','7 h','DCF, properly','Comps|Multiples|Screening','Building a comp set that survives scrutiny, choosing multiples, and the judgement calls about what to exclude.','Comps methodology|Screening walkthrough|Two worked examples','Screen a comp set|Build a trading comps sheet|Add precedent transactions|Write the football field',1],
  ['LBO in a day','Advanced','8 h','Comparables and precedents','LBO|Debt schedules|Returns','Sources and uses, debt schedules, returns. The paper LBO is a standing interview test and you have not done one.','Paper LBO walkthrough|Full LBO build|Returns analysis','Paper LBO on paper|Build a full LBO|Add a debt schedule|Sensitise the returns',0],
  ['The deck','Intermediate','6 h','Comparables and precedents','PowerPoint|Storyline|Charts','Storyline first, then pages. Banker formatting, footnotes, and a chart that does not need explaining.','Banker deck conventions|Storylining guide|Two teardowns','Storyline a pitch|Build 10 pages|Format to convention|Teardown two real decks',0],
  ['A live sector thesis','Advanced','10 h','LBO in a day','Research|Thesis|Valuation','Pick a sector, build the view, value two companies, and write the note. This is the work sample that gets you the conversation.','Equity research note examples|Sector primer|Note template','Pick a sector and read the primer|Model two companies|Write a 6-page note|Get it critiqued',0],
  ['Interview drills','Advanced','8 h','A live sector thesis','Technicals|Fit|Modelling test','400 technical questions, a timed modelling test and the "walk me through your resume" answer, said out loud until it stops sounding rehearsed.','400 technical questions|Modelling test practice|Fit question bank','200 technicals|Two timed modelling tests|Write your story|Four mock interviews',0]],
 lib:[
  ['Three-statement modelling','Wall Street Prep','course','Financial modelling','Intermediate',480,'progress','The backbone of everything else here. You are halfway.',1],
  ['DCF walkthrough with a live filing','Aswath Damodaran','video','Valuation (DCF)','Advanced',150,'not','Free, rigorous, and he shows the judgement rather than the formula.',1],
  ['Excel shortcuts for finance','Macabacus','practice','Excel','Beginner',180,'not','Speed is tested directly. Two weeks of drills is enough.',1],
  ['Paper LBO walkthrough','Breaking Into Wall Street','video','LBO modelling','Advanced',90,'not','The single most common on-the-spot test you have never done.',1],
  ['Comparable company analysis','Macabacus','docs','Comparable analysis','Intermediate',120,'not','Methodology plus the judgement calls about exclusions.',1],
  ['400 investment banking technicals','BIWS','practice','Interview prep','Advanced',600,'not','Start in week 8. Doing it earlier just builds false confidence.',1],
  ['Equity research note examples','Various','article','Industry research','Intermediate',90,'not','Read three before writing your own sector thesis.',0],
  ['Banker deck conventions','Macabacus','docs','Pitch decks','Intermediate',60,'not','Footnotes, sourcing and formatting rules that signal you have done this.',0],
  ['Your notes — NBFC credit memo','You','notes','Accounting','Intermediate',25,'done','Your own underwriting note. Good raw material for the sector thesis.',0],
  ['Damodaran on WACC','NYU Stern','video','Valuation (DCF)','Advanced',75,'not','Watch before you defend a discount rate to anyone.',0],
  ['Sector primer: Indian specialty chemicals','Various','article','Industry research','Intermediate',120,'not','A sector where you already have underwriting exposure.',0],
  ['Build a full LBO','SkillGap','project','LBO modelling','Advanced',480,'not','Week 5 milestone and the strongest portfolio item for this route.',0]],
 projects:[
  ['Three-statement model from a filing','Intermediate','10–12 h',50,'Take a listed company annual report and build the linked model from a blank sheet, twice.','Accounting|Excel','Modelling|Linkages|Excel discipline','Excel'],
  ['DCF with defensible assumptions','Advanced','9 h',0,'Full DCF with WACC derived from scratch, a sensitivity grid, and a page defending every assumption.','Financial modelling','DCF|WACC|Sensitivity','Excel'],
  ['Trading comps and football field','Intermediate','7 h',0,'Screen a comp set, justify exclusions, add precedent transactions, and produce the valuation range chart.','Accounting','Comps|Multiples|Charting','Excel|Capital IQ'],
  ['Paper and full LBO','Advanced','8 h',0,'Sources and uses, a three-tranche debt schedule and returns sensitised on entry multiple and exit year.','Financial modelling','LBO|Debt schedules|Returns','Excel'],
  ['Sector thesis note','Advanced','12 h',0,'Six pages on a sector you know, two companies valued, and a recommendation you would defend.','Industry research','Research|Thesis writing|Valuation','Excel|PowerPoint'],
  ['Credit memo rewrite','Beginner','4 h',100,'Finished in August. Reworked an internal underwriting memo into an external-quality investment note.','Accounting','Writing|Credit analysis','Word|Excel']],
 jd:{co:'Avendus Capital',title:'Investment Banking Analyst',loc:'Mumbai · On-site',exp:'1–3 years',
  text:`Investment Banking Analyst — Avendus Capital (Mumbai)

About the role
Support live M&A and private placement mandates in the consumer and healthcare coverage team.

Responsibilities
- Build and maintain three-statement, DCF and LBO models
- Prepare pitch materials, information memoranda and management presentations
- Run trading comparables and precedent transaction analysis
- Support due diligence and manage data rooms
- Draft sector and company research for client conversations
- Work directly with associates and VPs on live mandates

Requirements
- 1–3 years in banking, credit, transaction advisory or corporate finance
- Strong accounting fundamentals and Excel modelling
- Working knowledge of DCF, comparables and LBO analysis
- Excellent PowerPoint and written communication
- MBA, CA or equivalent
- Ability to work to deal timelines

Nice to have
- Capital IQ, Bloomberg or Factset
- Sector exposure in consumer or healthcare
- VBA or Python`,
  req:[['Accounting',1],['Excel',1],['PowerPoint',1],['Written communication',1],['MBA or CA',1],['Financial modelling',0],['DCF',0],['Comparables',0],['LBO',0]],
  pref:[['Industry research',1],['Capital IQ',0],['Bloomberg',0],['Consumer sector',0],['VBA / Python',0]],
  tools:['Excel','PowerPoint','Capital IQ','Bloomberg','Factset','VBA','Word'],
  resp:[['Build three-statement, DCF and LBO models',94],['Prepare pitch materials and IMs',82],['Trading comps and precedents',70],['Due diligence and data rooms',54],['Sector and company research',48],['Work to deal timelines',30]],
  reqs:[['g','1–3 years relevant experience','2 years 1 month in credit'],['g','MBA or CA','MBA Finance, IIM Indore'],['r','Live transaction modelling','Credit underwriting is adjacent, not the same']],
  kwGrid:[['LBO',5,'missing'],['DCF',5,'missing'],['three-statement',4,'missing'],['comparables',4,'missing'],['pitch',3,'partial'],['due diligence',3,'partial'],['Excel',3,'present'],['accounting',2,'present']]},
 kw:[['DCF valuation','88%','Skills and the DCF project','+10','r'],
  ['LBO','71%','Only after you have built one','+9','r'],
  ['three-statement model','84%','Skills, after week 1','+8','r'],
  ['comparable companies','79%','Projects section','+7','r'],
  ['financial modelling','92%','Summary line, once the models exist','+7','r'],
  ['due diligence','58%','You do credit diligence. Name it that way.','+4','y'],
  ['pitch materials','66%','Reframe the credit committee decks','+3','y'],
  ['Capital IQ','44%','Only if you get access','+1','r']],
 kwGroups:[['Accounting',82],['Modelling',30],['Valuation',26],['Materials',62],['Process',48]],
 match:{pct:56,verdict:'Right raw material, missing the deal toolkit',
  note:'Credit underwriting gives you accounting and diligence instincts most candidates lack. What is absent is every modelling artefact this role is measured on: DCF, comps and LBO.',
  cats:[['Accounting',85],['Modelling',32],['Valuation',28],['Materials',65],['Process',52]],
  matching:['Accounting fundamentals','Excel','PowerPoint','Credit analysis','Industry research','Written communication','MBA Finance','Client interaction'],
  partial:[['Financial modelling','Cash flow forecasting, but not linked three-statement builds.',45],['Diligence','Credit diligence, not transaction diligence.',50],['Decks','Credit committee memos, not pitch books.',55],['Excel speed','Competent, not keyboard-fast.',60]],
  missing:[['DCF valuation','−10','Required · week 3 of your plan'],['LBO modelling','−9','Required · week 5'],['Trading comparables','−7','Required · week 4'],['Precedent transactions','−4','Required · week 4'],['Capital IQ','−2','Preferred · access dependent']],
  fixes:[['+8%','Reframe credit work as diligence and modelling','You forecast cash flows and stress-test them. Say that in their vocabulary.'],
   ['+6%','Add deal-adjacent numbers','Ticket sizes, number of files, sectors covered. All absent right now.'],
   ['+5%','List the models once they exist','A projects block with DCF, comps and LBO changes this page entirely.'],
   ['+3%','Move the MBA and SRCC higher','Both are screening signals for this employer.']]},
 an:{score:71,ats:86,cover:48,head:'Clean and credible, built for the wrong job',
  sub:'This is a good credit analyst resume. For banking it is missing every modelling artefact, and the bullets describe process rather than deals.',
  weak:[['Experience · Meridian','Responsible for credit appraisal of mid-market clients.','Underwrote 41 mid-market credit files worth ₹680 crore across chemicals, auto components and healthcare.'],
   ['Experience · Meridian','Prepared notes for the credit committee.','Authored 41 credit memos presented to committee; 36 approved, with two escalations reversed on my analysis.'],
   ['Experience · Meridian','Did financial analysis of borrower companies.','Built three-year cash flow forecasts with downside cases for every file, flagging two covenant breaches ahead of default.']],
  missing:[['r','Modelling or transactions section','Nothing shows valuation work'],['y','Sector coverage','You have real sector depth that is invisible'],['y','Technical skills block','Excel, PowerPoint and tools unnamed']],
  fmt:[['g','Conventional, single column','Parses cleanly everywhere'],['g','Consistent date format','No issues'],['y','No section for deal or file volume','Bankers scan for scale first']],
  found:['Accounting','Credit analysis','Excel','Cash flow forecasting','PowerPoint','Research'],
  absent:['DCF','LBO','Comparables','Three-statement model','Capital IQ','Valuation'],
  recs:[['+9','Add file volume and ticket sizes','₹680 crore across 41 files is the number that gets read'],['+7','Add a modelling projects block','Even self-built models count if you can defend them'],['+5','Rewrite process bullets as outcomes','Rewrites are ready above'],['+3','Add a tools line','Excel, PowerPoint, Word, and Capital IQ when you have it']]},
 resume:{title:'Financial Analyst',skillsA:'Financial modelling, Credit analysis, Valuation (learning), Accounting, Industry research',skillsB:'Excel, PowerPoint, Word, Capital IQ (basic), Tally',
  job1:'Credit Analyst',co1:'Meridian Capital',d1:'Aug 2024 – Present',l1:'Mumbai',
  b1:'Underwrote 41 mid-market credit files worth ₹680 crore across chemicals, auto components and healthcare.\nAuthored 41 credit memos presented to committee; 36 approved, with two escalations reversed on my analysis.\nBuilt three-year cash flow forecasts with downside cases, flagging two covenant breaches ahead of default.',
  job2:'Finance Intern',co2:'Deloitte India',d2:'Apr 2023 – Jun 2023',l2:'Mumbai',
  b2:'Supported a transaction advisory team on two buy-side diligence engagements in consumer goods.\nBuilt the quality-of-earnings working file for a ₹120 crore target.',
  p1:'DCF valuation — listed specialty chemicals company',p1d:'Full model with WACC derived from scratch, terminal value sensitivity and a page defending every assumption.',
  p2:'Sector thesis — Indian specialty chemicals',p2d:'Six-page note covering demand drivers, two company models and a recommendation with the risks stated.',
  certs:'CFA Level I cleared (2024)\nNISM Series-VIII Equity Derivatives (2023)',
  ach:'Finance club co-head, IIM Indore 2023\nSecond place, national valuation case challenge (Kotak), 2023',
  degree:'MBA, Finance',school:'IIM Indore · B.Com (Hons), SRCC',eduYears:'2022 – 2024',grade:'CGPA 3.6 / 4'},
 activity:[['g','Finished the three-statement build from a 10-K','Yesterday · 2 h'],
  ['y','Started the DCF walkthrough','2 days ago'],
  ['g','Cleared 60 Excel timed drills','3 days ago'],
  ['b','Matched against Avendus IB Analyst','Last week · 56% match'],
  ['g','Rewrote the credit memo as an investment note','Last week']],
 today:'Build the second three-statement model from scratch',todaySub:'Two hours. The second build is where the linkages stop being memorised.'},

/* ---------------- 6. OPERATIONS & SUPPLY CHAIN ---------------- */
'ops':{name:'Operations & Supply Chain Manager',track:'Business & management',icon:'i-box',level:'Mid-level',
 blurb:'Planning, inventory, vendors and cost. For MBA operations and industrial engineering.',
 posts:110,score:60,hrs:6,weeksLeft:8,finish:'20 December',streak:4,hours:58,doneRes:26,totalRes:84,
 persona:{first:'Vikram',last:'Nair',ini:'VN',edu:'MBA Operations, SPJIMR · B.E. Mechanical, VJTI',cur:'Assistant Manager — Logistics',co:'Orbit Consumer',loc:'Chennai',exp:'3 yrs 4 mo',
  email:'vikram.nair@gmail.com',phone:'+91 98410 27735',links:'linkedin.com/in/vikramnair',
  summary:'Logistics assistant manager for a consumer goods distributor covering four southern states. Strong on execution and vendor relationships; building the planning, ERP and analytics side that manager roles are hired on.'},
 skills:[['Stakeholder communication',65,78],['Excel modelling',62,85],['Vendor negotiation',60,80],['Logistics',58,78],['Warehouse operations',55,70],
  ['Inventory management',55,85],['Project management',52,75],['Cost analysis',50,80],['Compliance',45,65],['Demand forecasting',45,80],
  ['Lean and Six Sigma',40,75],['S&OP',35,75],['Data and dashboards',35,70],['ERP (SAP)',30,80]],
 roadmap:[
  ['Inventory, from the maths up','Intermediate','7 h','None','Inventory|Safety stock|EOQ','Safety stock, reorder points, EOQ and service levels. Most stock-outs are a formula nobody applied, not bad luck.','Inventory management fundamentals|Safety stock calculation guide|Practice workbook','Read the fundamentals|Calculate safety stock for 20 SKUs|Set reorder points|Compare to current policy',4],
  ['Forecasting that holds','Intermediate','8 h','Inventory, from the maths up','Forecasting|Seasonality|Error','Moving averages, exponential smoothing, seasonality, and measuring forecast error honestly with MAPE and bias.','Demand forecasting course|Forecast error metrics|Excel forecasting lab','Build three forecast methods|Measure MAPE on last year|Add seasonality|Write a forecast review',3],
  ['SAP for supply chain','Intermediate','8 h','None','SAP|MM|Transactions','MM and SD basics, the transactions you will live in, and how master data errors turn into ₹40 lakh of dead stock.','SAP MM overview|Transaction cheat sheet|Sandbox exercises','SAP MM overview|Learn 20 core transactions|Run a sandbox PO cycle|Master data hygiene checklist',1],
  ['S&OP and planning','Advanced','7 h','Forecasting that holds','S&OP|Planning|Consensus','The monthly cycle: demand review, supply review, consensus, executive sign-off. The process that turns forecasting into decisions.','S&OP process guide|Two company case studies|Meeting templates','Read the process guide|Map your current cycle|Build a demand review pack|Design a consensus meeting',0],
  ['Cost and the P&L','Intermediate','6 h','None','Cost analysis|Landed cost|P&L','Landed cost, cost-to-serve, and the ability to argue a logistics decision in the language finance uses.','Cost-to-serve primer|Landed cost model|Two worked examples','Build a landed cost model|Calculate cost-to-serve by channel|Model a route change|Write the finance memo',2],
  ['Lean in practice','Intermediate','6 h','None','Lean|Six Sigma|Kaizen','Value stream mapping, the seven wastes, and a real kaizen on your own warehouse rather than a certificate on a wall.','Lean Six Sigma yellow belt|VSM walkthrough|Kaizen case studies','Yellow belt course|Map one value stream|Run a kaizen|Measure the result',0],
  ['Numbers people can see','Intermediate','6 h','Cost and the P&L','Dashboards|Excel|Reporting','Fill rate, OTIF, inventory turns and ageing, in one dashboard that gets opened on Monday morning.','Power BI for operations|Supply chain KPI guide|Dashboard examples','Define eight KPIs|Build the dashboard|Automate the refresh|Run one review with it',0],
  ['Interviews and case practice','Intermediate','5 h','S&OP and planning','Case practice|Operations cases|Story','Operations interviews are case-led: a stock-out, a cost overrun, a vendor failure. Practise thinking out loud.','Operations case bank|Guesstimate practice|STAR worksheet','20 operations cases|10 guesstimates|Write six STAR stories|Two mock interviews',0]],
 lib:[
  ['Inventory management fundamentals','APICS','course','Inventory management','Intermediate',360,'progress','Safety stock and reorder logic. You are two thirds through.',1],
  ['SAP MM for beginners','SAP Learning Hub','course','ERP (SAP)','Beginner',480,'not','Named in 71% of the manager postings you saved. Largest single gap.',1],
  ['Demand forecasting in Excel','Institute of Business Forecasting','course','Demand forecasting','Intermediate',300,'not','Practical, spreadsheet-first, no statistics background assumed.',1],
  ['S&OP process guide','Oliver Wight','docs','S&OP','Advanced',120,'not','The reference description of the monthly cycle.',1],
  ['Cost-to-serve primer','Supply Chain Digest','article','Cost analysis','Intermediate',45,'not','Teaches you to argue logistics decisions in finance language.',1],
  ['Lean Six Sigma yellow belt','ASQ','course','Lean and Six Sigma','Beginner',420,'not','Certification recruiters recognise, and the content is genuinely useful.',1],
  ['Supply chain KPI definitions','Gartner','notes','Data and dashboards','Beginner',30,'not','Settles the OTIF-versus-fill-rate arguments before they start.',0],
  ['Power BI for operations','Microsoft Learn','course','Data and dashboards','Beginner',240,'not','Enough to build the Monday-morning dashboard yourself.',0],
  ['Your notes — Coimbatore route change','You','notes','Logistics','Intermediate',20,'done','Your own analysis from July. Reusable as an interview story.',0],
  ['Negotiation: getting to yes','Fisher & Ury','article','Vendor negotiation','Beginner',180,'done','Read in August. Already showing up in your vendor conversations.',0],
  ['Warehouse layout and slotting','MHI','article','Warehouse operations','Intermediate',50,'not','Short read with an immediate application at your own DC.',0],
  ['Build an S&OP demand pack','SkillGap','project','S&OP','Advanced',360,'not','Week 4 milestone and the best evidence of planning capability.',0]],
 projects:[
  ['Safety stock policy for 50 SKUs','Intermediate','8 h',55,'Service-level driven safety stock and reorder points for your fastest-moving SKUs, compared against the current rule of thumb.','Inventory management|Excel modelling','Safety stock|Service levels|Policy design','Excel|SAP'],
  ['Twelve-month demand forecast','Intermediate','9 h',0,'Three forecasting methods on two years of history, error measured with MAPE and bias, and one recommended method.','Demand forecasting','Forecasting|Seasonality|Error measurement','Excel'],
  ['Cost-to-serve by channel','Advanced','8 h',0,'Allocate logistics cost across general trade, modern trade and e-commerce, and show where you are losing money per order.','Cost analysis','Cost modelling|Allocation|Finance framing','Excel'],
  ['S&OP demand review pack','Advanced','7 h',0,'The monthly pack: forecast, bias, supply constraints and the three decisions the meeting must make.','Demand forecasting','S&OP|Planning|Facilitation','Excel|PowerPoint'],
  ['Warehouse kaizen','Intermediate','6 h',0,'Map one value stream at the Chennai DC, remove two steps, and measure picks per hour before and after.','Warehouse operations','Lean|VSM|Measurement','Excel|Miro'],
  ['Route rationalisation, Coimbatore','Beginner','5 h',100,'Finished in July. Consolidated nine routes into seven and cut monthly freight by ₹2.4 lakh.','Logistics','Route planning|Cost analysis','Excel|Maps']],
 jd:{co:'Dabur India',title:'Manager — Supply Chain Planning',loc:'Chennai · On-site',exp:'4–6 years',
  text:`Manager — Supply Chain Planning, Dabur India (Chennai)

About the role
Own demand and supply planning for the southern region across three plants and eleven distribution centres.

Responsibilities
- Own the monthly demand forecast and lead the S&OP cycle
- Set inventory norms and drive working capital targets
- Manage 3PL partners against cost and service KPIs
- Drive cost reduction across freight and warehousing
- Own SAP master data quality for your region
- Report fill rate, OTIF and inventory turns to leadership

Requirements
- 4–6 years in supply chain planning or logistics
- Strong SAP MM or APO experience
- Demonstrated demand forecasting and inventory norm setting
- Advanced Excel; comfort with large datasets
- Experience managing 3PL and transport vendors
- MBA in operations preferred

Nice to have
- Lean or Six Sigma certification
- Power BI or Tableau
- FMCG distribution experience`,
  req:[['Logistics',1],['Vendor negotiation',1],['Warehouse operations',1],['Excel',1],['MBA Operations',1],['SAP',0],['Demand forecasting',0],['Inventory norms',0],['S&OP',0]],
  pref:[['FMCG distribution',1],['Cost analysis',1],['Lean / Six Sigma',0],['Power BI',0]],
  tools:['SAP MM','SAP APO','Excel','Power BI','TMS','WMS','PowerPoint'],
  resp:[['Own the demand forecast and S&OP cycle',92],['Set inventory norms and working capital',80],['Manage 3PL cost and service',72],['Freight and warehousing cost reduction',60],['SAP master data quality',44],['Report fill rate, OTIF, turns',34]],
  reqs:[['y','4–6 years supply chain','You have 3 years 4 months'],['g','MBA in operations','SPJIMR, 2022'],['r','SAP MM or APO','Your current firm runs on Tally and spreadsheets']],
  kwGrid:[['S&OP',5,'missing'],['SAP',5,'missing'],['forecast',4,'missing'],['inventory norms',4,'partial'],['OTIF',3,'missing'],['3PL',3,'present'],['fill rate',3,'missing'],['cost reduction',2,'present']]},
 kw:[['S&OP','78%','Summary, once you have run a demand review','+9','r'],
  ['SAP MM','71%','Skills, after the sandbox work','+9','r'],
  ['demand forecasting','83%','Skills and the forecast project','+8','r'],
  ['inventory norms','69%','Rewrite your stock bullet to use this term','+6','y'],
  ['OTIF and fill rate','64%','You track service levels. Use their words.','+5','y'],
  ['cost-to-serve','47%','After the channel costing project','+4','r'],
  ['working capital','52%','Connect inventory days to cash in one bullet','+3','r'],
  ['3PL management','74%','Already there — add the number of partners','+2','g']],
 kwGroups:[['Planning',34],['Execution',82],['Systems',28],['Cost',56],['People',70]],
 match:{pct:61,verdict:'Strong on execution, light on planning',
  note:'You run logistics well and the vendor side is genuinely strong. This role is a planning role, and forecasting, inventory norms and SAP are where it is decided.',
  cats:[['Planning',38],['Execution',85],['Systems',30],['Cost',58],['People',74]],
  matching:['Logistics operations','3PL management','Vendor negotiation','Warehouse operations','Route planning','Excel','FMCG distribution','MBA Operations'],
  partial:[['Inventory','You monitor stock; they want norms you set.',50],['Cost work','Freight savings, not cost-to-serve analysis.',55],['Reporting','Weekly MIS, not KPI ownership.',48],['Experience length','3 years 4 months against 4–6.',70]],
  missing:[['SAP MM / APO','−10','Required · week 3 of your plan'],['S&OP process','−8','Required · week 4'],['Demand forecasting','−8','Required · week 2'],['Inventory norm setting','−5','Required · week 1'],['Six Sigma','−2','Preferred · week 6']],
  fixes:[['+8%','Put the freight saving in the first bullet','₹2.4 lakh a month is the strongest number you have and it is buried.'],
   ['+6%','Use planning vocabulary for the stock work','"Monitored stock levels" and "set inventory norms" describe similar work to different readers.'],
   ['+5%','Name the scale you handle','Four states, eleven DCs, how many SKUs. Scale is the first filter.'],
   ['+3%','List SAP as in progress rather than omitting it','Honest, and it stops the keyword filter dropping you entirely.']]},
 an:{score:67,ats:81,cover:46,head:'An execution resume for a planning job',
  sub:'Everything on the page is about running the operation day to day. The role is bought on forecasting, norms and systems, and none of those words appear.',
  weak:[['Experience · Orbit Consumer','Responsible for day-to-day logistics operations across four states.','Run daily dispatch across four states, eleven DCs and 1,400 SKUs, holding fill rate at 96% through two peak seasons.'],
   ['Experience · Orbit Consumer','Handled transporter coordination and negotiation.','Renegotiated rates with nine transport partners, cutting freight cost per case by 11% year on year.'],
   ['Experience · Orbit Consumer','Worked on route optimisation for the Coimbatore region.','Consolidated nine Coimbatore routes into seven, saving ₹2.4 lakh a month with no drop in service level.']],
  missing:[['r','Systems and tools','No ERP, WMS or BI tool named anywhere'],['r','Scale indicators','SKU count, DC count and tonnage all absent'],['y','Planning vocabulary','Forecast, norm, S&OP and OTIF never appear']],
  fmt:[['g','Single column and conventional','Parses everywhere'],['y','Paragraph-style role descriptions','Convert to bullets'],['y','Certifications at the very bottom','Move Six Sigma up once you have it']],
  found:['Logistics','Transport','Warehouse','Vendor management','Route planning','Excel'],
  absent:['SAP','S&OP','Demand forecasting','Inventory norms','OTIF','Cost-to-serve'],
  recs:[['+9','Add scale to the first line','Four states, eleven DCs, 1,400 SKUs'],['+7','Reframe stock work in planning terms','Same work, the vocabulary the role screens for'],['+5','Add a systems line','Even "SAP MM — in progress" beats silence'],['+4','Lead with the freight saving','It is the number a hiring manager remembers']]},
 resume:{title:'Supply Chain Manager',skillsA:'Demand planning, Inventory management, Logistics, Vendor negotiation, Cost analysis',skillsB:'Excel (advanced), SAP MM (learning), Power BI (basic), WMS, PowerPoint',
  job1:'Assistant Manager — Logistics',co1:'Orbit Consumer',d1:'Oct 2023 – Present',l1:'Chennai',
  b1:'Run daily dispatch across four states, eleven DCs and 1,400 SKUs, holding fill rate at 96% through two peak seasons.\nRenegotiated rates with nine transport partners, cutting freight cost per case by 11% year on year.\nConsolidated nine Coimbatore routes into seven, saving ₹2.4 lakh a month with no drop in service level.',
  job2:'Logistics Executive',co2:'Orbit Consumer',d2:'Jun 2022 – Sep 2023',l2:'Chennai',
  b2:'Cut secondary transport damage claims by 38% by changing pallet configuration and loading standards.\nBuilt the weekly dispatch tracker still used by three regional teams.',
  p1:'Safety stock policy — 50 fast-moving SKUs',p1d:'Service-level driven reorder points compared against the existing rule of thumb; projected 9% inventory reduction.',
  p2:'Cost-to-serve by channel',p2d:'Allocated logistics cost across general trade, modern trade and e-commerce to find loss-making order profiles.',
  certs:'Lean Six Sigma Yellow Belt, in progress\nAPICS CPIM Part 1, planned January 2027',
  ach:'Operations club lead, SPJIMR 2022\nBest live project — distribution network study for a dairy co-operative',
  degree:'MBA, Operations',school:'SPJIMR Mumbai · B.E. Mechanical, VJTI',eduYears:'2020 – 2022',grade:'CGPA 3.4 / 4'},
 activity:[['g','Finished safety stock calculations for 20 SKUs','Yesterday · 1 h'],
  ['y','Started SAP MM overview','3 days ago'],
  ['g','Completed the Coimbatore route write-up','Last week'],
  ['b','Matched against Dabur Supply Chain Manager','Last week · 61% match'],
  ['b','Resume analysed — ATS 81','2 weeks ago']],
 today:'Finish reorder points for the remaining 30 SKUs',todaySub:'About an hour. Then the policy comparison is ready to show your plant head.'},

/* ---------------- 7. CIVIL SITE ENGINEER ---------------- */
'civil':{name:'Civil / Site Engineer',track:'Core engineering',icon:'i-build',level:'Junior to mid',
 blurb:'Site execution, quantities, quality and the drawings behind them.',
 posts:95,score:54,hrs:6,weeksLeft:9,finish:'27 December',streak:8,hours:61,doneRes:24,totalRes:78,
 persona:{first:'Rohit',last:'Deshmukh',ini:'RD',edu:'B.E. Civil Engineering, COEP Pune',cur:'Junior Site Engineer',co:'Sankalp Infra',loc:'Pune',exp:'2 yrs',
  email:'rohit.deshmukh@gmail.com',phone:'+91 97654 30281',links:'linkedin.com/in/rohitdeshmukh',
  summary:'Site engineer on residential towers, handling execution, daily progress and quality checks for structural works. Building the planning, estimation and BIM side that moves you from site supervision to project engineering.'},
 skills:[['AutoCAD',65,85],['Site supervision',60,85],['Concrete technology',58,80],['IS codes',55,85],['Surveying',55,75],
  ['Structural analysis',50,80],['Safety (HSE)',50,80],['Quality control',48,80],['BOQ and quantity surveying',45,85],['Estimation and costing',42,80],
  ['STAAD Pro',35,75],['Project scheduling',30,80],['Contracts and claims',25,65],['Revit / BIM',20,70]],
 roadmap:[
  ['Quantities and BOQ','Intermediate','8 h','None','BOQ|Estimation|Measurement','Take-off from drawings, mode of measurement as per IS 1200, and a BOQ that survives a billing engineer. This is the fastest route off the site and into project engineering.','IS 1200 measurement rules|BOQ preparation walkthrough|Two drawing sets to take off','Read IS 1200 essentials|Take off a G+3 slab|Prepare a full BOQ|Cross-check with a billing engineer',4],
  ['Rate analysis and costing','Intermediate','7 h','Quantities and BOQ','Estimation|Rate analysis|DSR','Building a rate from labour, material, plant and overhead, and reading a DSR properly instead of copying last year.','DSR walkthrough|Rate analysis workbook|Two worked examples','Analyse rates for 10 items|Build a material reconciliation|Compare DSR to market|Cost a small work order',3],
  ['Scheduling with MSP or Primavera','Advanced','8 h','None','Scheduling|Critical path|Resources','WBS, activity sequencing, critical path and resource levelling. Every project engineer posting asks for this, and almost no fresher has it.','MS Project essentials|Primavera P6 basics|Critical path explained','MSP essentials|Build a WBS for a tower|Create a 200-activity schedule|Level resources and baseline it',2],
  ['Concrete and quality control','Intermediate','6 h','None','Concrete|QC|Testing','Mix design, slump, cube testing, curing regimes and what to do when a cube fails. Plus the checklists and formats a QA engineer lives in.','IS 456 essentials|Mix design walkthrough|QC checklist pack','IS 456 essentials|Work through a mix design|Build a pour checklist|Write a cube-failure NCR',2],
  ['Structural analysis and STAAD','Advanced','9 h','None','STAAD Pro|Analysis|Design','Model a frame, apply loads to IS 875, and read the output critically instead of trusting it. Enough to talk to a design consultant as a peer.','STAAD Pro fundamentals|IS 875 load cases|Frame modelling exercises','STAAD fundamentals|Model a G+3 frame|Apply load combinations|Check results by hand',0],
  ['Revit and BIM','Advanced','8 h','Quantities and BOQ','Revit|BIM|Coordination','Modelling, sheets, schedules and clash detection. BIM appears in 61% of the Pune and Mumbai postings you saved and in none of your experience.','Revit for structures|BIM coordination basics|Modelling exercises','Revit interface and modelling|Model a two-storey structure|Generate sheets and schedules|Run a clash check',0],
  ['Contracts, billing and claims','Intermediate','6 h','Rate analysis and costing','Contracts|Billing|Claims','RA bills, variation orders, extension of time and the clauses behind them. The skill that decides who becomes a project engineer.','FIDIC overview|RA bill format walkthrough|Claim case studies','FIDIC overview|Prepare a mock RA bill|Draft a variation order|Read two claim cases',0],
  ['Safety and site management','Intermediate','5 h','None','HSE|Toolbox talks|Method statements','Method statements, permits, toolbox talks and incident reporting, written the way an audit expects to see them.','IS 3764 and safety codes|Method statement templates|Two incident case studies','Safety codes overview|Write a method statement|Run a toolbox talk|Draft an incident report',0],
  ['Portfolio and interviews','Beginner','5 h','Scheduling with MSP or Primavera','Portfolio|Interviews|Drawings','A portfolio with drawings, a BOQ, a schedule and photographs, plus practice for the technical viva these interviews really are.','Interview question bank|Portfolio examples|Site story worksheet','Assemble the portfolio|60 technical questions|Write six site stories|Two mock interviews',0]],
 lib:[
  ['IS 1200 — modes of measurement','BIS','docs','BOQ and quantity surveying','Intermediate',150,'progress','The document every billing dispute comes back to. Half done.',1],
  ['Primavera P6 fundamentals','Oracle','course','Project scheduling','Advanced',480,'not','Named in 68% of the project engineer postings you saved.',1],
  ['Revit for structural engineers','Autodesk','course','Revit / BIM','Advanced',420,'not','61% of Pune and Mumbai postings want BIM. You have none.',1],
  ['IS 456 essentials for site engineers','BIS','docs','Concrete technology','Intermediate',180,'not','Cover, development length, and the clauses you will be asked at interview.',1],
  ['Rate analysis workbook','CPWD','practice','Estimation and costing','Intermediate',240,'not','Ten worked items. Do them by hand before using software.',1],
  ['STAAD Pro fundamentals','Bentley','course','STAAD Pro','Advanced',360,'not','Enough to model and, more importantly, to question the output.',1],
  ['Concrete mix design walkthrough','NPTEL','video','Concrete technology','Intermediate',95,'not','Clear lecture series with Indian codes and materials.',0],
  ['Method statement templates','Various','notes','Safety (HSE)','Beginner',30,'not','Five real templates you can adapt for your own pours.',0],
  ['Your notes — Tower B slab cycle','You','notes','Site supervision','Intermediate',18,'done','Your own record of cutting the slab cycle from 12 days to 9.',0],
  ['FIDIC in plain language','Various','article','Contracts and claims','Intermediate',60,'not','Read before the billing week; the vocabulary is half the battle.',0],
  ['Total station survey practice','NPTEL','video','Surveying','Intermediate',70,'not','Refresher with setting-out exercises you can repeat on site.',0],
  ['Prepare a full BOQ for a G+3','SkillGap','project','BOQ and quantity surveying','Intermediate',480,'not','Week 1 milestone and the single best portfolio piece for this route.',0]],
 projects:[
  ['BOQ for a G+3 residential building','Intermediate','10–12 h',40,'Full take-off from a real drawing set, measured to IS 1200, with an abstract and a rate-analysed cost.','AutoCAD|IS codes','Quantity surveying|Measurement|Estimation','AutoCAD|Excel'],
  ['200-activity construction schedule','Advanced','9 h',0,'WBS, sequencing, critical path and resource levelling for a single tower, baselined and then updated with real progress.','Project scheduling','Primavera|Critical path|Resource levelling','Primavera|MSP'],
  ['STAAD model of a G+3 frame','Advanced','10 h',0,'Model, load to IS 875, run combinations, and hand-check two critical members against the output.','Structural analysis','STAAD|Load combinations|Verification','STAAD Pro|Excel'],
  ['Revit model with schedules','Advanced','12 h',0,'Two-storey structure modelled in Revit with sheets, quantity schedules and one clash check against services.','AutoCAD','Revit|BIM|Coordination','Revit|Navisworks'],
  ['Quality control pack for slab pours','Beginner','5 h',0,'Pre-pour checklist, cube testing register, curing schedule and a worked non-conformance report.','Concrete technology','QC systems|Documentation|IS 456','Excel|Word'],
  ['Slab cycle improvement, Tower B','Intermediate','6 h',100,'Finished in June. Cut the slab cycle from twelve days to nine by resequencing shuttering and rebar.','Site supervision','Planning|Sequencing|Measurement','Excel|MSP']],
 jd:{co:'L&T Construction',title:'Project Engineer — Buildings',loc:'Pune · Site-based',exp:'3–5 years',
  text:`Project Engineer — Buildings, L&T Construction (Pune)

About the role
Run execution for one tower of a residential development, from setting out to handover, working under the project manager.

Responsibilities
- Plan and execute structural and finishing works to programme
- Prepare and certify quantities, RA bills and subcontractor measurements
- Maintain quality records against IS codes and the project QAP
- Update the Primavera schedule weekly and report slippage
- Enforce HSE procedures and run toolbox talks
- Coordinate with consultants on drawings and RFIs

Requirements
- 3–5 years site experience on building projects
- Strong AutoCAD and drawing interpretation
- Hands-on quantity take-off and BOQ preparation
- Working knowledge of Primavera P6 or MS Project
- Sound understanding of IS 456, IS 800 and IS 1200
- B.E. or B.Tech in Civil Engineering

Nice to have
- Revit or BIM coordination exposure
- STAAD Pro
- Experience with RA bills and variation orders`,
  req:[['AutoCAD',1],['Site supervision',1],['Concrete technology',1],['IS codes',1],['Surveying',1],['B.E. Civil',1],['BOQ preparation',0],['Primavera / MSP',0],['RA billing',0]],
  pref:[['Quality control',1],['Revit / BIM',0],['STAAD Pro',0],['Variation orders',0]],
  tools:['AutoCAD','Primavera P6','MS Project','Revit','STAAD Pro','Excel','Navisworks'],
  resp:[['Plan and execute works to programme',90],['Quantities, RA bills and measurements',78],['Quality records against IS codes',66],['Weekly schedule updates and slippage',58],['HSE procedures and toolbox talks',46],['Consultant coordination and RFIs',38]],
  reqs:[['y','3–5 years site experience','You have 2 years on two towers'],['g','B.E. Civil Engineering','COEP Pune, 2024'],['r','Primavera or MS Project','No scheduling software on your profile']],
  kwGrid:[['Primavera',5,'missing'],['BOQ',4,'partial'],['RA bill',4,'missing'],['IS 456',3,'present'],['AutoCAD',3,'present'],['quality',3,'partial'],['BIM',2,'missing'],['HSE',2,'present']]},
 kw:[['Primavera P6','68%','Skills, once week 3 is done','+9','r'],
  ['BOQ and take-off','84%','You do this informally. Name it properly.','+8','y'],
  ['RA billing','61%','After the contracts week','+7','r'],
  ['IS 1200','47%','Skills, alongside IS 456','+5','r'],
  ['Revit / BIM','61%','Only after the Revit project','+5','r'],
  ['quality assurance plan','58%','Rewrite your quality bullet to name the QAP','+4','y'],
  ['setting out','54%','You do it weekly and never mention it','+3','y'],
  ['variation order','39%','After the contracts week','+2','r']],
 kwGroups:[['Drawings & design',62],['Execution',84],['Quantities',46],['Planning',24],['Quality & safety',58]],
 match:{pct:58,verdict:'Solid on site, missing the office half of the job',
  note:'Two years of real execution experience is worth a lot here. The gap is everything that happens in the site office: scheduling software, formal quantities and billing.',
  cats:[['Drawings & design',65],['Execution',86],['Quantities',48],['Planning',25],['Quality & safety',60]],
  matching:['AutoCAD','Site supervision','Concrete works','Setting out','IS 456','Bar bending schedules','Labour coordination','B.E. Civil'],
  partial:[['Quantities','You check quantities; you have never prepared a BOQ end to end.',48],['Quality','You run checks; the records are someone else\u2019s.',55],['Drawings','Strong at reading, no 3D or BIM.',60],['Experience length','2 years against 3–5.',65]],
  missing:[['Primavera P6','−9','Required · week 3 of your plan'],['BOQ preparation','−8','Required · week 1'],['RA billing','−7','Required · week 7'],['Revit / BIM','−5','Preferred · week 6'],['STAAD Pro','−3','Preferred · week 5']],
  fixes:[['+8%','Say how much you built, not what you supervised','Built-up area, number of floors, concrete volume. None of it is on the page.'],
   ['+6%','Claim the quantity work you already do','Checking a subcontractor bill is measurement experience. Say so accurately.'],
   ['+5%','Add the slab cycle improvement','Twelve days to nine is the strongest evidence you have.'],
   ['+3%','List the IS codes you work to','It is a keyword filter and a credibility signal at once.']]},
 an:{score:61,ats:79,cover:43,head:'Reads like a site diary, not a project engineer',
  sub:'Everything is described as supervision. The page never says how big the job was, what it cost, or how fast it went.',
  weak:[['Experience · Sankalp Infra','Responsible for supervising RCC works at site.','Supervised RCC works for two towers totalling 1.8 lakh sq ft, covering 42 slab pours with no rejected cube batch.'],
   ['Experience · Sankalp Infra','Checking of contractor bills and measurements.','Verified subcontractor measurements against IS 1200 for ₹4.2 crore of RCC and masonry work, recovering ₹11 lakh of over-claim.'],
   ['Experience · Sankalp Infra','Worked on improving slab cycle time.','Resequenced shuttering and rebar to cut the Tower B slab cycle from twelve days to nine, pulling the structure four weeks ahead.']],
  missing:[['r','Software and tools','AutoCAD is mentioned once, in passing'],['r','Project scale','No area, value or floor count anywhere'],['y','Codes and standards','IS 456 and IS 1200 never named']],
  fmt:[['y','Dense paragraphs per project','Convert to bullets with numbers'],['g','Single column, clean','No parsing problems'],['y','Skills as a comma sentence','List them as a block']],
  found:['Site supervision','RCC','AutoCAD','Concrete','Surveying','Labour coordination'],
  absent:['Primavera','BOQ','RA bill','Revit','STAAD Pro','IS 1200'],
  recs:[['+9','Add scale to every project line','Area, value, floors — the first thing a PM looks for'],['+7','Add a software and codes block','Right now filters cannot see AutoCAD at all'],['+6','Lead with the slab cycle result','It is measurable, unusual and yours'],['+4','Name the measurement work properly','Bill verification is quantity surveying experience']]},
 resume:{title:'Civil / Site Engineer',skillsA:'Site execution, RCC works, Quantity take-off, Quality control, Setting out',skillsB:'AutoCAD, Excel, MS Project (learning), STAAD Pro (basic), IS 456, IS 1200',
  job1:'Junior Site Engineer',co1:'Sankalp Infra',d1:'Aug 2024 – Present',l1:'Pune',
  b1:'Supervised RCC works for two towers totalling 1.8 lakh sq ft, covering 42 slab pours with no rejected cube batch.\nVerified subcontractor measurements against IS 1200 for ₹4.2 crore of RCC and masonry work, recovering ₹11 lakh of over-claim.\nResequenced shuttering and rebar to cut the Tower B slab cycle from twelve days to nine.',
  job2:'Graduate Engineer Trainee',co2:'Sankalp Infra',d2:'Jul 2023 – Jul 2024',l2:'Pune',
  b2:'Carried out setting out and level checks with a total station for foundation and plinth work.\nMaintained the daily progress report and pour cards for the structural team.',
  p1:'BOQ for a G+3 residential building',p1d:'Full take-off from drawings measured to IS 1200, with abstract and rate-analysed cost.',
  p2:'Slab cycle improvement — Tower B',p2d:'Resequenced activities and re-planned shuttering to save three days per floor across eleven floors.',
  certs:'Primavera P6 fundamentals, in progress\nSafety awareness course, National Safety Council (2024)',
  ach:'Best final-year project, COEP 2023 — precast connection study\nLed the college concrete cube competition team, third nationally',
  degree:'B.E., Civil Engineering',school:'College of Engineering, Pune',eduYears:'2019 – 2023',grade:'CGPA 7.9 / 10'},
 activity:[['g','Finished the G+3 slab take-off','Yesterday · 1 h 30 m'],
  ['y','Started IS 1200 measurement rules','3 days ago · half done'],
  ['b','Matched against L&T Project Engineer','Last week · 58% match'],
  ['g','Wrote up the Tower B slab cycle','Last week'],
  ['b','Resume analysed — ATS 79','2 weeks ago']],
 today:'Finish the BOQ abstract for the G+3',todaySub:'About an hour. Once the abstract is done the whole take-off becomes a portfolio piece.'},

/* ---------------- 8. MECHANICAL DESIGN ENGINEER ---------------- */
'mech':{name:'Mechanical Design Engineer',track:'Core engineering',icon:'i-gear2',level:'Junior to mid',
 blurb:'CAD, GD&T, simulation and design for manufacture.',
 posts:88,score:51,hrs:6,weeksLeft:9,finish:'30 December',streak:5,hours:47,doneRes:19,totalRes:74,
 persona:{first:'Anjali',last:'Verma',ini:'AV',edu:'B.Tech Mechanical Engineering, NIT Bhopal',cur:'Graduate Engineer — Production',co:'Sterling Auto Components',loc:'Pune',exp:'1 yr 9 mo',
  email:'anjali.verma@gmail.com',phone:'+91 88062 45190',links:'linkedin.com/in/anjaliverma · grabcad.com/anjali.v',
  summary:'Production engineer at a tier-two auto component supplier, moving towards design. Comfortable with drawings and shop-floor reality; building the CAD depth, tolerancing and simulation that design roles are hired on.'},
 skills:[['AutoCAD',70,75],['Technical drawing',66,85],['SolidWorks',62,88],['Thermodynamics',58,70],['Materials',55,78],
  ['Manufacturing processes',50,85],['Prototyping',45,70],['GD&T',40,85],['DFM / DFA',35,80],['Tolerance stack-up',32,75],
  ['FEA (Ansys)',30,75],['BOM and PLM',28,70],['Project documentation',50,70],['CATIA',20,60]],
 roadmap:[
  ['SolidWorks beyond the basics','Intermediate','8 h','None','SolidWorks|Modelling|Assemblies','Parametric modelling with intent, proper assemblies, mates that do not break, and drawings that a shop can build from without calling you.','SolidWorks essentials|Design intent guide|Ten modelling exercises','Essentials refresher|Model ten parts with intent|Build a 20-part assembly|Produce a full drawing set',4],
  ['GD&T that means something','Advanced','8 h','SolidWorks beyond the basics','GD&T|Datums|Inspection','Datums, feature control frames and why a drawing without GD&T is an argument waiting to happen with your supplier.','ASME Y14.5 essentials|GD&T fundamentals course|Drawing critique set','Y14.5 essentials|Apply GD&T to five drawings|Define datum schemes|Critique ten supplier drawings',3],
  ['Manufacturing, from the floor','Intermediate','6 h','None','Manufacturing|Processes|Cost','Casting, machining, sheet metal, injection moulding — what each does to your design, and what each costs. You have the advantage of already standing next to the machines.','Manufacturing processes primer|Process selection guide|Shop-floor observation log','Process primer|Observe five processes at work|Cost three parts by process|Write a selection guide',2],
  ['Design for manufacture','Advanced','7 h','Manufacturing, from the floor','DFM|DFA|Cost reduction','Draft angles, wall thickness, tool access, part count reduction. The discipline that turns a designer into one worth hiring.','DFM guidelines by process|DFA methodology|Two redesign case studies','DFM guidelines|Redesign a part for casting|Reduce an assembly by three parts|Quantify the saving',1],
  ['Tolerance stack-up','Advanced','6 h','GD&T that means something','Stack-up|Statistics|Fits','Worst case and RSS stack-ups, and the arithmetic that decides whether an assembly fits before you cut steel.','Stack-up methods guide|Worked examples|Practice set','Learn both methods|Stack up a three-part assembly|Compare worst case and RSS|Set tolerances on a real part',0],
  ['FEA you can defend','Advanced','9 h','SolidWorks beyond the basics','Ansys|FEA|Validation','Meshing, boundary conditions, convergence and hand-calculation checks. An unchecked simulation result is worth less than nothing.','Ansys fundamentals|Meshing and convergence|Hand-check exercises','Ansys fundamentals|Run a static structural study|Check convergence|Verify against hand calculation',0],
  ['Drawings, BOM and PLM','Intermediate','5 h','GD&T that means something','Drawings|BOM|Revision control','Title blocks, revision control, BOM structure and change notes. The unglamorous discipline that separates a design office from a folder of files.','Drawing standards guide|BOM structuring|ECN process walkthrough','Drawing standards|Structure a three-level BOM|Write two change notes|Set up a revision scheme',0],
  ['Portfolio and interviews','Intermediate','6 h','Design for manufacture','Portfolio|Interviews|Presentation','A GrabCAD portfolio with models, drawings and a redesign case, plus practice for the design-review style interview these roles use.','Portfolio examples|Design interview bank|Presentation template','Publish four models with drawings|Write the redesign case|50 technical questions|Two mock design reviews',0]],
 lib:[
  ['SolidWorks essentials','Dassault','course','SolidWorks','Intermediate',420,'progress','Design intent is the part most self-taught users skip. Two thirds done.',1],
  ['GD&T fundamentals (ASME Y14.5)','ASME','course','GD&T','Advanced',360,'not','Named in 77% of the design postings you saved. Largest single gap.',1],
  ['Ansys static structural fundamentals','Ansys Learning','course','FEA (Ansys)','Advanced',300,'not','Free official course with a student licence. Start after week 1.',1],
  ['DFM guidelines by process','Protolabs','docs','DFM / DFA','Intermediate',90,'not','Practical, per-process rules you can apply at Sterling tomorrow.',1],
  ['Tolerance stack-up methods','Various','article','Tolerance stack-up','Advanced',120,'not','Worst case versus RSS, with the arithmetic worked through.',1],
  ['Manufacturing processes primer','NPTEL','video','Manufacturing processes','Intermediate',240,'not','You already see these running. This names what you are watching.',1],
  ['Drawing standards and title blocks','Various','notes','Technical drawing','Beginner',40,'not','Short, and it fixes the most common reason drawings get returned.',0],
  ['Your notes — fixture redesign','You','notes','Prototyping','Intermediate',15,'done','From the July fixture job. Reuse it as a portfolio case.',0],
  ['Materials selection charts','Ashby','article','Materials','Intermediate',110,'not','The Ashby approach, useful whenever someone asks why this alloy.',0],
  ['CATIA V5 basics','Dassault','course','CATIA','Beginner',300,'not','Only worth it if you target the large OEM suppliers who standardised on it.',0],
  ['Reading a supplier drawing critically','Various','video','GD&T','Intermediate',55,'not','Ten real drawings picked apart. Good practice before week 2.',0],
  ['Redesign a part for casting','SkillGap','project','DFM / DFA','Advanced',420,'not','Week 4 milestone and the clearest evidence of design judgement.',0]],
 projects:[
  ['Ten-part model and drawing set','Intermediate','10 h',60,'Ten parts modelled with proper design intent, fully dimensioned drawings, and a supplier who could quote from them.','SolidWorks','Modelling|Design intent|Drawings','SolidWorks'],
  ['GD&T applied to a real assembly','Advanced','8 h',0,'Take an existing Sterling drawing, define the datum scheme properly and apply feature control frames.','GD&T|Technical drawing','GD&T|Datums|Inspection','SolidWorks|Excel'],
  ['Redesign a part for casting','Advanced','9 h',0,'Take a machined part, redesign it for casting with proper draft and wall thickness, and quantify the cost saving.','Manufacturing processes','DFM|Casting|Cost analysis','SolidWorks|Excel'],
  ['FEA study with hand verification','Advanced','10 h',0,'Static structural study on a bracket, convergence checked, and the result verified against a hand calculation.','SolidWorks','FEA|Meshing|Validation','Ansys|Excel'],
  ['Three-level BOM and ECN pack','Beginner','5 h',0,'Structure a BOM for a 30-part assembly and write two engineering change notes against it.','Technical drawing','BOM|Revision control|Documentation','Excel|SolidWorks'],
  ['Assembly fixture redesign','Intermediate','7 h',100,'Finished in July. Redesigned a welding fixture, cutting setup time per batch from eighteen minutes to seven.','Prototyping','Fixture design|Cycle time|Shop liaison','SolidWorks|AutoCAD']],
 jd:{co:'Tata Motors',title:'Design Engineer — Body in White',loc:'Pune · On-site',exp:'2–4 years',
  text:`Design Engineer — Body in White, Tata Motors (Pune)

About the role
Design and release sheet metal components for body structures, working with simulation, manufacturing and supplier teams.

Responsibilities
- Model and release sheet metal parts and sub-assemblies
- Apply GD&T and define datum schemes for inspection
- Run tolerance stack-ups on mating assemblies
- Work with CAE on structural and crash load cases
- Support DFM reviews with press shop and suppliers
- Maintain BOM, drawings and engineering change records

Requirements
- 2–4 years in mechanical or automotive design
- Strong CATIA V5 or SolidWorks
- Sound GD&T per ASME Y14.5 or ISO GPS
- Understanding of sheet metal processes and DFM
- Tolerance stack-up experience
- B.E. or B.Tech Mechanical

Nice to have
- Ansys or Hypermesh exposure
- PLM systems (Teamcenter, Windchill)
- Automotive supplier experience`,
  req:[['SolidWorks',1],['Technical drawing',1],['AutoCAD',1],['B.Tech Mechanical',1],['Sheet metal processes',0],['GD&T',0],['Tolerance stack-up',0],['DFM',0],['CATIA',0]],
  pref:[['Manufacturing exposure',1],['Ansys',0],['Hypermesh',0],['Teamcenter',0],['Automotive experience',1]],
  tools:['CATIA V5','SolidWorks','Ansys','Hypermesh','Teamcenter','Windchill','AutoCAD'],
  resp:[['Model and release sheet metal parts',90],['Apply GD&T and datum schemes',80],['Tolerance stack-ups',68],['Work with CAE on load cases',54],['DFM reviews with press shop',48],['BOM, drawings and change records',36]],
  reqs:[['y','2–4 years design experience','1 year 9 months, in production rather than design'],['g','B.Tech Mechanical','NIT Bhopal, 2024'],['r','CATIA V5','SolidWorks only; CATIA is week 8 at the earliest']],
  kwGrid:[['GD&T',6,'missing'],['CATIA',5,'missing'],['stack-up',4,'missing'],['sheet metal',4,'partial'],['DFM',3,'missing'],['SolidWorks',3,'present'],['BOM',2,'partial'],['Ansys',2,'missing']]},
 kw:[['GD&T','77%','Skills, once week 2 is done','+10','r'],
  ['tolerance stack-up','63%','After the stack-up week','+8','r'],
  ['DFM','71%','You already argue this on the floor. Name it.','+7','y'],
  ['sheet metal','58%','Rewrite your production bullets to name the processes','+6','y'],
  ['CATIA V5','54%','Only if you target the large OEM suppliers','+5','r'],
  ['FEA / Ansys','49%','After the verified FEA study','+5','r'],
  ['design intent','44%','Once the ten-part set is published','+3','r'],
  ['ECN / change control','38%','After the BOM project','+2','r']],
 kwGroups:[['CAD',66],['Tolerancing',26],['Manufacturing',58],['Simulation',24],['Documentation',48]],
 match:{pct:53,verdict:'A production engineer with the best possible reason to be hired into design',
  note:'Standing next to the presses for two years is an advantage almost no design candidate has. You have to show it as design judgement rather than shift work, and GD&T is non-negotiable.',
  cats:[['CAD',68],['Tolerancing',28],['Manufacturing',62],['Simulation',26],['Documentation',50]],
  matching:['SolidWorks','AutoCAD','Technical drawing','Manufacturing processes','Materials','Shop-floor liaison','Prototyping','B.Tech Mechanical'],
  partial:[['Sheet metal','You see it daily; you have not designed for it.',55],['BOM work','You consume BOMs, you do not author them.',40],['Design experience','Fixtures and tooling, not released parts.',48],['CAD depth','Competent modelling, no released drawing set.',60]],
  missing:[['GD&T','−10','Required · week 2 of your plan'],['Tolerance stack-up','−8','Required · week 5'],['DFM discipline','−6','Required · week 4'],['CATIA V5','−5','Required · not yet scheduled'],['Ansys','−4','Preferred · week 6']],
  fixes:[['+8%','Lead with the fixture redesign','It is design work you already did. Right now it is one line at the bottom.'],
   ['+6%','Name the processes you work next to','Press shop, welding, machining. It is the reason to hire you over a pure CAD candidate.'],
   ['+5%','Add a GrabCAD link once the ten-part set is up','Design hiring looks at models before resumes.'],
   ['+3%','Put SolidWorks in the first three lines','It is currently in the last section.']]},
 an:{score:58,ats:77,cover:41,head:'Production work described in production language',
  sub:'The experience is more relevant than it looks on the page. Nothing here is framed as design, and the one real design job you did is a single line.',
  weak:[['Experience · Sterling Auto','Responsible for daily production of machined components.','Ran a 12-machine cell producing 4,200 components a day, holding scrap below 1.4% across three shifts.'],
   ['Experience · Sterling Auto','Worked on a fixture for the welding line.','Redesigned a welding fixture in SolidWorks, cutting setup time per batch from eighteen minutes to seven.'],
   ['Experience · Sterling Auto','Coordinated with quality for inspection issues.','Resolved 23 dimensional non-conformances with the quality team, tracing nine to an ambiguous datum on the supplier drawing.']],
  missing:[['r','Design projects section','Your fixture work and models are nearly invisible'],['r','CAD portfolio link','GrabCAD profile exists and is not linked'],['y','Software block','SolidWorks and AutoCAD buried in prose']],
  fmt:[['y','Skills split across two places','Consolidate into one block'],['g','Single page, clean','No parsing issues'],['y','Education below experience','With under two years, put it higher']],
  found:['SolidWorks','AutoCAD','Production','Machining','Quality','Fixtures'],
  absent:['GD&T','Tolerance stack-up','DFM','Ansys','CATIA','Sheet metal design'],
  recs:[['+9','Move the fixture redesign to the top as design work','It is the only design evidence you have and it is good'],['+7','Add the GrabCAD link','Design hiring looks at models first'],['+6','Add a software and standards block','GD&T once week 2 is done'],['+4','Frame shop-floor time as manufacturing knowledge','It is an advantage, not a detour']]},
 resume:{title:'Mechanical Design Engineer',skillsA:'SolidWorks, AutoCAD, Technical drawing, GD&T (learning), Prototyping',skillsB:'Manufacturing processes, Materials selection, Ansys (basic), Excel, MS Project',
  job1:'Graduate Engineer — Production',co1:'Sterling Auto Components',d1:'Jan 2025 – Present',l1:'Pune',
  b1:'Redesigned a welding fixture in SolidWorks, cutting setup time per batch from eighteen minutes to seven.\nRan a 12-machine cell producing 4,200 components a day, holding scrap below 1.4% across three shifts.\nResolved 23 dimensional non-conformances, tracing nine to an ambiguous datum on the supplier drawing.',
  job2:'Engineering Intern',co2:'Sterling Auto Components',d2:'Jan 2024 – Jun 2024',l2:'Pune',
  b2:'Modelled and detailed eight jigs for the machining line, four of which went into production.\nBuilt the cycle-time study that justified a second deburring station.',
  p1:'Welding fixture redesign — SolidWorks',p1d:'Reduced clamping steps from six to three and setup time by 61%, verified over four production batches.',
  p2:'Ten-part model and drawing set',p2d:'Parts modelled with explicit design intent and fully detailed drawings a supplier could quote from.',
  certs:'SolidWorks Associate (CSWA), 2024\nGD&T per ASME Y14.5, in progress',
  ach:'SAE Baja team, NIT Bhopal — suspension sub-team, 2022 and 2023\nBest technical paper, department symposium 2023',
  degree:'B.Tech, Mechanical Engineering',school:'NIT Bhopal',eduYears:'2020 – 2024',grade:'CGPA 8.1 / 10'},
 activity:[['g','Finished four SolidWorks modelling exercises','Yesterday · 1 h'],
  ['y','Started ASME Y14.5 essentials','3 days ago'],
  ['g','Published the fixture redesign to GrabCAD','Last week'],
  ['b','Matched against Tata Motors BIW Design','Last week · 53% match'],
  ['b','Resume analysed — ATS 77','2 weeks ago']],
 today:'Model three parts with explicit design intent',todaySub:'About an hour each. Six of ten done for the portfolio set.'}
};

/* ================= helpers ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const cv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const charts={};
let RK='backend', R=null, RM=[], SK=[];

function toast(t,m){
  const el=document.createElement('div'); el.className='toast';
  el.innerHTML='<div><b></b><span></span></div>';
  el.querySelector('b').textContent=t; el.querySelector('span').textContent=m||'';
  $('#toasts').appendChild(el);
  setTimeout(()=>{el.style.transition='.25s';el.style.opacity='0';setTimeout(()=>el.remove(),260)},3500);
}
function openModal(id){$('#'+id).classList.add('open')}
function closeModal(id){$('#'+id).classList.remove('open')}
function bgClose(e){if(e.target.classList.contains('overlay'))e.target.classList.remove('open')}
function toggleMenu(id){const m=$('#'+id),was=m.classList.contains('open');$$('.menu').forEach(x=>x.classList.remove('open'));if(!was)m.classList.add('open');event.stopPropagation()}
document.addEventListener('click',()=>$$('.menu').forEach(m=>m.classList.remove('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.overlay.open').forEach(o=>o.classList.remove('open'));$$('.menu').forEach(m=>m.classList.remove('open'));document.body.classList.remove('nav-open')}});
function flip(b){b.setAttribute('aria-checked',b.getAttribute('aria-checked')!=='true')}
function chipRow(el){[...el.parentElement.children].forEach(c=>c.classList.remove('on'));el.classList.add('on')}
function acc(h){h.parentElement.classList.toggle('open')}
function toggleGrid(b){$('.page-wrap').style.backgroundImage=b.getAttribute('aria-checked')==='true'?'':'none'}
const ICO={video:'i-play',course:'i-book',docs:'i-file',article:'i-msg',practice:'i-code',notes:'i-edit',project:'i-layers'};
const TYPEN={video:'Video',course:'Course',docs:'Documentation',article:'Reading',practice:'Practice',notes:'Your notes',project:'Project'};
function dur(m){return m<60?m+' min':(m/60).toFixed(m%60?1:0)+' h'}
function band(s){return s.have>=s.need?'strong':(s.need-s.have)<=25?'moderate':'critical'}
function bcls(b){return b==='strong'?'g':b==='moderate'?'y':'r'}
function gauge(p,label,size){
  size=size||128;const r=(size/2)-8,c=2*Math.PI*r;
  return `<div class="gauge" style="width:${size}px;height:${size}px">
   <svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--sand-2)" stroke-width="10"/>
   <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--green)" stroke-width="10" stroke-linecap="butt"
     stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p/100)}"/></svg>
   <div class="gv"><div><b>${p}</b><span>${label}</span></div></div></div>`;
}

/* ================= theme / routing ================= */
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  $('#thLight')&&$('#thLight').classList.toggle('on',t==='light');
  $('#thDark')&&$('#thDark').classList.toggle('on',t==='dark');
  $('#themeBtn').innerHTML=`<svg><use href="#i-${t==='dark'?'sun':'moon'}"/></svg>`;
  Object.keys(charts).forEach(k=>{charts[k].destroy();delete charts[k]});
  const cur=$('.page.active'); if(cur)chartsFor(cur.id.slice(2));
}
function toggleTheme(){setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')}
function go(id){
  $$('.page').forEach(p=>p.classList.toggle('active',p.id==='p-'+id));
  $$('.nav-i[data-go]').forEach(n=>n.classList.toggle('active',n.dataset.go===id));
  document.body.classList.remove('nav-open'); window.scrollTo(0,0); chartsFor(id);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});
function showLanding(){document.body.classList.remove('in-app');$$('.mkview').forEach(v=>v.style.display='none');$('#v-landing').style.display='';window.scrollTo(0,0)}
function showAuth(w){document.body.classList.remove('in-app');$$('.mkview').forEach(v=>v.style.display='none');$('#v-'+w).style.display='';window.scrollTo(0,0)}

/* ================= role picker ================= */
let pickKey='backend', pickThenEnter=true;

const API_BASE_URL = "http://127.0.0.1:8000";

async function openRolePicker(enter) {
    pickThenEnter = enter !== false;
    pickKey = RK;

    document.body.classList.remove("in-app");
    $$(".mkview").forEach(v => v.style.display = "none");
    $("#v-role").style.display = "";
    window.scrollTo(0, 0);

    const picker = $("#rolePicker");
    picker.innerHTML =
        '<p class="muted">Loading job roles...</p>';

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/catalog`
        );

        if (!response.ok) {
            throw new Error(
                `Backend returned status ${response.status}`
            );
        }

        const catalog = await response.json();
        const tracks = catalog.tracks;
        const roles = catalog.roles;

        picker.innerHTML = tracks.map(track => `
            <div style="margin-bottom:20px">
                <div class="row"
                     style="gap:9px;margin-bottom:10px;
                     border-bottom:1.5px solid var(--rule);
                     padding-bottom:7px">

                    <span class="ico-sq">
                        <svg>
                            <use href="#${track.i}"></use>
                        </svg>
                    </span>

                    <div>
                        <b style="font-family:var(--font-d);
                                  font-size:15px">
                            ${track.k}
                        </b>
                        <div class="muted" style="font-size:12.5px">
                            ${track.d}
                        </div>
                    </div>
                </div>

                <div class="rolegrid">
                    ${roles
                        .filter(role => role.track === track.k)
                        .map(role => `
                            <button
                                class="rolecard ${
                                    role.key === pickKey ? "on" : ""
                                }"
                                data-rk="${role.key}"
                                onclick="pickRole('${role.key}')">

                                <b>${role.name}</b>
                                <small>${role.blurb}</small>

                                <div class="row"
                                     style="gap:6px;margin-top:9px">
                                    <span class="tag">${role.level}</span>
                                    <span class="tag">${role.level}</span>
                                </div>
                            </button>
                        `).join("")}
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Failed to load job roles:", error);

        picker.innerHTML = `
            <div class="track-card">
                <h3>Couldn't load job roles</h3>
                <p class="muted">
                    Check that the FastAPI server is running,
                    then refresh this page.
                </p>
            </div>
        `;
    }
}
function pickRole(k){pickKey=k;$$('.rolecard').forEach(c=>c.classList.toggle('on',c.dataset.rk===k))}

function confirmRole() {
  if (!pickKey || !ROLES[pickKey]) {
    console.error("Invalid role selected:", pickKey);
    alert("Please select a job role first.");
    return;
  }

  const selectedRole = pickKey;
  const changed = selectedRole !== RK;

  try {
    RK = selectedRole;
    loadRole();
  } catch (error) {
    console.error("Error loading the selected role:", error);
    alert("There was a problem building your notebook. Press F12 and check Console.");
    return;
  }

  document.body.classList.add("in-app");
  go("dashboard");

  toast(
    changed ? "Notebook rebuilt" : "Welcome back",
    changed
      ? `Everything is now scored against ${R.name}.`
      : `Picking up your ${R.name} plan.`
  );
}

function switchRole(k){RK=k;loadRole();go($('.page.active').id.slice(2));toast('Role changed',`Scored against ${R.name} postings now.`)}
function switchRoleFromGap(){switchRole($('#gapRole').value)}

/* ================= load a role ================= */
function loadRole(){
  R=ROLES[RK];
  SK=R.skills.map(s=>({n:s[0],have:s[1],need:s[2]}));
  RM=R.roadmap.map(m=>({t:m[0],diff:m[1],h:m[2],pre:m[3],skills:m[4].split('|'),d:m[5],res:m[6].split('|'),
    tasks:m[7].split('|').map((t,i)=>({t,done:i<m[8]}))}));
  const p=R.persona;
  $('#sbIni').textContent=p.ini; $('#tbIni').textContent=p.ini; $('#sbName').textContent=p.first+' '+p.last;
  $('#roleChip').querySelector('span').textContent=R.name;
  const nowIdx=RM.findIndex(m=>m.tasks.some(t=>!t.done));
  $('#sbWeek').textContent='W'+((nowIdx<0?RM.length:nowIdx+1));
  $('#gapRole').innerHTML=Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${k===RK?'selected':''}>${r.name}</option>`).join('');
  $('#setRole').innerHTML=$('#gapRole').innerHTML;
  $('#setLoc').value=p.loc+', Remote';
  renderAll();
}
function renderAll(){
  renderDash(); renderProfile(); buildForm(); renderResume(); renderSaved(); renderMyResumes();
  renderJD(); renderKw(); renderMatch(); renderGap(); renderRoadmap(); renderStudy(); renderProjects();
  renderProgressBody(); renderSettings(); renderBell(); renderCoachQs();
}

/* ================= dashboard ================= */
function counts(){const c={strong:0,moderate:0,critical:0};SK.forEach(s=>c[band(s)]++);return c}
function renderDash(){
  const p=R.persona,c=counts(),done=RM.filter(m=>m.tasks.every(t=>t.done)).length;
  const nowIdx=RM.findIndex(m=>m.tasks.some(t=>!t.done));
  const pct=rmPct();
  $('#dashHi').textContent='Good evening, '+p.first;
  $('#dashSub').textContent=`Week ${nowIdx+1} of ${RM.length} on the ${R.name} plan. ${c.critical} critical gap${c.critical===1?'':'s'} left before you are at the hiring bar.`;
  $('#dashCont').textContent='Continue week '+(nowIdx+1);
  const areas=SK.slice().sort((a,b)=>(b.need-b.have)-(a.need-a.have));
  const top=areas.slice(0,2), best=areas.slice(-3).reverse();
  $('#dashBody').innerHTML=`
  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="card lift pad">
      <div class="between wrap" style="gap:22px">
        <div class="row" style="gap:20px">
          ${gauge(R.score,'readiness')}
          <div>
            <div class="eyebrow">Aiming at</div>
            <div style="font-family:var(--font-d);font-size:20px;font-weight:700;margin:3px 0 9px">${R.name} · ${R.level.toLowerCase()}</div>
            <div class="row wrap" style="gap:6px">
              <span class="tag g"><i class="dot"></i>${c.strong} strong</span>
              <span class="tag y"><i class="dot"></i>${c.moderate} moderate</span>
              <span class="tag r"><i class="dot"></i>${c.critical} critical</span></div>
            <p class="muted" style="font-size:13px;margin-top:10px;max-width:42ch">Closing <b style="color:var(--ink)">${top[0].n}</b> alone is worth roughly +${Math.round((top[0].need-top[0].have)/5)} points.</p>
          </div>
        </div>
        <div style="min-width:180px;flex:1">
          <div class="eyebrow" style="margin-bottom:8px">Biggest gaps right now</div>
          <div class="stack" style="gap:10px">
            ${top.concat(best.slice(0,2)).map(s=>{const b=band(s);return `<div>
              <div class="between" style="font-size:12.5px;font-weight:600"><span>${s.n}</span><span class="muted">${s.have} / ${s.need}</span></div>
              <div class="bar thin ${bcls(b)==='g'?'':bcls(b)==='y'?'y':'r'}" style="margin-top:4px"><i style="width:${s.have}%"></i></div></div>`}).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="stack">
      <div class="card ink pad" style="background:var(--mark-soft);border-left:5px solid var(--mark)">
        <div class="eyebrow">Do this next</div>
        <h3 style="font-size:17px;margin:5px 0 6px">${R.today}</h3>
        <p style="font-size:13px;color:var(--ink-2)">${R.todaySub}</p>
        <button class="btn btn-primary btn-sm" style="margin-top:12px" data-go="roadmap">Open the plan</button>
      </div>
      <div class="panel">
        <div class="between"><div><div class="eyebrow">Today's goal</div><div style="font-family:var(--font-d);font-weight:700;font-size:16px;margin-top:2px">45 minutes</div></div><span class="tag y">28 / 45 min</span></div>
        <div class="bar" style="margin-top:11px"><i style="width:62%"></i></div>
        <p class="muted" style="font-size:12.5px;margin-top:8px">17 minutes left to keep the ${R.streak}-day streak.</p>
      </div>
    </div>
  </div>

  <div class="grid g4" style="margin-bottom:16px">
    <div class="kpi"><div class="lbl">Plan progress</div><div class="val">${pct}%</div><div class="sub">Week ${nowIdx+1} of ${RM.length} · ${done} weeks finished</div><div class="bar thin" style="margin-top:10px"><i style="width:${pct}%"></i></div></div>
    <div class="kpi"><div class="lbl">Study streak</div><div class="val">${R.streak} days</div><div class="sub">Longest run so far, 19</div>
      <div class="streak" style="margin-top:10px">${['M','T','W','T','F','S','S'].map((d,i)=>`<i class="${i===6?'today':i<6?'on':''}">${d}</i>`).join('')}</div></div>
    <div class="kpi"><div class="lbl">Hours studied</div><div class="val">${R.hours}</div><div class="sub">${R.hrs} h a week on average</div><div class="bar thin" style="margin-top:10px"><i style="width:${Math.min(100,R.hours)}%"></i></div></div>
    <div class="kpi"><div class="lbl">Resources done</div><div class="val">${R.doneRes}</div><div class="sub">of ${R.totalRes} recommended</div><div class="bar thin" style="margin-top:10px"><i style="width:${Math.round(R.doneRes/R.totalRes*100)}%"></i></div></div>
  </div>

  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="panel"><div class="between ruled"><div><div class="sec-t">Where your skills have moved</div><div class="sec-sub">Self-assessed, checked against project work</div></div></div>
      <div class="chart-box"><canvas id="cGrow"></canvas></div></div>
    <div class="panel"><div class="sec-t ruled">The gap, in one picture</div>
      <div class="chart-box" style="height:224px"><canvas id="cDonut"></canvas></div>
      <button class="btn btn-sm btn-block" style="margin-top:12px" data-go="gap">Open the full report</button></div>
  </div>

  <div class="grid g-1-2">
    <div class="panel"><div class="between ruled"><div class="sec-t">Recently</div><button class="btn btn-quiet btn-sm" data-go="progress">All</button></div>
      ${R.activity.map(a=>`<div class="list-row"><span class="ico-sq ${a[0]}"><svg><use href="#${a[0]==='g'?'i-check':a[0]==='y'?'i-flame':'i-file'}"/></svg></span>
        <div style="min-width:0"><b style="font-size:13.5px">${a[1]}</b><div class="muted" style="font-size:12px">${a[2]}</div></div></div>`).join('')}
    </div>
    <div class="panel"><div class="between ruled"><div><div class="sec-t">What's coming</div><div class="sec-sub">Next four weeks</div></div><button class="btn btn-sm" data-go="roadmap">Open roadmap</button></div>
      ${RM.slice(Math.max(0,nowIdx),nowIdx+4).map((m,i)=>{
        const st=i===0?'Now':i===1?'Next':'Later';
        return `<div class="list-row"><span class="ico-sq ${i===0?'y':''}"><svg><use href="#${i===0?'i-flame':'i-map'}"/></svg></span>
          <div style="flex:1;min-width:0"><b style="font-size:13.5px">Week ${nowIdx+i+1} — ${m.t}</b>
            <div class="muted" style="font-size:12px">${m.h} · ${m.tasks.filter(t=>t.done).length} of ${m.tasks.length} tasks done</div></div>
          <span class="tag ${i===0?'y':''}">${st}</span></div>`}).join('')}
      <div class="note" style="margin-top:12px">At ${R.hrs} hours a week you reach the hiring bar around <b>${R.finish}</b>.</div>
    </div>
  </div>`;
}

/* ================= profile ================= */
function renderProfile(){
  const p=R.persona;
  $('#profBody').innerHTML=`
  <div class="grid g-1-2">
    <div class="stack">
      <div class="card lift pad" style="text-align:center">
        <span class="avatar" style="width:78px;height:78px;font-size:27px;margin:0 auto">${p.ini}</span>
        <h2 style="font-size:20px;margin-top:12px">${p.first} ${p.last}</h2>
        <p class="muted" style="font-size:13.5px">${p.cur} · ${p.loc}</p>
        <div class="row" style="justify-content:center;gap:6px;margin-top:10px"><span class="tag">${p.exp} experience</span><span class="tag g">Open to offers</span></div>
        <div class="row" style="justify-content:space-around;border-top:1.5px solid var(--line);margin-top:16px;padding-top:14px">
          <div><b class="num" style="font-size:18px;display:block">${R.score}</b><span class="muted" style="font-size:11.5px">readiness</span></div>
          <div><b class="num" style="font-size:18px;display:block">${SK.length}</b><span class="muted" style="font-size:11.5px">skills</span></div>
          <div><b class="num" style="font-size:18px;display:block">${R.streak}</b><span class="muted" style="font-size:11.5px">day streak</span></div>
        </div>
      </div>
      <div class="panel"><div class="sec-t ruled">What you want next</div>
        <div class="stack" style="gap:12px">
          <label class="field"><span>Target role</span><select class="inp" onchange="switchRole(this.value)">${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${k===RK?'selected':''}>${r.name}</option>`).join('')}</select></label>
          <label class="field"><span>Work setup</span><select class="inp"><option>Hybrid or on-site</option><option>Remote only</option><option>On-site</option></select></label>
          <label class="field"><span>Locations</span><input class="inp" value="${p.loc}, Remote"></label>
          <label class="field"><span>Notice period</span><select class="inp"><option>30 days</option><option>Immediate</option><option>60 days</option></select></label>
          <div class="between"><div><b style="font-size:13.5px">Visible to recruiters</b><div class="muted" style="font-size:12px">Shows you in role searches</div></div><button class="switch" role="switch" aria-checked="true" onclick="flip(this)"></button></div>
        </div></div>
    </div>
    <div class="stack">
      <div class="panel"><div class="sec-t ruled">Basics</div>
        <div class="f2">
          <label class="field"><span>Full name</span><input class="inp" value="${p.first} ${p.last}"></label>
          <label class="field"><span>Email</span><input class="inp" value="${p.email}"></label>
          <label class="field"><span>Phone</span><input class="inp" value="${p.phone}"></label>
          <label class="field"><span>Location</span><input class="inp" value="${p.loc}"></label>
          <label class="field"><span>Current role</span><input class="inp" value="${p.cur}"></label>
          <label class="field"><span>Employer</span><input class="inp" value="${p.co}"></label>
        </div>
        <label class="field" style="margin-top:11px"><span>In your own words</span><textarea class="inp" rows="3">${p.summary}</textarea></label>
      </div>
      <div class="panel"><div class="sec-t ruled">Education</div>
        <div class="list-row"><span class="ico-sq"><svg><use href="#i-award"/></svg></span>
          <div style="flex:1"><b style="font-size:13.5px">${p.edu}</b><div class="muted" style="font-size:12.5px">${R.resume.eduYears} · ${R.resume.grade}</div></div>
          <button class="btn btn-quiet btn-sm"><svg><use href="#i-edit"/></svg></button></div>
        <div class="list-row"><span class="ico-sq"><svg><use href="#i-book"/></svg></span>
          <div style="flex:1"><b style="font-size:13.5px">Certifications</b><div class="muted" style="font-size:12.5px">${R.resume.certs.split('\n').join(' · ')}</div></div>
          <button class="btn btn-quiet btn-sm"><svg><use href="#i-edit"/></svg></button></div>
      </div>
      <div class="panel">
        <div class="between ruled"><div><div class="sec-t">Skills</div><div class="sec-sub">Drag a level and the gap report follows it</div></div>
          <button class="btn btn-sm" onclick="openModal('mAddSkill')"><svg><use href="#i-plus"/></svg>Add skill</button></div>
        <div id="profSkills"></div>
      </div>
      <div class="panel"><div class="sec-t ruled">How much time you have</div>
        <div class="between" style="font-size:13.5px;font-weight:600"><span>Hours a week</span><span class="tag y" id="hrsOut">${R.hrs} hours</span></div>
        <input type="range" min="1" max="25" value="${R.hrs}" id="hrsRange" style="width:100%;margin-top:9px">
        <p class="muted" style="font-size:12.5px;margin-top:7px" id="hrsNote">At ${R.hrs} hours a week the remaining ${R.weeksLeft} weeks finish around ${R.finish}.</p>
      </div>
    </div>
  </div>`;
  renderProfSkills();
  $('#hrsRange').addEventListener('input',e=>{
    const h=+e.target.value, wks=Math.ceil(R.weeksLeft*R.hrs/h);
    $('#hrsOut').textContent=h+' hour'+(h===1?'':'s');
    $('#hrsNote').textContent=`At ${h} hour${h===1?'':'s'} a week the remaining work takes about ${wks} week${wks===1?'':'s'}.`;
  });
}
function renderProfSkills(){
  $('#profSkills').innerHTML=SK.map((s,i)=>{const b=band(s);return `<div class="skill-row">
    <div><b style="font-size:13.5px">${s.n}</b><div class="muted" style="font-size:12px">${s.have>=s.need?'At or above the bar':(s.need-s.have)+' points short'}</div></div>
    <div class="dual-wrap"><div class="dual"><i style="width:${s.have}%;background:var(--${b==='critical'?'clay':b==='moderate'?'mark':'green'})"></i><u style="left:${s.need}%"></u></div></div>
    <div style="text-align:right"><input type="range" min="0" max="100" value="${s.have}" style="width:60px"
      oninput="SK[${i}].have=+this.value;this.closest('.skill-row').querySelector('.dual i').style.width=this.value+'%'"
      onchange="toast('Level updated','${s.n} set to '+this.value+'.');renderGap();renderDash()"></div></div>`}).join('');
}
function addSkill(){
  const n=$('#newSkillName').value.trim()||'New skill';
  SK.push({n,have:+$('#newSkillLvl').value,need:75});
  renderProfSkills(); renderGap(); closeModal('mAddSkill'); $('#newSkillName').value='';
  toast('Skill added',n+' is now in your gap report.');
}

/* ================= resume builder ================= */
const FIELDS=[
 ['Personal details','i-user',[['name','Full name','i'],['title','Headline','i'],['email','Email','i'],['phone','Phone','i'],['loc','Location','i'],['links','Links','i']],'summary'],
 ['Education','i-award',[['degree','Qualification','i'],['school','Institution','i'],['eduYears','Years','i'],['grade','Result','i']]],
 ['Skills','i-code',[['skillsA','Core skills','i'],['skillsB','Tools and systems','i']]],
 ['Experience','i-case',[['job1','Role','i'],['co1','Employer','i'],['d1','Dates','i'],['l1','Location','i']],'b1',
   [['job2','Role','i'],['co2','Employer','i'],['d2','Dates','i'],['l2','Location','i']],'b2'],
 ['Projects and work samples','i-layers',[['p1','Project one','i'],['p2','Project two','i']]],
 ['Certifications and achievements','i-shield',[]]
];
function buildForm(){
  const d=Object.assign({name:R.persona.first+' '+R.persona.last,email:R.persona.email,phone:R.persona.phone,loc:R.persona.loc,
    links:R.persona.links,summary:R.persona.summary},R.resume);
  const fld=(k,l)=>`<label class="field"><span>${l}</span><input class="inp rs" data-k="${k}" value="${esc(d[k]||'')}"></label>`;
  $('#builderForm').innerHTML=`
  <div class="acc open"><button class="acc-h" onclick="acc(this)"><span class="ico-sq"><svg><use href="#i-user"/></svg></span>Personal details<svg class="caret"><use href="#i-right"/></svg></button>
    <div class="acc-b"><div class="f2">${['name','title','email','phone','loc','links'].map(k=>fld(k,{name:'Full name',title:'Headline',email:'Email',phone:'Phone',loc:'Location',links:'Links'}[k])).join('')}</div>
      <label class="field" style="margin-top:11px"><span class="between" style="display:flex">Summary <button class="ai-btn" onclick="aiFix('summary')"><svg><use href="#i-spark"/></svg>Rewrite</button></span>
        <textarea class="inp rs" data-k="summary" rows="3">${esc(d.summary)}</textarea></label></div></div>

  <div class="acc"><button class="acc-h" onclick="acc(this)"><span class="ico-sq"><svg><use href="#i-award"/></svg></span>Education<svg class="caret"><use href="#i-right"/></svg></button>
    <div class="acc-b"><div class="f2">${fld('degree','Qualification')}${fld('school','Institution')}${fld('eduYears','Years')}${fld('grade','Result')}</div></div></div>

  <div class="acc"><button class="acc-h" onclick="acc(this)"><span class="ico-sq"><svg><use href="#i-code"/></svg></span>Skills<svg class="caret"><use href="#i-right"/></svg></button>
    <div class="acc-b"><label class="field"><span class="between" style="display:flex">Core skills <button class="ai-btn" onclick="aiFix('skills')"><svg><use href="#i-spark"/></svg>Suggest missing</button></span>
      <input class="inp rs" data-k="skillsA" value="${esc(d.skillsA)}"></label>
      <label class="field" style="margin-top:11px"><span>Tools and systems</span><input class="inp rs" data-k="skillsB" value="${esc(d.skillsB)}"></label></div></div>

  <div class="acc"><button class="acc-h" onclick="acc(this)"><span class="ico-sq"><svg><use href="#i-case"/></svg></span>Experience<svg class="caret"><use href="#i-right"/></svg></button>
    <div class="acc-b"><div class="f2">${fld('job1','Role')}${fld('co1','Employer')}${fld('d1','Dates')}${fld('l1','Location')}</div>
      <label class="field" style="margin-top:11px"><span class="between" style="display:flex">Bullets, one per line <button class="ai-btn" onclick="aiFix('bullets')"><svg><use href="#i-spark"/></svg>Strengthen</button></span>
        <textarea class="inp rs" data-k="b1" rows="4">${esc(d.b1)}</textarea></label>
      <div class="f2" style="margin-top:13px;padding-top:13px;border-top:1px dashed var(--line)">${fld('job2','Role')}${fld('co2','Employer')}${fld('d2','Dates')}${fld('l2','Location')}</div>
      <label class="field" style="margin-top:11px"><span>Bullets</span><textarea class="inp rs" data-k="b2" rows="2">${esc(d.b2)}</textarea></label></div></div>

  <div class="acc"><button class="acc-h" onclick="acc(this)"><span class="ico-sq"><svg><use href="#i-layers"/></svg></span>Projects and work samples<svg class="caret"><use href="#i-right"/></svg></button>
    <div class="acc-b">${fld('p1','Project one')}<label class="field" style="margin-top:9px"><span>Description</span><textarea class="inp rs" data-k="p1d" rows="2">${esc(d.p1d)}</textarea></label>
      <div style="margin-top:12px">${fld('p2','Project two')}</div><label class="field" style="margin-top:9px"><span>Description</span><textarea class="inp rs" data-k="p2d" rows="2">${esc(d.p2d)}</textarea></label></div></div>

  <div class="acc"><button class="acc-h" onclick="acc(this)"><span class="ico-sq"><svg><use href="#i-shield"/></svg></span>Certifications and achievements<svg class="caret"><use href="#i-right"/></svg></button>
    <div class="acc-b"><label class="field"><span>Certifications, one per line</span><textarea class="inp rs" data-k="certs" rows="2">${esc(d.certs)}</textarea></label>
      <label class="field" style="margin-top:11px"><span>Achievements, one per line</span><textarea class="inp rs" data-k="ach" rows="2">${esc(d.ach)}</textarea></label></div></div>`;
  $$('.rs').forEach(i=>i.addEventListener('input',renderResume));
}
function rd(){const o={};$$('.rs').forEach(i=>o[i.dataset.k]=i.value);return o}
function lines(s){return (s||'').split('\n').filter(x=>x.trim())}
function renderResume(){
  const d=rd(), tpl=$('#resumePaper').dataset.tpl;
  const body=`
   <div class="rs-sec" style="margin-top:0"><p>${esc(d.summary||'')}</p></div>
   <div class="rs-sec"><div class="rs-t">Skills</div><div><b>Core:</b> ${esc(d.skillsA||'')}</div><div><b>Tools:</b> ${esc(d.skillsB||'')}</div></div>
   <div class="rs-sec"><div class="rs-t">Experience</div>
     <div class="rs-job"><span>${esc(d.job1||'')} · ${esc(d.co1||'')}</span><span class="rs-meta">${esc(d.d1||'')}</span></div>
     <div class="rs-meta">${esc(d.l1||'')}</div><ul>${lines(d.b1).map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
     <div class="rs-job" style="margin-top:10px"><span>${esc(d.job2||'')} · ${esc(d.co2||'')}</span><span class="rs-meta">${esc(d.d2||'')}</span></div>
     <div class="rs-meta">${esc(d.l2||'')}</div><ul>${lines(d.b2).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div>
   <div class="rs-sec"><div class="rs-t">Projects</div>
     <div class="rs-job"><span>${esc(d.p1||'')}</span></div><div>${esc(d.p1d||'')}</div>
     <div class="rs-job" style="margin-top:7px"><span>${esc(d.p2||'')}</span></div><div>${esc(d.p2d||'')}</div></div>
   <div class="rs-sec"><div class="rs-t">Education</div>
     <div class="rs-job"><span>${esc(d.degree||'')}</span><span class="rs-meta">${esc(d.eduYears||'')}</span></div>
     <div class="rs-meta">${esc(d.school||'')} · ${esc(d.grade||'')}</div></div>
   <div class="rs-sec"><div class="rs-t">Certifications</div><ul>${lines(d.certs).map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div>
   <div class="rs-sec"><div class="rs-t">Achievements</div><ul>${lines(d.ach).map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div>`;
  const head=`<h2>${esc(d.name||'')}</h2>
   <div style="font-weight:700;font-size:12px;margin-top:2px;color:${tpl==='bold'?'rgba(255,255,255,.88)':'#22543C'}">${esc(d.title||'')}</div>
   <div class="rs-meta" style="margin-top:5px;${tpl==='bold'?'color:rgba(255,255,255,.78)':''}">${esc(d.email||'')} · ${esc(d.phone||'')} · ${esc(d.loc||'')}<br>${esc(d.links||'')}</div>`;
  const html=tpl==='bold'?`<div class="rs-head">${head}</div><div class="rs-body">${body}</div>`
    :`${head}<div style="height:1px;background:#ddd;margin:13px 0"></div>${body}`;
  $('#resumePaper').innerHTML=html;
  const pv=$('#previewPaper'); pv.dataset.tpl=tpl; pv.innerHTML=html;
}
function aiFix(k){
  const map={summary:'summary',skills:'skillsA',bullets:'b1'};
  const el=$(`.rs[data-k="${map[k]}"]`); if(!el)return;
  if(k==='bullets'){el.value=R.an.weak.map(w=>w[2]).join('\n')}
  else if(k==='summary'){el.value=R.match.note}
  else {el.value=R.resume.skillsA+', '+R.match.missing.slice(0,2).map(m=>m[0]).join(', ')+' (learning)'}
  renderResume(); toast('Rewritten',k==='skills'?'Added the two gaps you are actively closing.':'Stronger verbs, one more number.');
}
function downloadResume(){
  if(!$('#p-builder').classList.contains('active'))go('builder');
  toast('Preparing PDF','Choose "Save as PDF" in the print dialog.');
  setTimeout(()=>window.print(),800);
}
$$('.tpl[data-tpl]').forEach(b=>b.addEventListener('click',()=>{
  $$('.tpl[data-tpl]').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  $('#resumePaper').dataset.tpl=b.dataset.tpl; renderResume();
  toast('Template changed',b.querySelectorAll('span')[1].textContent+' applied. Still one page.');
}));

/* ================= analyzer ================= */

function renderSaved() {
  const container = document.getElementById('anSaved');

  // The old demo analyser may no longer contain this element.
  if (!container) return;

  const resumes = typeof getSavedResumes === 'function'
    ? getSavedResumes()
    : [];

  if (!resumes.length) {
    container.innerHTML = `
      <p class="muted" style="font-size:13px">
        No saved resumes yet. Save a resume in the Resume Builder first.
      </p>`;
    return;
  }

  container.innerHTML = resumes.map(r => `
    <div class="list-row">
      <span class="ico-sq">
        <svg><use href="#i-file"></use></svg>
      </span>
      <div style="flex:1">
        <b style="font-size:13.5px">${esc(r.name || 'Saved resume')}</b>
        <div class="muted" style="font-size:12px">
          ${esc(r.roleName || 'Target role')} ·
          ${new Date(r.savedAt).toLocaleDateString()}
        </div>
      </div>
      <button class="btn btn-sm"
        onclick="loadSavedResume(${Number(r.id)})">
        Edit
      </button>
    </div>
  `).join('');
}
function runAn(){
  const bar=$('#scanBar'),msg=$('#scanMsg');bar.style.display='block';msg.style.display='block';
  const steps=['Reading the layout…','Pulling out sections…','Comparing with '+R.posts+' postings…','Scoring the bullets…'];
  let i=0;bar.querySelector('i').style.width='8%';msg.textContent=steps[0];
  const t=setInterval(()=>{i++;msg.textContent=steps[Math.min(i,3)];bar.querySelector('i').style.width=(8+i*24)+'%';
    if(i>=4){clearInterval(t);$('#anUpload').style.display='none';$('#anResult').style.display='block';$('#reBtn').style.display='inline-flex';
      renderAnResult();toast('Analysis ready',`Resume ${R.an.score}, parsing ${R.an.ats}.`)}},600);
}
function resetAn(){$('#anUpload').style.display='block';$('#anResult').style.display='none';$('#reBtn').style.display='none';
  $('#scanBar').style.display='none';$('#scanMsg').style.display='none';$('#scanBar').querySelector('i').style.width='0'}
function renderAnResult(){
  const a=R.an;
  $('#anResult').innerHTML=`
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card lift pad" style="grid-column:span 2;display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      ${gauge(a.score,'resume score',118)}
      <div style="flex:1;min-width:180px"><h3 style="font-size:17px">${a.head}</h3>
        <p class="muted" style="font-size:13px;margin-top:5px">${a.sub}</p></div>
    </div>
    <div class="kpi"><div class="lbl">Parsing score</div><div class="val">${a.ats}</div><div class="sub">Read cleanly by 4 of 4 parsers</div><div class="bar thin" style="margin-top:10px"><i style="width:${a.ats}%"></i></div></div>
    <div class="kpi"><div class="lbl">Keyword coverage</div><div class="val">${a.cover}%</div><div class="sub">Against ${R.name} postings</div><div class="bar thin y" style="margin-top:10px"><i style="width:${a.cover}%"></i></div></div>
  </div>
  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="panel"><div class="between ruled"><div><div class="sec-t">Bullets worth rewriting</div><div class="sec-sub">Three, in order of damage</div></div><span class="tag y">Fix these first</span></div>
      <div class="stack" style="gap:11px">${a.weak.map(w=>`
        <div style="border:1.5px solid var(--line);border-radius:var(--r);padding:12px">
          <div class="muted" style="font-size:12px;margin-bottom:5px">${w[0]}</div>
          <p style="font-size:13.5px;text-decoration:line-through;color:var(--ink-3)">${w[1]}</p>
          <p style="font-size:13.5px;margin-top:8px;padding-left:10px;border-left:3px solid var(--mark)">${w[2]}</p>
          <button class="btn btn-sm" style="margin-top:9px" onclick="toast('Rewrite applied','It is in your builder draft.')">Use this</button></div>`).join('')}</div></div>
    <div class="stack">
      <div class="panel"><div class="sec-t ruled">Missing from the page</div>
        ${a.missing.map(m=>`<div class="list-row"><span class="ico-sq ${m[0]}"><svg><use href="#${m[0]==='r'?'i-x':'i-warn'}"/></svg></span><div style="flex:1"><b style="font-size:13.5px">${m[1]}</b><div class="muted" style="font-size:12px">${m[2]}</div></div></div>`).join('')}</div>
      <div class="panel"><div class="sec-t ruled">Formatting</div>
        ${a.fmt.map(m=>`<div class="list-row"><span class="ico-sq ${m[0]}"><svg><use href="#${m[0]==='g'?'i-check':'i-warn'}"/></svg></span><div style="flex:1"><b style="font-size:13.5px">${m[1]}</b><div class="muted" style="font-size:12px">${m[2]}</div></div></div>`).join('')}</div>
    </div>
  </div>
  <div class="grid g-2-1">
    <div class="panel"><div class="between ruled"><div class="sec-t">Skills the parser found</div><span class="muted" style="font-size:12.5px">${a.found.length} found · ${a.absent.length} expected and absent</span></div>
      <div class="chips">${a.found.map(s=>`<span class="chip on">${s}</span>`).join('')}${a.absent.map(s=>`<span class="chip miss">${s}</span>`).join('')}</div>
      <p class="muted" style="font-size:12.5px;margin-top:11px">Struck-through skills appear in ${R.name} postings but not in your resume.</p></div>
    <div class="panel"><div class="sec-t">What to change</div><div class="sec-sub" style="margin-bottom:10px">Ordered by score impact</div>
      ${a.recs.map(r=>`<div class="list-row"><span class="tag g">${r[0]}</span><div style="flex:1"><b style="font-size:13.5px">${r[1]}</b><div class="muted" style="font-size:12px">${r[2]}</div></div></div>`).join('')}
      <button class="btn btn-primary btn-block" style="margin-top:12px" data-go="builder">Apply in the builder</button></div>
  </div>`;
}

const SAVED_RESUMES_KEY = 'skillgap_ai_saved_resumes';

function getSavedResumes() {
  try {
    return JSON.parse(
      localStorage.getItem(SAVED_RESUMES_KEY) || '[]'
    );
  } catch (error) {
    console.error('Could not read saved resumes:', error);
    return [];
  }
}

function saveResume() {
  const data = rd();

  if (!data.name || !data.name.trim()) {
    toast('Name required', 'Enter your name before saving.');
    return;
  }

  const resumes = getSavedResumes();
  const now = Date.now();

  const version = resumes.filter(
    r => r.roleKey === RK
  ).length + 1;

  const saved = {
    id: now,
    name: data.name.trim() + ' — v' + version,
    roleKey: RK,
    roleName: R.name,
    template: $('#resumePaper').dataset.tpl || 'ats',
    savedAt: new Date(now).toISOString(),
    data: data
  };

  try {
    resumes.unshift(saved);
    localStorage.setItem(
      SAVED_RESUMES_KEY,
      JSON.stringify(resumes)
    );

    renderMyResumes();
    renderSaved();

    toast('Resume saved', saved.name + ' was saved successfully.');
  } catch (error) {
    console.error('Could not save resume:', error);
    toast('Save failed', 'Browser storage may be full.');
  }
}

function loadSavedResume(id) {
  const saved = getSavedResumes().find(
    r => r.id === Number(id)
  );

  if (!saved) {
    toast('Resume not found', 'This saved version may have been deleted.');
    return;
  }

  // Open the builder and create its form fields.
  go('builder');
  buildForm();

  // Restore the saved form values.
  $$('.rs').forEach(input => {
    const key = input.dataset.k;

    if (Object.prototype.hasOwnProperty.call(saved.data, key)) {
      input.value = saved.data[key] ?? '';
    }
  });

  // Restore the selected template.
  const template = saved.template || 'ats';
  $('#resumePaper').dataset.tpl = template;

  $$('.tpl').forEach(button => {
    button.classList.toggle(
      'on',
      button.dataset.tpl === template
    );
  });

  renderResume();
  toast('Resume loaded', 'You can now edit this saved version.');
}

function deleteSavedResume(id) {
  const remaining = getSavedResumes().filter(
    r => r.id !== Number(id)
  );

  try {
    localStorage.setItem(
      SAVED_RESUMES_KEY,
      JSON.stringify(remaining)
    );

    renderMyResumes();
    renderSaved();
    toast('Resume deleted', 'The saved version was removed.');
  } catch (error) {
    console.error('Could not delete resume:', error);
    toast('Delete failed', 'Could not update browser storage.');
  }
}


function renderMyResumes() {
  const resumes = getSavedResumes();
  const list = $('#resList');

  if (!resumes.length) {
    list.innerHTML = `
      <div class="panel" style="text-align:center;padding:32px">
        <div class="sec-t">No saved resumes yet</div>
        <p class="muted" style="margin:8px 0 16px">
          Create your resume and click Save to store your first version.
        </p>
        <button class="btn btn-primary btn-sm" data-go="builder">
          Create a resume
        </button>
      </div>`;
    return;
  }

  list.innerHTML = `
    <div class="res-grid" style="margin-bottom:16px">
      ${resumes.map(r => `
        <div class="res">
          <div class="rtype">
            <svg><use href="#i-file"/></svg>
            Saved resume
          </div>

          <div class="between">
            <h3>${esc(r.name || 'Untitled resume')}</h3>
            <span class="tag g">${esc(r.template || 'ats')}</span>
          </div>

          <p class="why">
            Target role: ${esc(r.roleName || 'Not specified')}
          </p>

          <div class="meta">
            <span>Saved ${new Date(r.savedAt).toLocaleDateString()}</span>
            <span>Version ${r.id}</span>
          </div>

          <div class="row" style="margin-top:12px">
            <button class="btn btn-sm"
              onclick="loadSavedResume(${Number(r.id)})">
              Edit
            </button>

            <button class="btn btn-quiet btn-sm"
              onclick="loadSavedResume(${Number(r.id)});toast('Resume loaded','Review it before analysing.')">
              Load to analyse
            </button>

            <span class="spacer"></span>

            <button class="btn btn-quiet btn-sm"
              onclick="deleteSavedResume(${Number(r.id)})">
              Delete
            </button>
          </div>
        </div>
      `).join('')}
    </div>`;
}

/* ================= JD ================= */
function renderJD(){
  $('#jdText').value=R.jd.text;
  $('#jdRecent').innerHTML=`
   <div class="list-row"><span class="ico-sq b"><svg><use href="#i-case"/></svg></span><div style="flex:1"><b style="font-size:13.5px">${R.jd.co} · ${R.jd.title}</b><div class="muted" style="font-size:12px">3 days ago · ${R.match.pct}% match</div></div></div>
   <div class="list-row"><span class="ico-sq"><svg><use href="#i-case"/></svg></span><div style="flex:1"><b style="font-size:13.5px">Another ${R.name} posting</b><div class="muted" style="font-size:12px">1 week ago · ${R.match.pct-5}% match</div></div></div>
   <div class="list-row"><span class="ico-sq"><svg><use href="#i-case"/></svg></span><div style="flex:1"><b style="font-size:13.5px">A third ${R.name} posting</b><div class="muted" style="font-size:12px">2 weeks ago · ${R.match.pct-13}% match</div></div></div>
   <div class="note" style="margin-top:12px">${R.match.missing[0][0]} has appeared in all three. It is the requirement you are missing most often.</div>`;
  $('#jdResult').innerHTML=jdHTML();
}
function jdHTML(){
  const j=R.jd;
  return `
  <div class="card lift pad" style="margin-bottom:16px">
    <div class="between wrap">
      <div><div class="eyebrow">What this posting is</div>
        <h2 style="font-size:21px;margin:3px 0 8px">${j.title} · ${j.co}</h2>
        <div class="row wrap" style="gap:6px"><span class="tag">${j.loc}</span><span class="tag">${j.exp}</span><span class="tag y">${j.req.length + j.pref.length} skills extracted</span></div></div>
      <div class="row" style="gap:18px">
        <div style="text-align:center"><b class="num" style="font-size:24px;display:block">${R.match.pct}%</b><span class="muted" style="font-size:12px">your match</span></div>
        <button class="btn btn-primary btn-sm" data-go="match">Open job match</button></div>
    </div>
  </div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="panel"><div class="between ruled"><div><div class="sec-t">Required</div><div class="sec-sub">Stated as must-haves</div></div>
      <span class="tag r">${j.req.filter(x=>x[1]).length} of ${j.req.length} you have</span></div>
      <div class="chips">${j.req.map(x=>`<span class="chip ${x[1]?'on':'miss'}">${x[0]}</span>`).join('')}</div></div>
    <div class="panel"><div class="between ruled"><div><div class="sec-t">Preferred</div><div class="sec-sub">Nice to have</div></div>
      <span class="tag y">${j.pref.filter(x=>x[1]).length} of ${j.pref.length}</span></div>
      <div class="chips">${j.pref.map(x=>`<span class="chip ${x[1]?'on':'miss'}">${x[0]}</span>`).join('')}</div></div>
  </div>
  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="panel"><div class="sec-t ruled">What you would actually do</div>
      <div class="stack" style="gap:11px">${j.resp.map(r=>`<div>
        <div class="between" style="font-size:13.5px;font-weight:600"><span>${r[0]}</span><span class="muted">${r[1]>70?'most of the job':r[1]>45?'regular':'occasional'}</span></div>
        <div class="bar thin" style="margin-top:4px"><i style="width:${r[1]}%"></i></div></div>`).join('')}</div></div>
    <div class="stack">
      <div class="panel"><div class="sec-t ruled">Experience and education</div>
        ${j.reqs.map(r=>`<div class="list-row"><span class="ico-sq ${r[0]}"><svg><use href="#${r[0]==='g'?'i-check':r[0]==='y'?'i-clock':'i-warn'}"/></svg></span>
          <div style="flex:1"><b style="font-size:13.5px">${r[1]}</b><div class="muted" style="font-size:12px">${r[2]}</div></div></div>`).join('')}</div>
      <div class="panel"><div class="sec-t ruled">Tools and systems named</div>
        <div class="chips">${j.tools.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
    </div>
  </div>
  <div class="panel"><div class="between ruled"><div><div class="sec-t">Words the filter looks for</div><div class="sec-sub">How often each appears, and whether your resume has it</div></div>
    <button class="btn btn-sm" data-go="keywords">Open keyword suggester</button></div>
    <div class="matrix">${j.kwGrid.map(k=>`<div class="mini"><div class="between"><b>${k[0]}</b>
      <span class="tag ${k[2]==='present'?'g':k[2]==='partial'?'y':'r'}">${k[2]}</span></div>
      <small>${k[1]} mention${k[1]===1?'':'s'}</small></div>`).join('')}</div></div>`;
}
function runJD(){
  if(!$('#jdText').value.trim()){toast('Nothing to read','Paste a job description first.');return}
  toast('Reading the posting','Pulling out skills, duties and keywords.');
  setTimeout(()=>{$('#jdInput').style.display='none';$('#jdResult').style.display='block';$('#jdBtn').style.display='inline-flex';
    toast('Done',`Your match against this posting is ${R.match.pct}%.`)},800);
}
function resetJD(){$('#jdInput').style.display='block';$('#jdResult').style.display='none';$('#jdBtn').style.display='none'}

/* ================= keywords ================= */
function renderKw(){
  $('#kwSub').textContent=`The words ${R.name} postings use that your resume does not, and where to put them honestly.`;
  const proj=Math.min(96,R.an.cover+24);
  $('#kwBody').innerHTML=`
  <div class="grid g4" style="margin-bottom:16px">
    <div class="kpi"><div class="lbl">Coverage today</div><div class="val">${R.an.cover}%</div><div class="sub">Against ${R.posts} postings</div><div class="bar thin y" style="margin-top:10px"><i style="width:${R.an.cover}%"></i></div></div>
    <div class="kpi"><div class="lbl">High-impact missing</div><div class="val">${R.kw.filter(k=>k[4]==='r').length}</div><div class="sub">In more than half of postings</div></div>
    <div class="kpi"><div class="lbl">Phrases to drop</div><div class="val">3</div><div class="sub">"responsible for", "worked on", "handled"</div></div>
    <div class="kpi"><div class="lbl">If you apply all of this</div><div class="val" style="color:var(--green)">${proj}%</div><div class="sub">Projected coverage</div><div class="bar thin" style="margin-top:10px"><i style="width:${proj}%"></i></div></div>
  </div>
  <div class="grid g-2-1">
    <div class="panel"><div class="between ruled"><div><div class="sec-t">Words worth adding</div><div class="sec-sub">Only add what you could defend in an interview</div></div></div>
      <div class="tbl-wrap" style="border:0"><table><thead><tr><th>Word</th><th>In postings</th><th>Where it belongs</th><th>Impact</th><th></th></tr></thead><tbody>
        ${R.kw.map(k=>`<tr><td><b>${k[0]}</b></td><td>${k[1]}</td><td class="muted" style="font-size:12.5px">${k[2]}</td>
          <td><span class="tag ${k[4]}">${k[3]}%</span></td>
          <td style="text-align:right"><button class="btn btn-quiet btn-sm" onclick="toast('Copied','${k[0]} — only where it is true.')">Copy</button></td></tr>`).join('')}
      </tbody></table></div></div>
    <div class="stack">
      <div class="panel"><div class="sec-t ruled">Coverage by group</div><div class="chart-box" style="height:230px"><canvas id="cKw"></canvas></div></div>
      <div class="panel"><div class="sec-t ruled">Phrases to replace</div>
        <div class="list-row"><span class="ico-sq r"><svg><use href="#i-x"/></svg></span><div style="flex:1"><b style="font-size:13.5px">"Responsible for"</b><div class="muted" style="font-size:12px">Four uses. Lead with the verb instead.</div></div></div>
        <div class="list-row"><span class="ico-sq r"><svg><use href="#i-x"/></svg></span><div style="flex:1"><b style="font-size:13.5px">"Worked on"</b><div class="muted" style="font-size:12px">Three uses. Say what you built or changed.</div></div></div>
        <div class="list-row"><span class="ico-sq y"><svg><use href="#i-warn"/></svg></span><div style="flex:1"><b style="font-size:13.5px">"Team player"</b><div class="muted" style="font-size:12px">Carries no signal for a person or a filter.</div></div></div>
      </div>
    </div>
  </div>`;
}

/* ================= match ================= */
function renderMatch(){
  const m=R.match;
  $('#matchSub').textContent=`Your ${R.name} resume against ${R.jd.co} — ${R.jd.title}.`;
  $('#matchBody').innerHTML=`
  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="card lift pad">
      <div class="between wrap" style="gap:20px">
        <div class="row" style="gap:18px">${gauge(m.pct,'overall match')}
          <div><h3 style="font-size:17px">${m.verdict}</h3>
            <p class="muted" style="font-size:13px;margin-top:5px;max-width:42ch">${m.note}</p>
            <div class="row wrap" style="gap:6px;margin-top:10px"><span class="tag g">${m.matching.length} matching</span><span class="tag y">${m.partial.length} partial</span><span class="tag r">${m.missing.length} missing</span></div></div></div>
        <div style="min-width:175px;flex:1"><div class="eyebrow" style="margin-bottom:8px">By area</div>
          <div class="stack" style="gap:9px">${m.cats.map(c=>`<div>
            <div class="between" style="font-size:12.5px;font-weight:600"><span>${c[0]}</span><span class="muted">${c[1]}%</span></div>
            <div class="bar thin ${c[1]>=70?'':c[1]>=45?'y':'r'}" style="margin-top:4px"><i style="width:${c[1]}%"></i></div></div>`).join('')}</div></div>
      </div>
    </div>
    <div class="panel"><div class="sec-t ruled">Keyword coverage</div><div class="chart-box" style="height:232px"><canvas id="cMatch"></canvas></div></div>
  </div>
  <div class="grid g3" style="margin-bottom:16px">
    <div class="panel"><div class="between ruled"><div class="sec-t">What lines up</div><span class="tag g">${m.matching.length}</span></div>
      <div class="chips">${m.matching.map(s=>`<span class="tag g">${s}</span>`).join('')}</div></div>
    <div class="panel"><div class="between ruled"><div class="sec-t">Half there</div><span class="tag y">${m.partial.length}</span></div>
      <div class="stack" style="gap:11px">${m.partial.map(p=>`<div>
        <div class="between" style="font-size:13.5px;font-weight:600"><span>${p[0]}</span></div>
        <div class="bar thin y" style="margin-top:4px"><i style="width:${p[2]}%"></i></div>
        <div class="muted" style="font-size:12px;margin-top:4px">${p[1]}</div></div>`).join('')}</div></div>
    <div class="panel"><div class="between ruled"><div class="sec-t">Not there at all</div><span class="tag r">${m.missing.length}</span></div>
      ${m.missing.map(x=>`<div class="list-row"><span class="tag r">${x[1]}</span><div style="flex:1"><b style="font-size:13.5px">${x[0]}</b><div class="muted" style="font-size:12px">${x[2]}</div></div></div>`).join('')}</div>
  </div>
  <div class="panel"><div class="between ruled"><div><div class="sec-t">What to change for this posting</div><div class="sec-sub">The first three take the match to roughly ${Math.min(95,m.pct+13)}%</div></div>
    <button class="btn btn-sm" onclick="toast('Queued','Open the builder to review each edit.')">Queue all</button></div>
    <div class="stack" style="gap:10px">${m.fixes.map(f=>`
      <div class="row" style="gap:11px;align-items:flex-start;padding:12px;border:1.5px solid var(--line);border-radius:var(--r)">
        <span class="tag g">${f[0]}</span><div style="flex:1"><b style="font-size:13.5px">${f[1]}</b><div class="muted" style="font-size:12.5px">${f[2]}</div></div>
        <button class="btn btn-sm" onclick="toast('Queued','Review it in the builder.')">Queue</button></div>`).join('')}</div>
  </div>`;
}

/* ================= gap ================= */
let gapFilter='all';
function renderGap(){
  const c=counts(), sorted=SK.slice().sort((a,b)=>(b.need-b.have)-(a.need-a.have));
  const list=gapFilter==='all'?sorted:sorted.filter(s=>band(s)===gapFilter);
  $('#gapSub').textContent=`Your level against what ${R.posts} live ${R.name} postings ask for.`;
  $('#gapBody').innerHTML=`
  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="panel"><div class="between ruled"><div><div class="sec-t">Current against required</div><div class="sec-sub">${R.name}, ${R.level.toLowerCase()}</div></div>
      <div class="row" style="font-size:12px;color:var(--ink-3)"><span class="row" style="gap:5px"><i style="width:10px;height:10px;background:var(--green)"></i>you</span>
        <span class="row" style="gap:5px"><i style="width:10px;height:10px;background:var(--ink-4)"></i>required</span></div></div>
      <div class="chart-box" style="height:320px"><canvas id="cRadar"></canvas></div></div>
    <div class="stack">
      <div class="card lift pad" style="text-align:center">
        <div style="display:flex;justify-content:center">${gauge(R.score,'readiness')}</div>
        <p class="muted" style="font-size:13px;margin-top:12px">Closing the ${c.critical} critical gap${c.critical===1?'':'s'} takes this to roughly <b style="color:var(--ink)">${Math.min(95,R.score+17)}</b>.</p>
        <button class="btn btn-primary btn-block" style="margin-top:12px" data-go="roadmap">See the plan</button></div>
      <div class="grid g3" style="gap:9px">
        <div class="kpi" style="padding:13px;text-align:center"><div class="val" style="font-size:22px;color:var(--green)">${c.strong}</div><div class="lbl">Strong</div></div>
        <div class="kpi" style="padding:13px;text-align:center"><div class="val" style="font-size:22px;color:var(--mark)">${c.moderate}</div><div class="lbl">Moderate</div></div>
        <div class="kpi" style="padding:13px;text-align:center"><div class="val" style="font-size:22px;color:var(--clay)">${c.critical}</div><div class="lbl">Critical</div></div>
      </div>
    </div>
  </div>
  <div class="panel" style="margin-bottom:16px">
    <div class="between wrap ruled"><div><div class="sec-t">Skill by skill</div><div class="sec-sub">Sorted by how far behind you are</div></div>
      <div class="chips" id="gapFilters">
        <button class="chip ${gapFilter==='all'?'on':''}" data-f="all">All ${SK.length}</button>
        <button class="chip ${gapFilter==='critical'?'on':''}" data-f="critical">Critical</button>
        <button class="chip ${gapFilter==='moderate'?'on':''}" data-f="moderate">Moderate</button>
        <button class="chip ${gapFilter==='strong'?'on':''}" data-f="strong">Strong</button></div></div>
    ${list.length?list.map(s=>{const b=band(s),g=s.need-s.have;return `<div class="skill-row">
      <div class="row" style="gap:10px"><span class="tag ${bcls(b)}"><i class="dot"></i></span>
        <div><b style="font-size:13.5px">${s.n}</b><div class="muted" style="font-size:12px">you ${s.have} · needed ${s.need}${g>0?` · ${g} short`:' · at the bar'}</div></div></div>
      <div class="dual-wrap"><div class="dual"><i style="width:${s.have}%;background:var(--${b==='critical'?'clay':b==='moderate'?'mark':'green'})"></i><u style="left:${s.need}%"></u></div></div>
      <div style="text-align:right"><span class="tag ${bcls(b)}">${g>0?'−'+g:'ok'}</span></div></div>`}).join('')
      :'<div class="empty"><h3>Nothing in this band</h3><p>Switch the filter to see the rest of your profile.</p></div>'}
  </div>
  <div class="grid g3" style="margin-bottom:16px">
    <div class="panel"><div class="row ruled" style="gap:8px"><span class="ico-sq g"><svg><use href="#i-check"/></svg></span><div><div class="sec-t">Strong</div><div class="sec-sub">Do not spend study time here</div></div></div>
      <div class="chips">${SK.filter(s=>band(s)==='strong').map(s=>`<span class="tag g">${s.n}</span>`).join('')||'<span class="muted" style="font-size:13px">Nothing here yet.</span>'}</div></div>
    <div class="panel"><div class="row ruled" style="gap:8px"><span class="ico-sq y"><svg><use href="#i-warn"/></svg></span><div><div class="sec-t">Moderate</div><div class="sec-sub">A week or two each</div></div></div>
      <div class="chips">${SK.filter(s=>band(s)==='moderate').map(s=>`<span class="tag y">${s.n}</span>`).join('')||'<span class="muted" style="font-size:13px">None.</span>'}</div></div>
    <div class="panel"><div class="row ruled" style="gap:8px"><span class="ico-sq r"><svg><use href="#i-warn"/></svg></span><div><div class="sec-t">Critical</div><div class="sec-sub">These keep you off the shortlist</div></div></div>
      <div class="stack" style="gap:9px">${SK.filter(s=>band(s)==='critical').map(s=>`
        <div style="padding:10px;border-radius:var(--r);background:var(--clay-soft)"><b style="font-size:13.5px;color:var(--clay)">${s.n}</b>
          <div style="font-size:12.5px;color:var(--ink-2);margin-top:2px">Level ${s.have} against ${s.need}. Worth roughly +${Math.round((s.need-s.have)/5)} readiness.</div></div>`).join('')||'<span class="muted" style="font-size:13px">No critical gaps. Unusual, and good.</span>'}</div></div>
  </div>
  <div class="panel"><div class="between ruled"><div><div class="sec-t">What to learn next</div><div class="sec-sub">Ordered by readiness gained per hour of study</div></div>
    <button class="btn btn-sm" data-go="study">Open the library</button></div>
    <div class="matrix">${sorted.slice(0,6).map(s=>{const b=band(s);return `<div class="mini">
      <div class="between"><b>${s.n}</b><span class="tag ${bcls(b)}">+${Math.max(1,Math.round((s.need-s.have)/5))}</span></div>
      <small>from ${s.have} to ${s.need}</small><div class="bar thin" style="margin-top:8px"><i style="width:${s.have}%"></i></div></div>`}).join('')}</div></div>`;
  const gf=$('#gapFilters');
  gf.addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c)return;gapFilter=c.dataset.f;renderGap();buildRadar()});
}

/* ================= roadmap ================= */
function rmPct(){let d=0,t=0;RM.forEach(m=>m.tasks.forEach(x=>{t++;if(x.done)d++}));return Math.round(d/t*100)}
function rmStatus(i){
  if(RM[i].tasks.every(t=>t.done))return 'done';
  const first=RM.findIndex(m=>m.tasks.some(t=>!t.done));
  return i===first?'now':'locked';
}
function renderRoadmap(){
  const nowIdx=Math.max(0,RM.findIndex(m=>m.tasks.some(t=>!t.done)));
  $('#rmSub').textContent=`${R.name}, ${R.level.toLowerCase()}. ${RM.length} weeks, re-ordered every Sunday around what you finished.`;
  $('#rmStats').innerHTML=`
   <div class="kpi"><div class="lbl">Target</div><div class="val" style="font-size:18px;margin-top:7px">${R.name}</div><div class="sub">${R.level} · ${R.persona.loc} market</div></div>
   <div class="kpi"><div class="lbl">Length</div><div class="val">${RM.length} wks</div><div class="sub">${R.weeksLeft} left at ${R.hrs} h a week</div></div>
   <div class="kpi"><div class="lbl">Done</div><div class="val" id="rmPctV">${rmPct()}%</div><div class="sub"><span id="rmDone">0</span> of ${RM.reduce((a,m)=>a+m.tasks.length,0)} tasks</div><div class="bar thin" style="margin-top:10px"><i id="rmBar" style="width:${rmPct()}%"></i></div></div>
   <div class="kpi"><div class="lbl">On this pace</div><div class="val" style="font-size:18px;margin-top:7px">${R.finish}</div><div class="sub">Two weeks earlier than August's estimate</div></div>`;
  $('#rmList').innerHTML=RM.map((m,i)=>{
    const st=rmStatus(i), icon=st==='done'?'i-check':st==='now'?'i-flame':'i-lock';
    const badge=st==='done'?'<span class="tag g">Finished</span>':st==='now'?'<span class="tag y">This week</span>':'<span class="tag">Later</span>';
    return `<div class="rm-item ${st} ${st==='now'?'open':''}" data-i="${i}">
      <div class="rm-card">
        <button class="rm-h" onclick="this.closest('.rm-item').classList.toggle('open')">
          <span class="ico-sq ${st==='done'?'g':st==='now'?'y':''}"><svg><use href="#${icon}"/></svg></span>
          <span style="flex:1;min-width:0"><span class="eyebrow">Week ${i+1}</span><h3>${m.t}</h3>
            <span class="meta" style="margin-top:3px"><span>${m.h}</span><span>${m.diff}</span><span>${m.tasks.filter(t=>t.done).length} of ${m.tasks.length} done</span></span></span>
          ${badge}<svg class="caret"><use href="#i-right"/></svg></button>
        <div class="rm-b">
          <p style="font-size:13.5px;color:var(--ink-2);max-width:74ch">${m.d}</p>
          <div class="grid g3" style="gap:10px;margin:13px 0">
            <div class="mini"><small>Difficulty</small><b>${m.diff}</b></div>
            <div class="mini"><small>Time to allow</small><b>${m.h}</b></div>
            <div class="mini"><small>Comes after</small><b style="font-size:13px">${m.pre}</b></div></div>
          <div class="chips" style="margin-bottom:13px">${m.skills.map(s=>`<span class="tag g">${s}</span>`).join('')}</div>
          <div class="grid g2" style="gap:15px">
            <div><div class="eyebrow" style="margin-bottom:5px">Tasks</div>
              ${m.tasks.map((t,j)=>`<div class="task ${t.done?'done':''}">
                <button class="cbx" role="checkbox" aria-checked="${t.done}" onclick="tick(${i},${j},this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></button>
                <span>${t.t}</span></div>`).join('')}</div>
            <div><div class="eyebrow" style="margin-bottom:5px">Resources</div>
              ${m.res.map(r=>`<div class="list-row" style="padding:7px 0"><span class="ico-sq" style="width:26px;height:26px"><svg style="width:12px;height:12px"><use href="#i-book"/></svg></span>
                <span style="font-size:13px;flex:1">${r}</span><svg style="width:14px;height:14px;color:var(--ink-4)"><use href="#i-link"/></svg></div>`).join('')}
              ${st!=='locked'?'<button class="btn btn-sm btn-block" style="margin-top:10px" data-go="study">Find these in the library</button>'
                :`<div class="row" style="gap:6px;margin-top:10px;font-size:12.5px;color:var(--ink-3)"><svg style="width:14px;height:14px"><use href="#i-lock"/></svg>Opens after week ${i}</div>`}</div>
          </div>
        </div></div></div>`}).join('');
  updateRm();
}
function tick(i,j,btn){
  RM[i].tasks[j].done=!RM[i].tasks[j].done;
  const d=RM[i].tasks[j].done;
  btn.setAttribute('aria-checked',d); btn.closest('.task').classList.toggle('done',d);
  if(d)toast('Ticked off',RM[i].tasks[j].t);
  updateRm();
  const st=rmStatus(i);
  if(st==='done'){toast('Week '+(i+1)+' finished','The next week is open.');setTimeout(renderRoadmap,600)}
}
function updateRm(){
  let d=0;RM.forEach(m=>m.tasks.forEach(x=>{if(x.done)d++}));
  const p=rmPct();
  if($('#rmPctV')){$('#rmPctV').textContent=p+'%';$('#rmBar').style.width=p+'%';$('#rmDone').textContent=d}
  const nowIdx=RM.findIndex(m=>m.tasks.some(t=>!t.done));
  $('#sbWeek').textContent='W'+((nowIdx<0?RM.length:nowIdx+1));
}
function jumpNow(){const el=$('.rm-item.now');if(el){el.classList.add('open');el.scrollIntoView({behavior:'smooth',block:'center'})}}

/* ================= study ================= */
function renderStudy(){
  const skills=[...new Set(R.lib.map(l=>l[3]))];
  if($('#stSkill').dataset.role!==RK){
    $('#stSkill').innerHTML='<option value="">All skills</option>'+skills.map(s=>`<option>${s}</option>`).join('');
    $('#stSkill').dataset.role=RK;
  }
  filterStudy();
}
function filterStudy(){
  const tab=$('#stTabs .tab.active').dataset.t, q=$('#stSearch').value.toLowerCase(),
    sk=$('#stSkill').value, df=$('#stDiff').value, du=$('#stDur').value;
  const items=R.lib.map(l=>({t:l[0],p:l[1],ty:l[2],sk:l[3],d:l[4],min:l[5],st:l[6],why:l[7],rec:l[8]}))
    .filter(r=>{
      if(tab==='rec'?!r.rec:r.ty!==tab)return false;
      if(q&&!(r.t+' '+r.p+' '+r.sk).toLowerCase().includes(q))return false;
      if(sk&&r.sk!==sk)return false;
      if(df&&r.d!==df)return false;
      if(du==='Under 1 hour'&&r.min>=60)return false;
      if(du==='1–4 hours'&&(r.min<60||r.min>240))return false;
      if(du==='Over 4 hours'&&r.min<=240)return false;
      return true;
    });
  $('#stCount').textContent=`${items.length} resource${items.length===1?'':'s'} · ${R.name}`;
  $('#stEmpty').style.display=items.length?'none':'block';
  $('#stGrid').innerHTML=items.map(r=>{
    const st=r.st==='done'?'<span class="tag g"><i class="dot"></i>Finished</span>':r.st==='progress'?'<span class="tag y"><i class="dot"></i>Part way</span>':'<span class="tag">Not started</span>';
    return `<div class="res">
      <div class="rtype"><svg><use href="#${ICO[r.ty]}"/></svg>${TYPEN[r.ty]}</div>
      <h3>${r.t}</h3><div class="muted" style="font-size:12.5px;margin-top:-6px">${r.p}</div>
      <p class="why">${r.why}</p>
      <div class="meta"><span>${r.sk}</span><span>${r.d}</span><span>${dur(r.min)}</span></div>
      <div class="between">${st}<button class="btn btn-sm" onclick="toast('${r.st==='done'?'Reopened':'Added to today'}','${r.t.replace(/'/g,'')}')">${r.st==='progress'?'Continue':r.st==='done'?'Revisit':'Start'}</button></div></div>`}).join('');
}
function clearStudy(){$('#stSearch').value='';$('#stSkill').value='';$('#stDiff').value='';$('#stDur').value='';filterStudy()}
$('#stTabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;
  $$('#stTabs .tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');filterStudy()});
['stSearch','stSkill','stDiff','stDur'].forEach(id=>{const el=$('#'+id);el.addEventListener('input',filterStudy);el.addEventListener('change',filterStudy)});

/* ================= projects ================= */
let pjFilter='all';
function renderProjects(){
  const items=R.projects.map(p=>({t:p[0],d:p[1],h:p[2],prog:p[3],desc:p[4],need:p[5].split('|'),learn:p[6].split('|'),tech:p[7].split('|')}));
  const show=pjFilter==='all'?items:items.filter(p=>p.d===pjFilter);
  const inProg=items.filter(p=>p.prog>0&&p.prog<100).length, done=items.filter(p=>p.prog===100).length;
  $('#pjSub').textContent=`Portfolio work chosen against your ${R.name} gaps. Each one is defensible in an interview.`;
  $('#pjStats').innerHTML=`
   <div class="kpi"><div class="lbl">In progress</div><div class="val">${inProg}</div><div class="sub">${items.find(p=>p.prog>0&&p.prog<100)?.t||'Nothing started'}</div></div>
   <div class="kpi"><div class="lbl">Finished</div><div class="val">${done}</div><div class="sub">Covering ${[...new Set(items.filter(p=>p.prog===100).flatMap(p=>p.learn))].length} distinct skills</div></div>
   <div class="kpi"><div class="lbl">Gap coverage if you finish all</div><div class="val">62%</div><div class="sub">Of your critical gaps</div><div class="bar thin y" style="margin-top:10px"><i style="width:62%"></i></div></div>`;
  $('#pjGrid').innerHTML=show.map(p=>{
    const dc=p.d==='Advanced'?'r':p.d==='Intermediate'?'y':'g';
    const state=p.prog===100?'Finished':p.prog>0?'In progress':'Not started';
    return `<div class="res">
      <div class="rtype"><svg><use href="#i-layers"/></svg>${p.h}</div>
      <div class="between" style="align-items:flex-start"><h3>${p.t}</h3><span class="tag ${dc}">${p.d}</span></div>
      <p class="why">${p.desc}</p>
      <div><div class="eyebrow" style="margin-bottom:4px">You need</div><div class="chips">${p.need.map(s=>`<span class="tag">${s}</span>`).join('')}</div></div>
      <div><div class="eyebrow" style="margin-bottom:4px">You'll come out with</div><div class="chips">${p.learn.map(s=>`<span class="tag g">${s}</span>`).join('')}</div></div>
      <div class="meta"><span>${p.tech.join(' · ')}</span></div>
      <div><div class="between" style="font-size:12px;color:var(--ink-3);font-weight:600"><span>${state}</span><span>${p.prog}%</span></div>
        <div class="bar thin" style="margin-top:4px"><i style="width:${p.prog}%"></i></div></div>
      <button class="btn ${p.prog===0?'btn-primary':''} btn-sm btn-block" onclick="toast('${p.prog===100?'Opened':p.prog?'Resumed':'Started'}','${p.t.replace(/'/g,'')}')">${p.prog===100?'Read the write-up':p.prog?'Carry on':'Start this'}</button>
    </div>`}).join('');
}
$('#pjFilters').addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c)return;chipRow(c);pjFilter=c.dataset.d;renderProjects()});

/* ================= progress ================= */
function renderProgressBody(){
  $('#prSub').textContent=`Six months of work on the ${R.name} track, and what it moved.`;
  $('#prBody').innerHTML=`
  <div class="grid g4" style="margin-bottom:16px">
    <div class="kpi"><div class="lbl">Readiness</div><div class="val">${R.score}</div><div class="sub">From ${R.score-26} in April</div><div class="bar thin" style="margin-top:10px"><i style="width:${R.score}%"></i></div></div>
    <div class="kpi"><div class="lbl">Hours studied</div><div class="val">${R.hours}</div><div class="sub">${R.hrs} h a week average</div></div>
    <div class="kpi"><div class="lbl">Resources finished</div><div class="val">${R.doneRes}</div><div class="sub">of ${R.totalRes} recommended</div></div>
    <div class="kpi"><div class="lbl">Longest streak</div><div class="val">19</div><div class="sub">Currently on ${R.streak} days</div></div>
  </div>
  <div class="grid g-2-1" style="margin-bottom:16px">
    <div class="panel"><div class="sec-t">Readiness over time</div><div class="sec-sub" style="margin-bottom:6px">Recomputed whenever your skills or the posting pool change</div>
      <div class="chart-box" style="height:275px"><canvas id="cReady"></canvas></div></div>
    <div class="panel"><div class="sec-t">Plan completion</div><div class="sec-sub" style="margin-bottom:6px">By week</div>
      <div class="chart-box" style="height:275px"><canvas id="cPhase"></canvas></div></div>
  </div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="panel"><div class="sec-t">Hours, split by what you were doing</div><div class="sec-sub" style="margin-bottom:6px">Learning against building</div>
      <div class="chart-box"><canvas id="cHours"></canvas></div></div>
    <div class="panel"><div class="sec-t">Four skills you have worked on</div><div class="sec-sub" style="margin-bottom:6px">Self-assessed, checked against project work</div>
      <div class="chart-box"><canvas id="cSkills"></canvas></div></div>
  </div>
  <div class="grid g-2-1">
    <div class="panel"><div class="between ruled"><div class="sec-t">Finished this month</div><span class="tag">${R.doneRes>20?11:6} items</span></div>
      <div class="tbl-wrap" style="border:0"><table><thead><tr><th>Item</th><th>Type</th><th>Skill</th><th>Time</th></tr></thead><tbody>
        ${R.lib.filter(l=>l[6]!=='not').slice(0,6).map(l=>`<tr><td>${l[0]}</td><td>${TYPEN[l[2]]}</td><td>${l[3]}</td><td>${dur(l[5])}</td></tr>`).join('')}
      </tbody></table></div></div>
    <div class="stack">
      <div class="panel"><div class="sec-t ruled">Last five weeks</div><div class="stack" style="gap:6px" id="heat"></div>
        <div class="row" style="margin-top:11px;font-size:12px;color:var(--ink-3);gap:5px"><span>less</span>
          <i style="width:13px;height:13px;background:var(--sand-2)"></i><i style="width:13px;height:13px;background:var(--green-soft)"></i>
          <i style="width:13px;height:13px;background:var(--green-2)"></i><i style="width:13px;height:13px;background:var(--green)"></i><span>more</span></div></div>
      <div class="panel"><div class="sec-t ruled">Worth noting</div>
        <div class="list-row"><span class="ico-sq g"><svg><use href="#i-award"/></svg></span><div style="flex:1"><b style="font-size:13.5px">Readiness crossed ${R.score-3}</b><div class="muted" style="font-size:12px">9 September</div></div></div>
        <div class="list-row"><span class="ico-sq g"><svg><use href="#i-flame"/></svg></span><div style="flex:1"><b style="font-size:13.5px">19-day streak</b><div class="muted" style="font-size:12px">28 August</div></div></div>
        <div class="list-row"><span class="ico-sq g"><svg><use href="#i-layers"/></svg></span><div style="flex:1"><b style="font-size:13.5px">${R.projects.filter(p=>p[3]===100).length} project${R.projects.filter(p=>p[3]===100).length===1?'':'s'} finished</b><div class="muted" style="font-size:12px">Most recent in July</div></div></div>
      </div>
    </div>
  </div>`;
  renderHeat();
}
function renderHeat(){
  const lv=[[2,1,3,0,2,1,0],[3,2,2,3,1,0,1],[2,3,3,2,2,1,0],[3,3,2,3,3,1,2],[3,2,3,2,3,2,3]];
  const bg=['var(--sand-2)','var(--green-soft)','var(--green-2)','var(--green)'];
  $('#heat').innerHTML=lv.map((w,i)=>`<div class="row" style="gap:6px"><span class="muted" style="font-size:11px;width:30px">W${34+i}</span>
    ${w.map(d=>`<i style="flex:1;height:21px;border:1px solid var(--line);background:${bg[d]}"></i>`).join('')}</div>`).join('');
}

/* ================= settings / bell / coach ================= */
function renderSettings(){
  const p=R.persona;
  $('#setAcct').innerHTML=`
   <label class="field"><span>Full name</span><input class="inp" value="${p.first} ${p.last}"></label>
   <label class="field"><span>Email</span><input class="inp" value="${p.email}"></label>
   <label class="field"><span>Phone</span><input class="inp" value="${p.phone}"></label>
   <label class="field"><span>Time zone</span><select class="inp"><option>Asia/Kolkata (GMT+5:30)</option><option>Asia/Dubai (GMT+4)</option><option>Europe/London (GMT+1)</option></select></label>`;
  $('#notifList').innerHTML=[
   ['Daily study reminder','At 8 pm, the time you usually start',1],
   ['Streak about to break',"Only if you haven't studied by 9:30 pm",1],
   ['A new week opens up','When the next roadmap week unlocks',1],
   ['New matching roles','Above your match threshold',1],
   ['Weekly summary','Sunday evening, by email',1],
   ['Product updates','New features and templates',0]
  ].map(n=>`<div class="between" style="padding:12px 0;border-bottom:1px dashed var(--line)">
    <div><b style="font-size:13.5px">${n[0]}</b><div class="muted" style="font-size:12.5px">${n[1]}</div></div>
    <button class="switch" role="switch" aria-checked="${!!n[2]}" onclick="flip(this)"></button></div>`).join('');
  $('#dashToggles').innerHTML=['Readiness score','Study streak','Skill chart','Recent activity','Job match feed']
   .map((t,i)=>`<div class="between" style="padding:11px 0;border-bottom:1px dashed var(--line)"><b style="font-size:13.5px">${t}</b>
     <button class="switch" role="switch" aria-checked="${i<4}" onclick="flip(this)"></button></div>`).join('');
}
function renderBell(){
  const nowIdx=Math.max(0,RM.findIndex(m=>m.tasks.some(t=>!t.done)));
  $('#bellList').innerHTML=`<div style="font-family:var(--font-d);font-weight:700;font-size:13.5px;padding:3px 5px 7px">Notifications</div>
   <div class="list-row" style="padding:8px 5px"><span class="ico-sq y"><svg><use href="#i-map"/></svg></span><span style="font-size:12.5px"><b style="display:block;font-size:13px">Week ${nowIdx+1} is open</b>${RM[nowIdx].t} is ready to start.</span></div>
   <div class="list-row" style="padding:8px 5px"><span class="ico-sq r"><svg><use href="#i-flame"/></svg></span><span style="font-size:12.5px"><b style="display:block;font-size:13px">Streak at risk</b>Twenty minutes today keeps ${R.streak} days.</span></div>
   <div class="list-row" style="padding:8px 5px"><span class="ico-sq g"><svg><use href="#i-check"/></svg></span><span style="font-size:12.5px"><b style="display:block;font-size:13px">Resume scored ${R.an.ats}</b>Up 11 points on the last version.</span></div>`;
}
function renderCoachQs(){
  const qs=[`What should I study this week to move my readiness the most?`,
    `Am I ready to apply for the ${R.jd.co} role?`,
    `Rewrite my strongest bullet for a ${R.name} application.`];
  $('#coachQs').innerHTML=qs.map(q=>`<button class="btn btn-sm" style="justify-content:flex-start;height:auto;padding:9px 11px;text-align:left;white-space:normal" onclick="askCoach(this)">${q}</button>`).join('');
}
function askCoach(btn){
  const q=btn?btn.textContent.trim():'What should I focus on?';
  const out=$('#coachOut'); out.style.display='block'; out.innerHTML='<span class="muted">Thinking…</span>';
  const sorted=SK.slice().sort((a,b)=>(b.need-b.have)-(a.need-a.have));
  setTimeout(()=>{out.innerHTML=`<b style="display:block;margin-bottom:6px;font-family:var(--font-d)">${q}</b>
    Finish what is already half done before starting anything new — partly finished work is worth nothing on a resume.
    After that, <b>${sorted[0].n}</b> before <b>${sorted[1].n}</b>: it appears in more of your saved postings and it is worth roughly
    +${Math.round((sorted[0].need-sorted[0].have)/5)} readiness against +${Math.round((sorted[1].need-sorted[1].have)/5)}.
    Neither matters until something on your resume proves it, which is why week ${Math.min(RM.length,6)} is a project rather than a course.`},700);
}

/* ================= charts ================= */
function base(){return{responsive:true,maintainAspectRatio:false,
 plugins:{legend:{display:false},tooltip:{backgroundColor:cv('--ink'),titleColor:cv('--paper'),bodyColor:cv('--paper'),
   padding:9,cornerRadius:3,titleFont:{family:'Public Sans',size:12},bodyFont:{family:'Public Sans',size:12},displayColors:false}},
 scales:{x:{grid:{display:false},border:{color:cv('--rule')},ticks:{color:cv('--ink-3'),font:{family:'Public Sans',size:11}}},
   y:{grid:{color:cv('--line')},border:{display:false},ticks:{color:cv('--ink-3'),font:{family:'Public Sans',size:11}}}}}}
function leg(){return{display:true,position:'bottom',labels:{usePointStyle:true,pointStyle:'rect',boxWidth:9,padding:14,color:cv('--ink-2'),font:{family:'Public Sans',size:11.5}}}}
function mk(id,cfg){const el=document.getElementById(id);if(!el)return;if(charts[id])charts[id].destroy();charts[id]=new Chart(el,cfg)}
const MON=['Apr','May','Jun','Jul','Aug','Sep'];
function buildRadar(){
  const s=SK.slice().sort((a,b)=>(b.need-b.have)-(a.need-a.have)).slice(0,8);
  mk('cRadar',{type:'radar',data:{labels:s.map(x=>x.n),datasets:[
    {label:'Required',data:s.map(x=>x.need),borderColor:cv('--ink-4'),backgroundColor:'transparent',borderWidth:1.6,borderDash:[5,4],pointRadius:0},
    {label:'You',data:s.map(x=>x.have),borderColor:cv('--green'),backgroundColor:cv('--green')+'2e',borderWidth:2.2,pointRadius:3,pointBackgroundColor:cv('--green')}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:base().plugins.tooltip},
      scales:{r:{min:0,max:100,angleLines:{color:cv('--line')},grid:{color:cv('--line')},
        pointLabels:{color:cv('--ink-2'),font:{family:'Public Sans',size:11}},ticks:{display:false}}}}});
}
function chartsFor(page){
  if(page==='dashboard'){
    const s=R.score, seq=[s-26,s-20,s-15,s-10,s-5,s];
    mk('cGrow',{type:'line',data:{labels:MON,datasets:[
      {label:'Overall readiness',data:seq,borderColor:cv('--green'),backgroundColor:'transparent',tension:.35,borderWidth:2.6,pointRadius:0,pointHoverRadius:5},
      {label:'Strongest area',data:seq.map(v=>Math.min(96,v+20)),borderColor:cv('--sky'),tension:.35,borderWidth:2,pointRadius:0},
      {label:'Weakest area',data:seq.map(v=>Math.max(5,v-34)),borderColor:cv('--clay'),borderDash:[5,4],tension:.35,borderWidth:2,pointRadius:0}]},
      options:{...base(),plugins:{...base().plugins,legend:leg()},scales:{...base().scales,y:{...base().scales.y,min:0,max:100}}}});
    const c=counts();
    mk('cDonut',{type:'doughnut',data:{labels:['Strong','Moderate gap','Critical gap'],datasets:[{data:[c.strong,c.moderate,c.critical],
      backgroundColor:[cv('--green'),cv('--mark'),cv('--clay')],borderWidth:1.5,borderColor:cv('--card'),cutout:'62%'}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:leg(),tooltip:base().plugins.tooltip}}});
  }
  if(page==='gap')buildRadar();
  if(page==='keywords'){
    mk('cKw',{type:'bar',data:{labels:R.kwGroups.map(g=>g[0]),datasets:[
      {label:'Covered',data:R.kwGroups.map(g=>g[1]),backgroundColor:cv('--green'),borderRadius:2,barPercentage:.6},
      {label:'Missing',data:R.kwGroups.map(g=>100-g[1]),backgroundColor:cv('--sand-2'),borderRadius:2,barPercentage:.6}]},
      options:{...base(),plugins:{...base().plugins,legend:leg()},scales:{x:{...base().scales.x,stacked:true},y:{...base().scales.y,stacked:true,max:100}}}});
  }
  if(page==='match'){
    mk('cMatch',{type:'bar',data:{labels:R.match.cats.map(c=>c[0]),datasets:[
      {label:'Covered',data:R.match.cats.map(c=>c[1]),backgroundColor:cv('--green'),borderRadius:2,barPercentage:.55},
      {label:'Gap',data:R.match.cats.map(c=>100-c[1]),backgroundColor:cv('--sand-2'),borderRadius:2,barPercentage:.55}]},
      options:{...base(),indexAxis:'y',plugins:{...base().plugins,legend:leg()},
        scales:{x:{...base().scales.x,stacked:true,max:100,grid:{color:cv('--line')}},y:{...base().scales.y,stacked:true,grid:{display:false}}}}});
  }
  if(page==='progress')renderProgress();
}
function renderProgress(mode){
  const s=R.score, labels=mode==='w'?['W31','W32','W33','W34','W35','W36','W37','W38']:MON;
  const ready=mode==='w'?[s-10,s-9,s-7,s-6,s-5,s-3,s-1,s]:[s-26,s-20,s-15,s-10,s-5,s];
  const hrs=mode==='w'?[4.5,6,5,7,4,6.5,5.5,6]:[9,13,16,14,18,16.5];
  const bld=mode==='w'?[1,0,1,0,2,1,1,2]:[2,3,4,3,5,4];
  mk('cReady',{type:'line',data:{labels,datasets:[{data:ready,borderColor:cv('--green'),tension:.35,borderWidth:2.8,pointRadius:0,pointHoverRadius:5}]},
    options:{...base(),scales:{...base().scales,y:{...base().scales.y,min:Math.max(0,s-40),max:100}}}});
  const doneW=RM.filter(m=>m.tasks.every(t=>t.done)).length;
  mk('cPhase',{type:'doughnut',data:{labels:['Finished','This week','Ahead of you'],datasets:[{data:[doneW,1,Math.max(0,RM.length-doneW-1)],
    backgroundColor:[cv('--green'),cv('--mark'),cv('--sand-2')],borderWidth:1.5,borderColor:cv('--card'),cutout:'62%'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:leg(),tooltip:base().plugins.tooltip}}});
  mk('cHours',{type:'bar',data:{labels,datasets:[
    {label:'Learning',data:hrs,backgroundColor:cv('--green'),borderRadius:2,barPercentage:.6},
    {label:'Building',data:bld,backgroundColor:cv('--mark'),borderRadius:2,barPercentage:.6}]},
    options:{...base(),plugins:{...base().plugins,legend:leg()},scales:{x:{...base().scales.x,stacked:true},y:{...base().scales.y,stacked:true}}}});
  const four=SK.slice().sort((a,b)=>b.have-a.have).slice(0,2).concat(SK.slice().sort((a,b)=>(b.need-b.have)-(a.need-a.have)).slice(0,2));
  const cols=[cv('--green'),cv('--sky'),cv('--clay'),cv('--mark')];
  mk('cSkills',{type:'line',data:{labels:MON,datasets:four.map((sk,i)=>({label:sk.n,
    data:MON.map((_,j)=>Math.max(2,Math.round(sk.have-(5-j)*(sk.have*0.09)))),borderColor:cols[i],tension:.35,borderWidth:2.1,pointRadius:0}))},
    options:{...base(),plugins:{...base().plugins,legend:leg()},scales:{...base().scales,y:{...base().scales.y,min:0,max:100}}}});
}

/* ================= landing viz ================= */
let gvIdx=0;
const GV_ORDER=['civil','pm','backend','finance','mech','analyst','ops','marketing'];
function renderGv(){
  const k=GV_ORDER[gvIdx%GV_ORDER.length], r=ROLES[k];
  const rows=r.skills.map(s=>({n:s[0],have:s[1],need:s[2]})).sort((a,b)=>(b.need-b.have)-(a.need-a.have)).slice(0,5);
  $('#gvTitle').textContent=r.name;
  $('#gvScore').textContent=r.score+'% ready';
  $('#gvRows').innerHTML=rows.map(s=>`<div class="skill-row" style="grid-template-columns:118px 1fr 34px;padding:9px 0">
    <span style="font-size:13px;font-weight:600">${s.n}</span>
    <div class="dual"><i style="width:0" data-w="${s.have}"></i><u style="left:${s.need}%"></u></div>
    <span class="muted num" style="font-size:12.5px;text-align:right">${s.have}</span></div>`).join('');
  setTimeout(()=>$$('#gvRows .dual i').forEach(i=>i.style.width=i.dataset.w+'%'),60);
}
function cycleGv(){gvIdx++;renderGv()}
$('#trackCards').innerHTML=TRACKS.map(t=>`<div class="track-card">
  <div class="row" style="gap:9px;margin-bottom:8px"><span class="ico-sq"><svg><use href="#${t.i}"/></svg></span><h3>${t.k}</h3></div>
  <p class="muted" style="font-size:13.5px">${t.d}</p>
  <div class="chips" style="margin-top:11px">${Object.values(ROLES).filter(r=>r.track===t.k).map(r=>`<span class="tag">${r.name}</span>`).join('')}</div>
</div>`).join('');

/* ================= misc wiring ================= */

const setTabs = $('#setTabs');

if (setTabs) {
  setTabs.addEventListener('click', e => {
    const t = e.target.closest('.tab');
    if (!t) return;

    $$('#setTabs .tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');

    $$('.setpane').forEach(p => {
      p.style.display = p.id === 's-' + t.dataset.s ? 'block' : 'none';
    });
  });
}

const globalSearch = $('#globalSearch');

if (globalSearch) {
  globalSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const query = e.target.value.trim();

      go('study');
      $('#stSearch').value = query;

      $$('#stTabs .tab').forEach((x, i) => {
        x.classList.toggle('active', i === 0);
      });

      filterStudy();
      toast('Searching the library', 'Showing matches for "' + query + '".');
      e.target.value = '';
    }
  });
}

const dz = $('#dropZone');

if (dz) {
  ['dragenter', 'dragover'].forEach(ev => {
    dz.addEventListener(ev, e => {
      e.preventDefault();
      dz.classList.add('hot');
    });
  });

  ['dragleave', 'drop'].forEach(ev => {
    dz.addEventListener(ev, e => {
      e.preventDefault();
      dz.classList.remove('hot');
    });
  });

  dz.addEventListener('drop', e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) runAn(file);
  });
}

/* ================= boot ================= */
loadRole();
renderGv();
loadResumeRoleOptions();

const dashboardResumeForm =
  document.getElementById("resumeAnalysisForm");

if (dashboardResumeForm) {
  dashboardResumeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("resumeFile");
    const roleKey = document.getElementById("resumeRole").value;
    const status = document.getElementById("resumeAnalysisStatus");
    const results = document.getElementById("resumeAnalysisResults");
    const button = document.getElementById("analyzeResumeBtn");
    const file = fileInput.files[0];

    results.innerHTML = "";

    if (!file) {
      status.textContent = "Please select your resume first.";
      return;
    }

    if (![".pdf", ".docx"].includes(
      file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
    )) {
      status.textContent = "Please upload a PDF or DOCX file.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      status.textContent = "Your resume must be 5 MB or smaller.";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role_key", roleKey);

    button.disabled = true;
    status.textContent = "Analysing your resume...";

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analyze-resume`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume analysis failed.");
      }

      const matched = data.matched_skills || [];
      const missing = data.missing_skills || [];
      const detected = data.detected_skills || [];

      status.textContent = "Analysis completed successfully!";

      const safeList = (items) =>
        items.length
          ? `<ul>${items.map(skill =>
              `<li>${escapeHtml(skill)}</li>`
            ).join("")}</ul>`
          : "<p>None found.</p>";

      results.innerHTML = `
        <div class="track-card">
          <h3>${escapeHtml(data.role_name || "Your target role")}</h3>
          <p style="margin-top:10px">
            Skill match:
            <strong>${Number(data.match_percentage) || 0}%</strong>
          </p>
          <div style="height:8px;background:var(--rule);border-radius:8px;margin:10px 0 18px">
            <div style="height:8px;width:${Math.min(100, Math.max(0, Number(data.match_percentage) || 0))}%;background:var(--accent, #16a34a);border-radius:8px"></div>
          </div>
          <h4>Matched skills (${matched.length})</h4>
          ${safeList(matched)}
          <h4 style="margin-top:14px">Skills to develop (${missing.length})</h4>
          ${safeList(missing)}
          <h4 style="margin-top:14px">Skills detected in your resume (${detected.length})</h4>
          ${safeList(detected)}
          <p class="muted" style="font-size:12px;margin-top:12px">
            This is a basic text-based prototype. A skill may not be detected
            if it is written differently in your resume.
          </p>
        </div>
      `;
    } catch (error) {
      console.error("Resume analysis error:", error);
      status.textContent = error.message ||
        "Couldn't connect to the backend. Check that it is running.";
    } finally {
      button.disabled = false;
    }
    });
}

  
const sidebarForm = document.getElementById("sidebarResumeAnalysisForm");

if (sidebarForm) {
  sidebarForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("sidebarResumeFile");
    const roleKey = document.getElementById("sidebarResumeRole").value;
    const status = document.getElementById("sidebarResumeAnalysisStatus");
    const results = document.getElementById("sidebarResumeAnalysisResults");
    const button = document.getElementById("sidebarAnalyzeResumeBtn");
    const file = fileInput.files[0];

    results.innerHTML = "";

    if (!file) {
      status.textContent = "Please select your resume first.";
      return;
    }

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (![".pdf", ".docx"].includes(extension)) {
      status.textContent = "Please upload a PDF or DOCX file.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      status.textContent = "Your resume must be 5 MB or smaller.";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role_key", roleKey);

    button.disabled = true;
    status.textContent = "Analysing your resume...";

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analyze-resume`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume analysis failed.");
      }

      const matched = data.matched_skills || [];
      const missing = data.missing_skills || [];
      const detected = data.detected_skills || [];

      const safeList = (items) =>
        items.length
          ? `<ul>${items.map(skill =>
              `<li>${escapeHtml(skill)}</li>`
            ).join("")}</ul>`
          : "<p>None found.</p>";

      const percentage = Math.min(
        100,
        Math.max(0, Number(data.match_percentage) || 0)
      );

      status.textContent = "Analysis completed successfully!";

      results.innerHTML = `
        <div class="track-card">
          <h3>${escapeHtml(data.role_name || "Your target role")}</h3>

          <p style="margin-top:10px">
            Skill match: <strong>${percentage}%</strong>
          </p>

          <div style="height:8px;background:var(--rule);border-radius:8px;margin:10px 0 18px">
            <div style="height:8px;width:${percentage}%;background:var(--accent, #16a34a);border-radius:8px"></div>
          </div>

          <h4>Matched skills (${matched.length})</h4>
          ${safeList(matched)}

          <h4 style="margin-top:14px">Skills to develop (${missing.length})</h4>
          ${safeList(missing)}

          <h4 style="margin-top:14px">Detected skills (${detected.length})</h4>
          ${safeList(detected)}

          <p class="muted" style="font-size:12px;margin-top:12px">
            Results depend on the skills detected in your resume text.
          </p>
        </div>
      `;
    } catch (error) {
      console.error("Sidebar resume analysis error:", error);
      status.textContent =
        error.message || "Could not connect to the backend.";
    } finally {
      button.disabled = false;
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char];
  });
}

async function loadResumeRoles() {
  const select = document.getElementById("resumeRole");
  if (!select) return;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/roles");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const roles = await response.json();

    select.replaceChildren(new Option("Select a target job role", ""));

    roles.forEach(role => {
      select.add(new Option(role.name, role.key));
    });
  } catch (error) {
    console.error("Could not load roles:", error);
    select.replaceChildren(new Option("Failed to load roles — refresh to retry", ""));
  }
}

loadResumeRoles();