-- AlterTable
ALTER TABLE `exam` ADD COLUMN `validated_by_director` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `validated_by_hod` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `validation` MODIFY `comments` VARCHAR(191) NULL,
    MODIFY `validation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
