# GitHub Setup Guide for RadOrderPad

This guide will walk you through setting up your RadOrderPad project on GitHub, while preserving all your existing documentation and project structure.

## Prerequisites

- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub](https://github.com/) account
- VS Code with the Source Control extension (which comes pre-installed)

## Step 1: Organize the Repository

Before initializing the repository, it's a good idea to organize your files:

1. Run the organization script to move loose files into appropriate directories:
   ```
   node organize-root-directory.js
   ```

2. Review the changes to make sure everything is organized as expected.

   **Note**: The organization script is designed to preserve all your existing documentation and project structure. It only moves loose files in the root directory to more appropriate locations.

## Step 2: Initialize the Repository

There are two ways to initialize the repository:

### Option 1: Using VS Code Source Control

1. Click on the Source Control icon in the VS Code sidebar (or press `Ctrl+Shift+G`).
2. Click the "Initialize Repository" button.

### Option 2: Using the Terminal

1. Open a terminal in VS Code (Terminal > New Terminal).
2. Run the following command:
   ```
   git init
   ```

## Step 3: Make the Initial Commit

1. In the Source Control panel, you'll see a list of all files that will be added to the repository.
2. You can click the "+" icon next to each file to stage it, or click the "+" icon next to "Changes" to stage all files.
3. Enter a commit message like "Initial commit" in the text box at the top of the Source Control panel.
4. Click the checkmark icon (✓) to commit the staged changes.

## Step 4: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in.
2. Click the "+" icon in the top-right corner and select "New repository".
3. Enter "RadOrderPad" as the repository name (or "RadOrderPad vRoo" as you suggested).
4. Add a description (optional).
5. Choose whether the repository should be public or private.
6. Do NOT initialize the repository with a README, .gitignore, or license (since we're pushing an existing repository).
7. Click "Create repository".

## Step 5: Push to GitHub

### Option 1: Using VS Code Source Control

1. In the Source Control panel, click the "..." menu and select "Remote" > "Add Remote...".
2. Enter the URL of your GitHub repository (e.g., `https://github.com/yourusername/RadOrderPad.git`).
3. Give the remote a name (typically "origin").
4. Click the "..." menu again and select "Push" (or click the cloud icon with an up arrow).

### Option 2: Using the Terminal

1. Open a terminal in VS Code.
2. Run the following commands:
   ```
   git remote add origin https://github.com/yourusername/RadOrderPad.git
   git branch -M main
   git push -u origin main
   ```

### Option 3: Using the "Publish to GitHub" Button

1. In the Source Control panel, you should see a "Publish to GitHub" button.
2. Click this button.
3. Follow the prompts to create a new GitHub repository and push your code.

## Step 6: Verify the Repository

1. Go to your GitHub account and check that the repository has been created and the code has been pushed.
2. Verify that the README.md is displayed on the repository's main page.
3. Check that the .gitignore file is working correctly by ensuring that node_modules and other excluded files are not in the repository.
4. Confirm that all your existing documentation is properly included in the repository.

## Additional Tips

### Branching Strategy

For future development, consider using a branching strategy:

1. Create a new branch for each feature or bug fix:
   ```
   git checkout -b feature/new-feature-name
   ```

2. Make your changes and commit them.

3. Push the branch to GitHub:
   ```
   git push -u origin feature/new-feature-name
   ```

4. Create a Pull Request on GitHub to merge the changes into the main branch.

### Handling Large Files

If you need to work with large files (like database dumps), consider using [Git LFS](https://git-lfs.github.com/) (Large File Storage).

### Protecting the Main Branch

To prevent accidental pushes to the main branch:

1. Go to your repository on GitHub.
2. Click on "Settings" > "Branches".
3. Add a branch protection rule for the main branch.
4. Enable options like "Require pull request reviews before merging" and "Require status checks to pass before merging".

## Troubleshooting

### Authentication Issues

If you encounter authentication issues when pushing to GitHub:

1. Make sure you're using the correct GitHub credentials.
2. Consider setting up SSH keys for more secure authentication.
3. Use a credential manager like Git Credential Manager to store your credentials securely.

### Large Files Issues

If you get errors about large files:

1. Check if any files exceed GitHub's file size limit (100 MB).
2. Consider using Git LFS for large files.
3. Update your .gitignore file to exclude large files that don't need to be versioned.