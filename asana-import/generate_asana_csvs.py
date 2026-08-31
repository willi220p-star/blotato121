#!/usr/bin/env python3
"""Generate DGK Asana CSV import files.

Asana CSV import creates projects, sections, tasks, assignees, and local
custom fields. It cannot create teams, org-level fields, rules, portfolios,
dashboards, My Tasks views, templates, or recurring schedules.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent / "csv"

DILIP = "Support@dgkbusinessconsultancy.com"
SHUVANG = "Shuvang@dgkbusinessconsultancy.com"

BASE_HEADERS = [
    "Name",
    "Description",
    "Section",
    "Assignee",
    "Collaborators",
    "Start Date",
    "Due Date",
    "Type",
    "Tags",
    "Parent Task",
]

CUSTOM_FIELD_HEADERS = [
    "Task Category",
    "Client Name",
    "Project Phase",
    "Priority Level",
    "Task Stage",
    "QA Status",
    "Blocked Reason",
    "Completion Notes",
    "Time Spent (hrs)",
    "Deliverable Link",
    "Metrics / KPIs",
    "Issues / Blockers Encountered",
    "Assigned Role",
    "Reviewed By",
    "Review Date",
    "Admin Notes",
    "Week Number",
    "Supervisor",
]

HEADERS = BASE_HEADERS + CUSTOM_FIELD_HEADERS

TASK_CATEGORY_OPTIONS = [
    "Website Build / Update",
    "GHL / CRM Automation",
    "Social Media Content",
    "SEO / Digital Marketing",
    "Lead Generation / Outreach",
    "Client Onboarding / Admin",
    "Reporting / Data Processing",
    "IT Support / Troubleshooting",
    "Intern Training / Supervision",
    "Internal Admin",
    "Other",
]

CLIENT_NAME_OPTIONS = ["DGK Internal", "To Be Assigned"]

PROJECT_PHASE_OPTIONS = [
    "Discovery",
    "Planning",
    "Execution",
    "Review",
    "Complete",
    "On Hold",
]

PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"]

TASK_STAGE_OPTIONS = [
    "Not Started",
    "In Progress",
    "Blocked",
    "Ready for Review",
    "Revision Needed",
    "Approved",
    "Complete",
]

QA_STATUS_OPTIONS = [
    "Awaiting Submission",
    "Pending Dilip Review",
    "Revision Required",
    "Approved by Dilip",
    "Rejected",
]

BLOCKED_REASON_OPTIONS = [
    "Waiting on Client Response",
    "Waiting on Team Member",
    "Technical Issue",
    "Missing Information or Access",
    "Scope Change",
    "Other — See Comments",
]

ASSIGNED_ROLE_OPTIONS = ["Allrounder / Senior", "Intern", "Admin"]

PLACEHOLDER_DESC = (
    "Placeholder so Asana creates this section during CSV import. "
    "Delete this task after import."
)

SOP_TEAM = """STEP 1 — RECEIVE YOUR TASK
✅ Check your My Tasks board every morning
✅ Start with Today column
✅ Read the full task description
✅ If anything is unclear, comment
   on the task and tag your supervisor
   Do NOT ask via WhatsApp or
   any other channel

STEP 2 — START THE TASK
✅ Change Task Stage → In Progress
✅ Note your start time
✅ If you hit a blocker at any point:
   → Change Task Stage → Blocked
   → Fill in Blocked Reason field
   → Add details in comments
   → Your supervisor is auto-notified

STEP 3 — COMPLETE THE TASK
Before submitting — fill in ALL of these:
✅ Completion Notes — what you did,
   how it went (REQUIRED — cannot submit without)
✅ Time Spent — hours and decimals
   e.g. 1.5 = 1hr 30mins
✅ Deliverable Link — paste the URL
   to your work output
✅ Metrics/KPIs — any numbers
   that show your output
✅ Issues/Blockers — anything that
   slowed you down (even if resolved)

STEP 4 — SUBMIT FOR REVIEW
✅ Change Task Stage → Ready for Review
✅ Dilip is automatically notified
✅ DO NOT mark the task complete yourself
✅ Do not chase Dilip on other channels —
   wait for Asana notification

STEP 5 — AFTER DILIP REVIEWS
If Approved:
✅ You get a notification
✅ Task is marked complete automatically
✅ Nothing else needed

If Revision Required:
✅ Check Admin Notes for Dilip's feedback
✅ Make the changes
✅ Resubmit (repeat from Step 3)"""

SOP_DILIP = """DAILY MORNING — 5 MINUTES MAX

Step 1: Open Daily Morning Briefing dashboard
Step 2: Check "Pending Your Review" widget
  → Open each task
  → Read Completion Notes
  → Check Deliverable Link
  → Set QA Status:
     Approved by Dilip → auto-closes ✅
     Revision Required → add Admin Notes
     explaining what needs changing ✅
Step 3: Check Overdue Tasks widget
  → Comment on the task directly
     (not Slack or WhatsApp)
Step 4: Check Blocked Tasks widget
  → Comment with solution to unblock
Step 5: Check Intern Check-ins widget
  → Follow up if needed
Done ✅ — 5 minutes maximum

WEEKLY FRIDAY — 15 MINUTES

Step 1: Open Weekly Performance dashboard
Step 2: Review completion rates per person
Step 3: Read completion notes on key tasks
Step 4: Check KPIs logged this week
Step 5: Update Portfolio health status
  🟢 On Track
  🟡 At Risk
  🔴 Off Track
Step 6: Plan next week's task delegations
Done ✅"""

SOP_SUPERVISOR = """WHEN ASSIGNING A TASK TO AN INTERN:
✅ Fill in the Supervisor field with your name
✅ Write a clear task description including:
   → Exactly what needs to be done
   → Where to find what they need
   → What "done" looks like specifically
   → Example or reference if possible
✅ Set a realistic due date
✅ Set Priority Level
✅ Set Assigned Role → Intern

MONITORING INTERN TASKS:
✅ Check "Intern Tasks I Supervise"
   column in My Tasks daily
✅ You are auto-notified if an intern
   task has no update for 24 hours
✅ When notified — comment on the task
   to check in. Do not use WhatsApp.
✅ If intern is stuck — help them
   update the Blocked Reason field

REVIEWING INTERN WORK:
✅ Interns submit to Dilip directly
   (Dilip is final approver on all tasks)
✅ You may add a comment on the task
   with your own feedback before
   Dilip reviews if helpful
✅ If intern work is clearly not ready —
   change QA Status to Revision Required
   yourself and add Admin Notes"""

INTERN_WELCOME = """Welcome to DGK on Asana 👋
Here is how your task system works:
1. Check THIS board every morning
2. Start with TODAY column first
3. Change Task Stage to In Progress
   when you start working
4. If you get stuck: change to Blocked
   and fill in the Blocked Reason field
5. Before submitting: fill in ALL fields
   (Completion Notes, Time Spent,
   Deliverable Link, Metrics/KPIs)
6. Change Task Stage to Ready for Review
   DO NOT mark complete yourself
7. Dilip reviews and approves —
   you will get a notification

Duplicate this task for each new intern and assign it to them."""


def empty_fields() -> dict[str, str]:
    return {key: "" for key in CUSTOM_FIELD_HEADERS}


def task(
    name: str,
    description: str = "",
    section: str = "",
    assignee: str = "",
    collaborators: str = "",
    start_date: str = "",
    due_date: str = "",
    task_type: str = "Task",
    tags: str = "",
    parent: str = "",
    **fields: str,
) -> dict[str, str]:
    row = {key: "" for key in HEADERS}
    row["Name"] = name
    row["Description"] = description
    row["Section"] = section
    row["Assignee"] = assignee
    row["Collaborators"] = collaborators
    row["Start Date"] = start_date
    row["Due Date"] = due_date
    row["Type"] = task_type
    row["Tags"] = tags
    row["Parent Task"] = parent
    for key, value in fields.items():
        if key not in CUSTOM_FIELD_HEADERS:
            raise KeyError(f"Unknown custom field: {key}")
        row[key] = value
    return row


def placeholder(section: str) -> dict[str, str]:
    return task(
        name="— Section placeholder (delete after import)",
        description=PLACEHOLDER_DESC,
        section=section,
        **{"Task Stage": "Not Started", "QA Status": "Awaiting Submission"},
    )


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADERS, extrasaction="raise")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def seed_rows() -> list[dict[str, str]]:
    """One row per dropdown option so Asana creates every choice."""
    rows: list[dict[str, str]] = []
    groups = [
        ("Task Category", TASK_CATEGORY_OPTIONS),
        ("Client Name", CLIENT_NAME_OPTIONS),
        ("Project Phase", PROJECT_PHASE_OPTIONS),
        ("Priority Level", PRIORITY_OPTIONS),
        ("Task Stage", TASK_STAGE_OPTIONS),
        ("QA Status", QA_STATUS_OPTIONS),
        ("Blocked Reason", BLOCKED_REASON_OPTIONS),
        ("Assigned Role", ASSIGNED_ROLE_OPTIONS),
    ]
    extras = {
        "Completion Notes": "Seed row. Delete this task after converting fields to organization-level.",
        "Time Spent (hrs)": "1.5",
        "Deliverable Link": "https://www.dgkbusinessconsultancy.com",
        "Metrics / KPIs": "12 leads generated",
        "Issues / Blockers Encountered": "None — field-seed task.",
        "Reviewed By": DILIP,
        "Review Date": "01/05/2026",
        "Admin Notes": "Seed row. Delete after import.",
        "Week Number": "1",
        "Supervisor": SHUVANG,
    }
    defaults = {
        "Task Category": "Internal Admin",
        "Client Name": "DGK Internal",
        "Project Phase": "Planning",
        "Priority Level": "Medium",
        "Task Stage": "Not Started",
        "QA Status": "Awaiting Submission",
        "Blocked Reason": "Other — See Comments",
        "Assigned Role": "Admin",
    }
    for field_name, options in groups:
        for option in options:
            values = dict(defaults)
            values[field_name] = option
            values.update(extras)
            rows.append(
                task(
                    name=f"FIELD SEED — delete: {field_name} = {option}",
                    description=(
                        "Import this project first. Then convert every custom field "
                        "to an organization field. Then delete this whole project. "
                        "Do not assign these tasks to the team."
                    ),
                    section="Field option seed (delete project after conversion)",
                    **values,
                )
            )
    return rows


def client_template_rows() -> list[dict[str, str]]:
    briefing = "📋 Briefing & Onboarding"
    in_progress = "🔧 In Progress"
    senior = "Allrounder / Senior"
    rows = [
        task(
            name="Client discovery call completed",
            description=(
                "Log key points from the discovery call in Completion Notes when done."
            ),
            section=briefing,
            **{
                "Assigned Role": senior,
                "Priority Level": "High",
                "Task Category": "Client Onboarding / Admin",
                "Client Name": "To Be Assigned",
                "Project Phase": "Discovery",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        task(
            name="Client onboarding form sent and received",
            description="Attach form response link in Deliverable Link field.",
            section=briefing,
            **{
                "Assigned Role": senior,
                "Priority Level": "High",
                "Task Category": "Client Onboarding / Admin",
                "Client Name": "To Be Assigned",
                "Project Phase": "Discovery",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        task(
            name="GHL contact created for client",
            description="Paste GHL contact URL in Deliverable Link field.",
            section=briefing,
            **{
                "Assigned Role": senior,
                "Priority Level": "Critical",
                "Task Category": "GHL / CRM Automation",
                "Client Name": "To Be Assigned",
                "Project Phase": "Discovery",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        task(
            name="Access credentials collected",
            description=(
                "Website, socials, tools access collected and stored securely. "
                "Log in Completion Notes."
            ),
            section=briefing,
            **{
                "Assigned Role": senior,
                "Priority Level": "Critical",
                "Task Category": "Client Onboarding / Admin",
                "Client Name": "To Be Assigned",
                "Project Phase": "Discovery",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        task(
            name="Project scope confirmed in writing",
            description="Paste document link in Deliverable Link field.",
            section=briefing,
            **{
                "Assigned Role": senior,
                "Priority Level": "Critical",
                "Task Category": "Client Onboarding / Admin",
                "Client Name": "To Be Assigned",
                "Project Phase": "Planning",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        task(
            name="Initial strategy document prepared",
            description="Link to strategy doc in Deliverable Link field.",
            section=in_progress,
            **{
                "Assigned Role": senior,
                "Priority Level": "High",
                "Task Category": "Client Onboarding / Admin",
                "Client Name": "To Be Assigned",
                "Project Phase": "Planning",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        placeholder("👀 Ready for Dilip Review"),
        placeholder("🔄 Revision Needed"),
        placeholder("✅ Approved & Complete"),
        placeholder("🗄️ Archive"),
    ]
    return rows


def social_media_rows() -> list[dict[str, str]]:
    senior = "Allrounder / Senior"
    rec_note = (
        "CSV cannot create a repeating schedule. After import, open this task "
        "and set Recurring."
    )
    return [
        task(
            name="Weekly content plan — Week [set week number]",
            description=(
                "Plan the week's posts.\n"
                "Log plan link in Deliverable Link.\n\n"
                f"{rec_note}\n"
                "Recurrence: Every Monday.\n"
                "Due: Wednesday same week."
            ),
            section="📅 Content Calendar",
            **{
                "Assigned Role": senior,
                "Priority Level": "High",
                "Task Category": "Social Media Content",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        placeholder("✍️ In Creation"),
        task(
            name="Create social graphics in Canva",
            description=(
                "Paste Canva design link in Deliverable Link.\n\n"
                f"{rec_note}\n"
                "Recurrence: Every Monday.\n"
                "Due: Thursday same week."
            ),
            section="🎨 Design — Canva",
            **{
                "Assigned Role": senior,
                "Priority Level": "High",
                "Task Category": "Social Media Content",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        placeholder("👀 Ready for Dilip Review"),
        task(
            name="Schedule posts for the week",
            description=(
                "Confirm scheduled in Completion Notes.\n\n"
                f"{rec_note}\n"
                "Recurrence: Every Thursday.\n"
                "Due: Friday same week."
            ),
            section="✅ Approved & Scheduled",
            **{
                "Assigned Role": senior,
                "Priority Level": "Medium",
                "Task Category": "Social Media Content",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
        task(
            name="Weekly social media report",
            description=(
                "Log reach, engagement, follower change in Metrics/KPIs field.\n\n"
                f"{rec_note}\n"
                "Recurrence: Every Friday.\n"
                "Due: Friday same week."
            ),
            section="📢 Published",
            **{
                "Assigned Role": senior,
                "Priority Level": "Medium",
                "Task Category": "Social Media Content",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
            },
        ),
    ]


def intern_training_rows() -> list[dict[str, str]]:
    senior = "Allrounder / Senior"
    rec_note = (
        "CSV cannot create a repeating schedule. After import, set Recurring: "
        "Weekly (every Monday)."
    )
    return [
        task(
            name="Welcome to DGK on Asana 👋 (duplicate for each intern)",
            description=INTERN_WELCOME,
            section="📚 Intern Onboarding",
            **{
                "Assigned Role": "Intern",
                "Priority Level": "Critical",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
                "Supervisor": SHUVANG,
            },
        ),
        task(
            name="Intern Asana access set up",
            description=(
                "Created fresh for every new intern from this project's task template. "
                "Duplicate this task, assign the intern's supervisor in Supervisor, "
                "and complete before the intern starts work."
            ),
            section="📚 Intern Onboarding",
            **{
                "Assigned Role": senior,
                "Priority Level": "Critical",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
                "Supervisor": SHUVANG,
            },
        ),
        task(
            name="Intern briefed on task SOP",
            description=(
                "Walk intern through the 5-step task process. "
                "Confirm understood in Completion Notes."
            ),
            section="📚 Intern Onboarding",
            **{
                "Assigned Role": senior,
                "Priority Level": "Critical",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
                "Supervisor": SHUVANG,
            },
        ),
        task(
            name="Intern completes first practice task",
            description="Intern's first real task to test the workflow end to end.",
            section="🔄 Active Training Tasks",
            **{
                "Assigned Role": "Intern",
                "Priority Level": "High",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
                "Supervisor": SHUVANG,
            },
        ),
        placeholder("📝 Skill Assessments"),
        task(
            name="First week supervisor check-in",
            description=(
                "Weekly supervisor check-in for the intern.\n\n"
                f"{rec_note}"
            ),
            section="👀 Supervisor Review",
            assignee=SHUVANG,
            **{
                "Assigned Role": senior,
                "Priority Level": "High",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "Not Started",
                "QA Status": "Awaiting Submission",
                "Supervisor": SHUVANG,
            },
        ),
        placeholder("✅ Training Signed Off"),
    ]


def internal_admin_rows() -> list[dict[str, str]]:
    ongoing = "🔄 Ongoing Operations"
    return [
        task(
            name="📋 TEAM SOP — How to Handle Any Task",
            description=SOP_TEAM,
            section=ongoing,
            assignee=DILIP,
            collaborators=SHUVANG,
            **{
                "Assigned Role": "Admin",
                "Priority Level": "Critical",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "In Progress",
                "QA Status": "Approved by Dilip",
            },
        ),
        task(
            name="👑 DILIP SOP — Daily Review Routine",
            description=SOP_DILIP,
            section=ongoing,
            assignee=DILIP,
            **{
                "Assigned Role": "Admin",
                "Priority Level": "Critical",
                "Task Category": "Internal Admin",
                "Client Name": "DGK Internal",
                "Task Stage": "In Progress",
                "QA Status": "Approved by Dilip",
            },
        ),
        task(
            name="🎓 SUPERVISOR SOP — Managing Interns",
            description=SOP_SUPERVISOR,
            section=ongoing,
            assignee=SHUVANG,
            collaborators=DILIP,
            **{
                "Assigned Role": "Allrounder / Senior",
                "Priority Level": "Critical",
                "Task Category": "Intern Training / Supervision",
                "Client Name": "DGK Internal",
                "Task Stage": "In Progress",
                "QA Status": "Approved by Dilip",
                "Supervisor": SHUVANG,
            },
        ),
        placeholder("📊 Reporting & Data"),
        placeholder("🛠️ Tools & Systems"),
        placeholder("💼 Business Development"),
        placeholder("✅ Done"),
    ]


def master_tracker_rows() -> list[dict[str, str]]:
    return [
        placeholder("🔴 Needs Immediate Attention"),
        placeholder("👀 Pending Dilip Review"),
        placeholder("🔄 All In Progress — Full Team"),
        placeholder("✅ Approved This Week"),
        placeholder("📋 Full Task History"),
    ]


def setup_checklist_rows() -> list[dict[str, str]]:
    """Tasks that CSV cannot create: teams, rules, portfolios, dashboards, views."""
    section_teams = "1. Teams (CSV cannot create teams)"
    section_fields = "2. Convert custom fields to organization-level"
    section_projects = "3. Place projects in the correct team"
    section_portfolios = "4. Portfolios (CSV cannot create portfolios)"
    section_rules = "5. Automation rules (CSV cannot create rules)"
    section_dashboards = "6. Dashboards (CSV cannot create dashboards)"
    section_mytasks = "7. My Tasks views (CSV cannot configure other users)"
    section_recurring = "8. Recurring schedules (CSV cannot set recurrence)"
    section_template = "9. Save client project as Asana template"
    admin = {"Assigned Role": "Admin", "Priority Level": "Critical", "Task Category": "Internal Admin", "Client Name": "DGK Internal", "Task Stage": "Not Started", "QA Status": "Awaiting Submission"}

    def item(name: str, description: str, section: str) -> dict[str, str]:
        return task(name=name, description=description, section=section, assignee=DILIP, **admin)

    return [
        item(
            "Create team: DGK — Client Operations",
            "Members: Dilip (admin), Shuvang (senior). Add 3rd allrounder when known. "
            "Add interns per client project only.\nVisibility: Members only.",
            section_teams,
        ),
        item(
            "Create team: DGK — Internal Operations",
            "Members: Dilip, Shuvang, all interns. Add 3rd allrounder when known.\n"
            "Visibility: team. Interns still only see tasks assigned to them if project "
            "privacy and assignee visibility are set correctly.",
            section_teams,
        ),
        item(
            "Create team: DGK — Admin Command Centre",
            "Members: Dilip ONLY. Private. Shuvang and interns must not see this team.",
            section_teams,
        ),
        item(
            "Invite Shuvang@dgkbusinessconsultancy.com",
            "Invite with a non-admin role. Do not make Shuvang a workspace admin.",
            section_teams,
        ),
        item(
            "Convert all 18 CSV custom fields to organization fields",
            "After importing 00_custom_field_seed.csv, open each field → "
            "Add to organization / make global. Option colours cannot be set by CSV: "
            "colour Task Category and Priority Level options in field settings.\n\n"
            "People fields workaround: CSV creates Reviewed By and Supervisor as text. "
            "Create People-type fields with those exact names if you want native people "
            "pickers, then hide the text versions.",
            section_fields,
        ),
        item(
            "Move 🏢 CLIENT — [Client Name] into Client Operations and save as template",
            "Import 01 CSV into a project named 🏢 CLIENT — [Client Name]. "
            "Then Customize → Save as template. Delete placeholder tasks first.",
            section_projects,
        ),
        item(
            "Move Social Media, Intern Training, Internal Admin into Internal Operations",
            "Import 02, 03, and 04 CSVs as three projects on that team. "
            "Delete placeholder tasks after sections exist.",
            section_projects,
        ),
        item(
            "Move 📊 DGK — Dilip Master Tracker into Admin Command Centre",
            "Import 05 CSV. Dilip only. Display all 18 custom fields on this project.",
            section_projects,
        ),
        item(
            "Portfolio: 🏢 DGK — Active Clients",
            "Team: Admin Command Centre. Add the client template and every future "
            "client project. Columns: Project name, health (On Track / At Risk / Off Track), "
            "% complete, overdue count, owner, start date, due date, last activity.",
            section_portfolios,
        ),
        item(
            "Portfolio: 📋 DGK — Internal Operations",
            "Add Social Media, Intern Training, and Internal Admin projects.",
            section_portfolios,
        ),
        item(
            "Portfolio: 🌐 DGK — Full Business Overview",
            "Add Portfolio 1 + Portfolio 2 if nested portfolios are available on Advanced. "
            "If nested portfolios are not available, add every project from both portfolios "
            "into this one portfolio.",
            section_portfolios,
        ),
        item(
            "Rule 1 — Ready for Review → notify Dilip",
            "Apply to ALL projects.\nTrigger: Task Stage changed to Ready for Review.\n"
            "Actions: assign Dilip; move to Ready for Dilip Review; QA Status = "
            "Pending Dilip Review; comment with the review checklist; due date = "
            "today + 1 business day.\n"
            "Workaround if a project has no matching section name: skip the move or "
            "map to that project's review section.",
            section_rules,
        ),
        item(
            "Rule 2 — Approved → auto close",
            "Trigger: QA Status = Approved by Dilip.\n"
            "Actions: Task Stage = Complete; move to Approved & Complete; mark complete; "
            "Review Date = today (Asana may not write custom date fields from rules — "
            "if so, Dilip fills Review Date); notify original assignee; multi-home to "
            "Master Tracker → Approved This Week.\n"
            "Limitation: rules often cannot store the original assignee. Workaround: "
            "keep the original assignee as a collaborator before reassigning to Dilip "
            "in Rule 1, then notify collaborators.",
            section_rules,
        ),
        item(
            "Rule 3 — Revision Required → return to assignee",
            "Trigger: QA Status = Revision Required.\n"
            "Actions: Task Stage = Revision Needed; move to Revision Needed; reassign "
            "to original assignee (use collaborator workaround if needed); extend due "
            "date +1 business day; notify assignee.",
            section_rules,
        ),
        item(
            "Rule 4 — Overdue → flag + alert Dilip",
            "Trigger: due date passed AND Task Stage is not Complete and not Approved.\n"
            "Actions: tag 🔴 OVERDUE; Priority = Critical; notify assignee; notify Dilip; "
            "multi-home to Master Tracker → Needs Immediate Attention.\n"
            "Limitation: Asana has no Task Stage value named Approved (use Complete). "
            "Tag names must be created once in the workspace.",
            section_rules,
        ),
        item(
            "Rule 5 — Blocked → alert Dilip",
            "Trigger: Task Stage = Blocked.\n"
            "Actions: tag ⚠️ BLOCKED; add Dilip as collaborator; notify Dilip; "
            "multi-home to Needs Immediate Attention; comment to fill Blocked Reason.\n"
            "48-hour follow-up: native rules cannot wait 48 hours after a field change. "
            "Workaround: a second rule on a due date, or a scheduled rule that finds "
            "tasks with tag ⚠️ BLOCKED last modified more than 2 days ago.",
            section_rules,
        ),
        item(
            "Rule 6 — New task missing fields",
            "Trigger: task added to project.\n"
            "If no due date / no assignee, comment to creator. Set defaults: "
            "Task Stage = Not Started; QA Status = Awaiting Submission; "
            "Priority Level = Medium unless already set.",
            section_rules,
        ),
        item(
            "Rule 7 — Intern inactive 24hrs",
            "Apply to Intern Training and every Client Operations project.\n"
            "Native limitation: Asana cannot trigger on Assigned Role = Intern AND "
            "no activity for 24 hours in one rule. Workaround: a scheduled rule "
            "(daily) filtering Assigned Role = Intern, Task Stage = In Progress, "
            "last modified yesterday or earlier. Notify Supervisor (People field) "
            "if available; otherwise notify Shuvang and Dilip.",
            section_rules,
        ),
        item(
            "Rule 8 — Approved task archive to Master Tracker",
            "Trigger: task completed AND QA Status = Approved by Dilip.\n"
            "Multi-home to Master Tracker → Approved This Week. Overlaps Rule 2; "
            "keep both if Rule 2 cannot multi-home.",
            section_rules,
        ),
        item(
            "Rule 9 — Monday 8:00 AM reset",
            "Master Tracker only. Move Approved This Week → Full Task History. "
            "Notify Dilip. Use a scheduled rule.",
            section_rules,
        ),
        item(
            "Rule 10 — Completion Notes missing → block submission",
            "Native limitation: Asana rules cannot read a long-text field and revert "
            "another field in one guaranteed native rule on all plans. Workaround: "
            "Rule 1 still fires on Ready for Review; add a branch/condition "
            "Completion Notes is empty → set Task Stage back to In Progress and "
            "comment the assignee. If conditions cannot inspect long text, require "
            "Completion Notes in the task description checklist instead.",
            section_rules,
        ),
        item(
            "Rule 11 — Deliverable Link missing → warn",
            "On Ready for Review, if Deliverable Link is empty: comment the reminder "
            "and notify Dilip. Do not block submission. Same text-field condition "
            "limitation as Rule 10; use a URL/text custom field condition if available.",
            section_rules,
        ),
        item(
            "Dashboard: ⚡ DGK — Daily Morning Briefing",
            "Admin Command Centre, Dilip only. Widgets: overdue (tag 🔴 OVERDUE); "
            "blocked (tag ⚠️ BLOCKED); pending review (QA Status = Pending Dilip Review); "
            "bar chart tasks due today by assignee; intern check-ins (tag 👀 NEEDS CHECK-IN "
            "and Assigned Role = Intern); completion rate this week.\n"
            "Limitation: colour thresholds on number charts and 'days blocked' are not "
            "always native. Use a report or custom number field if the widget cannot "
            "colour-code >80% / 50–80% / <50%.",
            section_dashboards,
        ),
        item(
            "Dashboard: 📊 DGK — Weekly Performance",
            "10 widgets as specified: completed by person; time spent by person; "
            "category pie; client bar; completion notes list; KPIs list; overdue count; "
            "in progress last modified >48h; intern activity; three number widgets.\n"
            "Limitation: summing Time Spent (hrs) by person needs the number field on "
            "tasks and a chart that supports custom number fields (Advanced).",
            section_dashboards,
        ),
        item(
            "Configure Shuvang My Tasks board",
            "CSV cannot set another person's My Tasks. Shuvang: My Tasks → Board with "
            "columns Today; This Week; In Progress; Overdue; Blocked; Intern Tasks I "
            "Supervise (Supervisor = Shuvang); Done This Week. Card fields: Priority, "
            "Client Name, Task Category, due date, Task Stage, Assigned Role. Sort due date.",
            section_mytasks,
        ),
        item(
            "Configure intern My Tasks list",
            "CSV cannot set intern views or hide other people's tasks beyond Asana privacy. "
            "Workaround for 'interns see only their own tasks': do not add interns to "
            "full teams as project members; add each intern only as assignee/collaborator "
            "on their tasks, or use a private per-intern project. Comment-only / limited "
            "roles cannot be fully enforced by CSV. Interns should use list sections: "
            "Today + overdue; This Week; In Progress; Blocked; Completed This Week.",
            section_mytasks,
        ),
        item(
            "Set weekly recurrence on 4 Social Media tasks and intern check-in",
            "Open each task → Set repeating. Social: Mon/Thu/Fri as specified. "
            "Intern check-in: every Monday.",
            section_recurring,
        ),
        item(
            "Pin the 3 SOP tasks to the top of Ongoing Operations",
            "CSV cannot pin. In Internal Admin, pin TEAM SOP, DILIP SOP, SUPERVISOR SOP. "
            "Do not mark them complete.",
            section_recurring,
        ),
        item(
            "Save client project as Asana template",
            "After deleting placeholders, save 🏢 CLIENT — [Client Name] as a template "
            "so a new client can be created in under 60 seconds.",
            section_template,
        ),
        item(
            "Create tags: 🔴 OVERDUE, ⚠️ BLOCKED, 👀 NEEDS CHECK-IN",
            "Create these tags once so rules can apply them.",
            section_rules,
        ),
        item(
            "Only Dilip can mark tasks complete",
            "Native limitation: Asana cannot stop assignees from completing tasks. "
            "Workaround: SOP + Rule 2 (Dilip approval completes the task) + comment "
            "rule if someone else completes a task without QA Status = Approved by Dilip "
            "(reopen it and notify Dilip).",
            section_rules,
        ),
    ]


def validate(files: dict[str, list[dict[str, str]]]) -> dict:
    report: dict = {"files": {}, "errors": []}
    for name, rows in files.items():
        sections = []
        for row in rows:
            if row["Section"] not in sections:
                sections.append(row["Section"])
            extra = set(row) - set(HEADERS)
            missing = set(HEADERS) - set(row)
            if extra:
                report["errors"].append(f"{name}: extra keys {sorted(extra)}")
            if missing:
                report["errors"].append(f"{name}: missing keys {sorted(missing)}")
            if not row["Name"]:
                report["errors"].append(f"{name}: empty Name")
            if row["Type"] != "Task":
                report["errors"].append(f"{name}: Type must be Task")
        invented_clients = {
            row["Client Name"]
            for row in rows
            if row["Client Name"] and row["Client Name"] not in CLIENT_NAME_OPTIONS
        }
        if invented_clients:
            report["errors"].append(f"{name}: unexpected clients {sorted(invented_clients)}")
        report["files"][name] = {
            "rows": len(rows),
            "sections": sections,
            "assignees": sorted({row["Assignee"] for row in rows if row["Assignee"]}),
        }
    # Seed must include every dropdown option.
    seed = files["00_custom_field_seed.csv"]
    checks = {
        "Task Category": TASK_CATEGORY_OPTIONS,
        "Client Name": CLIENT_NAME_OPTIONS,
        "Project Phase": PROJECT_PHASE_OPTIONS,
        "Priority Level": PRIORITY_OPTIONS,
        "Task Stage": TASK_STAGE_OPTIONS,
        "QA Status": QA_STATUS_OPTIONS,
        "Blocked Reason": BLOCKED_REASON_OPTIONS,
        "Assigned Role": ASSIGNED_ROLE_OPTIONS,
    }
    for field, options in checks.items():
        found = {row[field] for row in seed}
        missing_opts = [opt for opt in options if opt not in found]
        if missing_opts:
            report["errors"].append(f"seed missing {field} options: {missing_opts}")
    report["ok"] = not report["errors"]
    report["total_rows"] = sum(len(rows) for rows in files.values())
    return report


def main() -> None:
    files = {
        "00_custom_field_seed.csv": seed_rows(),
        "01_CLIENT_project_master_template.csv": client_template_rows(),
        "02_DGK_Social_Media_Content.csv": social_media_rows(),
        "03_DGK_Intern_Training.csv": intern_training_rows(),
        "04_DGK_Internal_Admin.csv": internal_admin_rows(),
        "05_DGK_Dilip_Master_Tracker.csv": master_tracker_rows(),
        "06_DGK_Setup_Checklist.csv": setup_checklist_rows(),
    }
    report = validate(files)
    if not report["ok"]:
        raise SystemExit("CSV validation failed:\n" + "\n".join(report["errors"]))
    OUT.mkdir(parents=True, exist_ok=True)
    for name, rows in files.items():
        write_csv(OUT / name, rows)
    (OUT / "validation_report.json").write_text(
        json.dumps(report, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
