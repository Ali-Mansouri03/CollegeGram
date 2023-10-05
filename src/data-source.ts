import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "./modules/user/entity/user.entity";
import { SessionEntity } from "./modules/user/entity/session.entity";
import 'dotenv-flow/config';
import { PostEntity } from "./modules/post/entity/post.entity";
import { CommentEntity } from "./modules/post/comment/entity/comment.entity";
import { TagEntity } from "./modules/post/tag/entity/tag.entity";
import { UserInteractionEntity } from "./modules/user-interaction/entity/user-interaction";
import { BlockEntity } from "./modules/block/entity/block.entity";
import { FollowEntity } from "./modules/follow/entity/follow.entity";
import { FollowRequestEntity } from "./modules/follow/entity/follow-request.entity";
import { BookmarkEntity } from "./modules/bookmark/entity/book-mark.entity";

export const AppDataSource = new DataSource({
    url: process.env.DB_URL,
    type: "postgres",
    port: 34561,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    entities: [UserEntity, SessionEntity, PostEntity, CommentEntity, TagEntity, UserInteractionEntity, FollowEntity, FollowRequestEntity, BlockEntity, BookmarkEntity],
    migrations: ["./src/migrations/*.ts"],
    subscribers: [],
});

