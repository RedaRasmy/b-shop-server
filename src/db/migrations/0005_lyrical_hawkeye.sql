ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "slug" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");