export interface Like {
  _id: number;
  user: {
    _id: number;
    name: string;
  };
  memo: string;
  target_id: number;
  extra: {
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LikeData {
  target_id: number;
  memo: string;
  extra: {
    type: string;
  };
}
