import { useState, useEffect } from 'react';
import { Course } from '../types';

const MOCK_COURSES: Course[] = [
  {
    id: '1', title: 'Operating Systems', description: 'Learn the basic OS abstractions, mechanisms, and their implementations in depth.',
    subject: 'Computer Science', tutorId: 'tutor1', tutorName: 'Mark Lee',
    duration: 90, enrolledCount: 18, maxEnrolled: 30, date: '2024-11-08', time: '10:00',
    status: 'upcoming', color: '#b8d4f0', icon: 'monitor', isEnrolled: true,
  },
  {
    id: '2', title: 'Artificial Intelligence', description: 'Intelligence demonstrated by machines, unlike natural intelligence displayed by humans and animals.',
    subject: 'Computer Science', tutorId: 'tutor2', tutorName: 'Jung Jaehyun',
    duration: 120, enrolledCount: 24, maxEnrolled: 25, date: '2024-11-10', time: '14:00',
    status: 'upcoming', color: '#c8e8d4', icon: 'brain', isEnrolled: false,
  },
  {
    id: '3', title: 'Software Engineering', description: 'Design, development and maintenance of software with modern engineering practices.',
    subject: 'Engineering', tutorId: 'tutor3', tutorName: 'Kim Taeyeong',
    duration: 100, enrolledCount: 15, maxEnrolled: 20, date: '2024-11-12', time: '09:00',
    status: 'ongoing', color: '#f0d8c8', icon: 'code', isEnrolled: true,
  },
  {
    id: '4', title: 'Data Structures', description: 'Arrays, trees, graphs and advanced data organization techniques for real applications.',
    subject: 'Computer Science', tutorId: 'tutor4', tutorName: 'Sarah Chen',
    duration: 90, enrolledCount: 22, maxEnrolled: 30, date: '2024-11-14', time: '11:00',
    status: 'upcoming', color: '#e8d0f0', icon: 'database', isEnrolled: false,
  },
  {
    id: '5', title: 'Database Systems', description: 'SQL, NoSQL, indexing strategies and database design patterns for modern apps.',
    subject: 'Computer Science', tutorId: 'tutor5', tutorName: 'Ahmed Ben Ali',
    duration: 110, enrolledCount: 19, maxEnrolled: 25, date: '2024-11-16', time: '16:00',
    status: 'upcoming', color: '#fce8c8', icon: 'server', isEnrolled: false,
  },
  {
    id: '6', title: 'Computer Networks', description: 'TCP/IP protocols, network architecture, routing algorithms, and security fundamentals.',
    subject: 'Engineering', tutorId: 'tutor6', tutorName: 'Leila Mansour',
    duration: 95, enrolledCount: 20, maxEnrolled: 28, date: '2024-11-18', time: '13:00',
    status: 'upcoming', color: '#d0eef8', icon: 'wifi', isEnrolled: false,
  },
];

// Courses a tutor teaches (linked to their tutorId)
const TUTOR_GIVEN_COURSES: Course[] = [
  {
    id: 't1', title: 'Introduction to Python', description: 'Hands-on Python programming from scratch — variables, loops, functions, and OOP.',
    subject: 'Computer Science', tutorId: 'me', tutorName: 'You',
    duration: 75, enrolledCount: 12, maxEnrolled: 20, date: '2024-11-09', time: '10:00',
    status: 'upcoming', color: '#c8e8d4', icon: 'code',
  },
  {
    id: 't2', title: 'Web Development Basics', description: 'HTML, CSS, JavaScript fundamentals and building your first interactive website.',
    subject: 'Engineering', tutorId: 'me', tutorName: 'You',
    duration: 90, enrolledCount: 8, maxEnrolled: 15, date: '2024-11-15', time: '14:00',
    status: 'upcoming', color: '#f0d8c8', icon: 'monitor',
  },
];

export function useCourses(userId?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCourses(MOCK_COURSES);
      setLoading(false);
    }, 0);
  }, []);

  const enrolledCourses = courses.filter(c => c.isEnrolled);
  const availableCourses = courses.filter(c => !c.isEnrolled);
  const tutorGivenCourses = TUTOR_GIVEN_COURSES;

  const enroll = (courseId: string) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId
        ? { ...c, isEnrolled: true, enrolledCount: Math.min(c.enrolledCount + 1, c.maxEnrolled) }
        : c
    ));
  };

  const unenroll = (courseId: string) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId
        ? { ...c, isEnrolled: false, enrolledCount: Math.max(c.enrolledCount - 1, 0) }
        : c
    ));
  };

  const createCourse = (data: Partial<Course>) => {
    const newCourse: Course = {
      id: 'new-' + Date.now(),
      title: data.title || 'New Course',
      description: data.description || '',
      subject: data.subject || 'General',
      tutorId: 'me',
      tutorName: data.tutorName || 'You',
      duration: data.duration || 60,
      enrolledCount: 0,
      maxEnrolled: data.maxEnrolled || 20,
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '10:00',
      status: 'upcoming',
      color: '#b8d4f0',
      icon: 'book',
    };
    setCourses(prev => [newCourse, ...prev]);
    return newCourse;
  };

  return { courses, loading, enrolledCourses, availableCourses, tutorGivenCourses, enroll, unenroll, createCourse };
}
