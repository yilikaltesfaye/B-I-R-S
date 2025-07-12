-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AUTHORITY', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'FIXED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "region" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,
    "refreshTokenExp" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorityOffice" (
    "id" SERIAL NOT NULL,
    "officeName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentOfficeId" INTEGER,

    CONSTRAINT "AuthorityOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorityStaff" (
    "userId" TEXT NOT NULL,
    "authorityOfficeId" INTEGER NOT NULL,
    "position" TEXT NOT NULL DEFAULT 'Staff',

    CONSTRAINT "AuthorityStaff_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "location" geography(Point,4326) NOT NULL,
    "address" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT[],
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "reporterConfirm" BOOLEAN NOT NULL DEFAULT false,
    "communityConfirm" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "userId" TEXT,
    "authorityOfficeId" INTEGER,
    "categoryId" INTEGER,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorityOfficeToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AuthorityOfficeToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorityOffice_phone_key" ON "AuthorityOffice"("phone");

-- CreateIndex
CREATE INDEX "_AuthorityOfficeToCategory_B_index" ON "_AuthorityOfficeToCategory"("B");

-- AddForeignKey
ALTER TABLE "AuthorityOffice" ADD CONSTRAINT "AuthorityOffice_parentOfficeId_fkey" FOREIGN KEY ("parentOfficeId") REFERENCES "AuthorityOffice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorityStaff" ADD CONSTRAINT "AuthorityStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorityStaff" ADD CONSTRAINT "AuthorityStaff_authorityOfficeId_fkey" FOREIGN KEY ("authorityOfficeId") REFERENCES "AuthorityOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorityOfficeId_fkey" FOREIGN KEY ("authorityOfficeId") REFERENCES "AuthorityOffice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorityOfficeToCategory" ADD CONSTRAINT "_AuthorityOfficeToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "AuthorityOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorityOfficeToCategory" ADD CONSTRAINT "_AuthorityOfficeToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
