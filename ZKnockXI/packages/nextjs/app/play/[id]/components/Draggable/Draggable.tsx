import React, { forwardRef } from "react";
import Image from "next/image";
import { Handle } from "../Item/components/Handle";
import styles from "./Draggable.module.css";
import { draggable, draggableHorizontal, draggableVertical } from "./draggable-svg";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import classNames from "classnames";

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  axis?: Axis;
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(function Draggable(
  { axis, dragOverlay, dragging, handle, label, listeners, transform, style, buttonStyle, ...props },
  ref,
) {
  let details = label?.split(":") ;
  return (
    <div
      className={classNames(
        styles.Draggable,
        dragOverlay && styles.dragOverlay,
        dragging && styles.dragging,
        handle && styles.handle,
      )}
      style={
        {
          ...style,
          "--translate-x": `${transform?.x ?? 0}px`,
          "--translate-y": `${transform?.y ?? 0}px`,
        } as React.CSSProperties
      }
    >
      <button
        {...props}
        aria-label="Draggable"
        data-cypress="draggable-item"
        {...(handle ? {} : listeners)}
        tabIndex={handle ? -1 : undefined}
        ref={ref}
        style={buttonStyle}
        className="bg-green-400 bg-opacity-35 rounded-full"
      >
        <div className="flex flex-col items-center justify-center w-24">
          <Image alt="Player Image" src={`/assets/players/${details[0]?details[0]:'Virat Kohli'}.jpg`} height={80} width={80} />
          <p className="font-semibold">{details[2]?details[2]:'Virat Kohli'}</p>
        </div>
        {handle ? <Handle {...(handle ? listeners : {})} /> : null}
      </button>
      {/* {label ? <label>{label}</label> : null} */}
    </div>
  );
});
