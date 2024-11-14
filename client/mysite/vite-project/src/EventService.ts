import axios from "axios";

// ログイン用のaxiosインスタンス
const loginClient = axios.create({
  // baseURL: "http://0.0.0.0:8000/", // mac
  // baseURL: "http://127.0.0.1:8000/", // windows
  baseURL: "https://django-backend-3637277477.asia-northeast1.run.app/", //gcp
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// サインアップ用のaxiosインスタンス
const signupClient = axios.create({
  // baseURL: "http://0.0.0.0:8000/api", // mac
  // baseURL: "http://127.0.0.1:8000/api", //windows
  baseURL: "https://django-backend-3637277477.asia-northeast1.run.app/api", //gcp
  headers: {
    "Content-Type": "application/json",
  },
});

// API用のaxiosインスタンス
const apiClient = axios.create({
  // baseURL: "http://0.0.0.0:8000/api", // mac
  // baseURL: "http://127.0.0.1:8000/api", //windows
  baseURL: "https://django-backend-3637277477.asia-northeast1.run.app/api", //gcp
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
};

type recBookInfo = {
  id: string;
  want_to_see?: boolean;
  want_to_rewatch?: boolean;
};

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
  getBookLists({
    booklisttype_id,
    member_id,
    reviewer_id,
    mode,
  }: {
    booklisttype_id?: string;
    member_id?: string;
    reviewer_id?: string;
    mode: string;
  }) {
    const params: { [key: string]: string } = {
      mode,
    };
    if (booklisttype_id) {
      params.booklisttype_id = booklisttype_id;
    }
    if (member_id) {
      params.member_id = member_id;
    }
    if (reviewer_id) {
      params.reviewer_id = reviewer_id;
    }
    const queryString = new URLSearchParams(params).toString(); // クエリ文字列を生成
    const url = `booklist/?${queryString}`; // URLを構築
    return apiClient.get(url);
  },
  getBookListAdminView(booklisttype_id: string) {
    return apiClient.get(
      // `booklist/admin_view/?booklisttype_id=${booklisttype_id}`
      `recbook/admin_view/?booklisttype_id=${booklisttype_id}`
    );
  },
  putBookList(bookListInfo: bookListInfo) {
    return apiClient.put("book/bulk_update/", bookListInfo);
  },
  postBookListLike(bookListLike: bookListLikeInfo) {
    return apiClient.post("booklist/like/", bookListLike);
  },
  getRecBookList(booklist_id: string) {
    return apiClient.get(`recbook/?booklist_id=${booklist_id}`);
  },
  putRecBook(recBookInfo: recBookInfo) {
    return apiClient.put(
      `recbook/${recBookInfo.id}/update_wants/`,
      recBookInfo
    );
  },
};
