import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fromEvent } from 'rxjs';
import { map, pairwise, switchMap, takeUntil } from 'rxjs/operators';

const scale = window.devicePixelRatio;

export const Canvas = (props) => {
  const dispatch = useDispatch();
  const { canvas: canvasDraw } = useSelector((state) => state.messages);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    const context = canvas.getContext('2d');
    context.scale(scale, scale);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const mouseMove = fromEvent(canvasRef.current, 'mousemove');
    const mouseDown = fromEvent(canvasRef.current, 'mousedown');
    const mouseUp = fromEvent(canvasRef.current, 'mouseup');
    const mouseOut = fromEvent(canvasRef.current, 'mouseout');

    if (props.paint) {
      const stream = mouseDown.pipe(
        switchMap(() => {
          return mouseMove.pipe(
            map((e) => ({
              x: e.offsetX,
              y: e.offsetY,
            })),
            pairwise(),
            takeUntil(mouseUp),
            takeUntil(mouseOut)
          );
        })
      );

      console.log('stream', stream);

      // //Our first draw
      context.fillStyle = '#fff';
      stream.subscribe(([from, to]) => {
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();

        dispatch({ type: 'draw', payload: { from, to } });
      });
    }
  }, []);

  useEffect(() => {
    // const test = [
    //   56, 36, 56, 37, 56, 37, 55, 38, 55, 38, 55, 39, 55, 39, 55, 41, 55, 41,
    //   54, 43, 54, 43, 54, 43, 54, 43, 54, 45, 54, 45, 54, 45, 54, 45, 54, 47,
    //   54, 47, 54, 48, 54, 48, 54, 49, 54, 49, 54, 50, 54, 50, 54, 51, 54, 51,
    //   54, 52, 54, 52, 54, 53, 54, 53, 54, 55, 54, 55, 54, 55, 54, 55, 54, 56,
    //   54, 56, 54, 57, 54, 57, 54, 57, 54, 57, 54, 58, 54, 58, 54, 58,
    // ];

    if (props.paint) {
      if (canvasDraw.length) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        const context = canvas.getContext('2d');

        context.scale(scale, scale);
        context.fillStyle = '#fff';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.beginPath();
        for (let i = 0; i < canvasDraw.length; i += 4) {
          context.moveTo(canvasDraw[i], canvasDraw[i + 1]);
          context.lineTo(canvasDraw[i + 2], canvasDraw[i + 3]);
          context.stroke();
        }
      }
    }
  }, [canvasDraw]);

  return <canvas ref={canvasRef} {...props} />;
};
