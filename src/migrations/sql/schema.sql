--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg110+2)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg110+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: audit_logs_action_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.audit_logs_action_enum AS ENUM (
    'create',
    'update',
    'delete',
    'verify',
    'publish',
    'moderate'
);


ALTER TYPE public.audit_logs_action_enum OWNER TO admin;

--
-- Name: audit_logs_entity_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.audit_logs_entity_enum AS ENUM (
    'link',
    'deal',
    'resource',
    'listing',
    'user',
    'settings',
    'comment'
);


ALTER TYPE public.audit_logs_entity_enum OWNER TO admin;

--
-- Name: deals_dealtype_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.deals_dealtype_enum AS ENUM (
    'percentage',
    'fixed',
    'free',
    'subscription'
);


ALTER TYPE public.deals_dealtype_enum OWNER TO admin;

--
-- Name: deals_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.deals_status_enum AS ENUM (
    'draft',
    'scheduled',
    'published',
    'expired',
    'archived'
);


ALTER TYPE public.deals_status_enum OWNER TO admin;

--
-- Name: links_branches_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.links_branches_enum AS ENUM (
    'Army',
    'Navy',
    'Air Force',
    'Marines',
    'Space Force',
    'Coast Guard',
    'DoD-wide'
);


ALTER TYPE public.links_branches_enum OWNER TO admin;

--
-- Name: links_category_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.links_category_enum AS ENUM (
    'Pay & Benefits',
    'Medical/TRICARE',
    'Education & Training',
    'Housing/PCS',
    'Travel/Finance',
    'Personnel/Records',
    'Legal',
    'Family Support',
    'Transition/Retirement',
    'VA'
);


ALTER TYPE public.links_category_enum OWNER TO admin;

--
-- Name: links_images_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.links_images_status_enum AS ENUM (
    'processing',
    'ready',
    'failed',
    'queued'
);


ALTER TYPE public.links_images_status_enum OWNER TO admin;

--
-- Name: links_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.links_status_enum AS ENUM (
    'published',
    'draft',
    'archived'
);


ALTER TYPE public.links_status_enum OWNER TO admin;

--
-- Name: links_verifiedby_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.links_verifiedby_enum AS ENUM (
    'system',
    'admin'
);


ALTER TYPE public.links_verifiedby_enum OWNER TO admin;

--
-- Name: listings_dealtype_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.listings_dealtype_enum AS ENUM (
    'sale',
    'rent',
    'both'
);


ALTER TYPE public.listings_dealtype_enum OWNER TO admin;

--
-- Name: listings_package_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.listings_package_enum AS ENUM (
    'basic',
    'premium'
);


ALTER TYPE public.listings_package_enum OWNER TO admin;

--
-- Name: listings_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.listings_status_enum AS ENUM (
    'draft',
    'pending',
    'active',
    'rejected',
    'inactive',
    'expired'
);


ALTER TYPE public.listings_status_enum OWNER TO admin;

--
-- Name: resources_format_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.resources_format_enum AS ENUM (
    'guide',
    'checklist',
    'tool',
    'pdf'
);


ALTER TYPE public.resources_format_enum OWNER TO admin;

--
-- Name: token_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.token_type_enum AS ENUM (
    'reset password',
    'refresh token'
);


ALTER TYPE public.token_type_enum OWNER TO admin;

--
-- Name: tokens_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.tokens_type_enum AS ENUM (
    'reset password',
    'confirm email',
    'refresh token'
);


ALTER TYPE public.tokens_type_enum OWNER TO admin;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.user_role_enum AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.user_role_enum OWNER TO admin;

--
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.user_status_enum AS ENUM (
    'active',
    'suspended'
);


ALTER TYPE public.user_status_enum OWNER TO admin;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_role_enum AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.users_role_enum OWNER TO admin;

--
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_status_enum AS ENUM (
    'active',
    'suspended'
);


ALTER TYPE public.users_status_enum OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    action public.audit_logs_action_enum NOT NULL,
    entity public.audit_logs_entity_enum NOT NULL,
    description text NOT NULL,
    ip inet NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "entityId" integer
);


ALTER TABLE public.audit_logs OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: deal_related; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.deal_related (
    id integer NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "sourceId" integer,
    "targetId" integer
);


ALTER TABLE public.deal_related OWNER TO admin;

--
-- Name: deal_related_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.deal_related_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deal_related_id_seq OWNER TO admin;

--
-- Name: deal_related_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.deal_related_id_seq OWNED BY public.deal_related.id;


--
-- Name: deal_sections; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.deal_sections (
    id integer NOT NULL,
    "position" integer NOT NULL,
    title text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    "bodyMd" text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "dealId" integer
);


ALTER TABLE public.deal_sections OWNER TO admin;

--
-- Name: deal_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.deal_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deal_sections_id_seq OWNER TO admin;

--
-- Name: deal_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.deal_sections_id_seq OWNED BY public.deal_sections.id;


--
-- Name: deal_tags; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.deal_tags (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.deal_tags OWNER TO admin;

--
-- Name: deal_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.deal_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deal_tags_id_seq OWNER TO admin;

--
-- Name: deal_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.deal_tags_id_seq OWNED BY public.deal_tags.id;


--
-- Name: deal_tags_join; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.deal_tags_join (
    "dealsId" integer NOT NULL,
    "dealTagsId" integer NOT NULL
);


ALTER TABLE public.deal_tags_join OWNER TO admin;

--
-- Name: deals; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.deals (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    teaser text,
    "heroImageUrl" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "primaryCategory" text,
    categories text[] DEFAULT '{}'::text[] NOT NULL,
    "offerEnabled" boolean DEFAULT true NOT NULL,
    "dealType" public.deals_dealtype_enum,
    "originalPrice" numeric(12,2),
    "yourPrice" numeric(12,2),
    "promoCode" text,
    "whereToEnterCode" text,
    "ongoingOffer" boolean DEFAULT false NOT NULL,
    "validFrom" date,
    "validUntil" date,
    "providerDisplayName" text,
    "seoMetaTitle" text,
    "seoMetaDescription" text,
    "ogImageMode" text,
    "ogImageUrl" text,
    "canonicalUrl" text,
    "allowIndexing" boolean DEFAULT true NOT NULL,
    status public.deals_status_enum DEFAULT 'draft'::public.deals_status_enum NOT NULL,
    "publishAt" timestamp with time zone,
    "expireAt" timestamp with time zone,
    "lastPublishedAt" timestamp with time zone,
    "commentsEnabled" boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.deals OWNER TO admin;

--
-- Name: deals_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.deals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deals_id_seq OWNER TO admin;

--
-- Name: deals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.deals_id_seq OWNED BY public.deals.id;


--
-- Name: link_tags; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.link_tags (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.link_tags OWNER TO admin;

--
-- Name: link_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.link_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.link_tags_id_seq OWNER TO admin;

--
-- Name: link_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.link_tags_id_seq OWNED BY public.link_tags.id;


--
-- Name: link_tags_join; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.link_tags_join (
    "linksId" integer NOT NULL,
    "linkTagsId" integer NOT NULL
);


ALTER TABLE public.link_tags_join OWNER TO admin;

--
-- Name: links; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.links (
    id integer NOT NULL,
    description text,
    url text NOT NULL,
    status public.links_status_enum DEFAULT 'published'::public.links_status_enum NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    "verifiedAt" timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category public.links_category_enum NOT NULL,
    branches public.links_branches_enum[] NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    "verifiedBy" public.links_verifiedby_enum,
    image_id integer
);


ALTER TABLE public.links OWNER TO admin;

--
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.links_id_seq OWNER TO admin;

--
-- Name: links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.links_id_seq OWNED BY public.links.id;


--
-- Name: links_images; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.links_images (
    id integer NOT NULL,
    url text NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    original_key text,
    processed_key text,
    status public.links_images_status_enum DEFAULT 'queued'::public.links_images_status_enum NOT NULL
);


ALTER TABLE public.links_images OWNER TO admin;

--
-- Name: links_images_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.links_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.links_images_id_seq OWNER TO admin;

--
-- Name: links_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.links_images_id_seq OWNED BY public.links_images.id;


--
-- Name: listing_amenities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.listing_amenities (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    "group" text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.listing_amenities OWNER TO admin;

--
-- Name: listing_amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.listing_amenities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listing_amenities_id_seq OWNER TO admin;

--
-- Name: listing_amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.listing_amenities_id_seq OWNED BY public.listing_amenities.id;


--
-- Name: listing_amenities_join; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.listing_amenities_join (
    "listingsId" integer NOT NULL,
    "listingAmenitiesId" integer NOT NULL
);


ALTER TABLE public.listing_amenities_join OWNER TO admin;

--
-- Name: listing_photos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.listing_photos (
    id integer NOT NULL,
    "position" integer NOT NULL,
    original_url text NOT NULL,
    thumb_url text,
    card_url text,
    hero_url text,
    caption text,
    is_cover boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "listingId" integer
);


ALTER TABLE public.listing_photos OWNER TO admin;

--
-- Name: listing_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.listing_photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listing_photos_id_seq OWNER TO admin;

--
-- Name: listing_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.listing_photos_id_seq OWNED BY public.listing_photos.id;


--
-- Name: listings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    "dealType" public.listings_dealtype_enum DEFAULT 'sale'::public.listings_dealtype_enum NOT NULL,
    package public.listings_package_enum DEFAULT 'basic'::public.listings_package_enum NOT NULL,
    "salePrice" integer,
    "rentMonthly" integer,
    bedrooms integer NOT NULL,
    "bathroomsFull" numeric(4,1) DEFAULT '1'::numeric NOT NULL,
    "bathroomsHalf" numeric(4,1) DEFAULT '0'::numeric NOT NULL,
    "interiorSqft" integer NOT NULL,
    "yearBuilt" integer,
    stories integer,
    "hoaPresent" boolean DEFAULT false NOT NULL,
    "hoaDues" integer,
    "hoaPeriod" text,
    street text NOT NULL,
    "hideStreet" boolean DEFAULT false NOT NULL,
    unit text,
    city text NOT NULL,
    state text NOT NULL,
    zip text NOT NULL,
    location public.geography(Point,4326),
    description text NOT NULL,
    status public.listings_status_enum DEFAULT 'draft'::public.listings_status_enum NOT NULL,
    "publishedAt" timestamp with time zone,
    "expiresAt" timestamp with time zone,
    badges text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "ownerId" integer,
    "nearestBaseId" integer
);


ALTER TABLE public.listings OWNER TO admin;

--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO admin;

--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: military_bases; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.military_bases (
    id integer NOT NULL,
    name text NOT NULL,
    state text NOT NULL,
    city text NOT NULL,
    location public.geography(Point,4326) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.military_bases OWNER TO admin;

--
-- Name: military_bases_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.military_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.military_bases_id_seq OWNER TO admin;

--
-- Name: military_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.military_bases_id_seq OWNED BY public.military_bases.id;


--
-- Name: resource_sections; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_sections (
    id integer NOT NULL,
    "position" integer NOT NULL,
    title text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    "bodyMd" text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "resourceId" integer
);


ALTER TABLE public.resource_sections OWNER TO admin;

--
-- Name: resource_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resource_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_sections_id_seq OWNER TO admin;

--
-- Name: resource_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resource_sections_id_seq OWNED BY public.resource_sections.id;


--
-- Name: resource_tags; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_tags (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.resource_tags OWNER TO admin;

--
-- Name: resource_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resource_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_tags_id_seq OWNER TO admin;

--
-- Name: resource_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resource_tags_id_seq OWNED BY public.resource_tags.id;


--
-- Name: resource_tags_join; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_tags_join (
    "resourcesId" integer NOT NULL,
    "resourceTagsId" integer NOT NULL
);


ALTER TABLE public.resource_tags_join OWNER TO admin;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    subtitle text,
    "imageUrl" text,
    format public.resources_format_enum NOT NULL,
    categories text[] DEFAULT '{}'::text[] NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "featuredDealId" uuid,
    "publishedAt" timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.resources OWNER TO admin;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO admin;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tokens (
    id integer NOT NULL,
    "tokenOrCode" character varying NOT NULL,
    expires_in timestamp with time zone NOT NULL,
    type public.tokens_type_enum NOT NULL,
    user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tokens OWNER TO admin;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_id_seq OWNER TO admin;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: user_favorite_deals; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_favorite_deals (
    id integer NOT NULL,
    "userId" integer,
    "dealId" integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_favorite_deals OWNER TO admin;

--
-- Name: user_favorite_deals_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_favorite_deals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorite_deals_id_seq OWNER TO admin;

--
-- Name: user_favorite_deals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_favorite_deals_id_seq OWNED BY public.user_favorite_deals.id;


--
-- Name: user_favorite_links; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_favorite_links (
    id integer NOT NULL,
    "userId" integer,
    "linkId" integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_favorite_links OWNER TO admin;

--
-- Name: user_favorite_links_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_favorite_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorite_links_id_seq OWNER TO admin;

--
-- Name: user_favorite_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_favorite_links_id_seq OWNED BY public.user_favorite_links.id;


--
-- Name: user_favorite_listings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_favorite_listings (
    id integer NOT NULL,
    "userId" integer,
    "listingId" integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_favorite_listings OWNER TO admin;

--
-- Name: user_favorite_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_favorite_listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorite_listings_id_seq OWNER TO admin;

--
-- Name: user_favorite_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_favorite_listings_id_seq OWNED BY public.user_favorite_listings.id;


--
-- Name: user_favorite_resources; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_favorite_resources (
    id integer NOT NULL,
    "userId" integer,
    "resourceId" integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_favorite_resources OWNER TO admin;

--
-- Name: user_favorite_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_favorite_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorite_resources_id_seq OWNER TO admin;

--
-- Name: user_favorite_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_favorite_resources_id_seq OWNED BY public.user_favorite_resources.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    username character varying(255) NOT NULL,
    avatar character varying(255),
    professional_title character varying(255),
    company character varying(255),
    private_email character varying(255) NOT NULL,
    public_email character varying(255),
    phone character varying(20),
    password character varying(255),
    footer_disclaimer boolean DEFAULT true NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    last_login_ip inet,
    last_activity timestamp with time zone DEFAULT '2025-11-06 20:00:38.179399+00'::timestamp with time zone NOT NULL,
    status public.users_status_enum DEFAULT 'active'::public.users_status_enum NOT NULL,
    free_listing_credit integer DEFAULT 1 NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    ban_expiration_date timestamp with time zone,
    ban_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: deal_related id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_related ALTER COLUMN id SET DEFAULT nextval('public.deal_related_id_seq'::regclass);


--
-- Name: deal_sections id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_sections ALTER COLUMN id SET DEFAULT nextval('public.deal_sections_id_seq'::regclass);


--
-- Name: deal_tags id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_tags ALTER COLUMN id SET DEFAULT nextval('public.deal_tags_id_seq'::regclass);


--
-- Name: deals id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deals ALTER COLUMN id SET DEFAULT nextval('public.deals_id_seq'::regclass);


--
-- Name: link_tags id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.link_tags ALTER COLUMN id SET DEFAULT nextval('public.link_tags_id_seq'::regclass);


--
-- Name: links id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links ALTER COLUMN id SET DEFAULT nextval('public.links_id_seq'::regclass);


--
-- Name: links_images id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links_images ALTER COLUMN id SET DEFAULT nextval('public.links_images_id_seq'::regclass);


--
-- Name: listing_amenities id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_amenities ALTER COLUMN id SET DEFAULT nextval('public.listing_amenities_id_seq'::regclass);


--
-- Name: listing_photos id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_photos ALTER COLUMN id SET DEFAULT nextval('public.listing_photos_id_seq'::regclass);


--
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: military_bases id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.military_bases ALTER COLUMN id SET DEFAULT nextval('public.military_bases_id_seq'::regclass);


--
-- Name: resource_sections id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_sections ALTER COLUMN id SET DEFAULT nextval('public.resource_sections_id_seq'::regclass);


--
-- Name: resource_tags id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_tags ALTER COLUMN id SET DEFAULT nextval('public.resource_tags_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: user_favorite_deals id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_deals ALTER COLUMN id SET DEFAULT nextval('public.user_favorite_deals_id_seq'::regclass);


--
-- Name: user_favorite_links id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_links ALTER COLUMN id SET DEFAULT nextval('public.user_favorite_links_id_seq'::regclass);


--
-- Name: user_favorite_listings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_listings ALTER COLUMN id SET DEFAULT nextval('public.user_favorite_listings_id_seq'::regclass);


--
-- Name: user_favorite_resources id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_resources ALTER COLUMN id SET DEFAULT nextval('public.user_favorite_resources_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: deal_related PK_19c7c5f7939ecd13208fe882aa2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_related
    ADD CONSTRAINT "PK_19c7c5f7939ecd13208fe882aa2" PRIMARY KEY (id);


--
-- Name: deal_sections PK_19f0aa364ebbfea44d9e85a6faa; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_sections
    ADD CONSTRAINT "PK_19f0aa364ebbfea44d9e85a6faa" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: user_favorite_links PK_2d07a2705afa66fe6001a43f0bf; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_links
    ADD CONSTRAINT "PK_2d07a2705afa66fe6001a43f0bf" PRIMARY KEY (id);


--
-- Name: tokens PK_3001e89ada36263dabf1fb6210a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY (id);


--
-- Name: listing_amenities PK_3160b87daaa89cca337bcfd2e3d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_amenities
    ADD CONSTRAINT "PK_3160b87daaa89cca337bcfd2e3d" PRIMARY KEY (id);


--
-- Name: user_favorite_resources PK_3bd95adfc4a9abbdc2e9d207701; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_resources
    ADD CONSTRAINT "PK_3bd95adfc4a9abbdc2e9d207701" PRIMARY KEY (id);


--
-- Name: links_images PK_4170f204c25db8dd59c6f509271; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links_images
    ADD CONSTRAINT "PK_4170f204c25db8dd59c6f509271" PRIMARY KEY (id);


--
-- Name: listings PK_520ecac6c99ec90bcf5a603cdcb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY (id);


--
-- Name: resources PK_632484ab9dff41bba94f9b7c85e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY (id);


--
-- Name: military_bases PK_6638227deed9abe715f9344922e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.military_bases
    ADD CONSTRAINT "PK_6638227deed9abe715f9344922e" PRIMARY KEY (id);


--
-- Name: listing_photos PK_73c5fd7f964a698b78f0920917c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_photos
    ADD CONSTRAINT "PK_73c5fd7f964a698b78f0920917c" PRIMARY KEY (id);


--
-- Name: resource_tags_join PK_8c1c3318e588ea0b5782dbb6808; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_tags_join
    ADD CONSTRAINT "PK_8c1c3318e588ea0b5782dbb6808" PRIMARY KEY ("resourcesId", "resourceTagsId");


--
-- Name: deals PK_8c66f03b250f613ff8615940b4b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: link_tags PK_aaf1cfe913fc81bc4fc3427d106; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.link_tags
    ADD CONSTRAINT "PK_aaf1cfe913fc81bc4fc3427d106" PRIMARY KEY (id);


--
-- Name: user_favorite_listings PK_ad2752fd0405a158b7d9461fb3e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_listings
    ADD CONSTRAINT "PK_ad2752fd0405a158b7d9461fb3e" PRIMARY KEY (id);


--
-- Name: deal_tags PK_ae8c5bfd3e111f8675ad64bd1f3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_tags
    ADD CONSTRAINT "PK_ae8c5bfd3e111f8675ad64bd1f3" PRIMARY KEY (id);


--
-- Name: links PK_ecf17f4a741d3c5ba0b4c5ab4b6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY (id);


--
-- Name: user_favorite_deals PK_eea8b5b4b6fa69c97163404449e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_deals
    ADD CONSTRAINT "PK_eea8b5b4b6fa69c97163404449e" PRIMARY KEY (id);


--
-- Name: deal_tags_join PK_efed88ce110f9711363b2f6656a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_tags_join
    ADD CONSTRAINT "PK_efed88ce110f9711363b2f6656a" PRIMARY KEY ("dealsId", "dealTagsId");


--
-- Name: resource_tags PK_f074d6112c7b5755be1d827c88b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_tags
    ADD CONSTRAINT "PK_f074d6112c7b5755be1d827c88b" PRIMARY KEY (id);


--
-- Name: link_tags_join PK_f65eed0829bd1d78fae237d65a8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.link_tags_join
    ADD CONSTRAINT "PK_f65eed0829bd1d78fae237d65a8" PRIMARY KEY ("linksId", "linkTagsId");


--
-- Name: listing_amenities_join PK_fbe2563ef600e201db6af3e6175; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_amenities_join
    ADD CONSTRAINT "PK_fbe2563ef600e201db6af3e6175" PRIMARY KEY ("listingsId", "listingAmenitiesId");


--
-- Name: resource_sections PK_ff668ac48f7d4e20d1a0b49e906; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_sections
    ADD CONSTRAINT "PK_ff668ac48f7d4e20d1a0b49e906" PRIMARY KEY (id);


--
-- Name: deal_tags UQ_1017bfa800bbeab595b78ba2b6b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_tags
    ADD CONSTRAINT "UQ_1017bfa800bbeab595b78ba2b6b" UNIQUE (name);


--
-- Name: listing_amenities UQ_1df1abb83cd78d937b03bd6fdbf; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_amenities
    ADD CONSTRAINT "UQ_1df1abb83cd78d937b03bd6fdbf" UNIQUE (name);


--
-- Name: user_favorite_deals UQ_20ba71f0ca8042ce270eaee26a0; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_deals
    ADD CONSTRAINT "UQ_20ba71f0ca8042ce270eaee26a0" UNIQUE ("userId", "dealId");


--
-- Name: listings UQ_23a9f6b054ab6ba43132dfec40c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT "UQ_23a9f6b054ab6ba43132dfec40c" UNIQUE (slug);


--
-- Name: user_favorite_listings UQ_285f9de729a4eb96b33b142f74c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_listings
    ADD CONSTRAINT "UQ_285f9de729a4eb96b33b142f74c" UNIQUE ("userId", "listingId");


--
-- Name: resource_tags UQ_4e13de88d50e6e03085c8254ddb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_tags
    ADD CONSTRAINT "UQ_4e13de88d50e6e03085c8254ddb" UNIQUE (name);


--
-- Name: link_tags UQ_4e78219466e135ddbb118721334; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.link_tags
    ADD CONSTRAINT "UQ_4e78219466e135ddbb118721334" UNIQUE (name);


--
-- Name: links UQ_54ebf5dec4e16cbf8f22d44caec; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT "UQ_54ebf5dec4e16cbf8f22d44caec" UNIQUE (slug);


--
-- Name: users UQ_59f8f37e3194a6218bfacc13926; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_59f8f37e3194a6218bfacc13926" UNIQUE (private_email);


--
-- Name: users UQ_90f1d2a2e169559bdbfebbb57e3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_90f1d2a2e169559bdbfebbb57e3" UNIQUE (public_email);


--
-- Name: resources UQ_9bc050eb2c77e448471cafbc6f3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT "UQ_9bc050eb2c77e448471cafbc6f3" UNIQUE (slug);


--
-- Name: deals UQ_9e276c0b4c6e95c04ad1a181359; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT "UQ_9e276c0b4c6e95c04ad1a181359" UNIQUE (slug);


--
-- Name: users UQ_a000cca60bcf04454e727699490; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE (phone);


--
-- Name: user_favorite_resources UQ_be84d01b54c735e0a78a2dde2be; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_resources
    ADD CONSTRAINT "UQ_be84d01b54c735e0a78a2dde2be" UNIQUE ("userId", "resourceId");


--
-- Name: user_favorite_links UQ_dc056aeb0e2b522d47fe08c4b6b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_links
    ADD CONSTRAINT "UQ_dc056aeb0e2b522d47fe08c4b6b" UNIQUE ("userId", "linkId");


--
-- Name: military_bases UQ_e1aef2411521dd7a2909f617921; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.military_bases
    ADD CONSTRAINT "UQ_e1aef2411521dd7a2909f617921" UNIQUE (name, state);


--
-- Name: links UQ_fa0eaa0936fdbf7112185cd593d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT "UQ_fa0eaa0936fdbf7112185cd593d" UNIQUE (image_id);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: tokens UQ_tokens_token_user; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "UQ_tokens_token_user" UNIQUE ("tokenOrCode", user_id);


--
-- Name: IDX_071b31d8eb8d926ef4ebcfdcc8; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_071b31d8eb8d926ef4ebcfdcc8" ON public.listings USING btree ("dealType");


--
-- Name: IDX_085bc90a6a48842f8266fcbc63; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_085bc90a6a48842f8266fcbc63" ON public.listings USING gist (location);


--
-- Name: IDX_0a65b771bc8228047f2f78a091; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_0a65b771bc8228047f2f78a091" ON public.listings USING btree (status);


--
-- Name: IDX_1017bfa800bbeab595b78ba2b6; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_1017bfa800bbeab595b78ba2b6" ON public.deal_tags USING btree (name);


--
-- Name: IDX_193b7d60dfbac6e47e37ccc380; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_193b7d60dfbac6e47e37ccc380" ON public.deals USING btree (title);


--
-- Name: IDX_1d585568ef662947d9260319e9; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_1d585568ef662947d9260319e9" ON public.listings USING btree (zip);


--
-- Name: IDX_1df1abb83cd78d937b03bd6fdb; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_1df1abb83cd78d937b03bd6fdb" ON public.listing_amenities USING btree (name);


--
-- Name: IDX_219407864f931839d520bfc593; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_219407864f931839d520bfc593" ON public.listings USING btree ("bathroomsFull");


--
-- Name: IDX_271d62735826132d918206a205; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "IDX_271d62735826132d918206a205" ON public.listing_photos USING btree ("listingId", "position");


--
-- Name: IDX_2cd10fda8276bb995288acfbfb; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_2cd10fda8276bb995288acfbfb" ON public.audit_logs USING btree (created_at);


--
-- Name: IDX_38bb756ebac34103669173682d; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_38bb756ebac34103669173682d" ON public.link_tags_join USING btree ("linkTagsId");


--
-- Name: IDX_4312a29eeca543265958db4424; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_4312a29eeca543265958db4424" ON public.listings USING btree (state);


--
-- Name: IDX_445557993007fefee3aa9f1117; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_445557993007fefee3aa9f1117" ON public.audit_logs USING btree (entity);


--
-- Name: IDX_494ab9579d9a7769547de2bf2c; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_494ab9579d9a7769547de2bf2c" ON public.link_tags USING btree (created_at);


--
-- Name: IDX_4b4d374730ee277ad2c42b60b4; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "IDX_4b4d374730ee277ad2c42b60b4" ON public.deal_related USING btree ("sourceId", "position");


--
-- Name: IDX_4cccfe7631b60e5c268a2e43c8; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_4cccfe7631b60e5c268a2e43c8" ON public.listings USING btree (title);


--
-- Name: IDX_4dbeb6d2036e3f987f1406be57; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_4dbeb6d2036e3f987f1406be57" ON public.links USING btree (category);


--
-- Name: IDX_4e13de88d50e6e03085c8254dd; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_4e13de88d50e6e03085c8254dd" ON public.resource_tags USING btree (name);


--
-- Name: IDX_54ebf5dec4e16cbf8f22d44cae; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_54ebf5dec4e16cbf8f22d44cae" ON public.links USING btree (slug);


--
-- Name: IDX_55d12c6970fdc3238032eca4b8; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_55d12c6970fdc3238032eca4b8" ON public.listings USING btree (created_at);


--
-- Name: IDX_575a723e1eb2d7e15d535dc541; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_575a723e1eb2d7e15d535dc541" ON public.deal_related USING btree (created_at);


--
-- Name: IDX_5fa57b389692aed99fee1a528d; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_5fa57b389692aed99fee1a528d" ON public.military_bases USING btree (name);


--
-- Name: IDX_5fd9c4f7e58d0ff1df335ad5a3; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_5fd9c4f7e58d0ff1df335ad5a3" ON public.links USING btree (title);


--
-- Name: IDX_6686ba72a1ab19046f649c9823; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_6686ba72a1ab19046f649c9823" ON public.military_bases USING btree (state);


--
-- Name: IDX_792aeae5cf71f96841009b795a; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_792aeae5cf71f96841009b795a" ON public.resource_tags_join USING btree ("resourceTagsId");


--
-- Name: IDX_7e19541dee9242e4203337f5cb; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_7e19541dee9242e4203337f5cb" ON public.listings USING btree (bedrooms);


--
-- Name: IDX_8338f3a97ce25864952043eb9f; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_8338f3a97ce25864952043eb9f" ON public.listings USING btree ("yearBuilt");


--
-- Name: IDX_8b630da2e6546b091484b101ef; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_8b630da2e6546b091484b101ef" ON public.listings USING btree (city);


--
-- Name: IDX_8c3786f7573a39793c1093fadf; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_8c3786f7573a39793c1093fadf" ON public.listings USING btree ("salePrice");


--
-- Name: IDX_8dc337d23799a3d29b0688cf9a; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_8dc337d23799a3d29b0688cf9a" ON public.listing_amenities_join USING btree ("listingAmenitiesId");


--
-- Name: IDX_93d2e367d9d500ea97c5e85b5c; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_93d2e367d9d500ea97c5e85b5c" ON public.deal_tags_join USING btree ("dealsId");


--
-- Name: IDX_940ced63d8aeddd3668fc39d87; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_940ced63d8aeddd3668fc39d87" ON public.deals USING btree (created_at);


--
-- Name: IDX_9cf616fcbcfff0698ee6168f23; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_9cf616fcbcfff0698ee6168f23" ON public.listings USING btree ("interiorSqft");


--
-- Name: IDX_9e276c0b4c6e95c04ad1a18135; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_9e276c0b4c6e95c04ad1a18135" ON public.deals USING btree (slug);


--
-- Name: IDX_a08491d5260fb79ea40d06ff98; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_a08491d5260fb79ea40d06ff98" ON public.deals USING btree ("primaryCategory");


--
-- Name: IDX_a8ae353cc0b5d212659e47bf66; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_a8ae353cc0b5d212659e47bf66" ON public.military_bases USING btree (city);


--
-- Name: IDX_ac3d5abb27ef245a12c291f632; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_ac3d5abb27ef245a12c291f632" ON public.listing_amenities_join USING btree ("listingsId");


--
-- Name: IDX_ae6a06193e97debdda615a59aa; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_ae6a06193e97debdda615a59aa" ON public.resource_sections USING btree (created_at);


--
-- Name: IDX_bb3059bfaa6904b413ca41c818; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_bb3059bfaa6904b413ca41c818" ON public.resources USING btree (created_at);


--
-- Name: IDX_bd106add0fdac9dd2551db0a33; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_bd106add0fdac9dd2551db0a33" ON public.deals USING btree (status);


--
-- Name: IDX_bdd8b41463d81f1a99248acf66; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_bdd8b41463d81f1a99248acf66" ON public.deal_tags_join USING btree ("dealTagsId");


--
-- Name: IDX_c0e331c0846f9bc0ef42697e9e; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_c0e331c0846f9bc0ef42697e9e" ON public.resources USING btree (title);


--
-- Name: IDX_c44a81cb65a33ffdc0385eb66b; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_c44a81cb65a33ffdc0385eb66b" ON public.resource_tags_join USING btree ("resourcesId");


--
-- Name: IDX_c9b5b525a96ddc2c5647d7f7fa; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_c9b5b525a96ddc2c5647d7f7fa" ON public.users USING btree (created_at);


--
-- Name: IDX_cd4621ebd335db0fc53ccf471f; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_cd4621ebd335db0fc53ccf471f" ON public.deal_tags USING btree (created_at);


--
-- Name: IDX_d4fdd71f4cdc982a062e27b55e; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_d4fdd71f4cdc982a062e27b55e" ON public.listings USING btree ("rentMonthly");


--
-- Name: IDX_d5165f535c0d8a998a2c1cac66; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_d5165f535c0d8a998a2c1cac66" ON public.deal_sections USING btree (created_at);


--
-- Name: IDX_d556e8442468f5c811c9b9b54f; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_d556e8442468f5c811c9b9b54f" ON public.links USING btree (created_at);


--
-- Name: IDX_d613c05ab63c883ca9331e68a8; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_d613c05ab63c883ca9331e68a8" ON public.military_bases USING gist (location);


--
-- Name: IDX_da7aac2695e972b06da543cf70; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_da7aac2695e972b06da543cf70" ON public.resource_sections USING btree ("position");


--
-- Name: IDX_daece8c9985c1a774e11293c75; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_daece8c9985c1a774e11293c75" ON public.resource_tags USING btree (created_at);


--
-- Name: IDX_db8762fdc93b91049f87d52a27; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_db8762fdc93b91049f87d52a27" ON public.deal_sections USING btree ("position");


--
-- Name: IDX_e80a99069a3744da4163edf68e; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_e80a99069a3744da4163edf68e" ON public.link_tags_join USING btree ("linksId");


--
-- Name: IDX_f23279fad63453147a8efb46cf; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_f23279fad63453147a8efb46cf" ON public.audit_logs USING btree ("entityId");


--
-- Name: user_favorite_deals FK_0471267b5c902634d803742a457; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_deals
    ADD CONSTRAINT "FK_0471267b5c902634d803742a457" FOREIGN KEY ("dealId") REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: listings FK_193913e0bc01184d228c9ef27e6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT "FK_193913e0bc01184d228c9ef27e6" FOREIGN KEY ("nearestBaseId") REFERENCES public.military_bases(id);


--
-- Name: user_favorite_resources FK_299449fe5a96bcd0d42d4682081; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_resources
    ADD CONSTRAINT "FK_299449fe5a96bcd0d42d4682081" FOREIGN KEY ("resourceId") REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: link_tags_join FK_38bb756ebac34103669173682d6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.link_tags_join
    ADD CONSTRAINT "FK_38bb756ebac34103669173682d6" FOREIGN KEY ("linkTagsId") REFERENCES public.link_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_favorite_listings FK_447bdd8122db5a7fec00f9bfea0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_listings
    ADD CONSTRAINT "FK_447bdd8122db5a7fec00f9bfea0" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: deal_related FK_5375df983a6bf3588c780f7a29d; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_related
    ADD CONSTRAINT "FK_5375df983a6bf3588c780f7a29d" FOREIGN KEY ("targetId") REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: user_favorite_listings FK_56c007a54c35ad181a2f4b4fee5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_listings
    ADD CONSTRAINT "FK_56c007a54c35ad181a2f4b4fee5" FOREIGN KEY ("listingId") REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: user_favorite_resources FK_6772b5802f2cc3271b4f4391857; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_resources
    ADD CONSTRAINT "FK_6772b5802f2cc3271b4f4391857" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_favorite_deals FK_6a046dc27af80bca17672bc54b9; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_deals
    ADD CONSTRAINT "FK_6a046dc27af80bca17672bc54b9" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_favorite_links FK_77f5d1ca081f61b720635f6599a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_links
    ADD CONSTRAINT "FK_77f5d1ca081f61b720635f6599a" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: resource_tags_join FK_792aeae5cf71f96841009b795aa; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_tags_join
    ADD CONSTRAINT "FK_792aeae5cf71f96841009b795aa" FOREIGN KEY ("resourceTagsId") REFERENCES public.resource_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tokens FK_8769073e38c365f315426554ca5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: listing_amenities_join FK_8dc337d23799a3d29b0688cf9ab; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_amenities_join
    ADD CONSTRAINT "FK_8dc337d23799a3d29b0688cf9ab" FOREIGN KEY ("listingAmenitiesId") REFERENCES public.listing_amenities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deal_tags_join FK_93d2e367d9d500ea97c5e85b5c0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_tags_join
    ADD CONSTRAINT "FK_93d2e367d9d500ea97c5e85b5c0" FOREIGN KEY ("dealsId") REFERENCES public.deals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_amenities_join FK_ac3d5abb27ef245a12c291f6324; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_amenities_join
    ADD CONSTRAINT "FK_ac3d5abb27ef245a12c291f6324" FOREIGN KEY ("listingsId") REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deal_related FK_ad2d90240f5c1992b565c705fd5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_related
    ADD CONSTRAINT "FK_ad2d90240f5c1992b565c705fd5" FOREIGN KEY ("sourceId") REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: deal_tags_join FK_bdd8b41463d81f1a99248acf66e; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_tags_join
    ADD CONSTRAINT "FK_bdd8b41463d81f1a99248acf66e" FOREIGN KEY ("dealTagsId") REFERENCES public.deal_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listings FK_c3dc0ba6b57c545899ab3187ea9; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT "FK_c3dc0ba6b57c545899ab3187ea9" FOREIGN KEY ("ownerId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: resource_tags_join FK_c44a81cb65a33ffdc0385eb66b9; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_tags_join
    ADD CONSTRAINT "FK_c44a81cb65a33ffdc0385eb66b9" FOREIGN KEY ("resourcesId") REFERENCES public.resources(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deal_sections FK_c48d73dc0e450bbbcac962535f1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.deal_sections
    ADD CONSTRAINT "FK_c48d73dc0e450bbbcac962535f1" FOREIGN KEY ("dealId") REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: audit_logs FK_cfa83f61e4d27a87fcae1e025ab; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: resource_sections FK_dff2e0050d5bb470b1868f68402; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_sections
    ADD CONSTRAINT "FK_dff2e0050d5bb470b1868f68402" FOREIGN KEY ("resourceId") REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: link_tags_join FK_e80a99069a3744da4163edf68ec; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.link_tags_join
    ADD CONSTRAINT "FK_e80a99069a3744da4163edf68ec" FOREIGN KEY ("linksId") REFERENCES public.links(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_favorite_links FK_f4df8f3d1a4eb2d4e23feef2268; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_favorite_links
    ADD CONSTRAINT "FK_f4df8f3d1a4eb2d4e23feef2268" FOREIGN KEY ("linkId") REFERENCES public.links(id) ON DELETE CASCADE;


--
-- Name: links FK_fa0eaa0936fdbf7112185cd593d; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT "FK_fa0eaa0936fdbf7112185cd593d" FOREIGN KEY (image_id) REFERENCES public.links_images(id) ON DELETE SET NULL;


--
-- Name: listing_photos FK_fbe5bfb140ed07ab1bc04bd92c5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.listing_photos
    ADD CONSTRAINT "FK_fbe5bfb140ed07ab1bc04bd92c5" FOREIGN KEY ("listingId") REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

