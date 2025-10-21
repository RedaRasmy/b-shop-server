ALTER TABLE "order_items" ALTER COLUMN "price_at_purchase" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);