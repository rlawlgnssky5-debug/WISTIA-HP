# Closed hourly time display — 2026-10-15

- Latest request replaces prior hide-unavailable behavior: retain every hourly start from 13:00 through 22:00
- Disabled starts have a strike-through time, explicit 마감 label and native disabled state
- Half-hour starts remain absent, original operating rules / full-duration collisions / price calculations unchanged
- Click handler rejects disabled buttons defensively
- Passed syntax, five-step inquiry, booking availability UI, capacity, amount animation and calendar refresh tests
- Local DUET Sunday check: ten starts rendered, 18:00–22:00 disabled and struck through, 13:00 selection produces 13:00–15:00
- 360 / 375 / 390 / 1280 / 1440 CSS px: ten time buttons, five disabled labels, strike-through on each closed time and zero horizontal overflow confirmed
- No real booking or external message was created
