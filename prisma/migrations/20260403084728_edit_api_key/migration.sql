-- AlterTable
ALTER TABLE "player_account" ADD COLUMN     "apiKeyId" TEXT;

-- AddForeignKey
ALTER TABLE "player_account" ADD CONSTRAINT "player_account_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE CASCADE;
