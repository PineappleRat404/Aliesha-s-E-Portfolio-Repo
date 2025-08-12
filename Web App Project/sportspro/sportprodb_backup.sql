--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

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
-- Name: sportspro; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA sportspro;


ALTER SCHEMA sportspro OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    productcode character varying(10) NOT NULL,
    name character varying(50) NOT NULL,
    version numeric(18,1) NOT NULL,
    releasedate date NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: administrators; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.administrators (
    username character varying(40) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE sportspro.administrators OWNER TO postgres;

--
-- Name: countries; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.countries (
    countrycode character(2) NOT NULL,
    countryname character varying(50) NOT NULL
);


ALTER TABLE sportspro.countries OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.customers (
    customerid integer NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    address character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    postalcode character varying(20) NOT NULL,
    countrycode character(2) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE sportspro.customers OWNER TO postgres;

--
-- Name: customers_customerid_seq; Type: SEQUENCE; Schema: sportspro; Owner: postgres
--

CREATE SEQUENCE sportspro.customers_customerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE sportspro.customers_customerid_seq OWNER TO postgres;

--
-- Name: customers_customerid_seq; Type: SEQUENCE OWNED BY; Schema: sportspro; Owner: postgres
--

ALTER SEQUENCE sportspro.customers_customerid_seq OWNED BY sportspro.customers.customerid;


--
-- Name: incidents; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.incidents (
    incidentid integer NOT NULL,
    customerid integer NOT NULL,
    productcode character varying(10) NOT NULL,
    techid integer,
    dateopened timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dateclosed timestamp without time zone,
    title character varying(50) NOT NULL,
    description text NOT NULL
);


ALTER TABLE sportspro.incidents OWNER TO postgres;

--
-- Name: incidents_incidentid_seq; Type: SEQUENCE; Schema: sportspro; Owner: postgres
--

CREATE SEQUENCE sportspro.incidents_incidentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE sportspro.incidents_incidentid_seq OWNER TO postgres;

--
-- Name: incidents_incidentid_seq; Type: SEQUENCE OWNED BY; Schema: sportspro; Owner: postgres
--

ALTER SEQUENCE sportspro.incidents_incidentid_seq OWNED BY sportspro.incidents.incidentid;


--
-- Name: products; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.products (
    productcode character varying(10) NOT NULL,
    name character varying(50) NOT NULL,
    version numeric(18,1) NOT NULL,
    releasedate date NOT NULL
);


ALTER TABLE sportspro.products OWNER TO postgres;

--
-- Name: registrations; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.registrations (
    customerid integer NOT NULL,
    productcode character varying(10) NOT NULL,
    registrationdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE sportspro.registrations OWNER TO postgres;

--
-- Name: technicians; Type: TABLE; Schema: sportspro; Owner: postgres
--

CREATE TABLE sportspro.technicians (
    techid integer NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE sportspro.technicians OWNER TO postgres;

--
-- Name: technicians_techid_seq; Type: SEQUENCE; Schema: sportspro; Owner: postgres
--

CREATE SEQUENCE sportspro.technicians_techid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE sportspro.technicians_techid_seq OWNER TO postgres;

--
-- Name: technicians_techid_seq; Type: SEQUENCE OWNED BY; Schema: sportspro; Owner: postgres
--

ALTER SEQUENCE sportspro.technicians_techid_seq OWNED BY sportspro.technicians.techid;


--
-- Name: customers customerid; Type: DEFAULT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.customers ALTER COLUMN customerid SET DEFAULT nextval('sportspro.customers_customerid_seq'::regclass);


--
-- Name: incidents incidentid; Type: DEFAULT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.incidents ALTER COLUMN incidentid SET DEFAULT nextval('sportspro.incidents_incidentid_seq'::regclass);


--
-- Name: technicians techid; Type: DEFAULT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.technicians ALTER COLUMN techid SET DEFAULT nextval('sportspro.technicians_techid_seq'::regclass);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (productcode, name, version, releasedate) FROM stdin;
\.


--
-- Data for Name: administrators; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.administrators (username, password) FROM stdin;
admin_john@sportspro.com	$2b$10$.oHu8NGWRCmGx/AykjwrL.ADXedDW3nM8nje/KRa9VCwY7AgcVo7e
super_user_jane@sportspro.com	$2b$10$HEd4zdZ.g/FHYBLvWmFxDec87SS4zZsI4CfQWK0MhIUltYr.1A9pu
data_manager_rob@sportspro.com	$2b$10$oXyYP/UOeI/SOhESgeyj1e6kgVP3h7ffh8qiYaLuJW/9UT/BPpPVm
support_lead_maria@sportspro.com	$2b$10$XBLMjTxFw1IXB0jU/jHASOBi0hJwuB4FCZ3Y7k3j8mSky73qGdFpe
network_admin_david@sportspro.com	$2b$10$1bkzXSbKdb1iHXDlo9ik/OHyjlYGhqQrmGRhOo7BD9scexxp1joVK
system_ops_wei@sportspro.com	$2b$10$nLSuVfSxzbf4ngEEck/mT.rErD2MHHaVeN9l9FD3ELVxrchoS/b0.
finance_admin_freja@sportspro.com	$2b$10$8znLTi2t2ZcIx4WGIlfNfureL8HpZYkcfJ/.WK2a5kSa3dVCase9q
hr_admin_pierre@sportspro.com	$2b$10$D1HsleQoTXxOM0YkIlLiOuJgGy3fWYEF1zsxBHru7aTRe3evgwuIG
it_manager_elena@sportspro.com	$2b$10$gYIVdlCT5snq.dTQWw2lxecXo.5sTP35OoWrT.f9QJBP0tpS3Sqgu
dev_ops_sean@sportspro.com	$2b$10$au4c/MbMSrjgTUuo8O2hpuOw9WvVNehM4SsKaO2YeE.HnB3eZQDt.
qa_lead_kaito@sportspro.com	$2b$10$/3VX06IBi32keaUPg1PQieDwcD/lKr7hK9.HHMw2kIwEoQ3bz3v.u
marketing_admin_sophia@sportspro.com	$2b$10$Ew2Al1qr89pe2yLnB0BWV.Z6/Z.nYlPHDg4D9YI5ON/QmBH/6frgy
sales_manager_carlos@sportspro.com	$2b$10$nPwGifAZa0hd25SlYby.9eM9/UBF3jj89RwRvqmNjYQaj.h7ZuGh6
product_manager_sophie@sportspro.com	$2b$10$zPeV3jDbQo40g3248Q16keeNyPDXamyNw.h3sdw05mmRLcF.2WzVG
legal_admin_ahmed@sportspro.com	$2b$10$VIYrAaJs2WoadcdWGmrqkOtwmokT3IaZojHxi1UnLISQILmHlwJyu
customer_success_maria@sportspro.com	$2b$10$UN.IDMC483JU7Z59uda/yOo61cpls1Jv4T5gi61vwt9mI6ewhbCfK
billing_admin_fahad@sportspro.com	$2b$10$PhE/VEdctZ0i7k.XiDJ3JeygTGFR2GLdOkIPk4Z0aXWxo/8Zy/rjO
logistics_ops_nokwanda@sportspro.com	$2b$10$N8NV26vWFY5DAqOJ1G95y.B4ks3Fzu0uFaieEJ6OBrRTls88Cmot.
security_auditor_hans@sportspro.com	$2b$10$YxKTgHO9ZxQAsrpFTlx.juQ8n8rzZH0LQUK4sFNhvcQ7u1ptvf3ii
senior_admin_olena@sportspro.com	$2b$10$jM.Wi6j45k3IExMiR2aSzeC1jKr1yKqRg7BNSXhEfritGdyEZd.D.
senior_admin_oleg@sportspro.com	$2b$10$GPvHFugEVkKI9YCmTxwg1etj4F0bfsT95OHCBaNq2u2bGKlKPanca
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.countries (countrycode, countryname) FROM stdin;
AU	Australia
US	United States of America
NZ	New Zealand
BR	Brazil
CA	Canada
CN	China
DK	Denmark
FR	France
GR	Greece
IE	Ireland
JP	Japan
GB	Great Britain
MX	Mexico
NL	Netherlands
PK	Pakistan
PH	Phillipines
SA	Saudi Arabia
ZA	South Africa
CH	Switzerland
UA	Ukraine
AQ	Antarctica
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.customers (customerid, firstname, lastname, address, city, state, postalcode, countrycode, phone, email, password) FROM stdin;
51	Kaito	Tanaka	Shibuya 1-1	Tokyo	Tokyo	150-0002	JP	+81 90 9876 5433	kaito.t@example.com	$2b$10$C81YnkxU8ArSJoW09wSvE.El3Rj.oaiPJC1G58xZknZuEVsCWgAtq
49	Elena	Papadopoulos	Kolokotroni St 20	Athens	Attica	105 62	GR	+30 697 123 4567	elena.p@example.com	$2b$10$glorgfz4SPypzVdKBxhizuLUaBsyEkAQJDoqp/pUbM66DoCi84AUu
41	John	Doe	123 Main St	Sydney	NSW	2000	AU	+61 412 345 611	john.doe@example.com	$2b$10$ExwAL/spG9IGnqifZsXKduOoTrIe9yac8QZUAVOf9SGUmH5y9YHYm
43	Robert	Johnson	78 Oak Rd	London	England	SW1A 0AA	GB	+44 7911 123457	robert.j@example.com	$2b$10$l/g6ezoBcdMVarmC.2Gtc.AVvc/icu9zqplDFtQhCvkbri84CNsOq
44	Maria	Silva	Av. Paulista, 1000	Sao Paulo	SP	01310-000	BR	+55 11 99876-5432	maria.s@example.com	$2b$10$CoXQWD5Kas8vCdloWtOp8OpAKsp06D5SjokXBMIPuF27BFopzShjq
45	David	Lee	90 Maple Blvd	Toronto	ON	M5V 2H1	CA	+1 416 987 6543	david.l@example.com	$2b$10$CNFmmiH5Quqk8.6fLVRVhejkD9LP8z5fnpyvVce3j0KhCj3tTDdeu
46	Wei	Chen	No. 1 Chaoyangmen	Beijing	Beijing	100020	CN	+86 10 87654321	wei.c@example.com	$2b$10$Yel06Wi.GiOM5An1pCkiOOEPUAwgYstpY1/Io5mgpUfhRP500f.YG
47	Freja	Jensen	Bredgade 5	Copenhagen	Hovedstaden	1260	DK	+45 20 12 34 56	freja.j@example.com	$2b$10$nsgaV3UsNGlXjxK3Fguan.PIiE1Nk.y0abe2yKYxRqBoEVfAH71fO
48	Pierre	Dubois	Rue de la Paix 15	Paris	Ile-de-France	75001	FR	+33 6 12 34 56 78	pierre.d@example.com	$2b$10$yHejIErJJQoDtsrKgIkiz.FhygvCDRskWjbQi0/uKN8Dcv0HbFV0q
52	Sophia	Miller	Elizabeth St	Wellington	Wellington	6011	NZ	+64 21 987 6543	sophia.m@example.com	$2b$10$4Y5fJOGWi2XfTds0uPBOWuijsw3b/nhEwt./A4VZfft4FgO2dGZ8i
53	Carlos	Ramirez	Reforma 100	Mexico City	CDMX	06600	MX	+52 1 55 1234 5678	carlos.r@example.com	$2b$10$HDdV0AlDIfu4157XeEpYl.H.GRhRHz5A7zGzRckEFvWRkiKtI8sZK
54	Sophie	de Jong	Keizersgracht 10	Amsterdam	North Holland	1015 CJ	NL	+31 6 1234 5678	sophie.dj@example.com	$2b$10$Q9HTI5fhA7rdKndE792Z1.HnQLykJv/QJRwsdXKgC5gzjTIm6CWca
55	Ahmed	Khan	Jinnah Ave	Karachi	Sindh	75500	PK	+92 300 1234567	ahmed.k@example.com	$2b$10$kptfoyh2IpbUAFdZ83lmfe/d45eKSLtM2xkErc0ulyooGtu1riPb6
56	Maria	Reyes	Ayala Ave	Makati	Metro Manila	1226	PH	+63 917 123 4567	maria.r@example.com	$2b$10$jtq3f41i3PuAGaENBsvIq.eflnNiKDJI4g3/wOl0DrKqchHnBaipi
57	Fahad	Al-Qahtani	King Fahd Rd	Riyadh	Riyadh Province	12345	SA	+966 50 123 4567	fahad.a@example.com	$2b$10$4iZLACvsdZZmtdL1vvZf0uAS3c5KTdyOyXv0ukOgcM0eyKiYJcJWG
50	Sean	Murphy	O Connell St 30	Dublin	Leinster	D01 XYZ	IE	+353 87 123 4568	sean.m@example.com	$2b$10$K6j2XA2zIslDtfmPA6PD2OfmqsHGE4xNQ4jELwEIFjjsPeRgFpOKS
42	Jane	Smith	45 Elm Ave	New York	NY	10001	US	+1 917 123 4562	jane.smith@example.com	$2b$10$w7JMiwYZWpN5oxmh8B85AeB6Qwi/54TxfX4xpHT3.8c5g8LR6sNea
58	Nokwanda	Dlamini	Main Rd 5	Johannesburg	Gauteng	2000	ZA	+27 72 123 4567	nokwanda.d@example.com	$2b$10$cAifHBmZ6PP7cnnIHuFjSuyGWXAaTYo863bIqJ4YMnL4bxj3WpYPO
59	Hans	Müller	Bahnhofstrasse 7	Zurich	Zurich	8001	CH	+41 79 123 4567	hans.m@example.com	$2b$10$.xtQJkUlWCsvieeNcHFkCehcFRwV4yQZd8y4NAMRWxmOgi.ZxAs7W
60	Olena	Kovalenko	Khreschatyk St 1	Kyiv	Kyiv City	01001	UA	+380 97 123 4567	olena.k@example.com	$2b$10$jX9drGrlkLgUWXIzsTxaZuT3KztDhvpH2Ax5SzlCh6vUXBHfgNqIu
\.


--
-- Data for Name: incidents; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.incidents (incidentid, customerid, productcode, techid, dateopened, dateclosed, title, description) FROM stdin;
2	42	DRAFT02	15	2025-06-18 14:00:00	2025-06-21 09:30:00	Draft Manager Export Error	Draft Manager V2 fails to export data to CSV format.
4	44	GAMSI05	7	2025-06-12 09:00:00	2025-06-14 17:00:00	Game Simulator V5.5 Freeze	Game Simulator V5.5 freezes unexpectedly during complex simulations.
5	45	TRUBS02	11	2025-06-05 16:00:00	2025-06-07 10:00:00	Troubleshooting Manual PDF Error	Troubleshooting Manual V2 PDF version has corrupted images.
6	46	SCHMA03	2	2025-06-01 08:45:00	2025-06-03 12:00:00	Schedule Mate Sync Issue	Schedule Mate 03 failing to sync schedules across devices.
8	48	GAMEP07	4	2025-05-25 10:00:00	2025-05-26 15:00:00	Game Planner V7 Save Failure	Cannot save game plans in Game Planner V7 after update.
11	51	PAYDA15	6	2025-05-15 14:00:00	2025-05-17 11:00:00	Payday Manager V15.3 Calculation Error	Payday Manager V15.3 calculates deductions incorrectly.
12	52	PLAYS09	10	2025-05-10 11:00:00	2025-05-12 09:00:00	Player Scheduler V9 UI Glitch	Player Scheduler V9 displays overlapping text on player profiles.
14	54	TEAMS03	19	2025-05-01 16:00:00	2025-05-04 14:00:00	Team Manager V3 Role Permission	Team Manager V3 not applying role permissions correctly.
15	55	HURTY15	5	2025-04-28 09:00:00	2025-04-30 11:00:00	Injury Tracker V15 Graph Error	Injury Tracker V15 graphs show skewed data for recovery times.
16	56	TRAIN06	17	2025-04-25 13:00:00	\N	Training Mate V6 Video Playback	Training Mate V6 videos are not playing on specific browsers.
17	57	GROUN03	3	2025-04-20 10:00:00	2025-04-22 15:00:00	Groundskeeping Scheduler V3 Export	Groundskeeping Scheduler V3 exports empty files.
18	58	MAINT03	8	2025-04-18 14:00:00	2025-04-19 10:00:00	Maintenance Scheduler V3 Notification	Maintenance Scheduler V3 sends duplicate maintenance reminders.
19	59	AIBOT3000	12	2025-04-15 11:00:00	2025-04-16 16:00:00	AI Helper 3000 Misinterprets Query	AI HELPER 3000 provides irrelevant answers to specific queries.
21	45	DRAFT02	15	2025-06-18 04:00:00	2025-06-20 23:30:00	Draft Manager Export Error	Draft Manager V2 fails to export data to CSV format.
22	41	BUGFI11	2	2025-06-20 00:15:00	\N	Critical Bug in BugFinder	User reports BugFinder 11 crashes when running a specific scan pattern.
26	46	AIBOT3000	16	2025-07-07 00:00:00	\N	Skynet warning	AI product has turned into Skynet
25	41	BUGFI11	7	2025-06-20 00:15:00	\N	Critical Bug in BugFinder	User reports BugFinder 11 crashes when running a specific scan pattern.
24	53	GAMSI05	18	2025-07-05 00:00:00	\N	Error message	An error message appears when client tries to execute game sim
29	50	GROUN03	\N	2025-07-08 00:00:00	\N	Cool Test Bug	A bug with sunglasses got trapped in the machine
30	57	HURTY15	10	2025-07-08 00:00:00	\N	Software injured user	User got frustrated, kicked computer and hurt foot. 
27	44	MAINT03	19	2025-07-08 00:00:00	\N	Maintenance isn't Scheduling	In fact, it's un-scheduling existing tasks already set! 
7	47	TIMET00	18	2025-05-28 13:00:00	2025-07-11 07:28:09.153	Timetable Trouble V0 Crash	Timetable Trouble V0 crashes randomly on launch for new users.
37	48	SINBI01	17	2025-07-17 00:00:00	\N	Unexpected Error on Reload	When user refreshes page, unexpected "THIS IS SKYNET" error appears on screen. 
40	43	MAINT03	\N	2025-07-17 00:00:00	\N	Scheduler set to the wrong time zone	Scheduler set to the wrong time zone
41	51	GROUN03	\N	2025-07-20 00:00:00	\N	Unkeeping the Grounds	Schedules the program is setting are making the grounds look unkempt
38	58	TEAMS03	40	2025-07-17 00:00:00	\N	Teams deleting from system	Teams seem to be automatically deleting from the system when delete function is not being initiated. 
28	47	GAMEP07	40	2025-07-08 00:00:00	\N	Lost database connection	System seems to have a broken connection between frontend and the database. No game information is being shown in the system. 
42	51	HURTY15	40	2025-07-26 00:00:00	\N	Logging Error	Logs are not tracking changes made in the system. 
39	45	DRAFT02	40	2025-07-17 00:00:00	2025-07-26 23:50:54.746	Drafts stay in Draft	Finalised drafts get stuck in draft status
1	41	BUGFI11	1	2025-06-20 10:15:00	\N	Critical Bug in BugFinder	User reports BugFinder 11 crashes when running a specific scan pattern.
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.products (productcode, name, version, releasedate) FROM stdin;
DRAFT02	Draft Manager V2	2.0	2024-10-10
SINBI01	Sin Bin Sim OG	1.0	2025-01-01
GAMSI05	Game Simulator V5.5	5.5	2025-05-01
TRUBS02	Troubleshooting Manual V2	2.0	2023-06-18
SCHMA03	Schedule Mate 03	3.0	2020-10-20
TIMET00	Timetable Trouble V0	0.0	2015-03-15
BUGFI11	BugFinder 11	11.0	2025-06-01
GAMEP07	Game Planner V7	7.0	2023-09-07
EQUIP10	Equipment Manager V10	10.0	2022-07-16
HRMAT01	HR MATE	1.1	2018-08-08
PAYDA15	Payday Manager V15.3	15.3	2025-03-22
PLAYS09	Player Scheduler V9 	9.0	2024-10-09
TEAMS03	Team Manager V3	3.0	2021-07-10
HURTY15	Injury Tracker V15	15.0	2025-02-10
TRAIN06	Training Mate V6	6.0	2021-11-30
GROUN03	Groundskeeping Scheduler V3	3.0	2023-03-03
MAINT03	Maintenance Scheduler V3	3.0	2023-03-03
AIBOT3000	AI HELPER 3000	3000.0	2025-06-22
\.


--
-- Data for Name: registrations; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.registrations (customerid, productcode, registrationdate) FROM stdin;
41	DRAFT02	2024-01-10 10:00:00
42	SINBI01	2024-02-15 11:30:00
43	GAMSI05	2024-03-20 09:00:00
44	TRUBS02	2024-04-01 14:00:00
45	SCHMA03	2024-05-05 16:00:00
46	TIMET00	2024-06-10 08:30:00
47	BUGFI11	2024-07-22 12:45:00
48	GAMEP07	2024-08-01 10:15:00
49	EQUIP10	2024-09-05 15:00:00
50	HRMAT01	2024-10-11 09:30:00
51	PAYDA15	2024-11-01 13:00:00
52	PLAYS09	2024-12-05 17:00:00
54	TEAMS03	2025-02-03 10:30:00
55	HURTY15	2025-03-08 11:00:00
56	TRAIN06	2025-04-12 14:00:00
57	GROUN03	2025-05-18 16:00:00
58	MAINT03	2025-06-01 09:00:00
59	AIBOT3000	2025-06-15 10:00:00
45	DRAFT02	2024-01-10 00:00:00
43	AIBOT3000	2025-07-05 00:00:00
44	SINBI01	2025-07-07 00:00:00
44	HRMAT01	2025-07-08 00:00:00
48	TRAIN06	2025-07-09 00:00:00
48	DRAFT02	2025-07-09 00:00:00
51	EQUIP10	2025-07-09 00:00:00
53	PLAYS09	2025-07-11 00:00:00
60	TRAIN06	2025-07-12 00:00:00
51	GAMSI05	2025-07-20 00:00:00
\.


--
-- Data for Name: technicians; Type: TABLE DATA; Schema: sportspro; Owner: postgres
--

COPY sportspro.technicians (techid, firstname, lastname, email, phone, password) FROM stdin;
1	Liam	Smith	liam.smith@sportspro.com	+61 2 8765 4321	$2b$10$84XMXjQYyWqxVSGJUhZJtufnN/2MiPwajTtMJT68RxXvm0m6Y/Jcq
2	Olivia	Johnson	olivia.j@sportspro.com	+1 212 555 0101	$2b$10$QpGjG5z9B8SU/8kg9HSXJu7hDIy7iA4lvx8wkJFBD.HNGjuAG508S
3	Noah	Williams	noah.w@sportspro.com	+64 9 876 5432	$2b$10$5mQ1.1UonpyWSP.iM83uoeEj5GurHsn1jakJDOHeYNjq87eRPFc.e
4	Emma	Brown	emma.b@sportspro.com	+55 11 98765-4321	$2b$10$asXu8LD5ytzkmES3xY1nFOG0zFzEdvAHkh/4z7UQyJko1TqDRUGCa
5	Oliver	Jones	oliver.j@sportspro.com	+1 416 555 1234	$2b$10$05jPdm7GkXJxxzA.f.cAIu9YpHq7YA655Fn/K1smUBWIlRPx8MBIa
6	Charlotte	Garcia	charlotte.g@sportspro.com	+86 10 65432109	$2b$10$ElwWlNvwe6uoqvIJN8x5kOpRAhS8c7pgbkz.Zb7ZtdG9JwxaRZGL2
7	Elijah	Miller	elijah.m@sportspro.com	+45 30 12 34 56	$2b$10$AkIu38IuxVFl0QDEOXeWWOShyedZER81s5NhDhe1WzgltKmIF78ve
8	Amelia	Davis	amelia.d@sportspro.com	+33 1 45 67 89 01	$2b$10$9uBOXfGqJkRpani4uZyJBeX1DkD/1dVPUo0sb.iuEd/3DAq9rwiDW
10	Sophia	Martinez	sophia.m@sportspro.com	+353 1 678 9012	$2b$10$vu0pqk3Ayn0Z29cwFlPfXuuJ3v77BcAiAy9cB5WqI272/dCnIh2ne
11	Benjamin	Hernandez	benjamin.h@sportspro.com	+81 3 1234 5678	$2b$10$ZyHQ82Y85eE8/ArhYyiL5OqgYb.f00U4QshNmd0kOuZgvHbFmsCLa
12	Isabella	Lopez	isabella.l@sportspro.com	+44 20 7946 0123	$2b$10$zLyI.d0j30fWCb/DzgMs.uTPCLkOXFjy5QQ3hvlTgMf4Wic2/GlVy
15	Henry	Anderson	henry.a@sportspro.com	+92 21 3456789	$2b$10$.oFLMfjPjoCA6S50Aq.lP.roUMnbKAIQOfTc8Z5zUWJwMVw.JB.Lu
16	Evelyn	Thomas	evelyn.t@sportspro.com	+63 2 8765432	$2b$10$PMODDSjtz/BsAgrEkJRsQuAlKKkIb/13oo3F6Gca78DEwhOIJ1eue
17	Alexander	Taylor	alex.t@sportspro.com	+966 11 2345 6789	$2b$10$Vt0VP4odZqah7fjhPUtEF.kq5l9Bz8MsIewY1xw7D21ckfAtiJOd2
18	Harper	Moore	harper.m@sportspro.com	+27 11 987 6543	$2b$10$0KElY67xTsysqfq1oRSKsO/IoFvb9q6F/Etqody7EhUPA07L1tfn6
19	William	Jackson	william.j@sportspro.com	+41 22 789 0123	$2b$10$Dzy/9PWDblopP0NebUY5xe9cVZm6HtGVToKyz04sER/kphw0GqoAG
40	Aliesha	Sleeman	aliesha.s@sportspro.com	+64 00 000 000	$2b$10$YmfLE0sn/hJ44MJBPdSpjuK.DIT1IUPn5fCiPmlfnw5SQyLVrmgB6
\.


--
-- Name: customers_customerid_seq; Type: SEQUENCE SET; Schema: sportspro; Owner: postgres
--

SELECT pg_catalog.setval('sportspro.customers_customerid_seq', 60, true);


--
-- Name: incidents_incidentid_seq; Type: SEQUENCE SET; Schema: sportspro; Owner: postgres
--

SELECT pg_catalog.setval('sportspro.incidents_incidentid_seq', 42, true);


--
-- Name: technicians_techid_seq; Type: SEQUENCE SET; Schema: sportspro; Owner: postgres
--

SELECT pg_catalog.setval('sportspro.technicians_techid_seq', 42, true);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (productcode);


--
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (username);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (countrycode);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customerid);


--
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (incidentid);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (productcode);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (customerid, productcode);


--
-- Name: technicians technicians_email_key; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.technicians
    ADD CONSTRAINT technicians_email_key UNIQUE (email);


--
-- Name: technicians technicians_pkey; Type: CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.technicians
    ADD CONSTRAINT technicians_pkey PRIMARY KEY (techid);


--
-- Name: customers customers_countrycode_fkey; Type: FK CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.customers
    ADD CONSTRAINT customers_countrycode_fkey FOREIGN KEY (countrycode) REFERENCES sportspro.countries(countrycode);


--
-- Name: incidents incidents_customerid_fkey; Type: FK CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.incidents
    ADD CONSTRAINT incidents_customerid_fkey FOREIGN KEY (customerid) REFERENCES sportspro.customers(customerid);


--
-- Name: incidents incidents_productcode_fkey; Type: FK CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.incidents
    ADD CONSTRAINT incidents_productcode_fkey FOREIGN KEY (productcode) REFERENCES sportspro.products(productcode);


--
-- Name: incidents incidents_techid_fkey; Type: FK CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.incidents
    ADD CONSTRAINT incidents_techid_fkey FOREIGN KEY (techid) REFERENCES sportspro.technicians(techid);


--
-- Name: registrations registrations_customerid_fkey; Type: FK CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.registrations
    ADD CONSTRAINT registrations_customerid_fkey FOREIGN KEY (customerid) REFERENCES sportspro.customers(customerid);


--
-- Name: registrations registrations_productcode_fkey; Type: FK CONSTRAINT; Schema: sportspro; Owner: postgres
--

ALTER TABLE ONLY sportspro.registrations
    ADD CONSTRAINT registrations_productcode_fkey FOREIGN KEY (productcode) REFERENCES sportspro.products(productcode);


--
-- PostgreSQL database dump complete
--

