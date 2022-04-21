import React from 'react';
import useCanvas from '../Hooks/useCanvas';

interface Props {
	draw: (ctx: any) => void;
}

const Canvas: React.FC<Props> = ({ draw }) => {
	const canvasRef = useCanvas(draw);
	return <canvas ref={canvasRef} style={{ border: '2px solid black', boxSizing: 'border-box', margin: '0 2.5%' }}></canvas>;
};

export default Canvas;
