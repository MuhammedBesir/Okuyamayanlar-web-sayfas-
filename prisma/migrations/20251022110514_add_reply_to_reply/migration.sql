-- AlterTable
ALTER TABLE "forum_replies" ADD COLUMN     "parentReplyId" TEXT;

-- AddForeignKey
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_parentReplyId_fkey" FOREIGN KEY ("parentReplyId") REFERENCES "forum_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
