/*
  Warnings:

  - The values [PROFESSOR,MASTER_ASSISTANT,DOCTORAL,STUDENT_DEROGATORY] on the enum `Teacher_title` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `teacher` MODIFY `title` ENUM('PROFESSEUR', 'PROFESSEUR_TRONC_COMMUN', 'MAITRE_ASSISTANT', 'MAITRE_DES_CONFERENCES', 'ASSISTANT', 'CONTRACTUEL') NOT NULL;
