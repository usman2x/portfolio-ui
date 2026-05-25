CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name TEXT NOT NULL,
    username CITEXT UNIQUE NOT NULL,
    email CITEXT UNIQUE NOT NULL,

    avatar_url TEXT,

    role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN (
            'user',
            'trusted_contributor',
            'admin'
        )),

    trust_score INTEGER NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mosques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    slug TEXT UNIQUE NOT NULL,

    name TEXT NOT NULL,
    description TEXT,

    phone TEXT,
    website TEXT,

    address_line1 TEXT,
    city TEXT,
    state TEXT,
    country TEXT,

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    timezone TEXT NOT NULL DEFAULT 'UTC',

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    source TEXT NOT NULL DEFAULT 'community'
        CHECK (source IN (
            'osm',
            'google',
            'community',
            'manual'
        )),

    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mosque_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mosque_id UUID NOT NULL
        REFERENCES mosques(id)
        ON DELETE CASCADE,

    uploaded_by UUID
        REFERENCES users(id),

    image_url TEXT NOT NULL,

    caption TEXT,

    is_approved BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,

    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

INSERT INTO facilities (code, name)
VALUES
('parking', 'Parking'),
('wudu', 'Wudu Area'),
('women_area', 'Women Prayer Area'),
('wheelchair', 'Wheelchair Access'),
('madrasa', 'Madrasa'),
('library', 'Library');

-- Junction table to represent the many-to-many relationship between mosques and facilities
CREATE TABLE mosque_facilities (
    mosque_id UUID NOT NULL
        REFERENCES mosques(id)
        ON DELETE CASCADE,

    facility_id INTEGER NOT NULL
        REFERENCES facilities(id)
        ON DELETE CASCADE,

    PRIMARY KEY (mosque_id, facility_id)
);

CREATE TABLE prayer_timings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mosque_id UUID NOT NULL
        REFERENCES mosques(id)
        ON DELETE CASCADE,

    effective_from DATE NOT NULL,

    fajr_adhan TIME,
    fajr_iqamah TIME,

    dhuhr_adhan TIME,
    dhuhr_iqamah TIME,

    asr_adhan TIME,
    asr_iqamah TIME,

    maghrib_adhan TIME,
    maghrib_iqamah TIME,

    isha_adhan TIME,
    isha_iqamah TIME,

    jumuah_1 TIME,
    jumuah_2 TIME,

    created_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- out of scope for MVP, but can be added later to allow mosques to post events like lectures, community gatherings, etc.
-- CREATE TABLE mosque_events (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

--     mosque_id UUID NOT NULL
--         REFERENCES mosques(id)
--         ON DELETE CASCADE,

--     title TEXT NOT NULL,
--     description TEXT,

--     category TEXT,

--     starts_at TIMESTAMPTZ NOT NULL,
--     ends_at TIMESTAMPTZ,

--     created_by UUID REFERENCES users(id),

--     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
-- );