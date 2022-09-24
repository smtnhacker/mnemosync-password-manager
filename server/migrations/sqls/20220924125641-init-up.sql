/* Replace with your SQL commands */

-- Table: public.session

-- DROP TABLE IF EXISTS public.session;

CREATE TABLE IF NOT EXISTS public.session
(
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;

-- Index: IDX_session_expire

-- DROP INDEX IF EXISTS public."IDX_session_expire";

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
    ON public.session USING btree
    (expire ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.salts

-- DROP TABLE IF EXISTS public.salts;

CREATE TABLE IF NOT EXISTS public.salts
(
    salt_id uuid NOT NULL,
    salt character varying(60) COLLATE pg_catalog."default" NOT NULL,
    iv character varying(60) COLLATE pg_catalog."default",
    authtag character varying(60) COLLATE pg_catalog."default",
    CONSTRAINT salts_pkey PRIMARY KEY (salt_id),
    CONSTRAINT salts_salt_key UNIQUE (salt)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.salts
    OWNER to postgres;

-- Table: public.user_info

-- DROP TABLE IF EXISTS public.user_info;

CREATE TABLE IF NOT EXISTS public.user_info
(
    user_id uuid NOT NULL,
    email character varying(50) COLLATE pg_catalog."default",
    phone character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT user_info_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_info
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id uuid NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    passhash character varying(65) COLLATE pg_catalog."default" NOT NULL,
    salt_id uuid NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_salt_id_key UNIQUE (salt_id),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_salt_id_fkey FOREIGN KEY (salt_id)
        REFERENCES public.salts (salt_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.user_info (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

-- Table: public.entry_detail

-- DROP TABLE IF EXISTS public.entry_detail;

CREATE TABLE IF NOT EXISTS public.entry_detail
(
    entry_detail_id uuid NOT NULL,
    ease integer NOT NULL,
    "interval" integer NOT NULL,
    due date NOT NULL,
    CONSTRAINT entry_detail_pkey PRIMARY KEY (entry_detail_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.entry_detail
    OWNER to postgres;

-- Table: public.entries

-- DROP TABLE IF EXISTS public.entries;

CREATE TABLE IF NOT EXISTS public.entries
(
    entry_id uuid NOT NULL,
    user_id uuid NOT NULL,
    sitename character varying(50) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    passhash character varying(50) COLLATE pg_catalog."default" NOT NULL,
    salt_id uuid NOT NULL,
    entry_detail_id uuid,
    CONSTRAINT entries_pkey PRIMARY KEY (entry_id),
    CONSTRAINT entries_sitename_username_key UNIQUE (sitename, username),
    CONSTRAINT entries_entry_detail_id_fkey FOREIGN KEY (entry_detail_id)
        REFERENCES public.entry_detail (entry_detail_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT entries_salt_id_fkey FOREIGN KEY (salt_id)
        REFERENCES public.salts (salt_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT entries_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.entries
    OWNER to postgres;