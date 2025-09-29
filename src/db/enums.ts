import { pgEnum } from "drizzle-orm/pg-core";

export const entityStatus = pgEnum('entity_status',["active","inactive"])