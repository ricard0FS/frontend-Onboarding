export const ENDPOINTS = {
  LOGIN: "/oauth/login",
  CLIENTS: {
    GET_ALL_CLIENTS: "/api/client/findAll",
    GET_FILTERED_CLIENTS: "/api/client/findCliente",
    GET_CLIENTS_DETAIL: "/api/v1/cliente-real/find/cnpjCliente={cnpjCliente}",
  },
  DOCUMENTS: {
    FIND_CUSTOMER_DOCUMENTS: "/api/documents/findCustomerDocuments",
  },
};
