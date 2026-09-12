# SaveWorld

Household savings and spend tracker. Each person has their own dashboard. Together shows the joint total.

- Monthly earnings by source
- Spends by category you add
- Estimated savings = earnings − spend
- Actual savings typed from the bank
- Gap = actual − estimated (minus if you saved less)
- Investments
- 24 months of history
- Copy a month forward, export / import JSON
- At month end, if the gap is negative, both of you get a shortfall note

Data stays in this browser (`localStorage`). A month-end shortfall mail goes to `regmisushant94@gmail.com` and `ishadhakal67@gmail.com` only when a bank actual is entered and the gap is behind. It does not mail on every visit.

## Run

```bash
cd saveworld
npm install
npm run dev
```

```bash
npm test
npm run build
```
