export type MemberType = {
  id: string;
  username: string;
  is_superuser: boolean;
}

export type BookType = {
  id: string;
  booklist: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

export type BookListType = {
  id: string;
  owner: MemberType;
  books: BookType[];
  type: string;
  is_completed: boolean;
}

export type GenreType = {
  id: string;
  type: string;
  booklist: {
    is_completed: boolean;
  }
}

export type SearchBookType = {
  id: string;
  title: string;
  description: string;
  image: string;
}