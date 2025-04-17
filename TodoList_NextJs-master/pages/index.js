import { Inter } from "next/font/google";
import { format } from "date-fns";
import { useState, StrictMode } from "react";  // Import StrictMode here
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 999);
  };

  const handleKeyUp = (key) => {
    if (key === "Enter" && newTodo) {
      const randomNumber = getRandomNumber();
      const newItem = {
        id: `item-${randomNumber}`,
        content: newTodo,
      };

      setTodo(todo.concat(newItem));
      setNewTodo("");
    }
  };

  const handleDelete = (id) => {
    setTodo(todo.filter((_, index) => index !== id));
  };

  const render = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDnDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const items = render(todo, source.index, destination.index);
    setTodo(items);
  };

  return (
    <div className="flex justify-center pt-40">
      <div className="max-w-sm w-full shadow-lg bg-white p-8 rounded-xl opacity-70">
        <div className="flex justify-center cursor-default bg-gray-200 rounded-3xl px-4 py-1 color-gray hover:scale-110 transition-all">
          <img
            className="object-cover rounded-full w-16 h-16 n-2"
            src="https://avatars.githubusercontent.com/u/111651863?v=4"
            alt="Zayan"
          ></img>
          <div className="w-full p-3">
            <p className="text-3xl text-white-600">ToDo List</p>
            <p className="text-sm">{format(new Date(), "MMM d, yyyy")}</p>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5V7.5h3a.5.5 0 0 1 0 1h-3V11.5a.5.5 0 0 1-1 0V8.5H4a.5.5 0 0 1 0-1h3V4.5A.5.5 0 0 1 8 4z" />
            </svg>
          </div>

          <input
            type="text"
            id="newToDo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyUp={(e) => handleKeyUp(e.key)}
            className="block w-full pl-10 p-2 border-4 rounded-full bg-gray-600 text-white"
            placeholder="new todo item"
          />
        </div>

        <StrictMode>  {/* Wrap DragDropContext with StrictMode */}
          <DragDropContext onDragEnd={handleDnDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                >
                  <ul className="block w-full pt-6">
                    {todo?.map((item, index) => (
                      <Draggable
                        draggableId={item.id}
                        key={item.id}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <li
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                            className="w-full border-2 rounded-xl mt-2 hover:border-blue-300"
                          >
                            <input
                              id={index}
                              type="checkbox"
                              className="float-left block w-6 h-6 m-3"
                            />
                            <button
                              id={index}
                              onClick={() => handleDelete(index)}
                              className="float-right w-7 h-7 m-2.5 rounded-2xl bg-red-700 text-gray-200 shadow-md hover:bg-red-500 hover:scale-105"
                            >
                              x
                            </button>
                            <label htmlFor={index} className="block w-full p-3">
                              {item.content}
                            </label>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </ul>
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </StrictMode>
      </div>
    </div>
  );
}
