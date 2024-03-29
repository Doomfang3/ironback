import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import BigText from 'ink-big-text';
import {Task, TaskList} from 'ink-task-list';
import spinners from 'cli-spinners';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {exec} from 'child_process';
import {useApp} from 'ink';
import TextInput from './components/TextInput.js';

type Props = {
	flags: {help: unknown} & Record<string, unknown>;
};

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

export default function App({flags: _}: Props) {
	const {exit} = useApp();

	const [projectType, setProjectType] = useState<string | undefined>();
	const [folderNameAlreadyExists, setFolderNameAlreadyExists] = useState({
		error: false,
		message: '',
	});
	const [projectPath, setProjectPath] = useState('');
	const [isFolderCreated, setIsFolderCreated] = useState(false);
	const [depsInstalled, setDepsInstalled] = useState(false);

	const createProjectFromTemplate = (projectName: string) => {
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const templatesDir = path.join(__dirname, 'templates');
		const projectDir = path.join(process.cwd(), projectName);
		setProjectPath(projectDir);

		if (fs.existsSync(projectDir)) {
			setFolderNameAlreadyExists({error: true, message: projectName});
			return;
		}

		fs.mkdirSync(projectDir, {recursive: true});
		const templatePath = path.join(templatesDir, projectType!);

		const copyRecursiveSync = (src: string, dest: string) => {
			const stats = fs.statSync(src);

			if (stats.isDirectory()) {
				fs.mkdirSync(dest, {recursive: true});
				fs.readdirSync(src).forEach(childItemName => {
					copyRecursiveSync(
						path.join(src, childItemName),
						path.join(dest, childItemName),
					);
				});
			} else {
				if (path.basename(src) === 'ignore_template') {
					fs.copyFileSync(src, path.join(path.dirname(dest), '.gitignore'));
				} else if (path.basename(src) === 'env_template') {
					fs.copyFileSync(src, path.join(path.dirname(dest), '.env'));
				} else {
					fs.copyFileSync(src, dest);
				}
			}
		};

		fs.readdirSync(templatePath).forEach(fileOrDir => {
			copyRecursiveSync(
				path.join(templatePath, fileOrDir),
				path.join(projectDir, fileOrDir),
			);
		});

		setIsFolderCreated(true);
	};

	useEffect(() => {
		if (isFolderCreated) {
			process.chdir(projectPath);
			const installCmd = `npm install`;
			exec(installCmd, (error, stdout, stderr) => {
				if (error) {
					console.error(`Error installing dependencies: ${error}`);
					return;
				}
				console.log(stdout);
				console.error(stderr);

				setDepsInstalled(true);
			});
		}
	}, [isFolderCreated]);

	useEffect(() => {
		if (depsInstalled) {
			exit();
		}
	}, [depsInstalled]);

	return (
		<Box
			borderStyle="round"
			borderColor={primaryColor}
			flexDirection="column"
			paddingLeft={1}
		>
			<BigText text="Ironback" font="tiny" colors={[primaryColor]} />
			{projectType ? (
				<>
					{isFolderCreated ? (
						<>
							<TaskList>
								<Task
									label={isFolderCreated ? 'Folder created' : 'Creating folder'}
									state={isFolderCreated ? 'success' : 'loading'}
									spinner={spinners.dots}
								/>
								<Task
									label={
										depsInstalled
											? 'Dependencies installed'
											: 'Installing dependencies'
									}
									state={
										isFolderCreated
											? depsInstalled
												? 'success'
												: 'loading'
											: 'pending'
									}
									spinner={spinners.dots}
								/>
							</TaskList>
							{depsInstalled && (
								<>
									<Text>
										You can now <Text color="yellow">cd</Text> into your new
										project
									</Text>
									<Text color={primaryColor}>
										🎉 Have fun and happy coding 💙
									</Text>
								</>
							)}
						</>
					) : (
						<>
							<TextInput
								label="Project name"
								onSubmit={createProjectFromTemplate}
							/>
							{folderNameAlreadyExists.error && (
								<Text color="redBright">
									The folder `{folderNameAlreadyExists.message}` already exists
								</Text>
							)}
						</>
					)}
				</>
			) : (
				<>
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
