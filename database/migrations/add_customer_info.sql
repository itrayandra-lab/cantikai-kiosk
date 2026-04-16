-- Add customer name and WhatsApp to analyses table
-- This allows tracking who the analysis belongs to for WhatsApp sharing

ALTER TABLE `analyses` 
ADD COLUMN `customer_name` VARCHAR(255) NULL AFTER `client_session_id`,
ADD COLUMN `customer_whatsapp` VARCHAR(50) NULL AFTER `customer_name`;

-- Add index for faster lookups
CREATE INDEX `idx_analyses_customer_whatsapp` ON `analyses` (`customer_whatsapp`);
