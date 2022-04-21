import { useRef, useEffect } from 'react';

const useCanvas = (draw: (ctx: any) => void) => {
	const canvasRef = useRef({} as HTMLCanvasElement);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth * 0.95;
		canvas.height = window.innerHeight * 0.85;

		const render = () => {
			draw(ctx);
		};

		const interval = setInterval(() => {
			render();
		}, 1000 / 45);

		render();

		return () => {
			clearInterval(interval);
		};
	}, [draw]);

	return canvasRef;
};

export default useCanvas;
