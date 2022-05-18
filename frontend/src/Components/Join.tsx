import React, { FC, useState } from 'react';

interface JoinProps {
	joinGame: (name: string) => void;
}

const Join: FC<JoinProps> = ({ joinGame }) => {
	const [input, setInput] = useState('');
	return (
		<div style={{ position: 'absolute' }}>
			<h1>Join</h1>
			<h3>Enter your username</h3>
			<input
				type="text"
				placeholder="Username"
				value={input}
				onChange={(e) => {
					setInput(e.target.value);
				}}
			/>
			<button onClick={() => joinGame(input || 'laurits')}>Join</button>
		</div>
	);
};

export default Join;
