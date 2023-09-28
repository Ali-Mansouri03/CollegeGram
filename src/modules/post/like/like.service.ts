import {LikeRepository} from "./like.repository";
import {PostService} from "../post.service";
import {LikeDtoType} from "./dto/like.dto";
import {BadRequestError, NotFoundError} from "../../../utility/http-errors";
import {followService} from "../../follow/follow.service";
import {UserService} from "../../user/user.service";
import {likeEventEmmmiter} from "../../../data/event-handling";

export class LikeService {
    constructor(private likeRepository: LikeRepository, private postService: PostService, private userService: UserService, private followRellService: followService) {
    }

    async like(dto: LikeDtoType) {
        const post = await this.postService.getPostById(dto.postId);
        if (!post) {
            throw new NotFoundError('Post');
        }
        if (post.userId === dto.userId) {
            throw new BadRequestError('You can not like your own post');
        }
        const author = await this.userService.getUserById(post.userId);
        if (author.isPrivate) {
            const follow = await this.followRellService.getFollowRelation({
                followerId: dto.userId,
                followingId: author.id
            });
            if (!follow) {
                throw new BadRequestError('You can not like this post');
            }
        }
        const like = await this.likeRepository.isLiked(dto);
        if (like) {
            throw new BadRequestError('You have already liked this post');
        }
        const newLike = await this.likeRepository.create(dto);
        likeEventEmmmiter.emit('like', newLike.userId, newLike.postId);
        return {status: "liked"};
    }
}