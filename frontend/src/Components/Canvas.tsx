import React from 'react';

interface Props {
	draw: (ctx: any) => void;
	canvasRef: React.MutableRefObject<HTMLCanvasElement>;
}

const Canvas: React.FC<Props> = ({ draw, canvasRef }) => {
	return <canvas ref={canvasRef} style={{ border: '2px solid black', boxSizing: 'border-box', margin: 'auto' }}></canvas>;
};

export default Canvas;
