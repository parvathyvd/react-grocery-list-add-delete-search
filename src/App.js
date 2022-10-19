import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useCallback, useEffect, useState } from "react";
import apiRequest from "./apiRequest";

function App() {
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [filteredItem, setFilteredItem] = useState(items);
  const [fetchErr, setFetchErr] = useState(null);

  const API_URL = "http://localhost:3500/items";

  const addItem = async (item) => {
    const id = Math.floor(Math.random() * 100000 + 2);
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
    //POST request  - Add an item

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myNewItem),
    };

    const res = await fetch(apiRequest(API_URL, postOptions));
    // console.log(res);
    // if (res) setFetchErr(res);
  };

  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
    // Update the items checked property

    const updateItem = listItems.find((item) => item.id === id);
    console.log(updateItem.checked);

    const updateOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: updateItem.checked }),
    };

    const res = await fetch(`${API_URL}/${id}`, updateOptions);
    console.log(res);
    if (res) setFetchErr(res.message);
  };

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const delOptions = {
      method: "DELETE",
    };
    const res = await fetch(`${API_URL}/${id}`, delOptions);
    console.log(res);
    // if (res) setFetchErr(res);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem("");
  };

  const getFiltered = useCallback(() => {
    let searchfilter;
    searchfilter = items.filter((item) =>
      item.item.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItem(searchfilter);
  }, [search, items]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Something went wrong");
        const result = await res.json();
        setItems(result);
        setFetchErr(null);
      } catch (err) {
        console.log(err);
        setFetchErr(err.message);
      } finally {
        // executes always after success or error - Loading state false
        console.log("End");
      }
    };
    getItems();
  }, []);

  useEffect(() => {
    getFiltered();
  }, [getFiltered]);

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      {fetchErr && <p>{fetchErr}</p>}
      {!fetchErr && items && (
        <Content
          items={filteredItem}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
      )}
      {!fetchErr && <Footer length={items.length > 0 && items.length} />}
    </div>
  );
}

export default App;
