export interface PostLike {
  _id: number;
  user: {
    _id: number;
    name: string;
  };
  memo: string;
  target_id: number;
  extra: {
    type: "POST";
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostLikeData {
  target_id: number;
  memo: string;
  extra: {
    type: "POST";
  };
}
