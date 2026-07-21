-- Retain existing refresh-token rows as legacy sessions while making every
-- subsequently issued token attributable to a browser device.
ALTER TABLE "RefreshToken"
  ADD COLUMN "deviceId" TEXT NOT NULL DEFAULT 'legacy',
  ADD COLUMN "deviceName" TEXT,
  ADD COLUMN "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "RefreshToken_userId_deviceId_idx" ON "RefreshToken"("userId", "deviceId");
