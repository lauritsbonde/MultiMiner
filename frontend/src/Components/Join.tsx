import React, { FC, startTransition, useState } from 'react';

interface JoinProps {
	joinGame: (name: string) => void;
}

const Join: FC<JoinProps> = ({ joinGame }) => {
	const [input, setInput] = useState('');
	const [avatar, setAvatar] = useState(`https://avatars.dicebear.com/api/personas/${''}.svg`);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		startTransition(() => {
			// TODO: do some checks to see if the avatar is valid and if someone else is using it
			setAvatar(`https://avatars.dicebear.com/api/personas/${e.target.value}.svg`);
		});
	};

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
						handleInput(e);
					}}
				/>
				<button type="submit" onClick={() => joinGame(input || `I AM BORING_${(Math.random() + 1).toString(36).substring(2)}`)}>
					Join
				</button>
			</form>
			<div>
				<h3>Your random avatar</h3>
				<img src={avatar} alt="random avatar" />
			</div>
		</div>
	);
};

export default Join;
