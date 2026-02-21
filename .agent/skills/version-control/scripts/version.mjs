import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
let type = args.includes('--major') ? 'major' : (args.includes('--minor') ? 'minor' : 'patch');
let message = args.find(a => !a.startsWith('--') && !['major', 'minor', 'patch'].includes(a));

// Auto-detection logic
const getGitStatus = () => {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        return status.split('\n').filter(line => line.trim() !== '');
    } catch (e) {
        return [];
    }
};

const changedFiles = getGitStatus();

if (changedFiles.length === 0 && !args.includes('--force')) {
    console.log('No changes detected. Repository is clean.');
    process.exit(0);
}

if (!message) {
    if (args[0] && !args[0].startsWith('--')) {
        type = ['major', 'minor', 'patch'].includes(args[0]) ? args[0] : 'patch';
        message = args[1] || args[0];
    } else {
        // Intelligence: Generate a default message from changed files
        console.log('Detecting changes...');
        const summaries = changedFiles.map(line => {
            const file = line.substring(3);
            return file.split(/[/\\]/).pop();
        }).slice(0, 3).join(', ');
        message = `update: modified ${summaries}${changedFiles.length > 3 ? ` and ${changedFiles.length - 3} others` : ''}`;
        console.log(`Auto-generated message: "${message}"`);
    }
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

// 1. Read and update package.json
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = pkg.version;
const parts = currentVersion.split('.').map(Number);

if (type === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
} else if (type === 'minor') {
    parts[1]++;
    parts[2] = 0;
} else {
    parts[2]++;
}

const newVersion = parts.join('.');
pkg.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

// 2. Update CHANGELOG.md
const date = new Date().toISOString().split('T')[0];
const changelogEntry = `
## [${newVersion}] - ${date}
### Changed
- ${message}
`;

if (!fs.existsSync(changelogPath)) {
    fs.writeFileSync(changelogPath, `# Changelog\n\nAll notable changes to this project will be documented in this file.\n`);
}

const currentChangelog = fs.readFileSync(changelogPath, 'utf8');
const updatedChangelog = currentChangelog.replace('# Changelog\n', `# Changelog\n${changelogEntry}`);
fs.writeFileSync(changelogPath, updatedChangelog);

console.log(`Bumped version from ${currentVersion} to ${newVersion} (${type})`);

// 3. Git Operations
try {
    console.log('Staging all changes...');
    execSync('git add .');
    execSync(`git commit -m "release: v${newVersion} - ${message}"`);
    execSync(`git tag -a v${newVersion} -m "Release v${newVersion}: ${message}"`);
    console.log(`Successfully committed and tagged v${newVersion}`);
} catch (error) {
    console.error('Git operations failed:', error.message);
}
