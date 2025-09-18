
import { User, Customer, Lead, LeadStatus } from '../types';

// Mock Database
let users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'Admin' },
  { id: '2', name: 'Regular User', email: 'user@test.com', role: 'User' },
];

let customers: Customer[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `123-456-78${String(i).padStart(2, '0')}`,
  company: `Company ${i + 1}`,
}));

let leads: Lead[] = customers.flatMap(customer => 
  Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, i) => ({
    id: `${customer.id}-${i + 1}`,
    customerId: customer.id,
    title: `Opportunity ${i + 1} for ${customer.name}`,
    description: 'This is a sample lead description.',
    status: [LeadStatus.New, LeadStatus.Contacted, LeadStatus.Converted, LeadStatus.Lost][Math.floor(Math.random() * 4)],
    value: Math.floor(Math.random() * 5000) + 500,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
);

const simulateDelay = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));


// --- Auth ---
export const apiRegister = async (name: string, email: string): Promise<User> => {
    if (users.find(u => u.email === email)) {
        throw new Error("User with this email already exists.");
    }
    const newUser: User = { id: String(users.length + 1), name, email, role: 'User' };
    users.push(newUser);
    return simulateDelay(newUser);
};

export const apiLogin = async (email: string): Promise<{ user: User; token: string }> => {
    const user = users.find(u => u.email === email);
    if (!user) {
        throw new Error("Invalid credentials.");
    }
    return simulateDelay({ user, token: `mock-token-for-${user.id}` });
};

// --- Customers ---
export const apiGetCustomers = async (page: number, limit: number, searchTerm: string): Promise<{ data: Customer[]; total: number }> => {
    let filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedData = filteredCustomers.slice((page - 1) * limit, page * limit);
    return simulateDelay({ data: paginatedData, total: filteredCustomers.length });
};

export const apiGetCustomerById = async (id: string): Promise<Customer | undefined> => {
    return simulateDelay(customers.find(c => c.id === id));
};

export const apiAddCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
    const newCustomer: Customer = { id: String(Date.now()), ...customerData };
    customers.unshift(newCustomer);
    return simulateDelay(newCustomer);
};

export const apiUpdateCustomer = async (customerData: Customer): Promise<Customer> => {
    customers = customers.map(c => c.id === customerData.id ? customerData : c);
    return simulateDelay(customerData);
};

export const apiDeleteCustomer = async (id: string): Promise<{ id: string }> => {
    customers = customers.filter(c => c.id !== id);
    leads = leads.filter(l => l.customerId !== id);
    return simulateDelay({ id });
};

// --- Leads ---
export const apiGetLeadsByCustomerId = async (customerId: string): Promise<Lead[]> => {
    return simulateDelay(leads.filter(l => l.customerId === customerId));
};

export const apiAddLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
    const newLead: Lead = { id: String(Date.now()), ...leadData, createdAt: new Date().toISOString() };
    leads.unshift(newLead);
    return simulateDelay(newLead);
};

export const apiUpdateLead = async (leadData: Lead): Promise<Lead> => {
    leads = leads.map(l => l.id === leadData.id ? leadData : l);
    return simulateDelay(leadData);
};

export const apiDeleteLead = async (id: string): Promise<{ id: string }> => {
    leads = leads.filter(l => l.id !== id);
    return simulateDelay({ id });
};

export const apiGetAllLeads = async (): Promise<Lead[]> => {
    return simulateDelay(leads);
}
