import { api as index } from "..";

const api = index.injectEndpoints({
  endpoints: (build) => ({
    GetTodos: build.query<TODO.GetTodosRes, TODO.GetTodosReq>({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["todo"],
    }),
    PostTodos: build.mutation<TODO.PostTodosRes, TODO.PostTodosReq>({
      query: (newData) => ({
        url: "/",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["todo"],
    }),
    DeleteTodo: build.mutation<TODO.DeleteTodoRes, TODO.DeleteTodoReq>({
      query: (_id) => ({
        url: `/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["todo"],
    }),
    UploadTodos: build.mutation<TODO.PostUploadFileRes, TODO.PostUploadFileReq>(
      {
        query: (data) => ({
          url: "/upload/file",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["upload"],
      }
    ),
    //////////
    EditIdTodos: build.mutation<TODO.PatchTodoRes, TODO.PatchTodoReq>({
      query: ({ _id, data }) => ({
        url: `/${_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useDeleteTodoMutation,
  usePostTodosMutation,
  useUploadTodosMutation,
  useEditIdTodosMutation,
} = api;
