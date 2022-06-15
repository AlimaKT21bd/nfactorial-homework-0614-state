import { useState } from "react";
import { v4 as getId } from "uuid";
import "./App.css";

// button-group
const buttons = [
{
    type: "all",
    label: "All",
},
{
    type: "active",
    label: "Active",
},
{
    type: "done",
    label: "Done",
},
];

// const toDoItems = [
// {
//     key: getId(),
//     label: "Have fun",
// },
// { 
//     key: getId(),
//     label: "Spread Empathy",
// },
// {
//     key: getId(),
//     label: "Generate Value",
// },
// ];

const newItems = JSON.parse(localStorage.getItem('items')) || [];


function App() {
    const [itemToAdd, setItemToAdd] = useState("");
    
    const [search, setSearch] = useState("");


    const [items, setItems] = useState(newItems);


    localStorage.setItem('items', JSON.stringify(items));
    
    const [filterType, setFilterType] = useState("");

 
    const handleChangeItem = (event) => {
        setItemToAdd(event.target.value);
    };

    const handleAddItem = () => {
        setItems((prevItems) => [
            { label: itemToAdd, key: getId() }, ...prevItems,
        ]);

        setItemToAdd("");
    };

    const handleItemDone = ({ key }) => {
        setItems((prevItems) => {
            return  prevItems.map((item) => {
                if (item.key === key) {
                    return { ...item, done: !item.done };
                } else return item;
            })
        });
    }

    const setItemImportant = ({ key }) => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.key === key) {
                    return {...item, important: !item.important};
                } else return item;
            })
        });
    };

    const setDeleteItem = ({key}) => {
        setItems(items.filter(items => items.key !== key));
    };


    const handleFilterItems = (type) => {
        setFilterType(type);
    };

    const handleSearch = (e) => {
        setFilterType("search");
        setSearch(e.target.value);

    }
    

    const amountDone = items.filter((item) => item.done).length;

    const amountLeft = items.length - amountDone;

    const filteredItems =
        !filterType || filterType === "all"
        ? items 
        : filterType === "search"
        ? items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        : filterType === "active"
        ? items.filter((item) => !item.done)
        : items.filter((item) => item.done);

    return (
        <div className="todo-app">
            {/* App-header */}
            <div className="app-header d-flex">
                <h1>Todo List</h1>
                <h2>
                {amountLeft} more to do, {amountDone} done
                </h2>
            </div>

            <div className="top-panel d-flex">
                {/* Search-panel */}
                <input
                    type="search"
                    className="form-control search-input"
                    placeholder="type to search"
                    onChange={handleSearch}
                    
                />
                {/* Item-status-filter */}
                <div className="btn-group">
                    {buttons.map((item) => (
                        <button
                            onClick={() => handleFilterItems(item.type)}
                            key={item.type}
                            type="button"
                            className={`btn btn-${filterType !== item.type ? "outline-" : ""}info`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List-group */}
            <ul className="list-group todo-list">
                {filteredItems.length > 0 &&
                filteredItems.map((item) => (
                    <li key={item.key} className="list-group-item">
                        <span className={`todo-list-item ${Boolean(item.done) === true ? "done" : ""} ${Boolean(item.important)===true ? "important" : ""}`} >
                            <span
                                className="todo-list-item-label"
                                onClick={() => handleItemDone(item)}
                            >
                                {item.label}
                            </span>

                            <button
                                onClick={() => setItemImportant(item)}
                                type="button"
                                className="btn btn-outline-success btn-sm float-right"
                            >
                                <i className="fa fa-exclamation" />
                            </button>
                        

                            <button
                                onClick={() => setDeleteItem(item)}
                                type="button"
                                className="btn btn-outline-danger btn-sm float-right"
                            >
                                <i className="fa fa-trash-o" />
                            </button>
                        </span>
                    </li>
                ))}
            </ul>

            {/* Add form */}
            <div className="item-add-form d-flex">
                <input
                    value={itemToAdd}
                    type="text"
                    className="form-control"
                    placeholder="What needs to be done"
                    onChange={handleChangeItem}
                />
                <button className="btn btn-outline-secondary" onClick={handleAddItem}>
                    Add item
                </button>
            </div>
        </div>
    );
}

export default App;
