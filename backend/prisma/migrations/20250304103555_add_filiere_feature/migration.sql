/*
  Warnings:

  - The primary key for the `supervisorexam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `filiere_name` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filiere_name` to the `subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monitor_id` to the `supervisorexam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `supervisorexam` DROP FOREIGN KEY `SupervisorExam_exam_id_fkey`;

-- DropForeignKey
ALTER TABLE `supervisorexam` DROP FOREIGN KEY `SupervisorExam_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `supervisorexam` DROP FOREIGN KEY `SupervisorExam_supervisor_id_fkey`;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `filiere_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `group_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `subject` ADD COLUMN `filiere_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supervisorexam` DROP PRIMARY KEY,
    ADD COLUMN `monitor_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`monitor_id`);

-- CreateTable
CREATE TABLE `filiere` (
    `filiere_name` VARCHAR(100) NOT NULL,
    `department_id` INTEGER NOT NULL,

    PRIMARY KEY (`filiere_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `group_id` INTEGER NOT NULL,
    `group_name` VARCHAR(100) NOT NULL,
    `filiere_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `group_group_name_filiere_name_key`(`group_name`, `filiere_name`),
    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `filiere` ADD CONSTRAINT `filiere_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `group_filiere_name_fkey` FOREIGN KEY (`filiere_name`) REFERENCES `filiere`(`filiere_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_filiere_name_fkey` FOREIGN KEY (`filiere_name`) REFERENCES `filiere`(`filiere_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`group_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject` ADD CONSTRAINT `subject_filiere_name_fkey` FOREIGN KEY (`filiere_name`) REFERENCES `filiere`(`filiere_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supervisorexam` ADD CONSTRAINT `supervisorexam_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exam`(`exam_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supervisorexam` ADD CONSTRAINT `supervisorexam_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supervisorexam` ADD CONSTRAINT `supervisorexam_supervisor_id_fkey` FOREIGN KEY (`supervisor_id`) REFERENCES `teacher`(`teacher_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
