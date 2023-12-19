import { useEffect, useState } from "react";
import { db, DB_TODO_KEY } from "../../firebaseConfig";
import { ref, onValue, set, off } from "firebase/database";
import { useNavigate } from "react-router-dom";

import "./TodoList.css";

export default function TodoList() {
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [edit, setEdit] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("userfb");
    if (!userLocalStorage) {
      navigate("/");
    } else {
      const userLocalStorageObject = JSON.parse(userLocalStorage);
      setUser(userLocalStorageObject);

      // Get data dari database dengan key=DB_TODO_KEY
      const dataRef = ref(db, DB_TODO_KEY);

      // Ketika ada perubahan data, maka akan mengambil data dari database
      const onDataChange = (snapshot) => {
        const newData = snapshot.val();
        if (!Array.isArray(newData)) {
          setList([]);
        } else {
          setList(newData);
        }
      };

      onValue(dataRef, onDataChange);

      return () => {
        // Ketika halaman ditutup, maka akan menghapus listener
        off(dataRef, onDataChange);
      };
    }
  }, []);

  const addItem = () => {
    // newDAta adalah data yang akan diupdate ke database
    const newData = list || [];

    // Tambahkan item baru ke newData
    const isiTodo = prompt("Masukkan isi ToDo:");
    if (isiTodo.trim()) {
      const newItem = {
        id: Date.now(),
        todo: isiTodo,
        createdAt: new Date().toISOString(),
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
      };
      newData.push(newItem);

      // Update the data in the database
      const dataRef = ref(db, DB_TODO_KEY);
      set(dataRef, newData);
    }
  };

  const deleteItem = (id) => {
    const newData = list || [];

    // Hapus item dengan id tertentu dari newData
    const index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      newData.splice(index, 1);
      const dataRef = ref(db, DB_TODO_KEY);
      set(dataRef, newData);
    }
  };

  const startEdit = (id, todo) => {
    const editedTodo = prompt("Edit Todo:", todo);
    if (editedTodo !== null) {
      const newData = list || [];
      const index = newData.findIndex((item) => item.id === id);
      if (index !== -1) {
        newData[index].todo = editedTodo;
        const dataRef = ref(db, DB_TODO_KEY);
        set(dataRef, newData);
      }
    }
  };

  const updateItem = (id) => {
    const newData = list || [];
    const index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      newData[index].todo = editText;
      const dataRef = ref(db, DB_TODO_KEY);
      set(dataRef, newData);
      setEdit(false);
      setSelectedTask(null);
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setSelectedTask(null);
  };

  return (
    <div className="form">
      <h1>Todo List</h1>
      <ul className="todoList">
        {list.length > 0 ? (
          list.map((item) => (
            <li
              key={item.id}
              className={item.user.uid === user.uid ? "user-sent" : ""}
            >
              <div
                className="todoList-user"
                style={{
                  backgroundColor:
                    item.user.uid === user.uid ? "#DCF8C6" : "#D3D3D3",
                }}
              >
                <img
                  src={item.user.photoURL}
                  alt={item.user.displayName}
                  className="todoList-user-img"
                  referrerPolicy="no-referrer"
                />
                <div className="todoList-user-field">
                  <p className="todoList-username">{item.user.displayName}</p>
                  <p className="todoList-item">{item.todo}</p>
                  <div className="time">
                    <p>
                      {new Date(item.createdAt).getHours()}:
                      {new Date(item.createdAt).getMinutes()}
                    </p>
                  </div>
                </div>
                {item.user.uid === user.uid && (
                  <div>
                    {!edit && (
                      <button
                        className="todoList-user-edit"
                        onClick={() => startEdit(item.id, item.todo)}
                      >
                        Edit
                      </button>
                    )}
                    {edit && selectedTask === item.id && (
                      <>
                        <button onClick={() => updateItem(item.id)}>
                          Update
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    )}
                    <button
                      className="todoList-user-delete"
                      onClick={() => deleteItem(item.id)}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="todoList-empty">Belum ada Todo</p>
        )}
      </ul>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}
