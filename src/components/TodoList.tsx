"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import scss from "./TodoList.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  usePostTodosMutation,
} from "../redux/api/todo";

interface IFTodos {
  _id: number;
  title: string;
  age: string;
  file: string[];
  createAt: string;
  updateAt: string;
}

interface IFTodo {
  _id: number;
  title: string;
  age: string;
  file: string;
  createAt: string;
  updateAt: string;
}

const api = process.env.NEXT_PUBLIC_API!;
const upload = process.env.NEXT_PUBLIC_UPLOAD!;

const TodoList = () => {
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: reset,
  } = useForm<IFTodos>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm<IFTodos>();

  const [deleteTodoMutation] = useDeleteTodoMutation();
  const [postTodosMutation] = usePostTodosMutation();

  // Используйте хук RTK Query для получения данных
  const { data: todosData, error, isLoading } = useGetTodosQuery();

  const [todos, setTodos] = useState<IFTodo[]>([]);
  const [isEditId, setIsEditId] = useState<number | null>(null);

  useEffect(() => {
    if (todosData) {
      // @ts-ignore
      setTodos(todosData);
    }
  }, [todosData]);

  const onSubmit: SubmitHandler<IFTodos> = async (data) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    const { data: responseUpload } = await axios.post(upload, formData);

    const newData = {
      _id: data._id,
      title: data.title,
      age: data.age,
      file: responseUpload.url,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    //@ts-ignore
    const { data: responseTodo } = await postTodosMutation(newData);
    //@ts-ignore
    setTodos(responseTodo);
    reset();
  };

  const onSubmitEdit: SubmitHandler<IFTodos> = async (data) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);
    const { data: responseUpload } = await axios.post(upload, formData);

    const newData = {
      title: data.title,
      age: data.age,
      file: responseUpload.url,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    const { data: responseData } = await axios.put(
      `${api}/${isEditId}`,
      newData
    );
    setTodos(responseData);
    setIsEditId(null);
  };

  const TodoDelete = async (_id: number) => {
    const { data } = await deleteTodoMutation(_id);
    //@ts-ignore
    setTodos(data);
  };

  if (isLoading) return <p>Loading...</p>;
  //@ts-ignore
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className={scss.TodoList}>
      <h1>TodoList</h1>
      <form onSubmit={handleSubmitAdd(onSubmit)}>
        <input
          type="text"
          placeholder="User name"
          {...registerAdd("title", { required: true })}
        />
        <input
          type="number"
          placeholder="User age"
          {...registerAdd("age", { required: true })}
        />
        <input type="file" {...registerAdd("file", { required: true })} />
        <button className={scss.btn} type="submit">
          Submit
        </button>
      </form>
      <div className={scss.EditTodos}>
        {todos.map((el) => (
          <div className={scss.card} key={el._id}>
            {isEditId === el._id ? (
              <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                <input
                  type="text"
                  {...registerEdit("title", { required: true })}
                />
                <input
                  type="number"
                  {...registerEdit("age", { required: true })}
                />
                <input
                  type="file"
                  {...registerEdit("file", { required: true })}
                />
                <div className={scss.btns}>
                  <button className={scss.greenBtn} type="submit">
                    Edit
                  </button>
                  <button
                    className={scss.greenBtn}
                    onClick={() => setIsEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <img src={el.file} alt={el.title} />
                <h4>{el.title}</h4>
                <h5>{el.age}</h5>
                <div className={scss.btns}>
                  <button
                    className={scss.greenBtn}
                    onClick={() => setIsEditId(el._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={scss.redBtn}
                    onClick={() => TodoDelete(el._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
