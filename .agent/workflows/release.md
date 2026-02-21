---
description: Automatically detect changes, bump version, and create a release tag.
---

# /release Workflow

This workflow simplifies the versioning process. It will automatically detect what files you've changed and create a new versioned snapshot.

// turbo
1. Execute the release script via npm:
   ```bash
   npm run release
   ```

2. If you need a specific version type, you can append flags:
   - For new features: `npm run release -- --minor`
   - For breaking changes: `npm run release -- --major`

3. The system will then:
   - Identify changed files.
   - Update `package.json` and `CHANGELOG.md`.
   - Create a Git Tag (e.g., `v0.1.2`).
   - Cleanly stage and commit all work.
