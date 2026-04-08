-- AlterTable
ALTER TABLE "AccountDevice" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "AccountDevice" ADD CONSTRAINT "AccountDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
