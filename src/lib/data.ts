import { supabase } from './supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types (kept the same)
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  batchId: string;
  joinDate: string;
  photo?: string;
  address: string;
  feeStatus: 'paid' | 'pending' | 'partial';
  totalFee: number;
  paidAmount: number;
  attendance: Record<string, boolean>;
  marks: Record<string, number>;
  password: string;
}

export interface Batch {
  id: string;
  name: string;
  type: 'Morning' | 'Evening' | 'Weekend';
  trainerId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  schedule: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  joinDate: string;
}

export interface Exam {
  id: string;
  name: string;
  batchId: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'cheque';
  status: 'completed' | 'pending';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'error';
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  name: string;
}

// NOTE: Auth functions use plain text passwords for demo
// In production, use proper hashing (bcrypt) and Supabase Auth
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
  if (error || !data) return null;
  return data;
}

// Auth helpers (localStorage state)
export function getAuth(): { role: 'admin' | 'student'; userId?: string } | null {
  const raw = localStorage.getItem('mscit_auth');
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(role: 'admin' | 'student', userId?: string) {
  localStorage.setItem('mscit_auth', JSON.stringify({ role, userId }));
}

export function logout() {
  localStorage.removeItem('mscit_auth');
}

// React Query hooks for data fetching & mutations
export const useStudents = () => useQuery<Student[]>({
  queryKey: ['students'],
  queryFn: async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    return data || [];
  }
});

export const useStudentsByBatch = (batchId: string) => useQuery<Student[]>({
  queryKey: ['students', batchId],
  queryFn: async () => {
    const { data, error } = await supabase.from('students').select('*').eq('batch_id', batchId);
    if (error) throw error;
    return data || [];
  },
  enabled: !!batchId
});

export const useStudent = (id: string) => useQuery<Student | null>({
  queryKey: ['student', id],
  queryFn: async () => {
    const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
    if (error) return null;
    return data || null;
  },
  enabled: !!id
});

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student: Omit<Student, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert({ ...student, id: `s${Date.now()}`, batchId: student.batchId, joinDate: student.joinDate })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Student>) => {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

// Similar hooks for Batches
export const useBatches = () => useQuery<Batch[]>({
  queryKey: ['batches'],
  queryFn: async () => {
    const { data, error } = await supabase.from('batches').select('*');
    if (error) throw error;
    return data || [];
  }
});

// Add/Update/Delete for batches... (similar pattern)

export const useAddBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (batch: Omit<Batch, 'id'>) => {
      const { data, error } = await supabase
        .from('batches')
        .insert({ ...batch, id: `b${Date.now()}` })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Batch>) => {
      const { data, error } = await supabase
        .from('batches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('batches').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
};

// Trainers
export const useTrainers = () => useQuery<Trainer[]>({
  queryKey: ['trainers'],
  queryFn: async () => {
    const { data, error } = await supabase.from('trainers').select('*');
    if (error) throw error;
    return data || [];
  }
});

export const useAddTrainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trainer: Omit<Trainer, 'id'>) => {
      const { data, error } = await supabase
        .from('trainers')
        .insert({ ...trainer, id: `t${Date.now()}` })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    }
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Omit<User, 'id'>) => {
      const { data, error } = await supabase
        .from('users')
        .insert({ ...user, id: `u${Date.now()}` })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

// Add more for other tables as needed...

// Utilities (client-side)
export function getAttendancePercent(student: Student): number {
  const entries = Object.values(student.attendance);
  if (entries.length === 0) return 0;
  const present = entries.filter(Boolean).length;
  return Math.round((present / entries.length) * 100);
}

export function getAverageMarks(student: Student): number {
  const marks = Object.values(student.marks).filter(m => m !== undefined);
  if (marks.length === 0) return 0;
  return Math.round(marks.reduce((a, b) => a + b as number, 0) / marks.length);
}

// Export for compatibility
export const db = {
  students: {
    useAll: useStudents,
    useByBatch: useStudentsByBatch,
    useOne: useStudent,
    useAdd: useAddStudent,
    useUpdate: useUpdateStudent,
    useDelete: useDeleteStudent,
  },
  batches: {
    useAll: useBatches,
    useAdd: useAddBatch,
    useUpdate: useUpdateBatch,
    useDelete: useDeleteBatch,
  },
  trainers: {
    useAll: useTrainers,
    useAdd: useAddTrainer,
  },
};

// Note: Run `npm run dev` to test. Tables must exist in Supabase.
console.warn('Supabase data.ts: Fill .env.local and run create_tables.sql');

