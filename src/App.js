import { useEffect, useRef, useState } from "react";

export default function App() {
  const [selecttask, setSelecttask] = useState("");
  const [showDaily, setShowDaily] = useState(function () {
    const local = localStorage.getItem("daily");
    return local ? JSON.parse(local) : [];
  });
  const [showlist, setList] = useState(function () {
    const local = localStorage.getItem("shoppinglist");
    return local ? JSON.parse(local) : [];
  });
  function handleAddItem(obj) {
    setList((list) => (list ? [...list, obj] : [obj]));
  }
  function handleDeleteItem(obj) {
    setList((arr) => arr.filter((el) => el.id !== obj.id));
  }
  function handleShowDaily(obj) {
    setShowDaily((t) => (t ? [...t, obj] : [obj]));
  }
  function handleDeleteDaily(obj) {
    setShowDaily((arr) => arr.filter((el) => el.id !== obj.id));
  }
  useEffect(
    function () {
      localStorage.setItem("daily", JSON.stringify(showDaily));
    },
    [showDaily]
  );
  useEffect(
    function () {
      localStorage.setItem("shoppinglist", JSON.stringify(showlist));
    },
    [showlist]
  );
  return (
    <div className="main">
      <Welcom selecttask={selecttask} setSelecttask={setSelecttask} />
      <div className="forms">
        {selecttask === "daily" && (
          <DailyForm
            setSelecttask={setSelecttask}
            onAddDaily={handleShowDaily}
          />
        )}
        {selecttask === "shopping" && (
          <ShoppingForm
            setSelecttask={setSelecttask}
            onAddItem={handleAddItem}
          />
        )}
      </div>
      <div className="tasks">
        {showDaily?.length > 0 && (
          <ShowDaily showDaily={showDaily} onDeleteDaily={handleDeleteDaily} />
        )}
        {showlist?.length > 0 && (
          <ItemsList showlist={showlist} ondeleteItem={handleDeleteItem} />
        )}
      </div>
    </div>
  );
}
function Welcom({ selecttask, setSelecttask }) {
  return (
    <div className="welcome">
      <h1>Welcome to simple task Manager</h1>
      <select
        value={selecttask}
        onChange={(e) => setSelecttask(e.target.value)}
      >
        <option>please select your taske</option>
        <option value="daily">DAILY</option>
        <option value="shopping">SHOPPING</option>
      </select>
    </div>
  );
}
function DailyForm({ setSelecttask, onAddDaily }) {
  const [dailyTask, setDailyTask] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const el = useRef(null);
  function handleAddDaily(e) {
    e.preventDefault();
    if (!dailyTask) return;
    const id = crypto.randomUUID();
    const newdailyTask = {
      id,
      daily: dailyTask,
      time: dailyTime,
    };
    onAddDaily(newdailyTask);
    setDailyTask("");
    setDailyTime("");
  }
  useEffect(function () {
    function callback(e) {
      if (e.code === "Enter") {
        el.current.focus();
      }
    }
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);
  return (
    <div className="dailyform">
      <form onSubmit={handleAddDaily}>
        <input
          ref={el}
          onChange={(e) => setDailyTask(e.target.value)}
          value={dailyTask}
          type="text"
          placeholder="📌descripe your task"
        />
        <input
          onChange={(e) => setDailyTime(e.target.value)}
          value={dailyTime}
          type="text"
          placeholder="⏰ set your time"
        />
        <button className="add">Add</button>
      </form>
      <button className="finish" onClick={() => setSelecttask("")}>
        ❌
      </button>
    </div>
  );
}
function ShowDaily({ showDaily, onDeleteDaily }) {
  return (
    <div className="daily">
      <h2>YOUR DAILY TASKS</h2>
      <ul>
        {showDaily.map((d) => (
          <DisplayDaily
            key={d.id}
            taskDaily={d}
            onDeleteDaily={onDeleteDaily}
          />
        ))}
      </ul>
    </div>
  );
}
function DisplayDaily({ taskDaily, onDeleteDaily }) {
  return (
    <li>
      <p>{taskDaily.daily}</p>
      <p>{taskDaily.time}</p>
      <button onClick={() => onDeleteDaily(taskDaily)}>❌</button>
    </li>
  );
}
function ShoppingForm({ setSelecttask, onAddItem }) {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const el = useRef(null);
  function handleItem(e) {
    e.preventDefault();
    if (!item) return;
    const id = crypto.randomUUID();
    const newItem = {
      id,
      item,
      quantity,
      packed: false,
    };
    onAddItem(newItem);
    setItem("");
    setQuantity("");
  }
  useEffect(function () {
    function callback(e) {
      if (e.code === "Enter") {
        el.current.focus();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, []);
  return (
    <div className="dailyform">
      <form onSubmit={handleItem}>
        <input
          ref={el}
          value={item}
          onChange={(e) => setItem(e.target.value)}
          type="text"
          placeholder="🛒  items..."
        />
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="text"
          placeholder="🛍  quantity"
        />
        <button>Add</button>
      </form>
      <button onClick={() => setSelecttask("")} className="finish">
        ❌
      </button>
    </div>
  );
}
function ItemsList({ showlist, ondeleteItem }) {
  return (
    <div className="daily">
      <h2>YOUR SHOPPING LIST</h2>
      <div>
        {showlist.map((item) => (
          <Item key={item.id} item={item} ondeleteItem={ondeleteItem} />
        ))}
      </div>
    </div>
  );
}
function Item({ item, ondeleteItem }) {
  const [isTrue, setIstrue] = useState(false);
  return (
    <li className="item">
      <p style={isTrue ? { textDecoration: "line-through" } : {}}>
        <span>{item.item}</span>
        <span>{item.quantity}</span>
      </p>
      <input
        onClick={() => setIstrue((t) => !t)}
        value={item.packed}
        type="checkbox"
      />
      <button onClick={() => ondeleteItem(item)}>❌</button>
    </li>
  );
}
