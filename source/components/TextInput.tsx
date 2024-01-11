import {Text, useInput, useStdin} from 'ink';
import React, {useEffect, useState} from 'react';

const TextInput = ({
	label,
	onSubmit,
}: {
	label: string;
	onSubmit: (name: string) => void;
}) => {
	const [value, setValue] = useState('');
	const {setRawMode} = useStdin();

	useEffect(() => {
		setRawMode(true);
		return () => setRawMode(false);
	}, [setRawMode]);

	useInput((input, key) => {
		if (key.return) {
			onSubmit(value);
		} else if (key.backspace || key.delete) {
			setValue(value.slice(0, -1));
		} else {
			setValue(value + input);
		}
	});

	return (
		<Text>
			{label} : {value}
		</Text>
	);
};

export default TextInput;
