# Johnny.Decimal Blog Post Naming Guide

## Quick Reference

### Category IDs
- **10** - Tech (Technology & Development)
- **20** - Travel (Travel & Exploration)
- **30** - Spiritual (Spirituality & Philosophy)
- **40** - Money (Finance & Money Matters)
- **50** - Personal (Personal Stories & Life)
- **60** - Health (Health & Wellness) - Future

### Naming Format
```
{category-id}.{post-id}-{descriptive-slug}.mdx
```

### Examples
- `10.0001-getting-started.mdx` (Tech category, 1st post)
- `30.0002-15-books-every-bharatiya-must-read.mdx` (Spiritual category, 2nd post)
- `40.0001-triple-witching-hour-explained.mdx` (Money category, 1st post)

## Current Post Counts
- **Tech (10)**: 8 posts (10.0001 - 10.0008)
- **Travel (20)**: 1 post (20.0001)
- **Spiritual (30)**: 2 posts (30.0001 - 30.0002)
- **Money (40)**: 1 post (40.0001)
- **Personal (50)**: 0 posts
- **Health (60)**: 0 posts

## Next Available IDs
- **Tech**: 10.0009
- **Travel**: 20.0002
- **Spiritual**: 30.0003
- **Money**: 40.0002
- **Personal**: 50.0001
- **Health**: 60.0001

## Rules
1. Always use leading zeros (0001, 0002, not 1, 2)
2. Never skip numbers or reuse them
3. Keep descriptive slug under 50 characters
4. Use kebab-case for descriptive part
5. Category IDs are fixed and never change

## Benefits
- IDE files sort numerically and stay organized
- Easy to reference specific posts ("check 10.0003")
- Scalable to 9999 posts per category
- Prevents file chaos as content grows 