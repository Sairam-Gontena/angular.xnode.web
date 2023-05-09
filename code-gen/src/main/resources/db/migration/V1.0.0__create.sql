create table tach_clients(
	client_id int GENERATED ALWAYS AS IDENTITY,
	client_name varchar(255),
	address text,
	created_on timestamp,
	last_updated timestamp
);

create table tach_client_billing(
	billing_id int GENERATED ALWAYS AS IDENTITY,
	client_id Integer,
	application_id Integer,
	application_bill decimal(20),
	month_of_billing character varying(255),
	last_updated timestamp
);
create table tach_users(
	user_id int GENERATED ALWAYS AS IDENTITY,
	user_name varchar(255),
	email_id varchar(255),
	first_name varchar(255),
	last_name varchar(255),
	client_id integer,
	created_on timestamp,
	last_updated timestamp
);

create table tach_applications(
	application_id int GENERATED ALWAYS AS IDENTITY,
	client_id int,
	application_name varchar(255),
	application_desc varchar(255),
	application_type varchar(255),
	application_status varchar(255),
	cloud_vendor varchar(255),
	application_category varchar(255),
	application_tech_stack varchar(255),
	application_schema_type varchar(255),
	application_version integer,
	application_time_spent integer,
	created_on timestamp,
	created_by varchar(255),
	last_updated timestamp,
	last_deployed timestamp,
	 PRIMARY KEY(application_id)
);

create table tach_application_schema(
	schema_id int GENERATED ALWAYS AS IDENTITY,
	application_id Integer,
	table_name varchar(255),
	table_description varchar(255),
	menu_title varchar(255),
	column_info jsonb,
	created_on timestamp,
	created_by varchar(255),
	 PRIMARY KEY(schema_id),
	CONSTRAINT fk_application
      FOREIGN KEY(application_id)
	  REFERENCES tach_applications(application_id)
);

create table tach_application_scan(
	scan_id int GENERATED ALWAYS AS IDENTITY,
	application_id Integer,
	application_version integer,
	scan_run_date timestamp,
	scan_link	varchar(255),
	last_updated timestamp
);

insert into tach_applications (client_id,application_name,application_desc,application_type, application_status, application_tech_stack,application_schema_type,cloud_vendor,application_category,
application_version,application_time_spent,created_on, created_by,last_updated,last_deployed)
values(1,'Test Web App', 'Test Web App', 'web', 'DEPLOYED', 'java+angular','FROM_FILE','aws','reconciliation', 1, 10, now(), 'System',now(),now());