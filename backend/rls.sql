BEGIN;

-- ENABLE RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- =========================
-- STUDENTS TABLE
-- =========================

CREATE POLICY "Students read own profile"
ON students
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Students update own profile"
ON students
FOR UPDATE
USING (id = auth.uid());

-- =========================
-- ADMINS TABLE
-- =========================

CREATE POLICY "Admins read own profile"
ON admins
FOR SELECT
USING (id = auth.uid());

-- =========================
-- EVENTS
-- =========================

-- Students can view
CREATE POLICY "Students view events"
ON events
FOR SELECT
USING (
    EXISTS (SELECT 1 FROM students WHERE id = auth.uid())
);

-- Tutors create academic
CREATE POLICY "Tutors create events"
ON events
FOR INSERT
WITH CHECK (
    type = 'academic'
    AND EXISTS (
        SELECT 1 FROM students
        WHERE id = auth.uid() AND is_tutor = TRUE
    )
);

-- Alumni create entrepreneurial
CREATE POLICY "Alumni create events"
ON events
FOR INSERT
WITH CHECK (
    type = 'entrepreneurial'
    AND EXISTS (
        SELECT 1 FROM students
        WHERE id = auth.uid() AND is_alumni = TRUE
    )
);

-- Host manages
CREATE POLICY "Host manages events"
ON events
FOR UPDATE
USING (host_student_id = auth.uid());

-- =========================
-- PARTICIPANTS
-- =========================

CREATE POLICY "Students join events"
ON event_participants
FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students view participation"
ON event_participants
FOR SELECT
USING (student_id = auth.uid());

-- =========================
-- REVIEWS
-- =========================

CREATE POLICY "Participants review"
ON reviews
FOR INSERT
WITH CHECK (
    reviewer_id = auth.uid()
);

-- =========================
-- TUTOR APPLICATIONS
-- =========================

CREATE POLICY "Students create applications"
ON tutor_applications
FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins manage applications"
ON tutor_applications
FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- =========================
-- RECORDINGS
-- =========================

CREATE POLICY "Host uploads recordings"
ON recordings
FOR INSERT
WITH CHECK (
    uploaded_by = auth.uid()
);

CREATE POLICY "Admins validate recordings"
ON recordings
FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

COMMIT;