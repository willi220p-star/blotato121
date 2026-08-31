# DGK Asana CSV import pack

Asana CSV import can create **projects, sections, tasks, assignees, collaborators, due dates, tags, and local custom fields**. It cannot create teams, organization-level fields, rules, portfolios, dashboards, My Tasks layouts, templates, or repeating schedules.

This pack gives you importable CSVs for the DGK system, plus a setup checklist project for everything CSV cannot build.

## Files

| File | Import as this Asana project | Team after import |
| --- | --- | --- |
| `csv/00_custom_field_seed.csv` | `DGK — Custom Field Seed (DELETE)` | Any; delete after converting fields |
| `csv/01_CLIENT_project_master_template.csv` | `🏢 CLIENT — [Client Name]` | DGK — Client Operations |
| `csv/02_DGK_Social_Media_Content.csv` | `📱 DGK — Social Media & Content` | DGK — Internal Operations |
| `csv/03_DGK_Intern_Training.csv` | `🎓 DGK — Intern Training` | DGK — Internal Operations |
| `csv/04_DGK_Internal_Admin.csv` | `⚙️ DGK — Internal Admin` | DGK — Internal Operations |
| `csv/05_DGK_Dilip_Master_Tracker.csv` | `📊 DGK — Dilip Master Tracker` | DGK — Admin Command Centre |
| `csv/06_DGK_Setup_Checklist.csv` | `🛠️ DGK — Remaining setup (rules, portfolios, dashboards)` | DGK — Admin Command Centre |

Regenerate the CSVs:

```bash
python3 asana-import/generate_asana_csvs.py
```

## How to import (one project per file)

1. In Asana, open the team (or create the 3 teams first if you can).
2. New project → **Blank project** → **List**.
3. Project title menu → **Import** → **CSV**.
4. Upload the matching file.
5. Check **Use first row as column names**.
6. Map:
   - `Name` → Task name
   - `Description` → Description
   - `Section` → Section
   - `Assignee` → Assignee
   - `Collaborators` → Collaborators
   - `Due Date` → Due date
   - remaining columns → custom fields with the **same names**
7. Import.
8. Delete every task named `— Section placeholder (delete after import)`.
9. Delete the whole seed project after fields are organization-level.

Do **not** import all files into one project. Section names would collide.

## Import order

1. `00_custom_field_seed.csv`
2. Convert the 18 fields to **organization** fields. Colour the dropdown options (CSV cannot set colours).
3. Create the 3 teams if they do not exist.
4. Import `01` through `05` into the matching projects, mapping columns onto the organization fields (do not create duplicates).
5. Import `06` and complete those tasks. That is the work CSV cannot do.

## What the CSVs already contain

- All 18 custom field **names** and every dropdown **option** (via the seed file)
- Client template onboarding tasks (6)
- Social media tasks (4), with recurrence written in the description
- Intern onboarding / practice / weekly check-in tasks, plus the intern welcome note
- 3 SOP tasks in Internal Admin (not marked complete)
- Empty sections created with delete-after-import placeholders
- Dilip / Shuvang emails as specified
- Client dropdown options only: `DGK Internal`, `To Be Assigned`

## What CSV cannot do (native workarounds)

| Spec item | Limitation | Workaround |
| --- | --- | --- |
| 3 teams | CSV cannot create teams | Create in Asana, then move projects. Checklist tasks in `06`. |
| Organization-level fields | CSV fields are **local** to the imported project | Convert seed fields to organization fields before other imports. |
| Field colours | CSV cannot colour dropdown options | Colour them in custom field settings. |
| People fields (`Reviewed By`, `Supervisor`) | CSV creates **text**, not people pickers | Store emails, or recreate as People fields with the same names. |
| URL / long text types | CSV maps extra columns as text or number | `Deliverable Link` is text; paste URLs. Long text still works as text. |
| Rules 1–11 | CSV cannot create rules | Build them from `06`. See that file for each trigger/action. |
| Rule 5 (48h still blocked) | Rules cannot wait 48 hours after a field change | Scheduled rule on tag `⚠️ BLOCKED` last modified > 2 days. |
| Rule 7 (intern inactive 24h) | No “no activity for 24h” + field filter trigger | Daily scheduled rule: Assigned Role = Intern, In Progress, last modified yesterday+. |
| Rule 10 (block empty Completion Notes) | Long-text conditions are limited | If the rule cannot read the field, add a required checklist item. |
| Only Dilip can complete tasks | Asana cannot hide Complete | SOP + reopen rule if completed without `Approved by Dilip`. |
| Interns see only their tasks | Team membership shows project tasks | Do not add interns as full project members; assign them on the task only. |
| Interns cannot create / reassign | CSV cannot set permission roles | Guest / commenter / limited access per intern; SOP for the rest. |
| Portfolios | CSV cannot create portfolios | Create the 3 Dilip-only portfolios from `06`. Nested portfolio 3 may need all projects added if nesting is unavailable. |
| Dashboards | CSV cannot create dashboards | Build both Dilip dashboards from `06`. Widget colour thresholds may be manual. |
| My Tasks views | CSV cannot configure another user’s My Tasks | Each person sets their own My Tasks; instructions are in `06`. |
| Recurring tasks | CSV cannot set Recurring | Open the 4 social tasks + intern check-in and set repeating. |
| Pin SOP tasks | CSV cannot pin | Pin the 3 SOP tasks after import. Do not complete them. |
| Client template | CSV cannot mark a project as a template | Save as template after import. |
| Multi-home / Master Tracker automations | CSV cannot multi-home | Rules 2, 4, 5, 8 in `06`. |
| 3rd allrounder | Name/email not provided | Do not invent. Add when known. |
| Intern list | Variable; emails not provided | Add via the intern guide below. |

## How to add a new intern (under 2 minutes)

1. Invite their email to Asana with the most limited role available.
2. Add them to team **DGK — Internal Operations** only. Do **not** add them to Admin Command Centre.
3. Add them to a client project only when they have a task on that client.
4. In `🎓 DGK — Intern Training`, duplicate the four onboarding tasks and the welcome note; assign the intern where Assigned Role = Intern; set Supervisor to Shuvang (or the 3rd allrounder when known).
5. Tell them: open **My Tasks**, start with today, never mark complete themselves.

## How to add a new client (under 60 seconds)

1. From the `🏢 CLIENT — [Client Name]` **template**, create a project.
2. Rename it to the real client, e.g. `🏢 CLIENT — Acme`.
3. Put it on **DGK — Client Operations**.
4. Add `Client Name` dropdown option for that client (organization field).
5. Set Client Name on the six default tasks.
6. Add the project to portfolio **🏢 DGK — Active Clients**.
7. Add Dilip, Shuvang, and only the interns who will work that client.

## Test tasks (do this after rules exist)

CSV cannot fire rules. After `06` rules are live, create the three test tasks from the original spec in Internal Admin, then delete them.

Emails used in these files:

- Dilip: `Support@dgkbusinessconsultancy.com`
- Shuvang: `Shuvang@dgkbusinessconsultancy.com`
