"""Curated starter learning resources for the built-in career roles."""

from copy import deepcopy


STARTER_RESOURCES = {
    "backend": [
        {"title": "The Python Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "docs", "source": "Python documentation", "why": "Learn core Python syntax, data structures, modules, and exceptions."},
        {"title": "FastAPI Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "type": "course", "source": "FastAPI documentation", "why": "Build APIs with validation, dependency injection, and authentication."},
        {"title": "PostgreSQL Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial.html", "type": "practice", "source": "PostgreSQL documentation", "why": "Practice relational queries, joins, aggregates, and database concepts."},
    ],
    "analyst": [
        {"title": "pandas Getting Started", "url": "https://pandas.pydata.org/docs/getting_started/index.html", "type": "docs", "source": "pandas documentation", "why": "Work through data loading, cleaning, selection, and summary operations."},
        {"title": "Get started with Power BI", "url": "https://learn.microsoft.com/en-us/training/modules/get-started-with-power-bi/", "type": "course", "source": "Microsoft Learn", "why": "Follow a guided introduction to connecting, transforming, and visualizing data."},
        {"title": "PostgreSQL Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial.html", "type": "practice", "source": "PostgreSQL documentation", "why": "Learn SQL fundamentals with queries against a relational database."},
    ],
    "pm": [
        {"title": "Product management guide", "url": "https://www.atlassian.com/agile/product-management", "type": "article", "source": "Atlassian", "why": "Understand product strategy, customer needs, roadmaps, and delivery."},
        {"title": "Product Management Handbook", "url": "https://handbook.gitlab.com/handbook/product/", "type": "docs", "source": "GitLab Handbook", "why": "See practical examples of product discovery, planning, and collaboration."},
        {"title": "Agile with Atlassian Jira", "url": "https://www.atlassian.com/agile/tutorials", "type": "course", "source": "Atlassian Agile Coach", "why": "Practice agile planning, backlogs, user stories, and delivery workflows."},
    ],
    "marketing": [
        {"title": "Digital Marketing Certification Course", "url": "https://academy.hubspot.com/courses/digital-marketing", "type": "course", "source": "HubSpot Academy", "why": "Study SEO, content, social, email, and digital campaign measurement."},
        {"title": "Google Ads Skillshop", "url": "https://skillshop.withgoogle.com/googleads/", "type": "course", "source": "Google Skillshop", "why": "Learn campaign setup and optimization using Google Ads training."},
        {"title": "Google Analytics learning resources", "url": "https://support.google.com/analytics/topic/14090456", "type": "docs", "source": "Google Analytics Help", "why": "Learn analytics concepts and how to interpret web measurement reports."},
    ],
    "finance": [
        {"title": "Valuation Online Course", "url": "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/webcastvalonline.htm", "type": "course", "source": "NYU Stern", "why": "Study valuation through lectures, notes, spreadsheets, and practice tests."},
        {"title": "Excel training", "url": "https://support.microsoft.com/en-us/excel", "type": "docs", "source": "Microsoft Support", "why": "Use official Excel help to build spreadsheet and financial-modeling fluency."},
        {"title": "Financial accounting course materials", "url": "https://ocw.mit.edu/courses/15-501-introduction-to-financial-and-managerial-accounting-spring-2004/", "type": "course", "source": "MIT OpenCourseWare", "why": "Review financial statements and the accounting concepts behind analysis."},
    ],
    "ops": [
        {"title": "Advanced Supply Chain Systems", "url": "https://ctl.mit.edu/advanced-supply-chain-systems", "type": "course", "source": "MIT Center for Transportation & Logistics", "why": "Explore supply chain design, planning, and analytical decision-making."},
        {"title": "Supply Chain Management learning journey", "url": "https://learning.sap.com/learning-journeys/discovering-sap-s-4hana-supply-chain", "type": "course", "source": "SAP Learning", "why": "Learn core supply chain processes and how enterprise systems support them."},
        {"title": "Supply chain management resources", "url": "https://www.ascm.org/learning-development/", "type": "article", "source": "ASCM", "why": "Find structured professional learning in planning, inventory, and logistics."},
    ],
    "civil": [
        {"title": "Autodesk Civil 3D learning collection", "url": "https://www.autodesk.com/learn/catalog/civil", "type": "course", "source": "Autodesk Learn", "why": "Follow lessons for civil design, surfaces, alignments, and project workflows."},
        {"title": "OSHA construction training resources", "url": "https://www.osha.gov/construction/training", "type": "docs", "source": "OSHA", "why": "Review construction safety training resources and hazard prevention."},
        {"title": "Construction safety and health materials", "url": "https://www.osha.gov/training/library/materials", "type": "article", "source": "OSHA", "why": "Use training materials covering jobsite safety and worker protections."},
    ],
    "mech": [
        {"title": "SOLIDWORKS Getting Started Tutorials", "url": "https://help.solidworks.com/2026/english/swtutorialonline/c_swtut_getting_started_online.htm?id=4", "type": "course", "source": "SOLIDWORKS Help", "why": "Practice part modeling, assemblies, and drawings through guided tutorials."},
        {"title": "Autodesk Fusion learning collection", "url": "https://www.autodesk.com/learn/catalog/fusion360", "type": "course", "source": "Autodesk Learn", "why": "Learn parametric CAD, assemblies, simulation, and manufacturing workflows."},
        {"title": "Fusion mechanical design certification prep", "url": "https://www.autodesk.com/learn/ondemand/course/fusion360-cad-mechanical-design-cert-prep/unit/6MneuyTFUdZfImZct79Kt9", "type": "practice", "source": "Autodesk Learn", "why": "Practice mechanical design workflows and skills used in the certification exam."},
    ],
}


def get_starter_resources(role_key: str) -> list[dict[str, str]]:
    """Return a copy so API callers cannot mutate the in-memory catalog."""
    return deepcopy(STARTER_RESOURCES.get(role_key, []))
