-- Convert USD values to EUR (rate: 0.84 EUR per 1 USD)
-- This is a one-time migration to change the base currency from USD to EUR

-- Update records table
UPDATE "records" SET "value" = ROUND("value" * 0.84, 2);

-- Update regularPayments table
UPDATE "regularPayments" SET "amount" = ROUND("amount" * 0.84, 2);

-- Clear exchangeRates table (old USD->PLN rates are invalid for EUR->PLN)
TRUNCATE TABLE "exchangeRates";
