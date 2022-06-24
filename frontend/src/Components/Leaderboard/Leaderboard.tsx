import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';

interface Props {
	leaderboard: Array<{ id: string; name: string; points: number }>;
}

const styling = {
	container: {
		color: '#fff',
	},
	position: {
		width: '10%',
	},
	name: {
		width: '55%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	score: {
		width: '35%',
	},
	cell: {
		color: '#fff',
		padding: '8px',
		boxSizing: 'border-box',
	},
};

const Leaderboard: FC<Props> = ({ leaderboard }) => {
	return (
		<Box sx={styling.container}>
			<Table>
				<TableBody>
					{leaderboard.map((player, index) => {
						return (
							<TableRow key={index}>
								<TableCell sx={styling.cell}>
									<Typography sx={styling.position}>{index + 1 === 1 ? '🏆' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : index + 1}</Typography>
								</TableCell>
								<TableCell sx={styling.cell}>
									<Typography sx={styling.name}>{player.name}</Typography>
								</TableCell>
								<TableCell sx={styling.cell}>
									<Typography sx={styling.score}>{player.points}</Typography>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Box>
	);
};

export default Leaderboard;
