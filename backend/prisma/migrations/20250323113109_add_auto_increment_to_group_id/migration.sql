-- AlterTable
ALTER TABLE `student` DROP FOREIGN KEY `student_group_id_fkey`;
ALTER TABLE `group` MODIFY `group_id` INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE `student`
ADD CONSTRAINT `student_group_id_fkey`
FOREIGN KEY (`group_id`) REFERENCES `group`(`group_id`);