/*
  Warnings:

  - You are about to drop the column `datadenascimento` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `endereço` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `datanascimento` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "datadenascimento",
DROP COLUMN "endereço",
ADD COLUMN     "datanascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL;
