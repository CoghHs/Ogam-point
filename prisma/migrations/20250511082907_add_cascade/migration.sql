-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PointHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" DATETIME,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PointHistory_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PointHistory" ("amount", "createdAt", "expiredAt", "id", "isExpired", "memberId") SELECT "amount", "createdAt", "expiredAt", "id", "isExpired", "memberId" FROM "PointHistory";
DROP TABLE "PointHistory";
ALTER TABLE "new_PointHistory" RENAME TO "PointHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
