# Fork Workflow - OpenHealth Development

## Overview

This document outlines how we use our fork (`kryptobaseddev/open-health`) as a testing ground before contributing to the upstream project (`OpenHealthForAll/open-health`).

## Repository Structure

```
OpenHealthForAll/open-health (UPSTREAM)
    ↓ forked
kryptobaseddev/open-health (YOUR FORK - Testing Ground)
    ↓ cloned locally
/mnt/projects/open-health (LOCAL DEVELOPMENT)
```

## Git Remotes Configuration

```bash
origin    → kryptobaseddev/open-health (your fork)
upstream  → OpenHealthForAll/open-health (original project)
```

## Development Workflow

### Phase 1: Develop & Test on Fork

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature
   ```

2. **Implement Following PR Guidelines**
   - Max 200 lines per PR
   - One feature per PR
   - Test locally first

3. **Create PR to Your Fork**
   ```bash
   git push origin feat/your-feature
   gh pr create --title "feat: Your Feature" --body "Description..."
   ```

4. **Test Thoroughly**
   - Merge PR to your fork's main
   - Deploy to your test environment
   - Validate functionality
   - Check for any issues

### Phase 2: Contribute to Upstream

Only after successful testing on your fork:

1. **Sync with Upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git push origin main
   ```

2. **Create Upstream Branch**
   ```bash
   git checkout -b feat/your-feature-upstream upstream/main
   git cherry-pick <tested-commit-hash>
   ```

3. **Create Upstream PR**
   ```bash
   git push origin feat/your-feature-upstream
   gh pr create --repo OpenHealthForAll/open-health \
     --base main \
     --head kryptobaseddev:feat/your-feature-upstream \
     --title "feat: Your Feature" \
     --body "Tested and validated on kryptobaseddev/open-health#123"
   ```

## Current PRs Status

### Testing Phase (Your Fork)
- **PR #2**: [Encryption Upgrade](https://github.com/kryptobaseddev/open-health/pull/2)
  - Status: Ready for testing
  - Size: 162 lines, 1 file
  - Next: Merge and test encryption functionality

- **PR #3**: [Rate Limiting](https://github.com/kryptobaseddev/open-health/pull/3)
  - Status: Ready for testing
  - Size: 185 lines, 1 file
  - Next: Merge and test rate limiting

### Upstream Phase
- To be created after successful fork testing

## Testing Checklist

Before contributing to upstream, verify on your fork:

- [ ] Build passes (`npm run build`)
- [ ] App runs locally (`npm run dev`)
- [ ] Feature works as expected
- [ ] No regressions in existing functionality
- [ ] No security vulnerabilities introduced
- [ ] Performance is acceptable
- [ ] Mobile responsive (if UI changes)

## Merge Strategy

### On Your Fork
- Use **Squash and Merge** to keep clean history
- Include comprehensive commit messages

### To Upstream
- Create **separate branch** from upstream/main
- Cherry-pick tested commits
- Reference fork testing in PR description

## Benefits of This Workflow

1. **Risk Mitigation**: Test changes thoroughly before upstream contribution
2. **Quality Assurance**: Catch issues in controlled environment
3. **Documentation**: Fork PRs serve as testing documentation
4. **Iteration Speed**: Fast feedback loop on your fork
5. **Confidence**: Submit only validated, working code upstream

## Example PR Description for Upstream

```markdown
## Summary
Upgrades encryption from AES-256-CBC to AES-256-GCM with backward compatibility.

## Testing
This change has been thoroughly tested on my fork:
- Fork PR: kryptobaseddev/open-health#2
- Testing environment: [link to deployment]
- Test results: All encryption/decryption working correctly
- Backward compatibility: Verified with existing data

## Changes
[list of changes]

## How to Test
[testing instructions]
```

## Keeping Fork in Sync

Weekly sync to prevent drift:

```bash
# Fetch upstream changes
git fetch upstream

# Update your main branch
git checkout main
git merge upstream/main
git push origin main

# Update any active branches
git checkout your-feature-branch
git rebase main
```

## Emergency Workflow

For critical fixes that need immediate upstream contribution:

1. Create fix on your fork
2. Test rapidly but thoroughly
3. Create upstream PR immediately
4. Mark as "urgent" with testing details

## Documentation Updates

When contributing documentation changes:

1. Test on your fork's GitHub Pages (if enabled)
2. Verify all links work
3. Check formatting and spelling
4. Then contribute to upstream

---

*This workflow ensures high-quality contributions while maintaining rapid development velocity.*