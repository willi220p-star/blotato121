# dgk-signal-source

Generated 2026-08-25T01:22:47.821355+00:00. Queue `tier1`.

## Policy
- LinkedIn: Company page URLs are recorded only. LinkedIn robots.txt and ToS forbid automated crawling.
- SEEK: Only robots-allowed search URLs with ?keywords= or ?advertiserid= are fetched. Individual /job/ listings are never requested.
- Company sites: About Us and careers pages on the company host are scraped when robots.txt allows.

## Signals
- **hiring** @ Triple R Community Service (confidence 0.85) — https://www.triplerccs.com.au/career/
  - …e (NDIS) Support Cordination | NDIS NDIS Worker Screening Check Worker Orientation Module Referral DVA Career Contact Us Career Home Career Want to work with us? Please fill this form and send it to us by clicking ‘Apply Now’ button. We will contact you as soon as possible. Contact us: Sydney: World…
- **expansion** @ Triple R Community Service (confidence 0.58) — https://www.triplerccs.com.au/career/
  - Offices or locations listed in Sydney, Melbourne.

## Sources
- `ok` robots: https://www.triplerccs.com.au/robots.txt — HTTP 200
- `ok` home: https://www.triplerccs.com.au/ — HTTP 200
- `ok` about: https://www.triplerccs.com.au/about-us/ — HTTP 200
- `ok` careers: https://www.triplerccs.com.au/career/ — HTTP 200
- `blocked` job_board: https://www.seek.com.au/jobs?keywords=support+worker — Cloudflare challenge on SEEK search (robots-allowed ?keywords= only; /job/ never fetched)
- `skipped` job_board: https://www.seek.com.au/jobs?keywords=registered+nurse — SEEK already Cloudflare-blocked this run; not retrying every keyword
- `skipped` job_board: https://www.seek.com.au/jobs?keywords=NDIS+support — SEEK already Cloudflare-blocked this run; not retrying every keyword
- `ok` robots: https://dgkbusinessconsultancy.com/robots.txt — HTTP 200
- `ok` home: https://dgkbusinessconsultancy.com/ — HTTP 200
- `ok` about: https://dgkbusinessconsultancy.com/about — HTTP 200
- `skipped` careers: https://dgkbusinessconsultancy.com/joinourteam — HTTP 404
- `skipped` job_board: https://www.seek.com.au/jobs?keywords=Marketing+Manager — SEEK already Cloudflare-blocked this run; not retrying every keyword
- `skipped` job_board: https://www.seek.com.au/jobs?keywords=Business+Development+Manager — SEEK already Cloudflare-blocked this run; not retrying every keyword

## LinkedIn watch (not scraped)
- DGK Business Consultancy: https://www.linkedin.com/company/dgk-business-consultancy
