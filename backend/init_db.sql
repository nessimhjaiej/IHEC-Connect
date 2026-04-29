BEGIN;

-- =========================
-- ENUMS
-- =========================
CREATE TYPE event_type AS ENUM ('academic', 'entrepreneurial');
CREATE TYPE delivery_mode AS ENUM ('online', 'onsite');
CREATE TYPE tutor_application_status AS ENUM ('pending', 'approved', 'rejected');

-- =========================
-- CORE TABLES
-- =========================
CREATE TABLE majors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL
);

CREATE TABLE academic_years (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- =========================
-- STUDENTS
-- =========================
CREATE TABLE students (
    id UUID PRIMARY KEY, -- auth.users.id

    major_id INTEGER REFERENCES majors(id),
    academic_year_id INTEGER REFERENCES academic_years(id),

    is_tutor BOOLEAN DEFAULT FALSE,
    is_alumni BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- ADMINS
-- =========================
CREATE TABLE admins (
    id UUID PRIMARY KEY, -- auth.users.id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- SUBJECTS
-- =========================
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    major_id INTEGER REFERENCES majors(id),
    academic_year_id INTEGER REFERENCES academic_years(id)
);

-- =========================
-- EVENTS
-- =========================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    type event_type NOT NULL,

    host_student_id UUID NOT NULL REFERENCES students(id),
    subject_id INTEGER REFERENCES subjects(id),

    major_id INTEGER REFERENCES majors(id),
    academic_year_id INTEGER REFERENCES academic_years(id),

    delivery_mode delivery_mode NOT NULL,

    location_text VARCHAR(300),
    meeting_url VARCHAR(500),

    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- PARTICIPANTS
-- =========================
CREATE TABLE event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    status VARCHAR(20) DEFAULT 'registered',
    joined_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (event_id, student_id)
);

-- =========================
-- REVIEWS
-- =========================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES students(id),

    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- TUTOR APPLICATIONS
-- =========================
CREATE TABLE tutor_applications (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id),

    grade NUMERIC(4,2),
    status tutor_application_status DEFAULT 'pending',

    reviewed_by UUID REFERENCES admins(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id, subject_id)
);

-- =========================
-- RECORDINGS
-- =========================
CREATE TABLE recordings (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,

    youtube_url VARCHAR(500),
    uploaded_by UUID REFERENCES students(id),

    validated BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES admins(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;