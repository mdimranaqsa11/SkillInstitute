import { colors } from '../constants';

export const currentUser = {
  name: 'Admin',
  fullName: 'Institute Admin',
  role: 'Administrator',
  branch: 'Main Branch',
  email: 'admin@skillinstitute.edu',
  avatarUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB79NCLUpGfuHC4zFlsghWu-EPCHuCg4EkNu_8iKGVrEb7E_pv-vuojQuTKiYYHKsDYQpy-TZHBvtUvZ-euzbpGDT-vAGhoAmgoyzaSg14u4XeWactkT9sNlJ9rmBL7NXLi0jT2_S-K7Sh4J3RjdctB-759USELXlWt8T9zzbVX1lfNn3M8xjXzvfa8T9MY1CQHNVR4U6G04HN00rEOOHfjCqHxY-Qk6cnd6Jndy5d-MXPar5Xo9b3s',
};

export const dashboardStats = [
  { id: 'students', icon: 'school', label: 'Total Students', value: '1,240', tint: colors.primary },
  { id: 'courses', icon: 'menu-book', label: 'Active Courses', value: '42', tint: colors.secondary },
  { id: 'exams', icon: 'quiz', label: 'Upcoming Exams', value: '8', tint: colors.tertiary },
  { id: 'results', icon: 'assessment', label: 'Results Published', value: '156', tint: colors.onPrimaryFixed },
];

export const quickActions = [
  { id: 'create-exam', icon: 'add-circle', label: 'Create Exam', primary: true },
  { id: 'add-course', icon: 'add-circle', label: 'Add Course' },
  { id: 'publish-result', icon: 'publish', label: 'Publish Result' },
  { id: 'add-branch', icon: 'domain-add', label: 'Add Branch' },
];

export const upcomingExamsPreview = [
  { id: '1', month: 'OCT', day: '15', title: 'Mid-Term: Advanced Mathematics', time: '09:00 AM - 12:00 PM', location: 'Hall A' },
  { id: '2', month: 'OCT', day: '18', title: 'Finals: Introduction to Physics', time: '02:00 PM - 05:00 PM', location: 'Lab 3' },
  { id: '3', month: 'OCT', day: '22', title: 'Practical: Computer Science 101', time: '10:00 AM - 01:00 PM', location: 'Tech Center' },
];

export const recentActivity = [
  { id: '1', icon: 'assessment', tint: colors.primary, tintBg: 'rgba(37,99,235,0.15)', title: 'Result Published for Final Term', meta: '2 hours ago • By System' },
  { id: '2', icon: 'person-add', tint: colors.secondary, tintBg: 'rgba(208,225,251,0.4)', title: 'New Student Enrolled', meta: '5 hours ago • Engineering Dept' },
  { id: '3', icon: 'domain-add', tint: colors.tertiary, tintBg: 'rgba(255,219,205,0.4)', title: "Branch 'East' Added", meta: 'Yesterday • By SuperAdmin' },
];

export const exams = [
  {
    id: 'e1',
    title: 'Mid-Term Assessment 2024',
    subject: 'Computer Science • Batch A',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    endsIn: '2h 15m',
    progress: 65,
    submitted: 65,
    total: 100,
    branch: 'Main Branch, Hall C',
  },
  {
    id: 'e2',
    title: 'Final Term 2024',
    subject: 'Business Admin',
    status: 'scheduled',
    statusLabel: 'Scheduled',
    date: 'Oct 24, 2024',
    time: '10:00 AM',
    branch: 'Main Branch',
  },
  {
    id: 'e3',
    title: 'Practical Assessment',
    subject: 'Information Tech',
    status: 'scheduled',
    statusLabel: 'Scheduled',
    date: 'Oct 26, 2024',
    time: '02:00 PM',
    branch: 'North Campus',
  },
  {
    id: 'e4',
    title: 'Q3 Unit Test',
    subject: 'Mathematics',
    status: 'completed',
    statusLabel: 'Completed',
    date: 'Oct 10, 2024',
    resultStatus: 'Published',
    branch: 'Main Branch',
  },
];

export const examTabs = ['All', 'Scheduled', 'Ongoing', 'Completed'];

export const courses = [
  { id: 'c1', code: 'MATH-401', title: 'Advanced Mathematics', students: 45, icon: 'calculate', tint: colors.primaryContainer },
  { id: 'c2', code: 'PHY-202', title: 'Quantum Physics', students: 28, icon: 'science', tint: colors.tertiary },
  { id: 'c3', code: 'CS-305', title: 'Data Structures', students: 62, icon: 'code', tint: colors.secondary },
  { id: 'c4', code: 'LIT-101', title: 'World Literature', students: 35, icon: 'menu-book', tint: colors.error },
];

export const resultStats = [
  { id: 'avg', label: 'Avg Score', value: '78%', tint: colors.primary },
  { id: 'pass', label: 'Pass Rate', value: '92%', tint: colors.primary },
  { id: 'graded', label: 'Total Graded', value: '450', tint: colors.onSurface },
  { id: 'pending', label: 'Pending', value: '24', tint: colors.tertiary },
];

export const results = [
  { id: 'r1', studentName: 'John Doe', studentId: 'STU-2024-001', courseName: 'Advanced React', grade: 'A', status: 'passed' },
  { id: 'r2', studentName: 'Alice Smith', studentId: 'STU-2024-045', courseName: 'UI/UX Design', grade: 'B+', status: 'passed' },
  { id: 'r3', studentName: 'Mike Johnson', studentId: 'STU-2024-089', courseName: 'Data Science Basics', grade: 'F', status: 'failed' },
  { id: 'r4', studentName: 'Emma Wilson', studentId: 'STU-2024-112', courseName: 'Advanced React', grade: 'A-', status: 'passed' },
];

export const branches = [
  {
    id: 'b1',
    name: 'Main Branch',
    icon: 'business',
    tint: colors.primary,
    students: 850,
    admin: 'Sarah Jenkins',
    address: '123 Education St, NY 10001',
    phone: '+1 (555) 123-4567',
  },
  {
    id: 'b2',
    name: 'North Campus',
    icon: 'corporate-fare',
    tint: colors.secondary,
    students: 420,
    admin: 'Michael Chang',
    address: '456 North Ave, NY 10022',
    phone: '+1 (555) 987-6543',
  },
];

export const notifications = [
  { id: 'n1', icon: 'assessment', title: 'Result Published for Final Term', meta: '2 hours ago', unread: true },
  { id: 'n2', icon: 'person-add', title: 'New Student Enrolled — Engineering Dept', meta: '5 hours ago', unread: true },
  { id: 'n3', icon: 'domain-add', title: "Branch 'East' Added by SuperAdmin", meta: 'Yesterday', unread: false },
  { id: 'n4', icon: 'quiz', title: 'Mid-Term Assessment starts tomorrow', meta: '2 days ago', unread: false },
];
