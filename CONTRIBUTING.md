# Contributing

**The issue tracker is only for technical support, bug reports and enhancement suggestions.
If you have a question, please ask it in the [Discord server](https://discord.gg/pudv7Rx) instead of opening an issue.**

If you wish to contribute to the Discord.RSS-Web, feel free to fork the repository and submit a pull request.
ESLint and StandardJS are used to enforce a consistent coding style, so having that set up in your editor of choice is a great boon to your development process.

All development happens on dev branches.

## Backend

1. Fork & clone this repo
2. Create a new branch from the **dev** branch
3. Code!
4. Run `npm run eslint` to run ESLint and automatically fix problems in coding style
5. Use `npm link` this repo from the clone repo to test changes
6. Push your work to your fork and submit a pull request (before that you may need to merge the latest from **upstream**)

## Frontend

1. `npm install` in src/client
2. `npm start` (to access the control panel, you must login via the server, then go back to the create-react-app's dev server on port 3000 so the session is available)
3. Code!
4. `npm run build` (build files are uploaded for the user)
5. Run `npm run eslint` to run ESLint and automatically fix problems in coding style
6. Push your work to your fork and submit a pull request (before that you may need to merge the latest from **upstream**)

If you use an outdated version of **npm**, then you may run into a [lock file conflict](https://docs.npmjs.com/files/package-locks#resolving-lockfile-conflicts).
More info [here](https://github.com/npm/npm/issues/20434) and [here](https://github.com/npm/npm/issues/20891).

[How do I know which version of **npm** comes with which version of **Node.js** ?](https://nodejs.org/en/download/releases/)
