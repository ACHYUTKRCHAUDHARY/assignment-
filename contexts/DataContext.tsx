
import React, { createContext, useReducer, ReactNode, useCallback } from 'react';
import { Customer, Lead } from '../types';
import * as MockApi from '../services/mockApi';

interface State {
  customers: Customer[];
  leads: { [customerId: string]: Lead[] };
  allLeads: Lead[];
  totalCustomers: number;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'GET_CUSTOMERS_SUCCESS'; payload: { customers: Customer[]; total: number } }
  | { type: 'GET_LEADS_SUCCESS'; payload: { customerId: string; leads: Lead[] } }
  | { type: 'GET_ALL_LEADS_SUCCESS'; payload: Lead[] }
  | { type: 'ADD_CUSTOMER_SUCCESS'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER_SUCCESS'; payload: Customer }
  | { type: 'DELETE_CUSTOMER_SUCCESS'; payload: string }
  | { type: 'ADD_LEAD_SUCCESS'; payload: Lead }
  | { type: 'UPDATE_LEAD_SUCCESS'; payload: Lead }
  | { type: 'DELETE_LEAD_SUCCESS'; payload: { leadId: string; customerId: string } };

const initialState: State = {
  customers: [],
  leads: {},
  allLeads: [],
  totalCustomers: 0,
  loading: false,
  error: null,
};

function dataReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'GET_CUSTOMERS_SUCCESS':
      return { ...state, loading: false, customers: action.payload.customers, totalCustomers: action.payload.total };
    case 'GET_LEADS_SUCCESS':
        return { ...state, loading: false, leads: { ...state.leads, [action.payload.customerId]: action.payload.leads } };
    case 'GET_ALL_LEADS_SUCCESS':
      return { ...state, loading: false, allLeads: action.payload };
    case 'ADD_CUSTOMER_SUCCESS':
      return { ...state, loading: false, customers: [action.payload, ...state.customers], totalCustomers: state.totalCustomers + 1 };
    case 'UPDATE_CUSTOMER_SUCCESS':
      return { ...state, loading: false, customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CUSTOMER_SUCCESS':
      return { ...state, loading: false, customers: state.customers.filter(c => c.id !== action.payload), totalCustomers: state.totalCustomers - 1 };
    case 'ADD_LEAD_SUCCESS': {
        const { customerId } = action.payload;
        const customerLeads = state.leads[customerId] ? [action.payload, ...state.leads[customerId]] : [action.payload];
        return { ...state, loading: false, leads: { ...state.leads, [customerId]: customerLeads } };
    }
    case 'UPDATE_LEAD_SUCCESS': {
        const { customerId } = action.payload;
        const customerLeads = state.leads[customerId]?.map(l => l.id === action.payload.id ? action.payload : l) || [];
        return { ...state, loading: false, leads: { ...state.leads, [customerId]: customerLeads } };
    }
    case 'DELETE_LEAD_SUCCESS': {
        const { leadId, customerId } = action.payload;
        const customerLeads = state.leads[customerId]?.filter(l => l.id !== leadId) || [];
        return { ...state, loading: false, leads: { ...state.leads, [customerId]: customerLeads } };
    }
    default:
      return state;
  }
}

interface DataContextType extends State {
    fetchCustomers: (page: number, limit: number, searchTerm: string) => Promise<void>;
    fetchLeadsByCustomerId: (customerId: string) => Promise<void>;
    fetchAllLeads: () => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
    updateCustomer: (customer: Customer) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<void>;
    updateLead: (lead: Lead) => Promise<void>;
    deleteLead: (id: string, customerId: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const dispatchWrapper = useCallback(async <T,>(apiCall: () => Promise<T>, successAction: (payload: T) => Action) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const result = await apiCall();
      dispatch(successAction(result));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }, []);

  const fetchCustomers = useCallback(async (page: number, limit: number, searchTerm: string) => {
    await dispatchWrapper(
        () => MockApi.apiGetCustomers(page, limit, searchTerm),
        (payload) => ({ type: 'GET_CUSTOMERS_SUCCESS', payload: { customers: payload.data, total: payload.total } })
    );
  }, [dispatchWrapper]);

  const fetchLeadsByCustomerId = useCallback(async (customerId: string) => {
    await dispatchWrapper(
        () => MockApi.apiGetLeadsByCustomerId(customerId),
        (leads) => ({ type: 'GET_LEADS_SUCCESS', payload: { customerId, leads } })
    );
  }, [dispatchWrapper]);
  
  const fetchAllLeads = useCallback(async () => {
    await dispatchWrapper(
        () => MockApi.apiGetAllLeads(),
        (payload) => ({ type: 'GET_ALL_LEADS_SUCCESS', payload })
    );
  }, [dispatchWrapper]);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id'>) => {
    await dispatchWrapper(
        () => MockApi.apiAddCustomer(customer),
        (payload) => ({ type: 'ADD_CUSTOMER_SUCCESS', payload })
    );
  }, [dispatchWrapper]);

  const updateCustomer = useCallback(async (customer: Customer) => {
    await dispatchWrapper(
        () => MockApi.apiUpdateCustomer(customer),
        (payload) => ({ type: 'UPDATE_CUSTOMER_SUCCESS', payload })
    );
  }, [dispatchWrapper]);

  const deleteCustomer = useCallback(async (id: string) => {
    await dispatchWrapper(
        () => MockApi.apiDeleteCustomer(id),
        (payload) => ({ type: 'DELETE_CUSTOMER_SUCCESS', payload: payload.id })
    );
  }, [dispatchWrapper]);
  
  const addLead = useCallback(async (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    await dispatchWrapper(
        () => MockApi.apiAddLead(lead),
        (payload) => ({ type: 'ADD_LEAD_SUCCESS', payload })
    );
  }, [dispatchWrapper]);

  const updateLead = useCallback(async (lead: Lead) => {
    await dispatchWrapper(
        () => MockApi.apiUpdateLead(lead),
        (payload) => ({ type: 'UPDATE_LEAD_SUCCESS', payload })
    );
  }, [dispatchWrapper]);

  const deleteLead = useCallback(async (id: string, customerId: string) => {
    await dispatchWrapper(
        () => MockApi.apiDeleteLead(id),
        (payload) => ({ type: 'DELETE_LEAD_SUCCESS', payload: { leadId: payload.id, customerId } })
    );
  }, [dispatchWrapper]);

  return (
    <DataContext.Provider value={{ ...state, fetchCustomers, fetchLeadsByCustomerId, fetchAllLeads, addCustomer, updateCustomer, deleteCustomer, addLead, updateLead, deleteLead }}>
      {children}
    </DataContext.Provider>
  );
};
