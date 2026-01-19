import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const ownerToken = localStorage.getItem('ownerToken');

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (ownerToken) {
    config.headers.Authorization = `Bearer ${ownerToken}`;
  }

  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('ownerToken');
      localStorage.removeItem('ownerUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  fuelTypes: string;
  phone?: string;
  openingHours?: string;
  amenities?: string;
  isVerified: boolean;
  approvalStatus?: string;
  rejectionReason?: string;
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName?: string;
  };
  subscriptionType?: string;
  subscriptionEnd?: string;
  subscriptions?: Array<{
    planType: string;
    status: string;
    endDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface StationOwner {
  id: string;
  email: string;
  name: string;
  phone: string;
  companyName?: string;
  gstNumber?: string;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: string;
  kycRejectionReason?: string;
  profileComplete: boolean;
  onboardingStep: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  stations?: Array<{
    id: string;
    name: string;
    city: string;
    approvalStatus: string;
  }>;
  _count?: {
    stations: number;
    supportTickets: number;
  };
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  ownerId?: string;
  stationId?: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  station?: {
    id: string;
    name: string;
    city: string;
  };
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  message: string;
  isInternal: boolean;
  createdBy: string;
  createdByType: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface StationsResponse {
  stations: Station[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OwnersResponse {
  owners: StationOwner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/admin/login', { email, password });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/admin/logout');
    } finally {
      localStorage.removeItem('adminToken');
    }
  },

  signup: async (data: { name: string; email: string; phone: string; password: string; stationName?: string; address?: string; companyName?: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/subscriber/signup`, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      companyName: data.stationName || data.companyName,
    });
    return response.data;
  },

  // Station Management
  getStations: async (page = 1, search = '', verified?: boolean, approvalStatus?: string) => {
    const params: any = { page };
    if (search) params.search = search;
    if (verified !== undefined) params.verified = verified;
    if (approvalStatus) params.approvalStatus = approvalStatus;
    const response = await api.get('/admin/stations', { params });
    const data = response.data;
    return {
      stations: data.stations || [],
      total: data.pagination?.total || 0,
      page: data.pagination?.page || page,
      totalPages: data.pagination?.totalPages || 1,
    };
  },

  createStation: async (data: any) => {
    const response = await api.post('/admin/stations', data);
    return response.data;
  },

  updateStation: async (id: string, data: any) => {
    const response = await api.put('/admin/stations', { id, ...data });
    return response.data;
  },

  deleteStation: async (id: string) => {
    const response = await api.delete('/admin/stations?id=' + id);
    return response.data;
  },

  // Station Owner (CRM) Management
  getOwners: async (page = 1, limit = 20, filters?: { status?: string; kycStatus?: string; search?: string }) => {
    const params: any = { page, limit, ...filters };
    const response = await api.get<OwnersResponse>('/admin/owners', { params });
    return response.data;
  },

  updateOwner: async (id: string, data: { status?: string; kycStatus?: string; kycRejectionReason?: string; emailVerified?: boolean; phoneVerified?: boolean }) => {
    const response = await api.put(`/admin/owners?id=${id}`, data);
    return response.data;
  },

  deleteOwner: async (id: string) => {
    const response = await api.delete(`/admin/owners?id=${id}`);
    return response.data;
  },

  // User Management
  getUsers: async (page = 1, limit = 20, search = '') => {
    const params: any = { page, limit };
    if (search) params.search = search;
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users?id=${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: { subscriptionType?: string; subscriptionEndsAt?: string }) => {
    const response = await api.put(`/admin/users?id=${id}`, data);
    return response.data;
  },

  // Support Ticket Management
  getTickets: async (page = 1, filters?: { status?: string; category?: string; priority?: string }) => {
    const params: any = { page, ...filters };
    const response = await api.get<TicketsResponse>('/admin/support', { params });
    return response.data;
  },

  updateTicket: async (id: string, data: { status?: string; assignedTo?: string; resolution?: string }) => {
    const response = await api.put(`/admin/support?id=${id}`, data);
    return response.data;
  },

  addTicketReply: async (ticketId: string, message: string, isInternal: boolean = false) => {
    const response = await api.post('/admin/support', { ticketId, message, isInternal });
    return response.data;
  },

  geocode: async (address: string) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    return response.data;
  },
};

export default api;
