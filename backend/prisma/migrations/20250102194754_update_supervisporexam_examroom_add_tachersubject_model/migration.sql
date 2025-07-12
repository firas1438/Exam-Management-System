/*
  Warnings:

  - You are about to drop the column `end_time` on the `exam` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `exam` DROP COLUMN `end_time`,
    DROP COLUMN `start_time`;

-- AlterTable
ALTER TABLE `examroom` ADD COLUMN `end_time` DATETIME(3) NULL,
    ADD COLUMN `start_time` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `supervisorexam` ADD COLUMN `end_time` DATETIME(3) NULL,
    ADD COLUMN `start_time` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `TeacherSubject` (
    `teacher_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`teacher_id`, `subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeacherSubject` ADD CONSTRAINT `TeacherSubject_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`teacher_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherSubject` ADD CONSTRAINT `TeacherSubject_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
