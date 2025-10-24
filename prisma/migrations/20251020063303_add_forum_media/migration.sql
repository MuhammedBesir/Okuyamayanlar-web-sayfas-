-- AlterTable
ALTER TABLE "forum_replies" ADD COLUMN     "image" TEXT,
ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "forum_topics" ADD COLUMN     "category" TEXT,
ADD COLUMN     "image" TEXT;
