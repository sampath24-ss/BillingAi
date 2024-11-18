-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "Price" INTEGER NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);
