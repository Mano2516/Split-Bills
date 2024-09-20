// import "./index.css";
import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [openSplite, setOpenSplite] = useState(null);
  function handleSelection(friend) {
    setOpenSplite((cur) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
    // setShowAddFriend(false);
  }
  // function handelSelected(friend) {
  //   setOpenSplite(friend);
  //   // console.log(friend.name);
  // }
  function handelAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsOpen(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === openSplite.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setOpenSplite(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          onSelection={handleSelection}
          selected={openSplite}
        />
        {isOpen ? <AddFriend onAddFriend={handelAddFriend} /> : ""}
        <Button onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? "Add friend" : "Close"}
        </Button>
      </div>
      {openSplite && (
        <SplitBill selected={openSplite} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}
function Friends({ friends, onSelection, selected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selected={selected}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selected }) {
  const isSelected = selected?.id === friend.id;

  return (
    <div>
      <li className={isSelected ? "selected" : ""}>
        <h3>{friend.name}</h3>
        <p>
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owes you {friend.balance} $
            </p>
          )}
          {friend.balance < 0 && (
            <p className="red">
              You owe {friend.name} {friend.balance * -1} $
            </p>
          )}
          {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        </p>
        <img src={friend.image} alt={friend.name} />
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");
  function handelSumbit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handelSumbit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function SplitBill({ selected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [friendExpense, setFriendExpense] = useState("");
  const paidByFriend = bill ? bill - friendExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handelSumbission(e) {
    e.preventDefault();
    if (!bill || !friendExpense) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -friendExpense);
  }
  return (
    <form className="form-split-bill" onSubmit={handelSumbission}>
      <h2>SPlit A bill with {selected.name}</h2>
      <label>💰Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♂️Your expense</label>
      <input
        type="number"
        value={friendExpense}
        onChange={(e) =>
          setFriendExpense(
            Number(e.target.value) > bill
              ? paidByFriend
              : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{selected.name}’s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 How is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selected.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
// At Video number 7
