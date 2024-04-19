import { useDrag } from "react-dnd";

interface Props {
  name: string;
}
export const DragCard = ({ name }: Props) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "language",
    item: { name },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div>
      <div ref={dragRef}>
        {name}
        {isDragging && "📂"}
      </div>
    </div>
  );
};
