import { Router } from "express";
import { PostService } from "../modules/post/post.service";
import { CommentService } from "../modules/post/comment/comment.service";
import { createPostDto } from "../modules/post/dto/create-post.dto";
import { handleExpresss } from "../utility/handle-express";
import { loginMiddle } from "../login.middleware";
import { UserService } from "../modules/user/user.service";
import { createCommentDto } from "../modules/post/comment/dto/create-comment.dto";
import { getPostsDto } from "../modules/post/dto/get-posts-dto";
import { getPostIdDto } from "../modules/post/dto/get-post-id-dto";
import { uploadMinIO } from "../utility/multer";
import { BadRequestError } from "../utility/http-errors";
import { likeDto } from "../modules/post/like/dto/like.dto";
import { LikeService } from "../modules/post/like/like.service";
import { homePageDto } from "../modules/post/dto/home-page.dto";
import { HomePageService } from "../modules/post/home-page.service";
import { CreateBookmarkDto } from "../modules/bookmark/dto/create-book-mark.dto";
import { BookmarkService } from "../modules/bookmark/book-mark.service";
import { GetBookmarkDto } from "../modules/bookmark/dto/get-book-mark.dto";


export const makePostRouter = (userService: UserService, postService: PostService, commentService: CommentService, homePageService: HomePageService, likeService: LikeService, bookmarkService: BookmarkService) => {
    const app = Router();
    app.post("/", loginMiddle(userService), uploadMinIO.array('post-photos'), (req, res) => {
        const data = createPostDto.parse(req.body);
        if (!req.files) {
            return new BadRequestError("post has no images")
        }
        handleExpresss(res, () => postService.createPost(data, req.files as Express.Multer.File[], req.user));
    });

    app.get("/home", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const limit = req.query.limit
        const startTime = req.query.startTime ? req.query.startTime : new Date()
        const dto = homePageDto.parse({ userId, limit, startTime })
        handleExpresss(res, () => homePageService.getHome(dto))
    })

    app.get("/user", loginMiddle(userService), (req, res) => {
        const { limit, startTime } = getPostsDto.parse(req.query);
        handleExpresss(res, () => postService.getPostsByUserId(req.user.id, limit, startTime ? startTime : new Date()));
    });

    app.get("/bookmarks", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const limit = req.query.limit
        const startTime = req.query.startTime ? req.query.startTime : new Date()
        const dto = GetBookmarkDto.parse({ userId, limit, startTime })
        handleExpresss(res, () => bookmarkService.getBookmarks(dto))
    })

    app.post("/bookmark", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const postId = req.body.id
        const dto = CreateBookmarkDto.parse({ userId, postId })
        handleExpresss(res, () => bookmarkService.bookmark(dto))
    })

    app.post("/unbookmark", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const postId = req.body.id
        const dto = CreateBookmarkDto.parse({ userId, postId })
        handleExpresss(res, () => bookmarkService.unBookmark(dto))
    })

    app.get("/:id", loginMiddle(userService), (req, res) => {
        const { id } = getPostIdDto.parse(req.params);
        handleExpresss(res, () => postService.getPostById(id));
    });

    app.post("/:id/comment", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const postId = req.params.id
        const dto = createCommentDto.parse({ userId, postId, ...req.body })
        handleExpresss(res, () => commentService.comment(dto))
    })

    app.get("/:id/like", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const postId = req.params.id
        const dto = likeDto.parse({ userId, postId, ...req.body })
        handleExpresss(res, () => likeService.like(dto))
    })

    app.get("/:id/unlike", loginMiddle(userService), (req, res) => {
        const userId = req.user.id
        const postId = req.params.id
        const dto = likeDto.parse({ userId, postId, ...req.body })
        handleExpresss(res, () => likeService.unlike(dto))
    })


    return app;
};