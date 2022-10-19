import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("shoppinglist")) || []
  );

  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [filteredItem, setFilteredItem] = useState(items);

  const addItem = (item) => {
    const id = Math.floor(Math.random() * 100000 + 2);
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
  };

  const handleCheck = (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
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
    localStorage.setItem("shoppinglist", JSON.stringify(items));
    getFiltered();
  }, [getFiltered, items]);

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      {items && (
        <Content
          items={filteredItem}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
      )}
      <Footer length={items && items.length} />
    </div>
  );
}

export default App;
