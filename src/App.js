import { useEffect, useState } from "react";
import "./App.css";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";

const AppToaster = Toaster.create({
  position: "top",
});

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUsers(json))
      .catch((error) => {
        AppToaster.show({
          message: "Failed to load users",
          intent: "danger",
          timeout: 3000,
        });
        console.error("Error fetching users:", error);
      });
  }, []);

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          AppToaster.show({
            message: "User added successfully",
            intent: "success",
            timeout: 3000,
          });
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        });
    }
  }

  function onchangeHandler(id, key, value) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [key]: value } : user
      )
    );
  }

  // Update user function
  function updateUser(id) {
    const user = users.find((user) => user.id === id);

    // fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    fetch(`https://jsonplaceholder.typicode.com/users/10`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? data : user))
        );
        AppToaster.show({
          message: "User updated successfully",
          intent: "success",
          timeout: 3000,
        });
      });
  }

  // Delete function
  function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Correct filter function
        AppToaster.show({
          message: "User deleted successfully",
          intent: "success",
          timeout: 3000,
        });
      });
  }
  

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <EditableText
                    onChange={(value) =>
                      onchangeHandler(user.id, "email", value)
                    }
                    value={user.email}
                  />
                </td>
                <td>
                  <EditableText
                    onChange={(value) =>
                      onchangeHandler(user.id, "website", value)
                    }
                    value={user.website}
                  />
                </td>
                <td>
                  <Button intent="primary" onClick={() => updateUser(user.id)}>
                    Update
                  </Button>
                  <Button intent="danger" onClick={() => deleteUser(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter Name..."
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter Email..."
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="Enter Website..."
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
