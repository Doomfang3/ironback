import React, {useState} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import BigText from 'ink-big-text';
/* import {Task, TaskList} from 'ink-task-list';
import spinners from 'cli-spinners'; */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import TextInput from './components/TextInput.js';

/* type Props = {
	name: string | undefined;
}; */

const primaryColor = '#2DC5FA';

interface Item {
	label: string;
	value: string;
}

const items: Item[] = [
	{
		label: 'Mock Backend with json-server (Module 2)',
		value: 'mock',
	},
	{
		label: 'Rest API with Express (Module 3)',
		value: 'rest',
	},
];

export default function App(/* {name = 'Stranger'}: Props */) {
	const [projectName, setProjectName] = useState('');
	const [projectType, setProjectType] = useState<string | undefined>();
	const [, /* isFolderCreated */ setIsFolderCreated] = useState(false);

	const createProjectFromTemplate = () => {
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const templatesDir = path.join(__dirname, 'templates');
		console.log(templatesDir);
		const projectDir = path.join(process.cwd(), projectName);

		// Ensure the project directory exists
		if (!fs.existsSync(projectDir)) {
			fs.mkdirSync(projectDir);
		}

		// Copy files from the template directory to the new project directory
		const templatePath = path.join(templatesDir, projectType!);
		fs.readdirSync(templatePath).forEach(file => {
			const srcFile = path.join(templatePath, file);
			const destFile = path.join(projectDir, file);
			fs.copyFileSync(srcFile, destFile);
		});

		setIsFolderCreated(true);
	};

	const handleFolderNameSubmit = (name: string) => {
		setProjectName(name);
		createProjectFromTemplate();
		// Further logic goes here (e.g., creating a folder)
	};

	return (
		<Box
			borderStyle="round"
			borderColor={primaryColor}
			flexDirection="column"
			paddingLeft={1}
		>
			{projectType ? (
				<>
					<TextInput label="Project name" onSubmit={handleFolderNameSubmit} />
					{/* <TaskList>
					<Task
						label="Created the folder"
						state={isFolderCreated ? 'success' : 'loading'}
						spinner={spinners.dots}
					/>
					<Task
						label="Installing dependencies"
						state={isFolderCreated ? 'loading' : 'pending'}
						spinner={spinners.dots}
					/>
				</TaskList> */}
				</>
			) : (
				<>
					<BigText text="Ironback" font="tiny" colors={[primaryColor]} />
					<Text>What do you need ?</Text>
					<SelectInput
						items={items}
						onSelect={(item: Item) => setProjectType(item.value)}
					/>
				</>
			)}
		</Box>
	);
}
