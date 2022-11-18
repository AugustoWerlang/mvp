import { GetServerSideProps } from "next"
import { prisma } from "../../lib/prisma";
import { Task } from "@prisma/client";
import { FormEvent, useState } from "react";

type TasksProps = {
  tasks: Task[]
}

export default function App({ tasks }: TasksProps) {
  const [newTask, setNewTask] = useState("");

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();

    await fetch("http://localhost:3000/api/tasks/create", {
      method: "POST",
      body: JSON.stringify({ title: newTask }),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  return (
    <div>
      <ul className="text-6xl">
        {tasks.map(task => <li key={task.id}>{task.title}</li>)}
      </ul>
      <form onSubmit={handleCreateTask}>
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)}/>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasksRaw = await prisma.task.findMany();

  const tasks = tasksRaw.map(task => {
    return {
      id: task.id,
      title: task.title,
      isDone: task.isDone,
      date: task.createdAt.toISOString()
    }
  })

  return {
    props: {
      tasks
    }
  }
}