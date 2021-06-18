import { useRef, useState } from 'react';

export function Card(props) {
  return (
    <div
      id={props.id}
      className={`card width-full ${props.className ? props.className : ''}`}
      style={props.style}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseMove={props.onMouseMove}
    >
      {props.children}
    </div>
  );
}

export function CardTitle(props) {
  return (
    <div className={`title width-full ${props.className ? props.className : ''}`}>
      {props.children}
    </div>
  );
}

export function CardBody(props) {
  return (
    <div className={`body width-full ${props.className ? props.className : ''}`}>
      {props.children}
    </div>
  );
}

export function CardWindow(props) {
  const windowRef = useRef();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e = e || window.event;

    const initPos = {
      x: e.clientX,
      y: e.clientY
    }

    document.onmouseup = (e) => {
      e.preventDefault();
      e = e || window.event;
      const { left, top } = windowRef.current.getBoundingClientRect();
      setX(left + (e.clientX - initPos.x));
      setY(top + (e.clientY - initPos.y));
      document.onmousedown = null;
      document.onmouseup = null;
      document.onmousemove = null;
    }

    document.onmousemove = (e) => {
      e.preventDefault();
      e = e || window.event;
      const { left, top } = windowRef.current.getBoundingClientRect();
      setX(left + (e.clientX - initPos.x));
      setY(top + (e.clientY - initPos.y));
    }
  }

  return (
    <div
      className={`card width-full z-index-200 position-fixed ${props.className ? props.className : ''}`}
      ref={windowRef}
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
      onMouseDown={handleMouseDown}
    >
      {props.children}
    </div>
  );
}