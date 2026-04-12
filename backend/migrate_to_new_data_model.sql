BEGIN;

-- 1) Core lookup tables
CREATE TABLE IF NOT EXISTS majors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO majors (code, name)
VALUES
    ('LSG', 'Licence en sciences de gestion'),
    ('LIG', 'Licence en informatique de gestion')
ON CONFLICT (code) DO NOTHING;

INSERT INTO academic_years (label, sort_order)
VALUES
    ('1ere annee', 1),
    ('2eme annee', 2),
    ('3eme annee', 3)
ON CONFLICT DO NOTHING;

-- 2) Rename users -> profiles (if still old name)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        EXECUTE 'ALTER TABLE users RENAME TO profiles';
    END IF;
END $$;

-- 3) Profiles shape updates
ALTER TABLE IF EXISTS profiles
    ADD COLUMN IF NOT EXISTS major_id INTEGER,
    ADD COLUMN IF NOT EXISTS academic_year_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_profiles_major_id'
    ) THEN
        ALTER TABLE profiles
            ADD CONSTRAINT fk_profiles_major_id
            FOREIGN KEY (major_id) REFERENCES majors(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_profiles_academic_year_id'
    ) THEN
        ALTER TABLE profiles
            ADD CONSTRAINT fk_profiles_academic_year_id
            FOREIGN KEY (academic_year_id) REFERENCES academic_years(id);
    END IF;
END $$;

ALTER TABLE IF EXISTS profiles
    DROP COLUMN IF EXISTS study_level,
    DROP COLUMN IF EXISTS specialty;

-- 4) Subjects shape updates
ALTER TABLE IF EXISTS subjects
    ADD COLUMN IF NOT EXISTS major_id INTEGER,
    ADD COLUMN IF NOT EXISTS academic_year_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_subjects_major_id'
    ) THEN
        ALTER TABLE subjects
            ADD CONSTRAINT fk_subjects_major_id
            FOREIGN KEY (major_id) REFERENCES majors(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_subjects_academic_year_id'
    ) THEN
        ALTER TABLE subjects
            ADD CONSTRAINT fk_subjects_academic_year_id
            FOREIGN KEY (academic_year_id) REFERENCES academic_years(id);
    END IF;
END $$;

-- 5) Events shape updates
ALTER TABLE IF EXISTS events
    ADD COLUMN IF NOT EXISTS type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS host_user_id UUID,
    ADD COLUMN IF NOT EXISTS subject_id INTEGER,
    ADD COLUMN IF NOT EXISTS major_id INTEGER,
    ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
    ADD COLUMN IF NOT EXISTS delivery_mode VARCHAR(20),
    ADD COLUMN IF NOT EXISTS location_text VARCHAR(300),
    ADD COLUMN IF NOT EXISTS meeting_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'event_type'
    ) THEN
        EXECUTE 'UPDATE events SET type = COALESCE(type, event_type, ''workshop'')';
    ELSE
        EXECUTE 'UPDATE events SET type = COALESCE(type, ''workshop'')';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'created_by'
    ) THEN
        EXECUTE 'UPDATE events SET host_user_id = COALESCE(host_user_id, created_by)';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'location'
    ) THEN
        EXECUTE 'UPDATE events SET location_text = COALESCE(location_text, location)';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'event_date'
    ) THEN
        EXECUTE 'UPDATE events SET starts_at = COALESCE(starts_at, event_date)';
    END IF;

    EXECUTE 'UPDATE events SET delivery_mode = COALESCE(delivery_mode, ''onsite'')';
END $$;

ALTER TABLE IF EXISTS events
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN host_user_id SET NOT NULL,
    ALTER COLUMN starts_at SET NOT NULL,
    ALTER COLUMN delivery_mode SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_events_host_user_id'
    ) THEN
        ALTER TABLE events
            ADD CONSTRAINT fk_events_host_user_id
            FOREIGN KEY (host_user_id) REFERENCES profiles(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_events_subject_id'
    ) THEN
        ALTER TABLE events
            ADD CONSTRAINT fk_events_subject_id
            FOREIGN KEY (subject_id) REFERENCES subjects(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_events_major_id'
    ) THEN
        ALTER TABLE events
            ADD CONSTRAINT fk_events_major_id
            FOREIGN KEY (major_id) REFERENCES majors(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_events_academic_year_id'
    ) THEN
        ALTER TABLE events
            ADD CONSTRAINT fk_events_academic_year_id
            FOREIGN KEY (academic_year_id) REFERENCES academic_years(id);
    END IF;
END $$;

ALTER TABLE IF EXISTS events
    DROP COLUMN IF EXISTS event_type,
    DROP COLUMN IF EXISTS location,
    DROP COLUMN IF EXISTS event_date,
    DROP COLUMN IF EXISTS created_by,
    DROP COLUMN IF EXISTS is_published;

-- 6) Event participants table (from event_registrations if exists)
CREATE TABLE IF NOT EXISTS event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'registered',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_event_participant UNIQUE (event_id, user_id)
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'event_registrations'
    ) THEN
        INSERT INTO event_participants (event_id, user_id, status, joined_at)
        SELECT er.event_id, er.user_id, 'registered', COALESCE(er.registered_at, NOW())
        FROM event_registrations er
        ON CONFLICT (event_id, user_id) DO NOTHING;
    END IF;
END $$;

DROP TABLE IF EXISTS event_registrations;

-- 7) Reviews now tied to events
ALTER TABLE IF EXISTS reviews
    ADD COLUMN IF NOT EXISTS event_id INTEGER;

UPDATE reviews r
SET event_id = sub.event_id
FROM (
        SELECT r2.id AS review_id, MIN(e.id) AS event_id
        FROM reviews r2
        JOIN events e ON e.host_user_id = r2.reviewee_id
        GROUP BY r2.id
) AS sub
WHERE r.id = sub.review_id
    AND r.event_id IS NULL;

DELETE FROM reviews WHERE event_id IS NULL;

ALTER TABLE IF EXISTS reviews
    ALTER COLUMN event_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_event_id'
    ) THEN
        ALTER TABLE reviews
            ADD CONSTRAINT fk_reviews_event_id
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    END IF;
END $$;

ALTER TABLE IF EXISTS reviews
    DROP COLUMN IF EXISTS session_id;

COMMIT;
