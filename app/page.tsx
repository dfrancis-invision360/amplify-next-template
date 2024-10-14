"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";


Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteItem(id: string){
      client.models.Todo.delete({ id })
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  const { signOut } = useAuthenticator();

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul style={{width: 400}}>
        {todos.map((todo) => (
          <li key={todo.id} style={{display:'flex', justifyContent: 'space-between', alignItems:'center'}}>
              {todo.content}
              <button style={{marginLeft: 10}} onClick={() => deleteItem(todo.id)}>delete</button>
          </li>

        ))}
      </ul>

        <button onClick={signOut}>logout</button>

    </main>
  );
}
