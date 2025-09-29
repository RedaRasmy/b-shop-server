ALTER TABLE "categories" drop COLUMN "isActive";
alter table "categories" add column "status" "entity_status" not null;