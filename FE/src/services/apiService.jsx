export const BASE_URL = "http://localhost:5034";

//Headers

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


const request = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: getAuthHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore nella richiesta");
  }

  if (response.status === 204) return null;

  return response.json();
};

//Cars API

export const getCars = () => request("/api/Cars");

export const getCarById = (id) =>
  request(`/api/Cars/${id}`);

export const getCarsByCategory = (id) =>
  request(`/api/Cars/category/${id}`);

export const createCar = (data) =>
  request("/api/Cars", "POST", data);

export const updateCar = (id, data) =>
  request(`/api/Cars/${id}`, "PUT", data);

// Create / Update car using FormData (for images). Do not set Content-Type so browser sets the boundary.
export const createCarForm = async (formData) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${BASE_URL}/api/Cars`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore nella richiesta");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const updateCarForm = async (id, formData) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${BASE_URL}/api/Cars/${id}`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore nella richiesta");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const deleteCar = (id) =>
  request(`/api/Cars/${id}`, "DELETE");

//Categories API

export const getCategories = () =>
  request("/api/Categories");

export const getCategoryById = (id) =>
  request(`/api/Categories/${id}`);

export const createCategory = (data) =>
  request("/api/Categories", "POST", data);

export const updateCategory = (id, data) =>
  request(`/api/Categories/${id}`, "PUT", data);


export const setCarToCategory = (carId, categoryId) =>
  request(`/api/Categories/setCar/${carId}/${categoryId}`, "PUT");


export const deleteCategory = (id) =>
  request(`/api/Categories/${id}`, "DELETE");

//Orders API

export const getOrders = () =>
  request("/api/Orders");

export const getOrderById = (id) =>
  request(`/api/Orders/${id}`);

export const createOrder = (data) =>
  request("/api/Orders", "POST", data);

export const updateOrder = (id, data) =>
  request(`/api/Orders/${id}`, "PUT", data);

export const deleteOrder = (id) =>
  request(`/api/Orders/${id}`, "DELETE");

//Payments API

export const getPayments = () =>
  request("/api/Payments");

export const getPaymentById = (id) =>
  request(`/api/Payments/${id}`);

export const createPayment = (data) =>
  request("/api/Payments", "POST", data);

export const updatePayment = (id, data) =>
  request(`/api/Payments/${id}`, "PUT", data);

export const deletePayment = (id) =>
  request(`/api/Payments/${id}`, "DELETE");

//Shipments API

export const getShipments = () =>
  request("/api/Shipments");

export const getShipmentById = (id) =>
  request(`/api/Shipments/${id}`);

export const createShipment = (data) =>
  request("/api/Shipments", "POST", data);

export const updateShipment = (id, data) =>
  request(`/api/Shipments/${id}`, "PUT", data);

export const deleteShipment = (id) =>
  request(`/api/Shipments/${id}`, "DELETE");

//Users API

export const getUsers = () =>
  request("/api/Users");

export const getUserById = (id) =>
  request(`/api/Users/${id}`);

export const createUser = (data) =>
  request("/api/Users", "POST", data);

export const updateUser = (id, data) =>
  request(`/api/Users/${id}`, "PUT", data);

export const deleteUser = (id) =>
  request(`/api/Users/${id}`, "DELETE");

//Login
export const login = async (credentials) => {
  const data = await request("/api/Users/login", "POST", credentials);

  if (data?.token) {
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("username", data.userName);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("roles", JSON.stringify(data.roles));
  }

  return data;
};

//Register
export const register = async (userData) => {
  const data = await request("/api/Users", "POST", userData);
  return data;
};

//Logout

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("roles");
  localStorage.removeItem("token");
};
