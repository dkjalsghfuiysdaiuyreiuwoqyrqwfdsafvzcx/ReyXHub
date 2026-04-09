/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `AccountDevice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccountDevice_name_userId_key" ON "AccountDevice"("name", "userId");
