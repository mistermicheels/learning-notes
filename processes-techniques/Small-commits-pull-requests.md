---
description: Why you should strive to commit early, push often and keep pull requests small
last_modified: 2022-01-31T14:29:20.513Z
---

# Small commits and pull requests

## Contents

-   [Small, atomic commits](#small-atomic-commits)
-   [Frequent pushes](#frequent-pushes)
-   [Small pull requests](#small-pull-requests)
-   [Resources](#resources)

## Small, atomic commits

-   Commits should be "atomic": a single commit should be dedicated to a single (sub)task
-   Separate commits for refactoring, bug fixes and new features
-   Avoid batching multiple kinds of changes together in a single commit
-   Each commit should represent one step forward in your process of solving the bug or implementing the feature
    -   A commit represents a small incremental change to the codebase
    -   Still likely to touch multiple files
-   Each commit should leave the codebase in a valid state
    -   Tests should pass, the system should build properly, ...
    -   Ideally, the commit also includes new tests relevant to the commit
-   Avoid committing throwaway code, commented-out code, `TODO` comments, ...
    -   These make commit history harder to understand and PRs harder to review

Approach:

-   Divide your work into small subtasks (30-60 minutes is ideal, more than 4 hours is probably too long)
    -   Added benefit: this is a great way to fight procrastination and also makes it easier to context switch if needed
-   Work only on one subtask at a time and commit your changes once you have finished a subtask (taking care to leave the codebase in a valid state)
-   If you see the need for refactoring of fixes in the code you need to touch, try to put these in separate commits (either before or after you make your main changes)
    -   If you are about to make a change which should be a separate commit (dependency install, refactor, …) you can stash your current changes to start from a clean slate and make that change as one logical commit. Then, you can restore the stash and continue.
-   If you already have a whole bunch of uncommitted changes that should ideally be split into multiple commits, you can stage specific files or even specific lines inside files to commit them separately
    -   Can work fine as long as different logical changes don't touch the same code

Benefits:

-   Focused commits make it easier to also provide focused commit messages
-   Easy to undo or revert a specific change
    -   It's hard to throw away one specific change if it's mixed with a bunch of other changes to the same set of files
-   Makes pull request reviews easier
    -   Reviewers can choose their view (total diff versus looking at separate commits)
    -   Commit log a clear story of how you tackled the problem

## Frequent pushes

-   When you make your small, atomic commits, also push them to a remote repository
-   "Commit Early, Push Often"

Benefits:

-   Pushing your work to a remote repository prevents you from losing your work due to disk failures or even brain farts
-   Pushing your commits as you make them provides transparency into your process
    -   Gives your colleagues an idea of how far you are
    -   Sometimes, your colleagues might be able to give you some early feedback or tips, potentially saving hours or even days of wasted work

## Small pull requests

-   Keep pull requests small and focused
-   Reviewers should be able to keep the entire pull request in their head when analyzing the code
-   As a reviewer, it should take you minutes rather than hours to review a pull request
-   It can help to split up issues/tasks into smaller ones
-   It can help to create a sequence of pull requests for one bigger issue/task
-   It can help to move big refactors into their own pull request

Benefits:

-   Makes reviewer's life easier
-   Faster reviews mean the developer gets their feedback when the everything is still fresh in their mind
-   Avoids long-running feature branches
    -   Reduces risk of developers writing conflicting code
    -   Allows developers to build on top of each other's changes without having to build on top of someone else's feature branch (or, even worse, some combination of other people's branches)
    -   See also [Trunk-Based Development](./Trunk-Based-Development.md)

## Resources

-   [Developer Tip: Keep Your Commits "Atomic"](https://www.freshconsulting.com/atomic-commits/)
-   [Commit Early, Push Often](https://www.worklytics.co/commit-early-push-often/)
