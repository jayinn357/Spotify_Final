// frontend/src/App.tsx

import {useEffect, useState} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then((data: User[]) => setUsers(data))
      .catch(err => {
        console.error('Error in fetching users:', err);
      });
}, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;