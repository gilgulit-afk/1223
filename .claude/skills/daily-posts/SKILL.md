---
name: daily-posts
description: Write today's Facebook/Instagram post and Instagram/Facebook stories (in Hebrew) that market the tantra temple workshops. Use when the user asks for today's posts, stories, social content, a post about a specific workshop, or types /daily-posts. Optional argument - a date (YYYY-MM-DD) or a topic/instruction for this post.
---

# עוזר שיווק יומי – פוסטים וסטוריז

You write ready-to-paste Hebrew social content for Hagit & Gili's tantra temple workshops.

## Steps

1. Read `social/brand.md` fully. It is the single source of truth for facts, voice and rules. Never invent prices, dates, testimonials or numbers that are not in it; if a needed fact is missing, write `[למלא: ...]` in its place.
2. Determine the target date: the argument if it is a date, otherwise today (Asia/Jerusalem). Note the weekday.
3. Look at the last ~7 files in `social/posts/` so you don't repeat the same angle, hook, testimonial or opening line.
4. Pick the angle:
   - **Event phase** (nearest upcoming event in brand.md):
     - more than 21 days away → awareness, education, values (light CTA)
     - 8–21 days → invitation + FAQ + testimonials, clear CTA
     - 2–7 days → countdown, "last places", early-bird deadline if one exists
     - day before / day of → warm "see you tonight" + final call
     - 1–3 days after → thank-you, atmosphere, invitation to the next date
   - **Weekday rotation** (blend with the phase):
     - ראשון – מה זה מקדש טנטרי / ערך חינוכי
     - שני – עדות משתתפ/ת
     - שלישי – מאחורי הקלעים / מי אנחנו
     - רביעי – שאלה נפוצה / ביטחון וגבולות
     - חמישי – הזמנה ישירה לסדנה
     - שישי – השראה רכה לסוף שבוע
     - שבת – סטוריז קליל בלבד (אפשר בלי פוסט)
   - If the user gave a topic or instruction, it overrides the rotation.
5. Write the content in the format below. Respect every rule under "כללי ברזל" in brand.md (Meta-safe wording, no explicit terms, emphasise consent and safety).
6. Save to `social/posts/YYYY-MM-DD.md` (overwrite if it exists), then show the full content to the user.

## Output format (Hebrew)

```markdown
# תוכן ליום <weekday> <DD.MM.YYYY>
**הזווית של היום:** <one line>  ·  **סדנה:** <name, days left>

## 📝 פוסט – פייסבוק
<hook line that stops the scroll>
<body: 80–150 words, short lines, white space>
<CTA + link from brand.md>

## 📸 פוסט – אינסטגרם
<same idea, shorter (60–100 words), CTA "לינק בביו" / "כתבו לנו 'מקדש' בהודעה">
<hashtags: 5–8 from the approved list>

**רעיון לתמונה/קרוסלה:** <what to shoot or which existing image; atmosphere only>

## 📱 סטוריז (3–5 פריימים)
1. **פריים 1:** טקסט על המסך: "..." · רקע: ... · סטיקר: <poll / question / quiz / countdown / link>
2. ...
(last frame always has a link sticker or "שלחו הודעה" CTA)

## 💬 תשובה מוכנה לתגובות/הודעות
<one short, warm reply template for people who comment "פרטים">
```

Keep the Facebook and Instagram texts genuinely different in length and CTA. Use interactive stickers (poll, question box, countdown before events) — they increase reach.
