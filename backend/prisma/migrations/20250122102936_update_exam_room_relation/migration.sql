/*
  Warnings:

  - A unique constraint covering the columns `[exam_id]` on the table `ExamRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ExamRoom_exam_id_key` ON `ExamRoom`(`exam_id`);
