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
			<form
				onSubmit={(e) => {
					e.preventDefault();
					joinGame(input);
				}}
			>
				<input
					type="text"
					placeholder="Username"
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
					}}
				/>
				<button type="submit" onClick={() => joinGame(input || `I AM BORING_${(Math.random() + 1).toString(36).substring(2)}`)}>
					Join
				</button>
			</form>
		</div>
	);
};

export default Join;
