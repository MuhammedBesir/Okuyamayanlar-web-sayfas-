-- AlterTable
ALTER TABLE "books" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "borrowedAt" TIMESTAMP(3),
ADD COLUMN     "borrowedBy" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3);
