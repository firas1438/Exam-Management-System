/*
  Warnings:

  - Added the required column `session_id` to the `exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exam` ADD COLUMN `session_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `session` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_type` ENUM('DS1', 'DS2', 'EX1', 'EX2', 'CONTROLE') NOT NULL,
    `date_debut` DATETIME(3) NOT NULL,
    `date_fin` DATETIME(3) NOT NULL,
    `is_validated` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exam` ADD CONSTRAINT `exam_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `session`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
