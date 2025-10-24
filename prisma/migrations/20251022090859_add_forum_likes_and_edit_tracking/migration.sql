-- AlterTable
ALTER TABLE "forum_replies" ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "forum_topics" ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "forum_topic_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_topic_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_reply_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_reply_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forum_topic_likes_userId_topicId_key" ON "forum_topic_likes"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "forum_reply_likes_userId_replyId_key" ON "forum_reply_likes"("userId", "replyId");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_borrowedBy_fkey" FOREIGN KEY ("borrowedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_topic_likes" ADD CONSTRAINT "forum_topic_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_topic_likes" ADD CONSTRAINT "forum_topic_likes_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "forum_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_reply_likes" ADD CONSTRAINT "forum_reply_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_reply_likes" ADD CONSTRAINT "forum_reply_likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "forum_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
