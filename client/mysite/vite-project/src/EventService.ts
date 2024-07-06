import axios from "axios";

// ログイン用のaxiosインスタンス
const loginClient = axios.create({
  // baseURL: "http://0.0.0.0:8000/", // mac
  baseURL: "http://127.0.0.1:8000/", // windows
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// サインアップ用のaxiosインスタンス
const signupClient = axios.create({
  // baseURL: "http://0.0.0.0:8000/api", // mac
  baseURL: "http://127.0.0.1:8000/api", //windows
  headers: {
    "Content-Type": "application/json",
  },
});

// API用のaxiosインスタンス
const apiClient = axios.create({
  // baseURL: "http://0.0.0.0:8000/api", // mac
  baseURL: "http://127.0.0.1:8000/api", //windows
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストを送信する前に実行されるインターセプターを追加
apiClient.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`; // トークンを動的に設定
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

type loginInfo = {
  username: string;
  password: string;
};

type signupInfo = {
  username: string;
  email: string;
  password: string;
};

type profileInfo = {
  id: string;
  username: string;
  email: string;
};

type bookInfo = {
  id: string;
  booklist: string;
  title: string;
  description: string;
  image: string;
  order: number;
};

type bookListInfo = {
  books: bookInfo[];
};

type bookListLikeInfo = {
  booklist_id: string;
  reviewer_id: string;
  like: boolean;
}

export default {
  submitLogin(loginInfo: loginInfo) {
    return loginClient.post("api-token-auth/", loginInfo);
  },
  submitSignup(signupInfo: signupInfo) {
    return signupClient.post("member/", signupInfo);
  },
  updateProfile(id: string, profileInfo: profileInfo) {
    return apiClient.patch(`member/${id}/`, profileInfo);
  },
  getMembers() {
    return apiClient.get("member/");
  },
  getBookListTypes(owner_id: string) {
    return apiClient.get(`booklisttype/?owner_id=${owner_id}`);
  },
  getBookLists({ booklisttype_id, member_id, reviewer_id, mode }: { booklisttype_id?: string, member_id?: string, reviewer_id: string, mode: string}) {
    let url = `booklist/?mode=${mode}&reviewer_id=${reviewer_id}&`;

    if (booklisttype_id) {
      url += `booklisttype_id=${booklisttype_id}`;
    }

    if (member_id) {
      url += `member_id=${member_id}`;
    }

    return apiClient.get(url);
  },
  getBookListAdminView(booklisttype_id: string) {
    return apiClient.get(`booklist/admin_view/?booklisttype_id=${booklisttype_id}`);
  },
  putBookList(bookListInfo: bookListInfo) {
    return apiClient.put("book/bulk_update/", bookListInfo);
  },
  postBookListLike(bookListLike: bookListLikeInfo) {
    return apiClient.post("booklist/like/", bookListLike)
  }
};
