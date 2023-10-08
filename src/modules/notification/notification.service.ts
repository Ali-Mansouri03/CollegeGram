import {NotificationRepository} from "./notification.repository";
import {CreateNotificationInterface} from "./model/notification";
import {
    acceptFollowRequestEventEmitter,
    commentEventEmitter,
    followEventEmitter,
    followRequestEventEmitter,
    likeEventEmitter
} from "../../utility/event-handling";
import {PostId} from "../post/model/post-id";
import {UserId} from "../user/model/user.id";
import {LikeNotification, LikeNotificationType} from "./model/like-notification";
import {GetNotificationsDto} from "./dto/get-notifications.dto";
import {PostLowService} from "../post/post.low.service";
import {CommentNotification, CommentNotificationType} from "./model/comment-notification";
import {FollowNotification, FollowNotificationType} from "./model/follow-notification";
import {
    FollowRequestAcceptedNotification, FollowRequestAcceptedNotificationType,
    FollowRequestPendingNotification,
    FollowRequestPendingNotificationType
} from "./model/follow-request-notification";
import {CommentId} from "../post/comment/model/comment-id";

export class NotificationService {
    constructor(
        private notificationRepository: NotificationRepository,
        private postService: PostLowService,
    ) {
        likeEventEmitter.on('like', async (userId: UserId, postId: PostId) => {
            await this.makeLikeNotification(userId, postId);
        })
        commentEventEmitter.on('comment', async (userId: UserId, postId: PostId, commentId: CommentId) => {
            await this.makeCommentNotification(userId, postId, commentId);
        })
        followEventEmitter.on('follow', async (followerId: UserId, followingId: UserId) => {
            await this.makeFollowNotification(followerId, followingId);
        })
        followRequestEventEmitter.on('followRequest', async (followerId: UserId, followingId: UserId) => {
            await this.makeFollowRequestNotification(followerId, followingId);
        })
        acceptFollowRequestEventEmitter.on('acceptFollowRequest', async (followerId: UserId, followingId: UserId) => {
            await this.makeAcceptFollowNotification(followerId, followingId);
        })
    }

    async getMyNotifications(dto: GetNotificationsDto) {
        return await this.notificationRepository.getNotificationsByUserId(dto);
    }

    async makeLikeNotification(userId: UserId, postId: PostId) {
        const interactingUserId = userId;
        const interactedUserId = await this.postService.getAuthorById(postId);
        const newNotification: CreateNotificationInterface = {
            interactingUserId: interactingUserId,
            interactedUserId: interactedUserId,
            type: LikeNotification as LikeNotificationType,
            postId: postId,
        }
        await this.notificationRepository.create(newNotification);
    }

    async makeCommentNotification(userId: UserId, postId: PostId, commentId: CommentId) {
        const interactingUserId = userId;
        const interactedUserId = await this.postService.getAuthorById(postId);
        const newNotification: CreateNotificationInterface = {
            interactingUserId: interactingUserId,
            interactedUserId: interactedUserId,
            type: CommentNotification as CommentNotificationType,
            postId: postId,
            commentId: commentId,
        }
        await this.notificationRepository.create(newNotification);
    }

    async makeFollowNotification(followerId: UserId, followingId: UserId) {
        const interactingUserId = followerId;
        const interactedUserId = followingId;
        const newNotification: CreateNotificationInterface = {
            interactingUserId: interactingUserId,
            interactedUserId: interactedUserId,
            type: FollowNotification as FollowNotificationType,
        }
        await this.notificationRepository.create(newNotification);
    }

    async makeFollowRequestNotification(followerId: UserId, followingId: UserId) {
        const interactingUserId = followerId;
        const interactedUserId = followingId;
        const newNotification: CreateNotificationInterface = {
            interactingUserId: interactingUserId,
            interactedUserId: interactedUserId,
            type: FollowRequestPendingNotification as FollowRequestPendingNotificationType,
        }
        await this.notificationRepository.create(newNotification);
    }

    async makeAcceptFollowNotification(followerId: UserId, followingId: UserId) {
        const interactingUserId = followerId;
        const interactedUserId = followingId;
        const newNotification: CreateNotificationInterface = {
            interactingUserId: interactingUserId,
            interactedUserId: interactedUserId,
            type: FollowRequestAcceptedNotification as FollowRequestAcceptedNotificationType,
        }
        await this.notificationRepository.create(newNotification);
    }


}