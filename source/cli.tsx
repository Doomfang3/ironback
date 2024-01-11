#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
Usage
  $ ironback

Then you need to choose the project type and the project name.
Ironback will install the dependencies for you.
After that you just have to cd into your newly created project and start coding💙
`,
	{
		importMeta: import.meta,
		flags: {
			help: {
				alias: 'h',
			},
		},
	},
);

render(<App flags={cli.flags} />);
