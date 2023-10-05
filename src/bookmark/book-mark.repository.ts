import { DataSource, LessThan, Repository } from "typeorm";
import { BookmarkEntity } from "./entity/book-mark.entity";
import { Bookmark, bookmarkInterface } from "./model/book-mark";
import { PostEntity } from "../modules/post/entity/post.entity";
import { UserId } from "../modules/user/model/user.id";
import { zodbookmarkPostssDao } from "./dao/bookmark.dao";
import {z} from "zod"

export class BookmarkRepository {
  private bookmarkRepo: Repository<BookmarkEntity>
  constructor(private appDataSource: DataSource) {
    this.bookmarkRepo = appDataSource.getRepository(BookmarkEntity);
  }

  createBookmark(bookmark: bookmarkInterface) {
    return new Promise<bookmarkInterface>(async (resolve, reject) => {
      try {
        await this.appDataSource.manager.transaction(async manager => {
          const postRepo = manager.getRepository(PostEntity);
          const bookmarkRepo = manager.getRepository(BookmarkEntity);
          const newBookmark = await bookmarkRepo.save({
            userId: bookmark.userId,
            postId: bookmark.postId
          });
          await postRepo.update(
            { id: bookmark.postId },
            { bookmarkCount: () => "bookmarkCount + 1" }
          );
          resolve(newBookmark);
        });
      } catch (error) {
        reject(error);
      }
    });

  }

  async getBookmark(bookmark: bookmarkInterface): Promise<Bookmark | null> {
    const getBookmark = await this.bookmarkRepo.findOneBy({ userId: bookmark.userId, postId: bookmark.postId })
    return getBookmark
  }


  async getBookmarksByUserId(userId: UserId, limit: number, startTime: Date){
    const [posts, count] = await this.bookmarkRepo.findAndCount(
      {
        where: {
          userId: userId,
          createdAt: LessThan(startTime)
        },
        order: { createdAt: 'desc' },
        take: limit

      }
    )
    const bookmarkPosts = z.nullable(zodbookmarkPostssDao).parse(posts)
    const hasMore = count > limit
    return { bookmarkPosts: bookmarkPosts, hasMore: hasMore }
  }

  async deleteBookmark(bookmark: Bookmark) {
    await this.appDataSource.manager.transaction(async manager => {
      const postRepo = manager.getRepository(PostEntity);
      const bookmarkRepo = manager.getRepository(BookmarkEntity);
      const deletedBookmark = await bookmarkRepo.delete({ userId: bookmark.userId, postId: bookmark.postId });
      await postRepo.update(
        { id: bookmark.postId },
        { bookmarkCount: () => "bookmarkCount - 1" }
      );
    });

  }

}