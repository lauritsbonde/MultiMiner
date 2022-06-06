import React, { FC, startTransition, useState } from 'react';
import DrillCustomizer from './Customizer/DrillCustomizer';

interface JoinProps {
	joinGame: (name: string, imageIndex: { head: string; body: string; bottom: string; wheels: string }) => void;
	playerImages: { [key: string]: any };
}

const Join: FC<JoinProps> = ({ joinGame, playerImages }) => {
	const [input, setInput] = useState('');
	const [avatar, setAvatar] = useState(`https://avatars.dicebear.com/api/personas/${''}.svg`);
	const [imageIndex, setImageIndex] = useState({ head: '0', body: '0', bottom: '0', wheels: '0' });

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		startTransition(() => {
			// TODO: do some checks to see if the avatar is valid and if someone else is using it
			setAvatar(`https://avatars.dicebear.com/api/personas/${e.target.value}.svg`);
		});
	};

	const updatePart = (part: 'head' | 'body' | 'bottom' | 'wheels', index: number) => {
		startTransition(() => {
			if (index === -1 && imageIndex[part] === '0') {
				setImageIndex({ ...imageIndex, [part]: '' + (Object.keys(playerImages[part]).length - 1) });
			} else {
				setImageIndex({ ...imageIndex, [part]: '' + ((+imageIndex[part] + index) % Object.keys(playerImages[part]).length) });
			}
		});
	};

	return (
		<div style={{ position: 'absolute' }}>
			<h1>Join</h1>
			<h3>Enter your username</h3>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					joinGame(input, imageIndex);
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
				<button type="submit" onClick={() => joinGame(input || `I AM BORING_${(Math.random() + 1).toString(36).substring(2)}`, imageIndex)}>
					Join
				</button>
			</form>
			<div>
				<h3>Your random avatar</h3>
				<img src={avatar} alt="random avatar" />
			</div>
			{playerImages ? <DrillCustomizer imageIndex={imageIndex} playerImages={playerImages} updatePart={updatePart} /> : <div>test...</div>}
		</div>
	);
};

export default Join;
