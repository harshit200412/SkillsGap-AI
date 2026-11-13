"""Canonical skill checklists used by resume analysis and roadmap generation.

The same role keys are stored in PostgreSQL's job_roles table.
Keep these keys aligned when new roles are added.
"""

ROLE_SKILLS = {
    "backend": [
        "Python", "Java", "SQL", "PostgreSQL", "REST APIs", "FastAPI",
        "Django", "Flask", "Git", "Docker", "Database Design",
        "Authentication", "Redis", "Testing", "Linux", "System Design",
    ],
    "analyst": [
        "SQL", "Python", "Excel", "Power BI", "Tableau", "Statistics",
        "Data Visualization", "Pandas", "NumPy", "Data Cleaning",
        "Communication", "Business Analysis",
    ],
    "pm": [
        "Product Strategy", "Market Research", "User Research", "Agile",
        "Scrum", "Communication", "Data Analysis", "Roadmapping",
        "Prioritization", "Product Analytics", "Stakeholder Management",
        "PRD Writing",
    ],
    "marketing": [
        "SEO", "Content Marketing", "Social Media Marketing",
        "Google Analytics", "Email Marketing", "Market Research",
        "Copywriting", "Digital Marketing", "Excel", "Communication",
        "Performance Marketing", "Campaign Analytics",
    ],
    "finance": [
        "Excel", "Financial Modeling", "Accounting", "Financial Analysis",
        "Valuation", "SQL", "Budgeting", "Forecasting", "Power BI",
        "Statistics", "Financial Reporting", "Corporate Finance",
    ],
    "ops": [
        "Supply Chain Management", "Inventory Management", "Excel", "SQL",
        "Project Management", "Logistics", "Procurement", "Forecasting",
        "Data Analysis", "Communication", "Process Improvement",
        "Vendor Management",
    ],
    "civil": [
        "AutoCAD", "Revit", "Structural Analysis", "Quantity Surveying",
        "Project Management", "Construction Management", "Site Safety",
        "Estimation", "Technical Drawing", "Quality Control",
        "Primavera P6", "Bill of Quantities",
    ],
    "mech": [
        "AutoCAD", "SolidWorks", "CATIA", "GD&T", "CAD", "FEA", "Ansys",
        "Thermodynamics", "Technical Drawing", "Manufacturing",
        "Design for Manufacturing", "Materials Science",
    ],
    "frontend": [
        "HTML", "CSS", "JavaScript", "React", "TypeScript",
        "Responsive Design", "Accessibility", "REST APIs", "Git",
        "Testing", "UI Design", "Web Performance",
    ],
    "fullstack": [
        "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
        "Python", "FastAPI", "SQL", "MongoDB", "REST APIs", "Git",
        "Authentication", "Docker", "Deployment",
    ],
    "java": [
        "Java", "Object-Oriented Programming", "Collections Framework",
        "Spring Boot", "SQL", "JDBC", "REST APIs", "Maven", "Git",
        "Unit Testing", "Data Structures", "Hibernate",
    ],
    "python": [
        "Python", "Object-Oriented Programming", "SQL", "FastAPI",
        "Django", "Flask", "Pandas", "NumPy", "Git", "REST APIs",
        "Testing", "Automation",
    ],
    "uiux": [
        "Figma", "Wireframing", "Prototyping", "User Research",
        "Usability Testing", "Interaction Design", "Visual Design",
        "Design Systems", "Accessibility", "Information Architecture",
    ],
    "qa": [
        "Software Testing", "Manual Testing", "Test Cases", "Bug Tracking",
        "Selenium", "Playwright", "API Testing", "SQL",
        "Regression Testing", "Automation Testing", "Git", "Agile",
    ],
    "devops": [
        "Linux", "Git", "Docker", "Kubernetes", "CI/CD", "Jenkins",
        "GitHub Actions", "AWS", "Networking", "Terraform", "Monitoring",
        "Shell Scripting",
    ],
}

# Common wording variants mapped to the canonical skill used in the catalog.
SKILL_ALIASES = {
    "javascript": ["js", "ecmascript"],
    "typescript": ["ts"],
    "postgresql": ["postgres"],
    "power bi": ["powerbi"],
    "rest apis": ["rest api", "restful api", "restful apis"],
    "node.js": ["nodejs", "node js"],
    "express.js": ["express", "expressjs"],
    "object-oriented programming": ["oop", "object oriented programming"],
    "collections framework": ["java collections", "collections in java"],
    "spring boot": ["springboot"],
    "bill of quantities": ["boq"],
    "gd&t": ["geometric dimensioning and tolerancing"],
    "fea": ["finite element analysis"],
    "solidworks": ["solid works"],
    "autocad": ["auto cad"],
    "supply chain management": ["supply chain"],
    "social media marketing": ["social media"],
    "financial modeling": ["financial modelling"],
    "design for manufacturing": ["dfm"],
    "user interface design": ["ui design"],
    "quality assurance": ["qa"],
    "continuous integration and delivery": ["ci/cd"],
}
