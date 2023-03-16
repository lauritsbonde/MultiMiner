import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Typography } from '@mui/material';

export default function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			{process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' && (
				<Typography variant="body1" sx={{ width: '100vw', height: '12px', fontSize: '12px', textAlign: 'center', backgroundColor: 'red' }}>
					env: {process.env.NEXT_PUBLIC_ENVIRONMENT}
				</Typography>
			)}
			<Component {...pageProps} />
		</UserProvider>
	);
}
