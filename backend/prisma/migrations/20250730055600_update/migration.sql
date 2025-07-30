-- AlterTable
ALTER TABLE "AuthorityOffice" ALTER COLUMN "iconUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "IconUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
