/*
  Warnings:

  - You are about to drop the column `validated_by_director` on the `exam` table. All the data in the column will be lost.
  - You are about to drop the column `validated_by_hod` on the `exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `exam` DROP COLUMN `validated_by_director`,
    DROP COLUMN `validated_by_hod`;

-- AlterTable
ALTER TABLE `supervisorexam` ADD COLUMN `validated_by_director` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `validated_by_hod` BOOLEAN NOT NULL DEFAULT false;
