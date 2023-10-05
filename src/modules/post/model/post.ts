import { UserId } from "../../user/model/user.id";
import { CreateTagInterface } from "../tag/model/tag";
import {Tags} from "../tag/dto/tag.dto";
import {PostId} from "./post-id";

export interface PostInterface {
  id: PostId;
  photos: string[];
  description?: string;
  tags?: Tags;
  closeFriends: boolean;
  createdAt: Date;
}

export interface CreatePostInterface {
  userId: UserId;
  photos: string[];
  description?: string;
  tags?: CreateTagInterface[];
  closeFriends: boolean;
}

export interface PostsInterface {
  posts: PostInterface[],
  nextOffset: Date,
  hasMore: boolean,
}