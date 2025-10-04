ALTER TABLE "product_images" ADD COLUMN "is_primary" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" DROP COLUMN "position";