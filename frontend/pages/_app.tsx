import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Typography } from '@mui/material';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			{process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' && (
				<Typography variant="body1" sx={{ width: '100vw', height: '18px', fontSize: '12px', textAlign: 'center', backgroundColor: 'red', margin: 0, padding: 0 }}>
					env: {process.env.NEXT_PUBLIC_ENVIRONMENT}
				</Typography>
			)}
			<Component {...pageProps} />
		</UserProvider>
	);
}
