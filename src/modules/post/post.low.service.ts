import { PostRepository } from "./post.repository";
import { PostId } from "./model/post-id";
import { CreatePostInterface, PostInterface } from "./model/post";
import { UserId } from "../user/model/user.id";
import { NotFoundError } from "../../utility/http-errors";
import { TagTitle } from "./tag/model/tag-title";
import { FollowingId } from "../follow/model/follow";

export class PostLowService {
    constructor(private postRepository: PostRepository) {
    }

    async getPostById(id: PostId): Promise<PostInterface | null> {
        return await this.postRepository.getPostById(id);
    }

    async createPost(post: CreatePostInterface): Promise<PostInterface> {
        return await this.postRepository.createPost(post);
    }

    async getPostsByUsersId(usersId: UserId[], limit: number, startTime: Date) {
        const result = await this.postRepository.getPostsByusersId(usersId, limit, startTime)
        const nextOffset = result.resultPosts.length === 0 ? new Date() : result.resultPosts[result.resultPosts.length - 1].createdAt
        const hasMore = result.hasMore
        return {
            posts: result.resultPosts,
            nextOffset: nextOffset,
            hasMore: hasMore,
        }
    }

    async getPostsByUserId(userId: UserId, limit: number, startTime: Date) {
        const result = await this.postRepository.getPostsByUserId(userId, limit, startTime);
        return {
            posts: result.posts,
            hasMore: result.hasMore,
            nextOffset: result.posts.length > 0 ? result.posts[result.posts.length - 1].createdAt : new Date,
        }
    }

    async getPostsByTagTitle(unWantedUsers: UserId[], followingUsers: FollowingId[], tagTitle: TagTitle, limit: number, startTime: Date) {
        return await this.postRepository.getPostsByTagTitle(unWantedUsers, followingUsers, tagTitle, limit, startTime)
    }

    async userHasMorePosts(userId: UserId, startTime: Date): Promise<boolean> {
        return await this.postRepository.userHasMorePosts(userId, startTime);
    }

    async getAuthorById(postId: PostId) {
        const author = await this.postRepository.getAuthorById(postId)
        if (!author) {
            throw new NotFoundError('User');
        }
        return author;
    }

    async getTotalPostById(postId: PostId) {
        const post = await this.postRepository.getTotalPostById(postId)
        if (!post) {
            throw new NotFoundError('Post');
        }
        return post;
    }

    //TODO: add closeFriend
    async getPostsForExploreByUserId(userId: UserId , limit: number) {
        return await this.postRepository.getPostsForExploreByUserId(userId, limit)
    }
}