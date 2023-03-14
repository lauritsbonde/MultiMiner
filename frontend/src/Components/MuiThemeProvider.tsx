import React, { FC, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			danger: string;
		};
	}
	// allow configuration using `createTheme`
	interface ThemeOptions {
		status?: {
			danger?: string;
		};
	}
}

const theme = createTheme({
	status: {
		danger: '#f44336',
	},
	typography: {
		fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(
			','
		),
		h1: {
			fontWeight: '600',
			fontSize: '4rem',
		},
		h2: {
			fontWeight: '500',
			fontSize: '3rem',
		},
		h4: {
			fontWeight: '500',
		},
		h5: {
			fontWeight: '500',
		},
	},
});

interface ThemeProps {
	children?: ReactNode;
}

const MuiThemeProvider: FC<ThemeProps> = ({ children }) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
