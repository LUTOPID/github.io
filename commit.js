const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the script is being run from the root of the git repository
const repoPath = process.cwd();

// Define the start date and the end date
const startDate = new Date('2018-03-15');
const endDate = new Date('2018-12-20');

// Create a file to commit
const fileName = 'fake_history.txt';
fs.writeFileSync(path.join(repoPath, fileName), 'This is a updated commit history file.\n');

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

// Calculate the number of weeks between the start date and end date
const numWeeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));

for (let week = 0; week < numWeeks; week++) {
    const commitCount = getRandomInt(4); // Random number of commits from 0 to 3

    for (let commit = 0; commit < commitCount; commit++) {
        // Choose a random day in the week (excluding Saturday and Sunday)
        let dayOfWeek;
        do {
            dayOfWeek = getRandomInt(5); // Random number from 0 (Monday) to 4 (Friday)
        } while (dayOfWeek === 5 || dayOfWeek === 6);

        const commitDate = new Date(startDate);
        commitDate.setDate(startDate.getDate() + week * 7 + dayOfWeek);

        // Skip if the commit date exceeds the end date
        if (commitDate > endDate) break;

        const commitMessage = `updated commit for ${commitDate.toISOString().split('T')[0]}`;

        // Set the GIT_COMMITTER_DATE and GIT_AUTHOR_DATE environment variables
        const envVars = {
            GIT_COMMITTER_DATE: commitDate.toISOString(),
            GIT_AUTHOR_DATE: commitDate.toISOString(),
        };

        // Run git add, commit, and push commands
        execSync(`git add ${fileName}`, { stdio: 'inherit' });
        execSync(`git commit -m "${commitMessage}"`, { env: envVars, stdio: 'inherit' });
    }
}

// Push the commits to the remote repository
execSync('git push', { stdio: 'inherit' });