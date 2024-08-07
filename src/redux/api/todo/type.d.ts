namespace TODO {
  type GetTodosRes = IFTodos[];
  type GetTodosReq = void;

  type PostTodosRes = IFTodos[];
  type PostTodosReq = void;

  type DeleteTodoRes = IFTodos[];
  type DeleteTodoReq = number;

  type PostUploadFileRes = {
    name: string;
    format: string;
    url: string;
  };
  type PostUploadFileReq = FormData;

  type PatchTodoRes = IFTodos[];
  type PatchTodoReq = {
    _id: number;
    data: ITodos;
  };
}
