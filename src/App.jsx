import { useReducer, useState } from "react";
import "./styles.css";

const initialTodos = [];

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        { id: Date.now(), text: action.payload, completed: false, isEditing: false },
        ...state,
      ];
    case "TOGGLE_TODO":
      return state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
    case "DELETE_TODO":
      return state.filter((t) => t.id !== action.payload);
    case "EDIT_TODO":
      return state.map((t) =>
        t.id === action.payload ? { ...t, isEditing: true } : t
      );
    case "SAVE_TODO":
      return state.map((t) =>
        t.id === action.payload.id
          ? { ...t, text: action.payload.text, isEditing: false }
          : t
      );
    case "CANCEL_EDIT":
      return state.map((t) =>
        t.id === action.payload ? { ...t, isEditing: false } : t
      );
    default:
      return state;
  }
}

function EditTodo({ todo, dispatch }) {
  const [value, setValue] = useState(todo.text);

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="edit-input"
      />
      <button
        onClick={() =>
          dispatch({ type: "SAVE_TODO", payload: { id: todo.id, text: value } })
        }
        className="btn"
      >
        Save
      </button>
      <button
        onClick={() => dispatch({ type: "CANCEL_EDIT", payload: todo.id })}
        className="btn"
      >
        Cancel
      </button>
    </>
  );
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo) return;
    dispatch({ type: "ADD_TODO", payload: newTodo });
    setNewTodo("");
  };

  return (
    <div className="container">
      <h2>Create Todo List</h2>

      <div className="add-row">
        <input
          type="text"
          placeholder="Add task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="input"
        />
        <button onClick={addTodo} className="btn">Add</button>
      </div>

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id} className="item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
            />

            {todo.isEditing ? (
              <EditTodo todo={todo} dispatch={dispatch} />
            ) : (
              <>
                <span
                  className="text"
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => dispatch({ type: "EDIT_TODO", payload: todo.id })}
                  className="btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}
                  disabled={!todo.completed}
                  className="btn delete"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App