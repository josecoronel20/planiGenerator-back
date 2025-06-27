-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "dominantFoot" TEXT NOT NULL,
    "transferStatus" TEXT NOT NULL,
    "mainPosition" TEXT NOT NULL,
    "secondaryPositions" TEXT[],
    "profileSummary" TEXT NOT NULL,
    "currentLevel" TEXT,
    "objective" TEXT NOT NULL,
    "image" TEXT,
    "videoUrl" TEXT,
    "scoutingStatus" TEXT,
    "clubsInterested" TEXT[],
    "clubsHistory" TEXT[],
    "statsId" INTEGER NOT NULL,
    "skillsId" INTEGER NOT NULL,
    "achievements" TEXT[],

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "season" TEXT NOT NULL,
    "matches" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "yellowCards" INTEGER NOT NULL,
    "redCards" INTEGER NOT NULL,
    "goalsReceived" INTEGER NOT NULL,
    "cleanSheets" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" SERIAL NOT NULL,
    "technique" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "vision" INTEGER NOT NULL,
    "finishing" INTEGER NOT NULL,
    "passing" INTEGER NOT NULL,
    "reflexes" INTEGER NOT NULL,
    "crossHandling" INTEGER NOT NULL,
    "oneOnOnes" INTEGER NOT NULL,
    "footWork" INTEGER NOT NULL,
    "leadership" INTEGER NOT NULL,
    "kickingPower" INTEGER NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_statsId_key" ON "Player"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_skillsId_key" ON "Player"("skillsId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_skillsId_fkey" FOREIGN KEY ("skillsId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
