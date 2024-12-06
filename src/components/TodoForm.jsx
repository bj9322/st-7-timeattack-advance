import { useState } from "react";
import { todoApi } from "../api/todos";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const queryClient = useQueryClient();

  // TODO: 필수: useMutation 으로 리팩터링 하세요.
  const mutation = useMutation({
    mutationFn: async (newTodo) => {
      const response = await todoApi.post("/todos", newTodo);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  })
  
  // TODO: 선택: useMutation 으로 리팩터링 후, useTodoMutation 커스텀훅으로 정리해 보세요.
  const handleAddTodo = async (e) => {
    e.preventDefault();
    mutation.mutate({
      id: Date.now().toString(),
      title,
      contents,
      isCompleted: false,
      createdAt: Date.now(),
    })
    setTitle("");
    setContents("");

  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="title">제목:</label>
      <input
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="contents">내용:</label>
      <input
        id="contents"
        name="contents"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        required
      />
      <button type="submit">추가하기</button>
    </form>
  );
}
