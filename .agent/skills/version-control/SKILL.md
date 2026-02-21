---
name: version-control
description: Implements Semantic Versioning (SemVer) and automated changelog management for the Feel Japan ecosystem.
---

# Version Control & Lifecycle Management

**Goal:** Ensure every change is tracked, versioned, and documented to prevent "messed up" states and provide clear rollback points.

## 1. Semantic Versioning (SemVer)
We follow the `MAJOR.MINOR.PATCH` format:
- **MAJOR:** Incompatible API changes or total redesigns.
- **MINOR:** New functionality in a backwards-compatible manner (e.g., a new brochure type).
- **PATCH:** Backwards-compatible bug fixes or minor content corrections.

## 2. Commit Categories (Conventional Commits)
All commits and changelog entries must use these prefixes:
- `feat:` A new feature for the agent or partner.
- `fix:` A bug fix (e.g., fixing itinerary durations).
- `docs:` Documentation changes only.
- `style:` Changes that do not affect the meaning of the code (white-space, formatting).
- `refactor:` A code change that neither fixes a bug nor adds a feature.
- `perf:` A code change that improves performance.
- `chore:` Updating build tasks, package manager configs, etc.

## 3. Automated Changelog
Maintain a `CHANGELOG.md` in the root directory. Every version bump MUST append a new section describing the changes.

## 4. Tagging Protocol
For every release (e.g., moving from 0.1.0 to 0.1.1):
1. Update `package.json` version.
2. Update `CHANGELOG.md`.
3. Commit both files with message `release: vX.Y.Z`.
4. Create a git tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`.

## 5. Usage
### Manual Release (Recommended)
Specify the bump type and a descriptive message:
```bash
node .agent/skills/version-control/scripts/version.mjs patch "Short description of changes"
```

### Auto-Pilot Mode
The skill can detect changed files and generate a baseline message automatically:
```bash
node .agent/skills/version-control/scripts/version.mjs
```
*Defaults to `patch` and `git add .` to ensure nothing is lost.*

## Constraints
- Never commit directly to `master` for major features without a version bump.
- The `v` prefix is mandatory for tags (e.g., `v1.0.0`).
- If a revert is needed, use `git checkout tags/vX.Y.Z`.
