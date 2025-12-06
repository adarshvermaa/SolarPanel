CREATE TABLE "calculator_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_name" text NOT NULL,
	"avg_sunlight_hours" numeric(4, 2) NOT NULL,
	"cost_per_kw" numeric(10, 2) NOT NULL,
	"electricity_rate" numeric(6, 2) NOT NULL,
	"efficiency_panel" numeric(5, 2) DEFAULT '0.18' NOT NULL,
	"co2_savings_per_unit" numeric(6, 3) DEFAULT '0.71' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "calculator_config_state_name_unique" UNIQUE("state_name")
);
