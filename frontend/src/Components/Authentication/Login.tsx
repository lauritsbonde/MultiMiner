import { Box, Typography, TextField, Button } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';

const styling = {
	container: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: '10px',
	},
	loginButton: {
		height: '40px',
		width: '50%',
		fontSize: '1.2rem',
		marginTop: '10px',
	},
};

const Login = () => {
	const router = useRouter();
	return (
		<Box sx={styling.container}>
			<Button
				variant="contained"
				onClick={() => {
					router.push('/api/auth/login');
				}}
			>
				Login
			</Button>
			<Typography variant="h5">Login</Typography>
			<TextField label="Username" variant="filled" margin="dense" size="small" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
			<TextField variant="filled" type="password" label="Password" margin="dense" size="small" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
			<Button variant="contained" sx={styling.loginButton}>
				Login
			</Button>
		</Box>
	);
};

export default Login;
