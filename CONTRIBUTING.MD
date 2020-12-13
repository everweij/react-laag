# Contributing

## General

### Bugs

Open issues can be found on the GitHub [issues](https://github.com/everweij/react-laag/labels/bug) page with a "Bug" label.

These are a great place to start contributing to the repo!

Once you start work on a bug, post your intent on the issue itself. This will prevent more than one person working on it at once.

If the bug you want to work on doesn't have a related issue, open one, and attach the "Bug" label.

### New features

Before adding any features, open a [Feature Proposal](https://github.com/everweij/react-laag/issues/new/choose).

This will let us talk through your proposal before you spend time on it.

react-laag consists of various low-level building blocks. This is a huge part in what makes react-laag so flexible. Keep this in mind when proposing a new feature -> does this benefit all of us, or is the feature a more specific use-case?

### Documentation

If a PR introduces or changes API, please make sure to update the relevant docs (readme) or examples (storybook) as well.

## Development

### Getting started

In order to get started with your PR:

1. Fork the react-laag repo
2. Clone york fork locally
3. run `yarn install` (make sure you have `yarn` installed on your machine)
4. See the scripts-section of the workspace `package.json` for a list of available commands
5. Add your code and supporting tests
6. If this is a feature that requires doc changes, make as necessary.
7. You're ready!

### Repo structure

This repo leverages yarn workspaces to split this repo into multiple packages:

- react-laag -> source code of the actual library
- website -> the front page of react-laag.com, built with Gatsby
- storybook -> an isolated place to develop examples
